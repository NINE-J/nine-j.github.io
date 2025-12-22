---
publish: true
draft: false
title: JWT 구조를 구체적으로 알아보자
description: 보안 토큰의 3단계 구조 분석
author: Nine
date: 2025-08-05 01:58:05
categories:
  - Backend
  - Security
tags:
  - devlog
  - JWT
  - 인증
  - 보안
  - AccessToken
  - Backend
  - OAuth
  - JSON-Web-Token
  - Spring-Security
  - 인증토큰구조
# image: Status: Done
---
## 📌개요

최근 백엔드 인증/인가 시스템을 설계하거나 OAuth 2.0 기반의 로그인 시스템을 구축할 때 가장 많이 등장하는 키워드 중 하나가 `JWT(JSON Web Token)`이다.

JWT의 **3단계 구조**를 정확히 이해하고, 각 구성 요소가 왜 존재하는지, 어떤 역할을 하는지 예제를 통해 상세히 알아본다.

## 📌내용

JWT는 기본적으로 **세 부분으로 구성된 문자열**이다.

```
<Header>.<Payload>.<Signature>
```

각각의 의미를 뜯어보자.

### 1. Header (헤더)

이 부분은 **토큰을 어떻게 검증할 것인지에 대한 메타 정보**를 제공한다.
Base64Url로 인코딩되어 토큰의 첫 번째 파트를 구성한다.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg`(algorithm): 토큰 서명을 생성하기 위한 알고리즘을 명시. 보통 `HS256` 또는 `RS256`.
- `typ`(type): 토큰의 타입을 나타냄. JWT를 사용하는 경우 `"JWT"`로 고정.

### 2. Payload (페이로드)

이 페이로드는 **서명되어 있지만 암호화되어 있진 않다.** 즉, **누구나 내용을 볼 수 있다.**  
따라서 민감 정보(password, 주민번호 등)는 절대 포함시키면 안 된다.

```json
{
  "sub": "user1234",
  "name": "John Doe",
  "iat": 1691432621,
  "exp": 1691436221,
  "role": "admin"
}
```

- `sub`(subject): 주체 식별자 (ex. 사용자 ID).
- `iat`(issued at): 발급 시간 (Unix timestamp).
- `exp`(expiration): 만료 시간.
- `role`, `email` 등 커스텀 클레임: 인증 또는 인가에 필요한 사용자 속성 값.

### 3. Signature (서명)

서버는 이 서명을 사용하여 토큰이 **위조되지 않았음을 검증**할 수 있다.  
서명이 다르면 페이로드가 조작된 것이다. 유효하지 않은 토큰으로 처리된다.

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

- 앞서 인코딩한 Header와 Payload를 `.`으로 연결한 후,
- 비밀 키(`secret`)를 이용해 알고리즘(`HS256` 등)으로 서명한 값.

### JWT 예시

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTYiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MDAwMDAwMDB9.
TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ
```

각 부분을 디코딩하면:

- **Header**:
    ```json
    { "alg": "HS256", "typ": "JWT" }
    ```
- **Payload**:
    ```json
    { "sub": "123456", "role": "admin", "exp": 1700000000 }
    ```
- **Signature**: 서버에서 secret key로만 확인 가능.

### JWT의 주요 보안 고려사항

- **서명만 존재하고, 페이로드는 암호화되지 않는다.**
    - 민감 정보는 넣지 말 것.
- **만료 시간(`exp`)을 꼭 설정**하자.
    - 토큰 탈취 시 무한히 사용할 수 없도록 하기 위해.
- **서버는 반드시 Signature를 검증**해야 한다.
    - 서명 검증을 하지 않으면 누구나 Payload만 바꿔도 토큰이 유효해진다.

## 🎯결론

>JWT는 “신뢰할 수 있는 정보를 클라이언트에 안전하게 전달하기 위한 구조화된 문자열”이다.  

`Header`는 토큰의 형식과 알고리즘, `Payload`는 전달하고자 하는 정보, `Signature`는 위조 여부를 판별하는 핵심 키이다.

## ⚙️EndNote

### 사전 지식

- Base64 인코딩/디코딩
- 대칭/비대칭 키 개념 (HMAC vs RSA)
- HTTP 인증 방식 (Bearer Token)

### 더 알아보기

- [jwt.io](https://jwt.io/)
- [RFC 7519: JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [Spring Security에서 JWT 사용하기 공식 가이드](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html)
- OAuth 2.0과 JWT의 관계
- JWT vs Session 기반 인증 비교 포스팅