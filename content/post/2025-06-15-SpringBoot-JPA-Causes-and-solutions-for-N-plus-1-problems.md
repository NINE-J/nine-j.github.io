---
publish: true
draft: false
title: JPA의 대표적인 성능 병목
description: N+1 문제, 왜 생기고 어떻게 해결할까?
author: Nine
date: 2025-06-15 15:34:08
categories:
  - SpringBoot
  - JPA
tags:
  - devlog
  - SpringBoot
  - JPA
  - Fetch_Join
  - EntityGraph
  - Batch_Fetching
  - Hibernate
  - 성능최적화
# image: Status: Done
---
## 📌개요

JPA를 사용하면서 가장 자주 마주치는 성능 문제 중 하나가 바로 N+1 문제다.
"나는 하나의 쿼리만 호출했는데 왜 수십 개의 쿼리가 날아가지?"

이번엔 N+1 문제가 발생하는 원인과 이를 해결하는 방법을 Spring Boot 환경 중심으로 알아보자.

## 📌내용

### N+1 문제란?

N+1 문제는 1개의 쿼리로 N개의 결과를 가져온 후 각 결과에 대해 N번 추가 쿼리를 실행하는 현상을 의미한다.

```java
...
List<Order> orders = orderRepository.findAll(); // 1번
for(Order order : orders) {
    System.out.println(order.getMember().getName()); // N번
}
...
```

- `orders`를 조회하는 `findAll()` 쿼리 1회
- 각 `order`의 연관된 `member`를 지연 로딩(LAZY)하면서 `order` 수만큼 N회 추가 쿼리

결과적으로 1+N회의 쿼리가 발생하게 된다.

### 왜 이런 문제가 발생할까?

기본적으로 JPA는 연관 관계를 지연 로딩으로 설정하기 때문이다.

```java
@Entity
public class Order {
    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;
}
```

지연 로딩의 목적은 불필요한 데이터를 미리 조회하지 않기 위한 것이지만 반복문처럼 연관 객체를 순차적으로 접근할 때 N+1 문제가 발생한다.

### 해결 방법

#### 1. Fetch Join

가장 직관적인 해결책이다.
연관된 엔티티를 함께 조회하는 조인 쿼리를 사용한다.

```java
@Query("""
    Select o
    FROM Order o
    JOIN FETCH o.member
""")
List<Order> findAllWithMember();
```

- JPA는 이 쿼리 결과를 기반으로 `Order`와 `Member`를 한 번에 메모리에 올린다.
- Hibernate는 더 이상 각 `member`에 대해 추가 쿼리를 실행하지 않는다.

가장 강력하고 빠른 방법이지만 `Fetch Join`은 컬렉션(`@OneToMany` 등)에 사용할 경우 페이징이 불가능하다는 단점이 있다.

#### 2. `@EntityGraph`

엔티티 수준에서 `Fetch Join`과 유사한 효과를 얻을 수 있는 선언적 방법이다.

```java
@EntityGraph(attributePaths = {"member"})
@Query("Select o FROM Order o")
List<Order> findAllWithMember();
```

- 코드 가독성이 좋아지고 재사용 가능한 설정을 만들 수 있다.

`Fetch Join`을 간결하게 사용하기 위한 어노테이션이고 내부적으로 기능이 비슷해서 비슷한 단점을 가진다.
실제로는 `left outer join`을 사용한다는 점을 주의해야 한다.

#### 3. Batch Size 설정

컬렉션에 대해 Lazy 로딩을 유지하면서 성능을 개선하는 방법이다.

- 컬렉션이나 LAZY 로딩 관계의 객체들을 100개씩 in 절로 묶어서 한 번에 조회한다.
- 페이징 + 성능 최적화가 동시에 필요한 경우 유용하다.

```yaml
spring:
  jpa:
    properties:
      hibernate:
        default_batch_fetch_size: 100
```

```java
@Entity
public class Order {
    @OneToMany(mappedBy = "order")
    private List<OrderItem> items;
}
```

- `items` 조회 시 in 절로 묶여 일괄 조회된다.
- 페이징 가능한 쿼리에 적합한 방법이다.

### Fetch Join VS `@EntityGraph`

>[!INFO]
>`@EntityGraph`와 JPQL `fetch join`은 기능적으로 유사하지만 내부 동작 방식과 조인 타입에서 차이를 가진다.

#### 핵심 차이 정리

| 항목               | `fetch join` (JPQL/QueryDSL) | `@EntityGraph` (Spring Data JPA) |
| ---------------- | ---------------------------- | -------------------------------- |
| 선언 위치            | JPQL/QueryDSL 내부             | Repository 메서드 어노테이션             |
| 기본 조인 방식         | `INNER JOIN`                 | `LEFT OUTER JOIN`                |
| 연관 관계 없어도 조회됨?   | ❌ (자식 없으면 부모도 제외)            | ✅ (자식 없어도 부모 조회됨)                |
| 런타임 FetchType 전환 | ❌                            | ✅ (`LAZY → EAGER`)               |
| 페이징 가능 여부        | ❌ (컬렉션과 함께 사용 불가)            | ❌ (컬렉션 시 동일)                     |
| 조건 활용 유연성        | 자유롭다                         | 정적 메서드에 한정                       |
| 중복 row 처리        | `distinct` 필요                | 일부 자동 처리됨                        |

#### 예제 비교

```java
// fetch join: inner join → 자식 없으면 조회되지 않음
@Query("""
    SELECT o FROM Order o
    JOIN FETCH o.member
""")
List<Order> findAllWithMember();

// entity graph: left outer join → 자식 없어도 조회됨
@EntityGraph(attributePaths = {"member"})
@Query("SELECT o FROM Order o")
List<Order> findAllWithMember();
```

### 상황에 따른 선택 가이드

| 상황                        | 해결책                          |
| ------------------------- | ---------------------------- |
| 단일 객체 또는 ToOne 관계 조회      | Fetch Join / EntityGraph     |
| 컬렉션 관계(`@OneToMany` 등) 페치 | Batch Size                   |
| 페이징 처리와 병행해야 하는 경우        | Batch Size 또는 DTO Projection |

## 🎯결론

> JPA N+1 문제는 자동화된 지연 로딩의 그림자다. 하지만 문제를 정확히 이해하면 해결은 어렵지 않다.

단 하나의 `@ManyToOne` 관계에서 시작된 N+1 문제도, 반복 루프나 리스트 응답에서는 큰 성능 이슈로 이어질 수 있다.  
`Fetch Join`, `EntityGraph`, `Batch Size` 같은 다양한 전략을 상황에 맞게 적절히 조합하자.

## ⚙️EndNote

### 사전 지식

- JPA 기본 연관 관계(`@OneToMany`, `@ManyToOne` 등)
- LAZY vs EAGER 로딩 전략
- JPQL 작성법

### 더 알아보기

- [[HIBERNATE] Batch Fetching](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html#fetching-batch)
- [[Spring Data JPA] JPA Query Methods](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html#jpa.entity-graph)
- [MultipleBagFetchException 발생시 해결 방법 by 향로](https://jojoldu.tistory.com/457)

