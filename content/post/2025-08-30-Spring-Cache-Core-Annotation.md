---
publish: true
draft: false
title: Spring Cache 핵심 어노테이션 정리
description: 캐시 제어 3가지 방식
author: Nine
date: 2025-08-30 13:12:30
categories:
  - Spring
tags:
  - devlog
  - Spring
  - SpringBoot
  - SpringCache
  - Cacheable
  - CachePut
  - CacheEvict
  - 캐시전략

Status: Done
---
## 📌개요

Spring Framework에서 캐싱은 데이터베이스 조회나 외부 API 호출처럼 **비용이 큰 연산 결과를 저장**해두고 재사용할 수 있게 도와준다.

이를 간단히 적용할 수 있는 방법이 바로 **Spring Cache 어노테이션**(`@Cacheable`, `@CachePut`, `@CacheEvict`)이다.

이 세 가지 어노테이션의 차이점과 각각을 언제 사용하는 게 좋은지 정리한다.

## 📌내용

### 1. @Cacheable

- **동작 방식**: 캐시에 값이 있으면 그대로 반환하고, 없으면 메서드를 실행 후 결과를 캐시에 저장한다.
- **적절한 상황**:
    - 조회 성능 최적화가 필요한 경우 (DB 조회, 외부 API 호출)
    - 결과가 자주 변하지 않고 재사용 가치가 큰 경우
- **예시 코드**:
    ```java
    @Cacheable(cacheNames = "books", key = "#isbn")
    public Book findBook(String isbn) { ... }
    ```

### 2. @CachePut

- **동작 방식**: 항상 메서드를 실행하고, 실행 결과를 캐시에 저장한다.
- **적절한 상황**:
    - 업데이트가 발생했을 때 최신 결과를 캐시에 반영해야 할 때
    - 캐시 미스를 줄이기보다 캐시 동기화가 중요한 경우
- **주의점**:
    - `@Cacheable`과 같은 메서드에 함께 사용하는 것은 비추천 (동작 충돌 가능)
- **예시 코드**:
    ```java
    @CachePut(cacheNames = "books", key = "#isbn")
    public Book updateBook(String isbn, BookDescriptor descriptor) { ... }
    ```

### 3. @CacheEvict

- **동작 방식**: 캐시에서 특정 엔트리나 전체 엔트리를 제거한다.
- **적절한 상황**:
    - 데이터 삭제/갱신 후, 오래된 캐시를 반드시 무효화해야 할 때
    - 정기적으로 캐시를 초기화할 때
- **옵션**:
    - `allEntries = true`: 캐시 전체 삭제
    - `beforeInvocation = true`: 메서드 실행 전 캐시 삭제 (예외 발생 시에도 캐시 정리 보장)
- **예시 코드**:
    ```java
    @CacheEvict(cacheNames = "books", key = "#isbn")
    public void deleteBook(String isbn) { ... }
    
    @CacheEvict(cacheNames = "books", allEntries = true)
    public void clearCache() { ... }
    ```

## 🎯결론

- 조회는 `@Cacheable`
- 갱신은 `@CachePut`
- 삭제/무효화는 `@CacheEvict`

이 세 가지를 상황에 맞게 조합하면, DB 부하를 줄이면서도 데이터 정합성을 유지하는 효율적인 캐싱 전략을 설계할 수 있다.

## ⚙️EndNote

### 사전 지식

- Java, Spring Boot 애플리케이션 기본 구조
- 캐시(Cache)의 개념과 동작 원리
- Redis, Caffeine 등 Spring Cache 지원 캐시 제공자

### 더 알아보기

- [Spring Framework Docs - Caching Abstraction](https://docs.spring.io/spring-framework/reference/integration/cache.html)
- [Redis 공식 문서](https://redis.io/docs/)
- Spring Boot Reference: `spring-boot-starter-cache`