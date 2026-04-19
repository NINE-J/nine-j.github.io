---
publish: true
draft: false
title: 트랜잭션 격리성 - Isolation
description: 동시성 환경에서 데이터를 지키기 위한 전략
author: Nine
date: 2025-06-15T17:31:13
categories:
  - DB
  - Transaction
tags:
  - devlog
  - 트랜잭션
  - Transaction
  - ACID
  - Isolation
  - DirtyRead
  - Non-RepeatableRead
  - PhantomRead
  - 동시성처리
  - 읽기현상
# image: 
Status: Done
id: 019ce76a-c1f8-760b-af20-2ae42fd7c81e
slug: b9f1-devlog-트랜잭션-격리성-isolation
---

## 📌개요

트랜잭션의 ACID 속성 중 **Isolcation(격리성)** 은 다수의 트랜잭션이 동시에 실행될 때 각 트랜잭션이 서로에게 미치는 영향을 통제하기 위한 핵심 요소이며 가장 복잡하고 이해하기 어려운 속성이다.

격리 수준이 보장하는 것은 단순히 일관성이 아니라 **데이터 무결성과 비즈니스의 신뢰성** 이다.
특히 동시성 환경에서 격리 수준이 부족하면 데이터는 꼬이고, 그 피해는 실시간으로 사용자에게 전달된다.

이번 글에서 정리하는 건 모두 이해하고 작성할 수 없어서 관련 자료를 정리한 후 상세한 내용에 대해 더 깊게 파고들 예정이다.

격리성이 무너지면서 발생하는 문제들을 예제로 설명하고, 이를 막기 위해 존재하는 격리 수준들에 대해 단계적으로 정리해본다.

## 📌내용

### 격리성은 기본값으로 보장되고 있을까?

* 대부분의 RDBMS의 기본 격리 수준은 `READ COMMITED` 또는 `REPEATABLE READ`이지만 이름은 같아도 구현 방식과 보장 수준은 다르다.
* 예를 들어 Oracle의 `SERIALIZABLE`은 실제론 `SNAPSHOT ISOLATION`
* MySQL의 `REPEATABLE READ`는 기본적으로 Phantom Read를 방지하지 않으며
* PostgreSQL은 MVCC 기반이지만 `Serializable`을 명시해야만 실제 직렬화 보장을 한다.
  * MVCC: Multi-Version Concurrency Control, 다중 버전 동시성 제어

격리 수준은 이름이 같다고 같은 게 아니다.
반드시 DB별 구현 방식을 확인해야 한다.

### 격리 수준이 깨질 때 벌어지는 현상들

| 유형                      | 설명                       | 예시                                                          |
| ----------------------- | ------------------------ | ----------------------------------------------------------- |
| **Dirty Read**          | 커밋되지 않은 데이터를 읽음          | A가 송금 처리 중인데, B가 중간 상태의 금액을 읽고 합산하여 중복 송금 발생                |
| **Non-Repeatable Read** | 동일 조건으로 두 번 조회했는데 결과가 다름 | A가 상품 재고를 두 번 조회하는 사이, B가 재고를 변경함                           |
| **Phantom Read**        | 같은 쿼리인데 행 개수가 달라짐        | A가 `"나이 > 30"` 조건으로 조회 → B가 35세 사용자를 삽입 → A가 다시 조회하면 결과 달라짐 |

### 실무에서 실제 발생한 사례

* **동시 송금 시스템에서의 경쟁 조건**
  * 사용자가 잔액이 100인 상태에서 거의 동시에 두 번 송금 요청을 보냄
  * 둘 다 잔액 조회 결과 100을 읽고, 각각 80을 송금 → 총 160 송금됨
  * 이유: `READ COMMITTED` 상태에서는 두 트랜잭션이 서로를 고려하지 못함
* **해결책은?**
  * `SERIALIZABLE` 수준의 격리 또는 **애플리케이션 차원의 락** 적용

### ANSI SQL 격리 수준 비교표

> \[!WARNING]
> 격리 수준을 올리면 오류는 줄지만, 성능에 영향을 미친다.

격리 수준 4가지와 이에 따른 현상 3가지가 있다.
이 3가지 현상을 읽기 현상(Read Phenomena)라고 표현한다.

* **Dirty Read**: 커밋되지 않은(trash) 데이터를 읽는 현상
* **Non-Repeatable Read**: 같은 쿼리를 두 번 실행했을 때 결과가 달라지는 현상
* **Phantom Read**: 동일 조건의 쿼리에서 행 개수가 달라지는 현상 (삽입/삭제로 인해)

| 격리 수준                | Dirty Read | Non-Repeatable Read | Phantom Read | 비고                                    |
| -------------------- | ---------- | ------------------- | ------------ | ------------------------------------- |
| **READ UNCOMMITTED** | 허용         | 허용                  | 허용           | 최저 성능, 실사용 거의 없음                      |
| **READ COMMITTED**   | 방지         | 허용                  | 허용           | 대부분 DB의 기본값                           |
| **REPEATABLE READ**  | 방지         | 방지                  | 허용           | MySQL 기본값 (하지만 Phantom Read 방지는 불완전함) |
| **SERIALIZABLE**     | 방지         | 방지                  | 방지           | 가장 강력하나 성능 저하 있음                      |

### Spring에서의 설정 방법

```java
@Transactional(isolation = Isolation.SERIALIZABLE)
public void processTransaction() {
    ...
}
```

* `Isolation.DEFAULT`: DBMS 기본 설정 따름
* 프로젝트에 따라 `.yml`, `.yaml` 또는 DB 설정에서 전역 기본값을 조정할 수도 있음
* 트랜잭션을 사용할 때 `@Transactional`만 선언하고 끝이 아니라 어떤 `isolation level`이 적용되는지 알아본다면 좋을 것이다.

## 🎯결론

**트랜잭션은 선언만으로 안전하지 않다.**

격리 수준은 코드의 동작 방식과 데이터 신뢰성을 결정짓는 중요한 요소다.\
문제를 겪고 나서야 "왜 데이터가 꼬였지?"를 고민하기보다, 미리 격리 수준을 설정하고 이해하는 것이 훨씬 값지다.

## ⚙️EndNote

### 사전 지식

* 트랜잭션과 커밋/롤백의 개념
* DB 락: Shared Lock vs Exclusive Lock
* MVCC(Multi-Version Concurrency Control)
* [Read Phenomena in Transactions by oim\_](https://oimbook.tistory.com/entry/Read-Phenomena-in-Transactions)

### 더 알아보기

* [PostgreSQL 공식 문서: Isolation Levels](https://www.postgresql.org/docs/current/transaction-iso.html)
* [MySQL InnoDB 트랜잭션 격리 수준](https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html)
* [Spring Declarative Transaction Management](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative.html)
* [Hermitage: Testing the “I” in ACID](https://martin.kleppmann.com/2014/11/25/hermitage-testing-the-i-in-acid.html)
* [I-9. 표준 SQL 이란?](https://sesoc.tistory.com/317)
* [Isolation (database systems)](https://en.wikipedia.org/wiki/Isolation_\(database_systems\))
