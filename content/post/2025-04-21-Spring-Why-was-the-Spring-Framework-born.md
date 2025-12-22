---
publish: true
draft: false
title: Spring 왜 태어났을까?
description: Java 생태계의 한계를 돌파한 IoC의 미학
author: Nine
Created: 2025-04-21
categories:
  - Spring
tags:
  - devlog
  - Spring
  - Framework
# image: Status: Done
---
## 📌개요

초기의 Java EE는 견고하고 강력한 구조를 제공했지만, 개발자들의 손과 발을 묶는 복잡성과 과도한 설정으로 악명 높았다.

이러한 무거움에서 벗어나기 위해 등장한 것이 Spring Framework.

"제어의 주체가 누구인가"라는 핵심 개념을 중심으로 알아본다.

- Spring Framework가 등장한 배경과 해결하고자 했던 문제점
- 프레임워크와 라이브러리의 구조적차이
- Spring Framework와 일반 Java 라이브러리의 예시

## 📌내용

### Java EE 시대의 불편함

2000년대 초 Java EE(Enterprise Edition)는 대규모 애플리케이션을 위한 표준으로 자리잡고 있었다.
하지만 실무에서 이를 사용하는 개발자들은 다음과 같은 고통을 겪고 있었다.

- `EJB`(Enterprise JavaBeans)의 과도한 복잡성
- 무거운 XML 설정과 보일러플레이트 코드
- 느린 배포 및 테스트 주기
- 객체 간 의존성 주입이 어렵고 테스트 불가능한 구조

즉, 코드보다 설정이 많고 유연성이 떨어지며 단위 테스트가 거의 불가능한 환경이었다.

### Spring의 등장

2003년 Rod Johnson은 저서 Expert One-on-One J2EE Design and Development에서 Spring Framework의 기반이 되는 아이디어를 처음 공개했다.

핵심 철학은 간단했다.

>복잡한 EJB 대신 가볍고 유연한 구조로 Java 애플리케이션을 개발하자.

#### Spring의 해결책

| 문제점       | Spring의 접근                       |
| --------- | -------------------------------- |
| EJB의 무거움  | Plain Old Java Object(POJO) 사용   |
| XML 기반 설정 | 어노테이션 기반 설정, Java Config         |
| 결합도 높은 코드 | DI(Dependency Injection)로 느슨한 결합 |
| 테스트 어려움   | IoC 컨테이너로 유닛 테스트 용이성 확보          |

Spring은 이러한 철학을 바탕으로 다음 두 가지 설계 원칙을 채택한다.

1. IoC(Inversion of Control)
	- 객체의 생명주기와 의존성 관리를 프레임워크가 담당
2. AOP(Aspect Oriented Programming)
	- 공통 관심사를 분리하여 핵심 로직에 집중

### 프레임워크와 라이브러리의 결정적 차이

>[!info] 누가 제어권을 갖는가
>
>프레임 워크는 개발자의 코드를 호출하고 라이브러리는 개발자가 라이브러리를 호출한다.

#### Framework

- 개발자가 프레임워크 규칙에 따라 코드를 작성
- 제어 흐름은 프레임워크가 주도
- 개발자는 Hook Point만 제공
- 예: Spring Framework는 개발자가 직접 인스턴스를 생성하지 않고, 스프링 컨테이너가 주도하여 객체 생성 및 주입

```java
@Service
public class UserService {
	private final UserRepository repository

	public UserService(UserRepository repository) {
		this.repository = repository; // Spring이 DI로 주입
	}
}
```

#### Library

- 개발자가 직접 라이브러리를 호출하고 사용하는 방식
- 제어 흐름의 주도권은 개발자에게 있음
- 예: Apache Commons, Gson, Log4j 등은 필요할 때 개발자가 직접 호출

```java
Gson gson = new Gson();
String json = gson.toJson(new User("Alice", 25));
```

#### Spring VS 일반 Java 라이브러리

| 항목     | Spring Framework                             | Java 라이브러리                          |
| ------ | -------------------------------------------- | ----------------------------------- |
| 예시     | `@Component`, `@Autowired`, `@Transactional` | `Gson`, `Apache Commons IO`, `JDBC` |
| 제어 흐름  | Spring이 주도 (IoC 컨테이너)                        | 개발자가 직접 호출                          |
| 의존성 관리 | 자동 주입 (DI)                                   | 수동 인스턴스 생성                          |
| 단위 테스트 | Mocking/Bean 주입으로 용이                         | 의존성 분리 어려움                          |


## ⚙️EndNote

### 사전 지식

- **IoC (Inversion of Control)**: 객체 생성과 의존성 주입을 프레임워크에 위임
- **DI (Dependency Injection)**: 필요한 객체를 외부에서 주입받는 설계 방식
- **AOP (Aspect-Oriented Programming)**: 공통 관심사(예: 로깅, 트랜잭션)를 핵심 로직과 분리

### 더 알아보기

- Expert One-on-One J2EE Design and Development - Rod Johnson
- Spring 공식 문서: [https://spring.io/docs](https://spring.io/docs)
