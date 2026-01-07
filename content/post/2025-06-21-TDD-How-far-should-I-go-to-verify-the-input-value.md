---
publish: true
 draft: false
title: 입력값 검증 어디까지 해야 할까?
description: 중복 없는 계층별 검증 전략과 트레이드오프 분석
author: Nine
date: 2025-06-21 21:08:37
categories:
  - 설계
  - TDD
tags:
  - devlog
  - SpringBoot
  - InputValidation
  - 계층구조
  - BeanValidation
  - DDD
  - 유효성검증
  - TDD

Status: Done
---
## 📌개요

입력값 검증은 보안, 데이터 무결성, 사용자 경험을 모두 좌우하는 핵심 요소다.
하지만 각 계층의 책임이 명확하지 않으면 중복 검증, 누락, 책임 희석 등의 문제가 발생할 수 있다.

각 계층에서 검증 책임을 정리하고 중복 없이 안정성을 확보하는 전략과 트레이드오프를 알아보자.

## 📌내용

### Presentation Layer

>[!WARNING]
>클라이언트와 Controller에서의 검증은 빠른 피드백을 줄 수 있지만 절대 신뢰할 수 있는 검증 계층은 아니다. 반드시 하위 계층의 보완이 필요하다.

- 계층: Web, Controller
- 책임: UI/UX 관점에서 빠른 피드백 제공
- 검증: 형식적 유효성(null, 공백, 정규식 등)
    - 예: 이메일 형식, 숫자 범위, 필수 입력 여부
- 기술 예시: `@Valid`, `@Validated`, `BindingResult`, JavaScript 클라이언트 측 검증
- 목적: UX 개선 + 서버 리소스 낭비 방지

### Service Layer

>[!INFO]  
>비즈니스 정책을 수반하는 검증은 Controller가 아닌 Service에서 처리해야 한다. 핵심 규칙을 책임지는 계층이다.

- 계층: Application, Service
- 책임: 유스케이스 단위의 비즈니스 규칙 검증
- 검증:
    - 상태 기반 조건
    - 중복 등록, 권한 체크, 사용 제한 등
    - 예: 하루 1회만 등록 가능, 좌석 수 초과 불가 등
- 기술 예시: 조건문, Guard Clause, Specification Pattern, 예외 발생 기반 제어
- 목적: 흐름 제어와 정책 보장, 응답 일관성 유지

### Domain Layer

>[!INFO]
>도메인은 단순한 데이터 보관소가 아니라 행위와 불변 조건을 포함한 책임 주체다.
>도메인 객체는 자기 상태를 보호해야 하며 외부로부터 일관성을 강제 받지 않는다.

- 계층: Domain Model (Entity, ValueObject, Aggregate)
- 책임: 객체의 내부 일관성과 상태 전이 검증
- 검증:
    - 객체 생성 시 필수 조건
    - 상태 변경 제약
        - 예: 배송 상태는 '결제 완료' 이후에만 가능
- 기술 예시: 생성자/정적 팩토리 검증, 불변 조건 메서드, `validateTransition()` 등
- 목적: 외부 계층 의존 없는 무결성 유지, 테스트 가능성 향상

### Persistence Layer

>[!INFO]
>하위 계층일수록 안전 장치 역할이 강해진다. 모든 검증을 상위 계층에 의존하는 것은 위험하다.
>DB는 최후의 방어선으로 작동해야 한다.

- 계층: Repositoiry, Database
- 책임: 저장 및 조회 시 스키마 기반의 데이터 무결성 보장
- 검증:
    - DB 스키마 제약: `NOT NULL`, `UNIQUE`, `CHECK`, `FK` 등
    - ORM 수준 검증: `@Column(nullable = false)`, `@UniqueConstraint` 등
- 기술 예시: JPA, Hibernate Validator, RDB 제약 조건
- 목적: 상위 계층 누락 방지, 악의적 요청 방어

### Trade-off

| 구분            | 장점                      | 단점                         |
| ------------- | ----------------------- | -------------------------- |
| **계층별 검증 분산** | 책임 분리, 시스템 안정성 증가       | 로직 분산 → 이해 난이도 상승          |
| **중복 검증 허용**  | Fail-safe 설계 가능, 안정성 강화 | 과도한 검증 → 응답 지연, 리소스 낭비 가능성 |
| **검증 통합 집중**  | 유지보수 단순화 가능             | 변경 시 연쇄 영향 발생, 도메인 무결성 위험  |

## 🎯결론

입력값 검증은 단일 계층의 책임이 아니다.
각 계층에서 역할에 맞는 검증을 수행해야만 중복을 줄이고 안전성을 확보할 수 있다.

|계층|핵심 역할|
|---|---|
|Presentation|빠른 피드백|
|Service|정책 흐름 제어|
|Domain|불변 조건 보장|
|Persistence|최종 무결성 수호선 역할|

## ⚙️EndNote

### 사전 지식

- MVC / 계층형 아키텍처 기본 개념
- DDD의 엔티티, 밸류 객체, 애그리거트 이해
- Bean Validation (`@Valid`, `@NotBlank`)
- 예외 처리 흐름 (`@ControllerAdvice`, 예외 매핑)
- REST 응답 코드 설계 (`400`, `409`, `422` 등)

### 🔍 더 알아보기

- [Spring Validation 공식 문서](https://docs.spring.io/spring-framework/reference/core/validation/)
- Jakarta Bean Validation 3.0
- Effective Java - Item 49: Check parameters for validity
- Refactoring 2nd Ed - Bad Smells in Code: Shotgun Surgery, Feature Envy
- Martin Fowler - Specification Pattern
- Validation in DDD: Where, Why, How