---
title: "@RestController 요청이 응답으로 반환되기까지"
description: feat.HttpMessageConverter
author: Nine
date: 2025-05-21 21:28:02
categories:
  - SpringBoot
tags:
  - devlog
  - SpringBoot
  - RestController
  - Dispatcher
  - DispatcherServlet
  - HttpMessageConverter
  - request-response-lifecycle
  - Spring-MVC
image: cover.png
---
## 📌개요

Spring Boot를 활용한 REST API 개발에서 `@RestController`는 가장 많이 사용되는 어노테이션 중 하나다. 하지만 그 이면에서 실제 HTTP 요청이 어떻게 애플리케이션으로 전달되고, 어떤 과정을 거쳐 클라이언트에게 JSON 등으로 응답이 전달되는지는 자주 간과된다.

이번 글에서는 Spring MVC의 요청 처리 흐름을 DispatcherServlet을 기점으로 전반적으로 살펴보고, 특히 `HttpMessageConverter`가 어떤 역할을 하며 언제 동작하는지 명확히 정리해본다.

## 📌내용

### 요청 처리 흐름 요약

Spring Boot 애플리케이션에서 HTTP 요청이 들어오면 다음과 같은 순서로 처리된다.

1. **요청 수신 – `DispatcherServlet`**
    - 모든 HTTP 요청은 먼저 `DispatcherServlet`에서 수신된다.
    - 이 서블릿은 Front Controller로서 전체 요청의 진입점이며, Spring Boot에서는 자동으로 등록된다.
        
2. **핸들러 탐색 – `HandlerMapping`**
    - 어떤 컨트롤러 메서드가 이 요청을 처리할지 결정한다.
    - `@RequestMapping`, `@GetMapping` 등으로 설정된 경로 정보를 기반으로 매핑이 일어난다.
        
3. **핸들러 실행 – `HandlerAdapter`**
    - 찾은 핸들러(즉, `@RestController`의 메서드)를 실행하는 어댑터.
    - `@RequestBody`가 선언되어 있다면 이 시점에 `HttpMessageConverter`를 통해 JSON → 객체 변환이 이뤄진다.
        
4. **응답 변환 – `HttpMessageConverter`**
    - 컨트롤러 메서드가 반환한 Java 객체는 `HttpMessageConverter`를 통해 다시 JSON 등의 HTTP 응답 본문으로 변환된다.
    - 이때 사용되는 대표적인 구현체로는 `MappingJackson2HttpMessageConverter`가 있으며, 내부적으로 Jackson을 사용한다.
        
5. **응답 반환 – `DispatcherServlet`**
    - 변환된 응답은 다시 `DispatcherServlet`을 통해 클라이언트에게 반환된다.

### `HttpMessageConverter`의 동작 시점과 역할

`HttpMessageConverter`는 **요청과 응답의 바디(body)를 변환**하는 컴포넌트로서 다음과 같은 역할을 한다:

- `@RequestBody`가 있는 경우:
    - 요청 바디를 JSON → Java 객체로 역직렬화 (ex. DTO로 바인딩)
- `@ResponseBody` 또는 `@RestController`가 있는 경우:
    - 반환되는 객체를 Java 객체 → JSON으로 직렬화

이 변환은 `RequestMappingHandlerAdapter`에 등록된 `messageConverters` 리스트를 순회하며 타입과 Content-Type 헤더를 기반으로 적절한 컨버터를 찾아 자동으로 수행된다.

```mermaid
sequenceDiagram
    participant Client
    participant DispatcherServlet
    participant HandlerMapping
    participant HandlerAdapter
    participant Controller
    participant HttpMessageConverter

    Client->>DispatcherServlet: HTTP 요청 전송
    DispatcherServlet->>HandlerMapping: 핸들러 조회
    HandlerMapping-->>DispatcherServlet: 핸들러 반환
    DispatcherServlet->>HandlerAdapter: 핸들러 실행 요청
    HandlerAdapter->>HttpMessageConverter: 요청 바디 역직렬화 (JSON → 객체)
    HttpMessageConverter-->>HandlerAdapter: 객체 반환
    HandlerAdapter->>Controller: 메서드 호출
    Controller-->>HandlerAdapter: 객체 반환
    HandlerAdapter->>HttpMessageConverter: 객체 직렬화 (객체 → JSON)
    HttpMessageConverter-->>HandlerAdapter: JSON 반환
    HandlerAdapter-->>DispatcherServlet: 응답 반환
    DispatcherServlet-->>Client: 응답 전송
```

## 🎯결론

> Spring MVC의 요청 처리 흐름은 `DispatcherServlet`에서 시작해 `HandlerMapping`, `HandlerAdapter`, `HttpMessageConverter`를 통해 RESTful 서비스를 완성한다.

특히 `HttpMessageConverter`는 요청과 응답을 Java 객체 ↔ JSON 사이에서 자동 변환해주는 핵심적인 컴포넌트로, 동작 시점과 역할을 명확히 이해하는 것이 REST API 개발의 안정성과 유지보수성을 높이는 데 매우 중요하다.

## ⚙️EndNote

### 사전 지식

- 서블릿 기반 웹 애플리케이션 구조
- Spring MVC의 `@Controller`, `@RestController` 어노테이션 차이
- Jackson의 직렬화/역직렬화 개념

### 더 알아보기

- [Spring Web MVC 공식 문서](https://docs.spring.io/spring-framework/reference/web/webmvc.html)
- [Spring Boot의 HttpMessageConverters 설정](https://docs.spring.io/spring-boot/docs/current/reference/html/web.html#web.servlet.spring-mvc.message-converters)
- [DispatcherServlet 내부 구조](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html)