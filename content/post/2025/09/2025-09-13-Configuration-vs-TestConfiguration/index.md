---
title: 설정 어노테이션 비교
description: "@Configuration vs @TestConfiguration"
author: Nine
date: 2025-09-13 21:03:30
categories:
  - Spring
  - Test
tags:
  - devlog
  - SpringBoot
  - Configuration
  - TestConfiguration
image: cover.png
---
## 📌개요

Spring Boot에서 애플리케이션 설정을 구성할 때 자주 쓰이는 `@Configuration`과 테스트 환경에서 활용되는 `@TestConfiguration`은 비슷해 보이지만 동작 방식과 적용 범위가 다르다.

두 어노테이션의 **자동 등록 여부, 프로필 영향, 스캔 시점**을 기준으로 비교해보고 어떤 상황에서 적절히 선택해야 하는지 정리한다.

## 📌내용

### 1. 자동 등록 여부

#### @Configuration

- `@Component` 계열 어노테이션처럼 Spring의 **컴포넌트 스캔 대상**에 포함된다.
- 별도의 import 없이도 `ApplicationContext` 초기화 시 자동으로 등록된다.

#### @TestConfiguration

- **자동 스캔 제외** 대상이다.
- 테스트 컨텍스트에선 기본적으로 로드되지 않으며, 다음과 같은 경우에만 적용된다:
    1. **테스트 클래스 내부 static class** 로 선언했을 때
    2. `@Import` 등을 통해 명시적으로 가져왔을 때

### 2. 프로필(Profile) 영향

- 두 어노테이션 모두 `@Profile`을 함께 사용하면 활성화된 profile에 따라 적용 여부가 결정된다.
- 하지만 `@TestConfiguration`은 기본적으로 스캔되지 않기 때문에, **import되거나 테스트 내부에 선언된 경우에만 프로필 조건이 평가**된다.

### 3. 적용 시점 / 스캔

#### @Configuration

- 애플리케이션 실행 시 Spring Context 초기화 과정에서 **컴포넌트 스캔, Bean 정의 등록** 순서로 처리된다.

#### @TestConfiguration

- 테스트 실행 시 컨텍스트에 주입된다.
- `@Import`된 경우에는 일반 컴포넌트보다 **먼저 적용**되며 이후 테스트 컨텍스트에 필요한 빈들을 우선적으로 교체하거나 오버라이드할 수 있다.

### 4. 사용 목적

#### @Configuration

- 프로덕션 및 애플리케이션 전역 설정을 관리한다.
- 예: `DataSource`, `Service Bean`, `MessageConverter` 설정 등.

#### @TestConfiguration

- 테스트 전용 설정을 분리하기 위한 용도로 사용한다.
- 예: `MockBean`, `Stub`, `Testcontainers 초기화`, 테스트용 Repository 대체 설정 등.

## 🎯결론

- `@Configuration`
    - **애플리케이션 전역** 설정
    - 컴포넌트 스캔 대상
    - 프로덕션/테스트 어디든 포함될 수 있음
- `@TestConfiguration`
    - **테스트 전용** 설정
    - 자동 스캔 제외 (명시적 import 또는 static inner class로 사용)
    - **운영 환경에서는 로딩되지 않음**. "운영 코드와 테스트 설정의 경계"를 안전하게 보장

## ⚙️EndNote

### 사전 지식

- Spring IoC Container (Bean 관리 메커니즘)
- Spring Boot TestContext Framework
- Profile 기반 환경 분리

### 더 알아보기

- [Spring Framework @Configuration 공식 문서](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html)
- [Spring Boot @TestConfiguration 공식 문서](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/TestConfiguration.html)
- 테스트 설정 패턴: `@MockitoBean`, `@Import`, `@ActiveProfiles`