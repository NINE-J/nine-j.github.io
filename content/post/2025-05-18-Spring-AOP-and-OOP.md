---
publish: true
title: Spring에서 AOP란
description: OOP & AOP
author: Nine
date: 2025-05-18 15:20:00
categories:
  - Spring
tags:
  - devlog
  - Spring
  - SpringAOP
  - Transactional
  - 설계
  - 프록시패턴
  - SpringBoot
# image: Status: Done
---
## 📌개요

Spring에서 OOP(Object Oriented Programming) 만큼이나 강조되는 AOP(Aspect Oriented Programming)은 언제, 왜 필요할까?

또한 AOP와 OOP는 대립되는 개념이 아니라는 것.
서로를 보완하며 강력한 설계를 가능케 하는지 알아보자.

## 📌내용

### 왜 AOP가 필요한가?

Spring Framework의 핵심 철학은 POJO와 OOP 기반의 설계다.
하지만 서비스가 복잡해질수록 로깅, 트랜잭션, 보안 등 공통 관심사가 여기저기 흩어져 코드를 어지럽힌다.

예를 들어 다음과 같은 로직을 생각해보자.

```java
@Transactional
public void createUser(UserRequest request) {
    log.info("사용자 생성 시작");
    validate(request);
    userRepository.save(request.toEntity());
    log.info("사용자 생성 완료");
}
```

이 메서드는 핵심 기능 외에도 트랜잭션 처리, 로깅이라는 **횡단 관심사(cross-cutting concerns)** 를 포함하고 있다.

이러한 코드가 여러 메서드에 중복되면 유지보수와 확장성이 심각하게 저하된다.
AOP는 이런 문제를 해결하기 위해 등장했다.

#### 로그인 감사 로깅

```java
@Aspect
@Component
public class LoginLoggingAspect {

    @Around("@annotation(com.example.annotation.Auditable)")
    public Object logLogin(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        log.info("[AUDIT] {} executed in {}ms", joinPoint.getSignature(), System.currentTimeMillis() - start);
        return result;
    }
}
```

사용자 정의 어노테이션 `@Auditable`을 붙인 메서드에 감사 로깅이 적용된다.
핵심 로직과 분리되어 있기 때문에 유지보수가 쉬워지고 로직이 더 깔끔해진다.

### AOP VS OOP

AOP와 OOP는 결코 대립하지 않는다.
오히려 상호 보완적이다.

- OOP는 모듈화를 통해 도메인 개념을 캡슐화한다.
- AOP는 횡단 관심사를 모듈화하여 코드 중복을 제거한다.

AOP는 OOP만으로는 분리하기 어려운 공통 로직을 흩어지지 않게 모듈화하는 방식이다.
즉, AOP는 OOP의 약점을 보완한다.

### 💡 재미있는 일화

Spring 초창기에는 AOP가 XML 설정 기반으로 매우 복잡했지만 지금은 `@Aspect` 어노테이션만으로 매우 간단하게 적용할 수 있다.

JPA 트랜잭션 설정 없이 `@Transactional` 하나만 붙였는데도 실제로 프록시 기반으로 트랜잭션이 관리된다는 사실을 알게 되었을 때, 마치 "마법 같다"는 반응이 많다.

#### Spring AOP의 초기 XML 설정의 복잡성

Spring AOP의 초기 버전에서는 XML을 통해 AOP 설정을 해야 했다.
예를 들어 [DigitalOcean의 튜토리얼 - By Pankaj Kumar](https://www.digitalocean.com/community/tutorials/spring-aop-example-tutorial-aspect-advice-pointcut-joinpoint-annotations)에서는 XML 기반 AOP 설정의 예시를 다음과 같이 보여준다.

이러한 설정은 복잡하고 유지보수가 어려웠겠지.

```xml
<aop:config>
	<aop:aspect ref="employeeXMLConfigAspect" id="employeeXMLConfigAspectID" order="1">
		<aop:pointcut expression="execution(* com.journaldev.spring.model.Employee.getName())" id="getNamePointcut"/>
		<aop:around method="employeeAroundAdvice" pointcut-ref="getNamePointcut" arg-names="proceedingJoinPoint"/>
	</aop:aspect>
</aop:config>
```

#### `@Transactional` 어노테이션과 프록시 기반 트랜잭션 관리의 "마법"

`@Transactional` 어노테이션을 사용하면 개발자는 명시적으로 트랜잭션을 시작하거나 종료하는 코드를 작성하지 않아도 된다.

Spring은 내부적으로 프록시를 생성하여 트랜잭션을 관리한다.
이러한 동작은 개발자에게는 마치 "마법"처럼 느껴질 수 있다.

[Marco Behler의 블로그](https://www.marcobehler.com/guides/spring-transaction-management-transactional-in-depth)에서는 이러한 동작을 다음과 같이 설명한다.

> [!QUOTE]
> "Now whenever you are using `@Transactional` on a bean, Spring uses a tiny trick. It does not just instantiate a UserService, but also a transactional _proxy_ of that UserService."
>
> "이제 빈에서 `@Transactional`을 사용할 때마다 Spring은 작은 트릭을 사용합니다. 이는 단순히 사용자 서비스를 인스턴스화하는 것뿐만 아니라 해당 사용자 서비스의 트랜잭션 프록시도 사용합니다."

[Stack Overflow의 질문: Spring - @Transactional - What happens in background?](https://stackoverflow.com/questions/1099025/spring-transactional-what-happens-in-background)에서도 이와 유사한 설명을 확인할 수 있었다.
무려 15년 전 질문이다.

> [!QUOTE]
> "But at a very high level, Spring creates proxies for classes that declare `@Transactional` on the class itself or on members. The proxy is mostly invisible at runtime. It provides a way for Spring to inject behaviors before, after, or around method calls into the object being proxied."
>
> "매우 높은 수준에서 Spring은 클래스 자체 또는 멤버에 `@Transactional`을 선언하는 클래스에 대한 프록시를 생성합니다. 프록시는 런타임에 대부분 보이지 않습니다. 이 프록시는 Spring이 메서드 호출 전후 또는 주변의 동작을 프록시 대상 객체에 주입할 수 있는 방법을 제공합니다."

## 🎯결론

OOP는 설계의 뼈대, AOP는 설계의 윤활유다.
AOP는 복잡한 애플리케이션에서 반드시 필요한 설계 전략이다.

## ⚙️EndNote

### 사전 지식

- Java 언어 및 Spring Framework 기초
- DI(의존성 주입)과 Proxy 패턴 개념
- 어노테이션 기반 설정 이해

### 더 알아보기

- [Spring AOP 공식 문서](https://docs.spring.io/spring-framework/reference/core/aop.html)
- [AspectJ 소개](https://eclipse.dev/aspectj/)
- 핵심 키워드: `@Aspect`, `@Around`, `JoinPoint`, `cross-cutting concern`, `Proxy`, `Advice`, `Pointcut`