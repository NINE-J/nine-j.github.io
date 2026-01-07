---
publish: true
draft: false
title: DTO VS Command
description: Request를 그대로 사용하지 말자
author: Nine
date: 2025-05-24 17:17:02
categories:
  - 설계
  - 객체지향
tags:
  - devlog
  - Java
  - DDD
  - 객체지향
  - 객체지향프로그래밍
  - Command
  - DTO
  - 도메인설계
  - 계층분리
  - CleanArchitecture

Status: Done
---
## 📌개요

Controller의 Request 객체를 Service에 그대로 전달하면 처음엔 간편해 보일 수 있지만, 실제로는 여러 설계상의 문제가 생긴다.

- 계층간 의존성이 강해진다.
- Service의 역할을 침해한다.
- 확장성과 재사용성이 저하된다.
- 유지보수 및 테스트가 어려워진다.
- 객체지향 원칙을 위배하게 된다.

이러한 문제를 방지하기 위해 Controller에서는 Service에 전달할 Command 객체를 별도로 정의하여 사용하는 것이 바람직하다.

Command는 DTO와 유사해 보이지만, 그 목적과 책임이 분명히 다르다.

DTO와 Command 객체에는 어떤 차이가 있는지 코드와 함께 비교해보고 이 설계가 가지는 의미에 대해 알아보자.

## 📌내용

전반적인 내용을 작성한다.
관련된 재미있는 일화가 있다면 함께 작성하여 기억에 오래 남는 글을 작성한다.

### 이름만 다르고 구조는 같은 거 아닌가?

간단한 CRUD 프로젝트에선 그럴 수 있다.
실제로 구조가 동일한 경우도 있지만, 의미 단위로 객체를 분리하면 테스트, 유지보수, 의미 표현 측면에서 장점이 크다.

```java
// 간단한 구조에서는 굳이 Command 객체를 만들지 않고도 계층 분리가 가능하다.
public UserResponse createUser(UserCreateRequest request) {
    return userService.create(request.name(), LocalDate.parse(request.birthDate()));
}
```

하지만 **애플리케이션이 성장하고 도메인 로직이 복잡해질수록**, 구조적으로 명확한 역할 분리가 필요한 시점이 오게 된다. 이때 DTO와 Command는 **단순히 구조가 비슷하더라도 책임과 의미가 다르기 때문에 분리되어야 한다.**

이처럼 작은 프로젝트에서는 구조 재사용도 가능하지만, 의미 단위로 객체를 분리해두면 **도메인 개념 확장** 또는 **API 포맷 변경**이 발생했을 때 유연하게 대처할 수 있다.

### 목적과 책임이 어떻게 다를까?

이름만 다른 게 아니라 **목적과 책임이 다르기 때문**에 분리된 객체로 사용되는 것이다.

|구분|DTO (Request)|Command|
|---|---|---|
|사용 계층|Controller (웹 계층)|Service 또는 도메인 계층|
|책임|외부 요청 수집, JSON 매핑, 검증 포맷 제공|비즈니스 로직 수행을 위한 의미 있는 명령 표현|
|필드의 표현 방식|문자열 그대로 전달 (`"1990-01-01"`)|비즈니스에 맞는 타입으로 변환 (`LocalDate`)|
|검증 포인트|외부 형식 검증 (`@Valid`, `@NotNull`)|도메인 비즈니스 규칙 검증 (`validate()`)|
|구조 유연성|프론트 요구에 따라 자주 변경됨|서비스/도메인 로직에 맞춰 고정됨|
|테스트 용이성|Web 계층에 의존 (Spring Test 등 필요)|순수 Java 객체로 유닛 테스트 가능|

#### 유효성 검증 책임 분리

Request에선 유효성 검증, Command에선 비즈니스 규칙을 검증할 수 있다.

|계층|검증 목적|사용하는 도구/패턴|예시|
|---|---|---|---|
|**Request DTO (Controller)**|외부 입력의 형식 검증|`@Valid`, `@Pattern`, `@Email`|이메일 형식, 날짜 포맷, 필수 여부 등|
|**Command 객체 (Service/Domain)**|비즈니스 규칙 검증|도메인 메서드, 자체 `validate()` 메서드|나이 제한, 상태 전이 유효성, 고유 값 중복 등|

```java
// Request
// 외부에서 받은 형태: 문자열 기반
public record UserCreateRequest(
    @NotBlank String name,
    @Email String email,
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}") String birthDate
) {
    public CreateUserCommand toCommand() {
        return new CreateUserCommand(name, email, LocalDate.parse(birthDate));
    }
}

// Command
// 내부에선 진짜 도메인 개념 기반
public record CreateUserCommand(String name, String email, LocalDate birthDate) {
    public void validate() {
        if (birthDate.isAfter(LocalDate.now())) {
            throw new BusinessException("미래에 태어났니?");
        }
    }
}
```

### Command에서 Request를 참조하지 말라

**Command 객체가 Request를 참조하게 되면 계층 간 결합이 생기고**, 이는 곧 **Service나 Domain 계층이 Controller에 의존하게 되는 구조**를 의미한다.

```java
// 잘못된 예: 의존 방향이 역전됨
public class CreateUserCommand {
    public static CreateUserCommand from(UserCreateRequest request) {
        return new CreateUserCommand(request.name(), ...);
    }
}
```

올바른 설계는 **Request가 Command를 생성하는 방향(Request → Command)** 이다.  
이는 "의존 방향이 위에서 아래로 흐르도록" 설계하는 객체지향 계층 구조의 기본 원칙이다.

이처럼 **계층 간 의존성은 반드시 위에서 아래 방향**으로만 흘러야 한다. 도메인 계층이 프레젠테이션 계층의 존재를 인지하게 되는 순간, 전체 구조는 깨지기 시작한다.

#### 보완 전략

만약 Command 객체를 생성하기 위한 `toCommand()`등의 메서드가 너무 커지고 DTO에서 책임이 많아질 것 같으면 Mapper 클래스를 따로 만드는 방법을 고려해보자.

```java
public class UserMapper {
    public static CreateUserCommand toCommand(UserCreateRequest request) {
        return new CreateUserCommand(request.name(), ...);
    }
}
```

### Anemic Domain Model

**DTO와 Command 객체의 역할 분리**는, 도메인 계층에서의 책임을 명확히 분리하여 **풍부한 도메인 모델(Rich Domain Model)** 로 발전할 수 있는 기반을 마련한다는 측면에서 중요하다.

DTO와 Command를 적절히 분리하는 작업은 Anemic Domain Model을 피하고, 도메인 모델이 **비즈니스 로직을 스스로 갖는 Rich Domain Model**로 성장하는 기반이 된다.

- 참고: [Anemic Domain Model](https://martinfowler.com/bliki/AnemicDomainModel.html)

>[!TIP] **Anemic Domain Model(빈약한 도메인 모델)**
>영어권 개발자들 사이에서 실제로 널리 사용되는 용어이며, **DDD(Domain-Driven Design)** 맥락에서 등장한 개념이다. 이 표현은 2003년 마틴 파울러(Martin Fowler)가 처음으로 정리해 소개했으며, 당시부터 비판적인 의미로 사용되어 왔다.

## 🎯결론

**"겉으로는 같은 구조처럼 보여도, 계층과 책임이 다르면 객체도 분리되어야 한다."**

Web 계층의 입력 형식과 도메인 계층의 명령은 다른 역할을 하며, 이 둘을 구분하는 설계는 유지보수성과 테스트 용이성, 도메인 주도 설계 모두를 위한 기초가 된다.

## ⚙️EndNote

### 사전 지식

- 계층형 아키텍처 (Layered Architecture)
- DDD 기본 개념
- Java의 `record` 문법
- Bean Validation (`@Valid`, `@NotNull` 등)

### 더 알아보기

- [Anemic Domain Model](https://martinfowler.com/bliki/AnemicDomainModel.html)
- [What is the difference between DTO and Command in DDD?](https://stackoverflow.com/questions/64737721/what-is-the-difference-between-dto-and-command-in-ddd)
- [CQRS란 무엇인가?](https://mslim8803.tistory.com/73)