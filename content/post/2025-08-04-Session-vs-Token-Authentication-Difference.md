---
publish: true
 draft: false
title: 세션 vs 토큰 인증 차이
description: 인증 방식의 구조와 보안 포인트
author: Nine
date: 2025-08-04
categories:
  - Backend
  - Security
tags:
  - devlog
  - 인증방식
  - 세션기반인증
  - 토큰기반인증
  - JWT
  - OAuth2
  - CSRF
  - 보안
  - Security

Status: Done
---
## 📌개요

백엔드 개발자가 꼭 이해하고 있어야 할 인증의 두 축, **세션 기반 인증**과 **토큰 기반 인증**의 구조적 차이점과 각각의 **보안상 고려사항**에 대해 다뤄보자.

특히 REST API 설계, OAuth2 도입, JWT 사용 시 맞닥뜨리는 여러 결정 포인트에서 어떤 방식을 왜 선택해야 하는지, 실전 관점에서 짚어본다.

## 📌내용

### 세션 기반 인증 (Session-based Authentication)

1. **동작 방식**
    - 로그인 성공 시 서버는 사용자 정보를 저장한 **세션 ID**를 생성하고, 클라이언트에 **쿠키로 전달**한다.
    - 이후 모든 요청에는 쿠키가 자동으로 첨부되어 세션 ID를 통해 인증 정보를 확인한다.
2. **특징**
    - 서버가 세션 상태를 **직접 저장** (메모리, Redis 등)
    - 브라우저 친화적 (자동 쿠키 처리)
3. **보안 고려사항**
    - **CSRF 공격**에 취약: 쿠키가 자동 전송되기 때문
    - 세션 탈취(Session Hijacking) 대비 필요
    - **SameSite, Secure, HttpOnly** 쿠키 옵션 사용 필수
4. **적합한 경우**
    - 브라우저 기반의 전통적인 웹 서비스
    - 내부망 또는 통제된 환경

### 토큰 기반 인증 (Token-based Authentication)

1. **동작 방식**
    - 로그인 성공 시 서버는 **JWT(JSON Web Token)** 또는 커스텀 토큰을 발급하고, 클라이언트는 이를 **로컬 저장소에 저장**한다.
    - 이후 요청 시 Authorization 헤더를 통해 **직접 첨부**해서 인증한다.
2. **특징**
    - **서버 무상태(stateless)** 인증 방식 (세션 저장 불필요)
    - 클라이언트/서버 분리된 구조에 유리
    - JWT는 **자체적으로 서명되어 위변조 검증** 가능
3. **보안 고려사항**
    - **XSS에 취약**: 토큰을 로컬스토리지에 저장 시 노출 가능
    - **토큰 탈취 → 장기 권한 노출** 우려
    - 만료시간, Refresh Token 전략, **Token Rotation** 도입 필요
    - HTTPS 필수
4. **적합한 경우**
    - 모바일 앱, SPA(Single Page App)
    - 분산 시스템, 마이크로서비스

### 주요 차이 정리

|항목|세션 기반 인증|토큰 기반 인증|
|---|---|---|
|서버 상태|상태 유지 (Stateful)|상태 없음 (Stateless)|
|저장소|서버 메모리/DB/Redis|클라이언트 로컬 저장소|
|인증 전달|쿠키 (자동 전송)|HTTP Header (직접 전송)|
|취약점|CSRF, 세션 탈취|XSS, 토큰 탈취|
|사용 사례|웹 사이트|모바일, API 서버|

## 🎯결론

>인증 방식은 서비스 구조와 위협 모델에 따라 선택하자. 만능은 없다.

클라이언트가 브라우저 중심이고 보안 제어가 가능한 경우엔 **세션 기반 인증**이, REST API나 모바일 중심이라면 **토큰 기반 인증**이 적절하다.

단, 어떤 방식을 쓰든 보안은 추가 설정과 방어 로직 없이는 무너질 수 있다.

## ⚙️EndNote

### 사전 지식

- HTTP 쿠키/헤더
- JWT 구조 (Header.Payload.Signature)
- CSRF, XSS 개념

### 더 알아보기

- [OWASP 인증 관련 가이드](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT 공식 문서](https://www.jwt.io/introduction)
- [RFC 7519: JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [OAuth 2.0 개념 정리 및 흐름](https://oauth.net/2/)