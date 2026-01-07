---
publish: true
draft: false
title: 웹 API 진화의 핵심 전환
description: 왜 우리는 REST를 선택했는가
author: Nine
date: 2025-05-20 13:23:57
categories:
  - CS
  - Network
tags:
  - devlog
  - SOAP
  - RESTful
  - REST-API
  - API
  - 마이크로서비스
  - XML
  - JSON
  - HTTP

Status: Done
---
## 📌개요

과거 웹 서비스 API의 표준은 SOAP(Simple Object Access Protocol)였다.

그러나 2010년대를 지나며 REST(Representational State Transfer)가 빠르게 주류로 자리 잡았고 요즘 대부분의 공개 웹 API에서 RESTful API가 사실상의 표준으로 자리 잡고 있다.

웹 API의 발전 과정 속에서, SOAP에서 REST로의 전환이 일어난 배경과 그에 따른 장단점을 알아보자.

## 📌내용

### SOAP의 등장과 전성기

SOAP은 WSDL(Web Service Definition Language), XML 기반 메시지 포맷 그리고 HTTP 외에도 SMTP나 FTP를 사용할 수 있는 유연성 덕분에 초기에는 대형 엔터프라이즈 시스템에서 주로 채택되었다.
보안(SOAP Security), 트랜잭션, 메시지 무결성 등 강력한 스펙이 특징이었다.

그러나 SOAP은 다음과 같은 문제를 가지고 있었다.
- 메시지 포맷이 무겁고 복잡함 (XML 기반)
- 학습 비용이 높고 구현이 어려움
- 브라우저, 모바일 등 가벼운 클라이언트 환경과 맞지 않음

### REST의 부상

2000년에 로이 필딩(Roy Fielding)이 논문에서 제시한 REST는 본래 HTTP의 아키텍처 스타일로 제안된 개념이었지만 시간이 지나며 "RESTful API"라는 개념으로 대중화되었다.

REST의 핵심은 자원(Resource) 지향 아키텍처와 표준 HTTP 메서드(GET, POST, PUT, DELETE)를 활용한 통신이다.

REST가 빠르게 채택된 이유는 다음과 같다.
- HTTP라는 웹의 표준을 그대로 활용
- JSON 기반 경량 메시지 포맷 (브라우저/모바일 친화적)
- 상태 없는(stateless) 구조로 확장성 우수
- 클라이언트와 서버 간 결합도가 낮음
- 문서화가 간단하고 테스트/디버깅이 쉬움

### SOAP VS REST

| 항목       | SOAP                           | REST                     |
| -------- | ------------------------------ | ------------------------ |
| 메시지 포맷   | XML (무겁고 엄격)                   | JSON, XML (가볍고 유연)       |
| 표준       | WSDL 등 다양한 스펙 존재               | 명확한 표준 없음 (URI, HTTP 활용) |
| 보안, 트랜잭션 | WS-Security, WS-Atomic 등 내장 지원 | HTTP 보안 활용, 트랜잭션 미지원     |
| 상태성      | 상태 유지(Stateful) 가능             | Stateless 기반             |
| 학습 곡선    | 높음 (설정과 구현 복잡)                 | 낮음 (간단한 HTTP 인터페이스)      |
| 확장성과 경량성 | 제한적                            | 뛰어남                      |

### REST 이후의 대안이 있을까?

REST는 단순하고 확장 가능한 아키텍처지만, 다음과 같은 한계가 존재한다.
- 과도한 데이터 전송 (Over-fetching/Under-fetching)
- 정적인 엔드포인트 설계
- 실시간 양방향 통신 미지원
- 리소스 간 관계 표현의 어려움

이러한 문제를 해결하기 위한 대안으로 다음 기술이 떠오르고 있다.
- **GraphQL**: 클라이언트가 필요한 데이터만 요청할 수 있어 Over-fetching/Under-fetching 문제를 해소함.
- **gRPC**: HTTP/2 기반의 양방향 스트리밍과 낮은 대역폭, 빠른 응답속도를 제공하여 마이크로서비스 간 통신에 적합함.
- **Async API, WebSocket 기반 API**: 실시간 스트리밍 통신 및 이벤트 기반 시스템에 특화됨.

이렇듯 REST는 여전히 강력한 기본값이지만, 목적에 따라 더 나은 대안들이 상황별로 사용되고 있다.

## 🎯결론

페이스북, 트위터, 구글, 아마존 등 주요 플랫폼 API는 거의 모두 REST 기반이다.
심지어 마이크로소프트도 SOAP에서 REST 기반 API로 점진적으로 이동하고 있다고 한다.

## ⚙️EndNote

### 사전 지식

- HTTP 메서드(GET, POST, PUT, DELETE)
- XML vs. JSON 포맷
- 클라이언트-서버 아키텍처
- 상태 유지(Stateful) vs 상태 없음(Stateless)

### 더 알아보기

- [Architectural Styles and the Design of Network-based Software Architectures - Roy Thomas Fielding](https://ics.uci.edu/~fielding/pubs/dissertation/top.htm)
- [Import a SOAP API to API Management and convert it to REST](https://learn.microsoft.com/en-us/azure/api-management/restify-soap-api)
- [RESTful API 디자인 가이드 - Microsoft](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design)
- [SOAP vs REST 비교 블로그 - Postman](https://blog.postman.com/soap-vs-rest/)
- [GraphQL 공식 문서](https://graphql.org/)
- [gRPC 공식 문서](https://grpc.io/)