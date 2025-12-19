---
publish: true
title: Spring 웹 보안 위협과 대응 전략
description: CSRF, XSS, 세션 고정, JWT 탈취 대응법
author: Nine
date: 2025-08-05 01:52:32
categories:
  - Spring
  - Security
tags:
  - devlog
  - Spring-Security
  - CSRF
  - XSS
  - 세션고정
  - JWT
  - 보안위협
  - 웹보안
  - 토큰보안
  - 세션하이재킹
  - 인증인프라
# image: Status: Done
---
## 📌개요

Spring 기반 웹 애플리케이션을 개발하거나 운영할 때 반드시 고려해야 할 대표적인 4가지 보안 위협을 다뤄본다.

CSRF, XSS, 세션 고정, JWT 탈취는 대부분의 웹 시스템에서 발생할 수 있는 위험이다.
각 공격의 특성과 Spring Security를 활용한 대응 전략을 정리하여 실제 서비스에 적용할 수 있는 인사이트를 알아보자.

## 📌내용

### 1. CSRF (Cross-Site Request Forgery)

- **공격 개요**: 사용자가 의도치 않게 공격자의 요청을 자신의 권한으로 서버에 보내게 하는 공격.
- **예시**: 로그인한 사용자가 의심 없는 사이트를 방문했는데, 그 사이트에 포함된 악성 스크립트가 사용자의 계정으로 돈을 송금하는 요청을 서버에 보냄.
- **Spring Security 대응 전략**:
    - `@EnableWebSecurity` 사용 시 기본적으로 CSRF 토큰이 활성화됨.
    - HTML `<form>` 내에 CSRF 토큰을 자동 삽입하거나, JavaScript 요청에서는 `X-CSRF-TOKEN` 헤더로 전달.
    - API 서버의 경우 `csrf().disable()` 후 토큰 기반 인증(JWT 등)으로 대체하는 경우가 많음.

```java
http
  .csrf().disable() // API 서버라면 비활성화 가능
  .authorizeHttpRequests(...)
```

### 2. XSS (Cross-Site Scripting)

- **공격 개요**: 클라이언트 브라우저에서 악성 JavaScript가 실행되도록 유도하는 공격.
- **예시**: 게시판에 `<script>alert('XSS');</script>` 삽입 시, 이를 읽은 다른 사용자의 브라우저가 스크립트를 실행함.
- **대응 전략**:
    - **출력 시 이스케이프**: JSP, Thymeleaf 등 템플릿 엔진은 기본적으로 HTML 이스케이프 적용.
    - **Spring Boot 내장 방어**: Thymeleaf는 `th:text="${var}"`로 출력 시 자동 escape.
    - **JSON 출력 시**: XSS 필터 사용 필요 (예: `XssEscapeServletFilter` 추가).
    - **입력 검증**도 병행 권장 (단, 출력 시 이스케이프는 항상 해야 함).

```java
@Bean
public FilterRegistrationBean<XssEscapeServletFilter> xssFilter() {
    FilterRegistrationBean<XssEscapeServletFilter> registrationBean = new FilterRegistrationBean<>();
    registrationBean.setFilter(new XssEscapeServletFilter());
    registrationBean.setOrder(1);
    return registrationBean;
}
```

### 3. 세션 고정 공격 (Session Fixation)

- **공격 개요**: 공격자가 세션 ID를 미리 지정한 뒤 피해자가 해당 세션으로 로그인하도록 유도.
- **예시**: 공격자가 `JSESSIONID=known_id`로 피해자 브라우저를 설정한 뒤 로그인 유도 → 세션 탈취.
- **Spring Security 대응 전략**:
    - 로그인 성공 시 세션 ID를 새로 발급하도록 설정: `sessionFixation().newSession()`
    - 기본적으로 Spring Security는 `changeSessionId()` 정책을 사용 (Java EE 7+ 환경)

```java
http
  .sessionManagement()
  .sessionFixation().migrateSession(); // 또는 newSession()
```

### 4. JWT 탈취

- **공격 개요**: JWT가 노출되면 누구나 동일한 권한으로 API 요청 가능.
- **예시**: HTTPS 미사용 환경에서 JWT가 탈취되어 악의적인 요청 발생.
- **대응 전략**:
    - **HTTPS 필수**: 전송 시 암호화는 기본.
    - **토큰 저장 위치**:
        - `localStorage` → XSS에 취약하나 CSRF 안전.
        - `HttpOnly Cookie` → CSRF 취약하나 XSS에 안전. CSRF 방어 필수.
    - **JWT 구성 보완**:
        - `exp`(만료시간), `iat`, `jti` 등을 활용하여 재사용 방지.
        - 서버 측에서 블랙리스트 관리 로직 구현 (Redis 활용 등).

```java
// JWT 사용 시 Filter에서 인증 구현 예시
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(...) {
        String token = resolveToken(request);
        if (token != null && jwtProvider.validate(token)) {
            Authentication auth = jwtProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
    }
}
```

## 🎯결론

웹 보안은 단순히 설정으로 끝나지 않는다.

아키텍처 설계 단계부터 공격 벡터를 고려하고, Spring Security를 활용해 방어 레이어를 체계적으로 구성해야 한다.

## ⚙️EndNote

### 사전 지식

- HTTP의 Stateless 특성
- 쿠키/세션/토큰 인증 방식
- Spring Security 설정 구조
- 웹 브라우저의 Same-Origin 정책

### 더 알아보기

- [Spring Security 공식 문서](https://docs.spring.io/spring-security/reference/index.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CSRF in Spring Security](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)
- [XSS Prevention Cheat Sheet (OWASP)](https://owasp.org/www-community/xss-prevention)