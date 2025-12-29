---
publish: true
draft: false
title: Spring Boot와 웹서버
description: 웹 서버와 WAS의 차이, 내장 톰캣의 역할
author: Nine
date: 2025-04-28
categories:
  - Spring
tags:
  - devlog
  - SpringBoot
  - WebServer
  - WAS
  - Tomcat
  - Bean
  - Java
  - Backend
# image: Status: Done
---
## 📌개요

웹 서버와 WAS의 차이점을 명확히 이해하고 Spring Boot의 내장 톰캣이 어떤 역할을 하는지 알아본다.
또한, Spring Boot에서 사용되는 다양한 Bean 등록 방법과 각각의 장단점을 비교 분석한다.

## 📌내용

### Web Server VS Web Application Server

#### 웹 서버(Web Server)

- 정적 콘텐츠(HTML, CSS, JS, 이미지 등)을 제공하는 서버
- 클라이언트의 요청을 받아 파일 시스템의 리소스를 반환
- 동적 처리 불가능 WAS와 연동 필요
- 예: Nginx, Apache HTTP Server 등

#### 웹 애플리케이션 서버(Web Application Server)

- 편하게 '와쓰'라고 발음하는 경우가 많다.
- 동적 콘텐츠(비즈니스 로직, DB 연동)를 처리하는 서버
- 서블릿 컨테이너를 포함해 애플리에킹션 실행 환경 제공
- 웹 서버의 기능도 일부 포함 가능 (단, 정적 리소스 처리 효율성이 떨어짐)
- 예: Tomcat, Jetty 등

#### 주요 차이점

|구분|웹 서버|WAS|
|---|---|---|
|**역할**|정적 콘텐츠 제공|동적 콘텐츠 처리|
|**예시**|Nginx, Apache|Tomcat, Jetty|
|**성능**|정적 파일 처리 최적화|애플리케이션 로직 실행|
|**보안**|리버스 프록시, 로드 밸런싱|세션 관리, 트랜잭션 처리|

### Spring Boot의 내장 톰캣은 WAS

- Spring Boot는 내장형 톰캣을 기본으로 제공한다.
	- 별도의 WAS 설치 없이 실행이 가능하단 소리다.
- `spring-boot-starter-web` 의존성 추가 시 자동 구성된다.
- WAS로 동작하지만 정적 리소스도 처리 가능하다. (개발용으로 충분)
- 프로덕션 환경에서는 Nginx + Spring Boot(Tomcat) 등 조합을 사용하는 것이 좋다.

### Spring Boot에서 Bean 등록 방법 비교

#### 컴포넌트 스캔

`@Component`, `@Service`, `Repository`, `@Controller` 등 어노테이션으로 간단히 빈 등록이 가능하다. 명확한 케이스를 나타내는 어노테이션을 사용하는데, 대부분 `@Component`를 상속 받고 있다.

- **장점:**
	- 간편한 등록 `@Component` 및 하위 어노테이션 자동 감지
	- 의존성 자동 주입 `@Autowired`
- **단점:**
	- 명시적 제어 불가능
	- 모든 빈이 스캔되므로 불필요한 빈이 등록될 수 있다.
	- 커스터마이징이 어렵다.

#### 자바 설정 클래스

`@Configuration` + `@Bean` 조합으로 명시적 등록 방법

```java
@Configuration
public class AppConfig {
	@Bean
	public MyService myService() {
		return new MyServiceImpl();
	}
}
```

- **장점:**
	- 명시적 빈 등록
	- 필요한 빈만 선택적으로 등록 가능
	- 외부 라이브러리 빈 등록에 유용
- **단점:**
	- 수동 등록이 번거로울 수 있다.

#### Import를 이용한 빈 등록

```java
@Configuration
@Import({DatabaseConfig.class, SecurityConfig.class})
public class AppConfig {}
```

- **장점:**
	- 모듈화된 설정 관리 가능
- **단점:**
	- 의존성 관계가 명확하지 않을 수 있다.

#### XML 기반 빈 등록

legacy한 기술이라서 "이런 방법이 있구나" 정도만 이해하자.

```xml
<bean id="myService" class="com.example.MyServiceImpl" />
```

- **장점:**
	- 레거시 시스템과 호환성
- **단점:**
	- 가독성이 떨어진다.
	- 유지보수가 어렵다.
	- 최신 Spring에 권장되지 않는다.

#### 최적의 방법은?

- 컴포넌트 스캔: 일반적인 애플리케이션 빈 등록
- `@Bean` 수동 등록: 외부 라이브러리, 커스텀 설정 필요 시
- `@Import`: 설정 분리 시 유용

## ⚙️EndNote

### 사전 지식

- Servlet Container: 웹 애플리케이션 실행 환경
	- 예: Tomcat
- DI(Dependency Injection): Spring의 핵심 개념, 빈 간의 의존성 관리

### 더 알아보기

- [Spring 공식 문서 - Embedded Web Servers](https://docs.spring.io/spring-boot/how-to/webserver.html#page-title)