---
publish: true
draft: false
title: URL 입력 후 ENTER 키
description: 무슨 일이 벌어질까?
author: Nine
date: 2025-04-08
categories:
  - CS
  - Network
tags:
  - devlog
  - Network
  - Protocol
# image: Status: Done
---
## 📌개요

사용자가 브라우저에 URL을 입력하고 엔터를 누르면, 요청한 웹페이지를 가져와 화면에 표시하기까지 복잡한 일련의 과정이 진행된다.

이 과정은 여러 시스템, 프로토콜, 그리고 인터넷 스택의 다양한 계층을 포함한다.
엔지니어에게 이 과정을 이해하는 것은 성능 최적화, 보안 강화, 문제 해결에 필수적이다.

이 과정을 기술적으로 상세히 알아보자.

## 📌내용

### 네트워킹

브라우저는 언제 URL을 분석해서 요청을 처리할 방법을 결정한다.

1. **URL의 구성 요소** (예: `https://www.example.com:443/path?query=value#fragment`)
	- 스키마/프로토콜: `https`는 사용할 프로토콜(HTTP/HTTPS)을 나타낸다.
	- 도메인: `www.example.com`은 서버를 지정한다.
	- 포트: `:443`(선택 사항 HTTP는 기본 80, HTTPS는 443)
	- 경로: `/path`는 요청할 리소스를 식별한다.
	- 쿼리: `?query=value`는 추가 매개변수를 제공한다.
	- 프래그먼트: `#fragment`는 페이지 내 특정 섹션을 가리킨다.
2. **유효성 검사**: 브라우저는 URL의 문법이 올바른지 확인한다.
	- 잘못된 경우 검색 쿼리로 처리할 수 있다.
3. **HSTS 확인**
	- HTTPS 연결을 위해 브라우저는 HSTS(HTTP Strict Transport Security) 목록을 확인하여 도메인이 보안 연결을 요구하는지 확인한다.
4. **인코딩**
	- 특수 문자는 URL 인코딩 (예: 공백을 `%20`으로 변환)을 통해 처리된다.

### DNS 조회

도메인 이름을 실제 서버의 IP 주소로 변환하는 과정.

1. **로컬 캐시 확인**
	- 브라우저와 OS는 먼저 로컬 DNS 캐시를 확인한다.
		- 예: 브라우저 캐시, `/etc/hosts` 파일
2. **재귀적 DNS 쿼리**
	- 캐시에 없으면 시스템은 ISP의 DNS 리졸버 또는 공용 DNS (예: 8.8.8.8)에 쿼리를 보낸다.
		- ISP: Internet Service Provider, DNS: Domain Name System
	- 리졸버는 루트 DNS 서버, TLD(최상위 도메인, `.com`) 서버, 권한 있는 네임 서버를 순차적으로 질의하여 IP 주소를 얻는다.
		- TLD: Top-Level Domain
3. **DNS 레코드**
	- `A` 레코드(IPv4 주소) 또는 `AAAA` 레코드(IPv6 주소)를 반환.
	- `CNAME` 레코드가 있으면 추가 조회가 필요할 수 있다.
4. **DNS 캐싱**
	- 조회된 IP는 TTL에 따라 로컬에 캐싱되어 이후 요청을 가속화한다.
		- TTL: Time To Live
5. **DNS 보안**
	- DNSSEC을 사용하면 응답의 무결성을 보장한다.
		- DNSSEC: DNS Security Extensions

### TCP 연결

브라우저는 서버와 안정적인 연결을 설정하기 위해 TCP 프로토콜을 사용한다.
TCP: Transmission Control Protocol (전송 제어 프로토콜)

1. **3 Way 핸드셰이크**
	- 클라이언트가 `SYN` 패킷을 서버로 전송
	- 서버가 `SYN-ACK`로 응답
	- 클라이언트가 `ACK`로 보내 연결을 완료
		- SYN: SYNchronization (동기화), ACK: ACKnowledgement (확인)
2. **소켓 생성**
	- 클라이언트와 서버는 각각 소켓을 열어 데이터를 주고 받을 준비를 한다.
3. **지연 요소**
	- 네트워크 레이턴시와 패킷 손실은 연결 시간을 늘릴 수 있다.
	- TCP Slow Start는 초기 전송 속도를 조절한다.
4. **Keep-Alive**: HTTP/1.1부터는 연결을 재사용하여 오버헤드를 줄인다.

### TLS 핸드셰이크 (HTTPS)

HTTPS 요청의 경우 데이터 보안을 위해 TLS(Transport Layer Security) 연결을 설정한다.

1. **TLS 협상**
	- 클라이언트는 `ClientHello` 메시지로 지원하는 암호화 스위트와 TLS 버전을 전송.
	- 서버는 `SeverHello`로 선택한 암호화 방식과 인증서를 응답
2. **인증서 검증**
	- 클라이언트는 서버의 인증서를 CA로 검증
		- CA: Certificate Authority
	- 인증서의 도메인 일치 여부와 유효 기간을 확인
3. **키 교환**
	- Diffie-Hellman 또는 RSA를 사용해 세션 키를 생성
	- 이후 데이터는 대칭 암호화(예: AES)로 보호
4. **성능 고려사항**
	- TLS 1.3은 핸드셰이크를 단순화하여 지연을 줄임
	- 세션 재개는 이전 연결의 캐시를 활용

### HTTP 통신

#### HTTP 요청

브라우저는 서버에 HTTP 요청을 보내 리소스를 요청한다.

1. **요청 구성**
	- 메서드: `GET`, `POST` 등.
	- 헤더: `Host`, `User-Agent`, `Accept`, `Cookie` 등.
	- 바디: `POST` 요청 시 데이터 포함 (예: JSON, Form 데이터).
2. **HTTP/2 및 HTTP/3**
	- HTTP/2는 멀티플렉싱과 헤더 압축을 지원
	- HTTP/3는 UDP 기반 QUIC를 사용하여 성능을 개선
3. **프록시 및 CDN**
	- 요청은 프록시 서버나 CDN(예: Cloudflare)을 거칠 수 있음
	- CDN은 캐싱된 콘텐츠를 제공해 지연을 줄임

#### 서버 응답

서버는 요청을 처리하고 응답을 반환한다.

1. **응답 구성**
	- 상태 코드
		- `200 OK`, `404 Not Found`, `301 Moved Permanently` 등
	- 헤더
		- `Content-Type`, `Content-Length`, `Cache-Control` 등
	- 바디
		- HTML, JSON, 이미지 등의 콘텐츠
2. **리다이렉션**
	- `301` 또는 `302` 상태 코드는 브라우저를 다른 URL로 이동시킴
3. **압축**
	- `gzip` 또는 `brotli`로 콘텐츠를 압축해 전송 속도를 높임

### 렌더링

#### HTML 파싱 및 DOM 구축

브라우저는 서버에서 받은 HTML을 파싱하여 DOM을 생성한다.
DOM: Document Object Model

1. 파싱 과정
	- HTML은 바이트 스트림에서 토큰으로 분해됨
	- 토큰은 노드로 변환되어 DOM 트리로 조립
2. 오류 처리
	- 잘못된 HTML(예: 닫히지 않은 태그)도 최대한 파싱
3. 비동기 로딩
	- `<script>` 태그는 기본적으로 파싱을 차단하나, `async` 또는 `defer` 속성으로 최적화 가능

#### CSS 파싱 및 렌더 트리

CSS는 스타일을 정의하고 렌더 트리를 생성해 화면에 표시할 요소를 결정한다.

1. CSSOM 생성
	- CSS는 CSSOM으로 변환
		- CSSOM: CSS Object Model
2. 렌더 트리
	- DOM과 CSSOM을 결합해 보이는 요소만 표함
3. 리플로우
	- 스타일 변경 시 레이아웃을 재계산

#### 자바스크립트 실행

자바스크립트는 동적 콘텐츠를 생성하고 페이지를 조작한다.

1. 엔진
	- V8(Chrome), SpiderMonkey(Firefox) 등.
2. 이벤트 루프
	- 비동기 작업(예: `setTimeout`, AJAX)을 처리.
3. 성능 병목
	- 무거운 스크립트는 렌더링을 지연시킬 수 있음

#### 화면 렌더링

브라우저는 렌더 트리를 기반으로 픽셀을 화면에 그린다.

1. 레이아웃: 요소의 위치와 크기를 계산
2. 페인팅: 계산된 스타일을 픽셀로 변환
3. 합성: GPU를 활용해 레이어를 합성
4. 최적화: 하드웨어 가속과 캐싱으로 성능 개선

## 🎯결론

URL 입력부터 화면 표시까지의 과정은 네트워킹(DNS, TCP, TLS, HTTP)과 웹 기술(파싱, 렌더링)의 긴밀한 협력으로 이루어진다.

각 단계는 성능, 보안, 사용자 경험에 직접적인 영향을 미치며 엔지니어는 이를 이해함으로써 최적화와 문제 해결의 기반을 마련할 수 있다.

### 과정 요약

1. URL 파싱: 브라우저는 URL을 분석하여 프로토콜(예: HTTPS), 도메인, 경로 등을 식별하고 요청 준비를 한다.
2. DNS 조회: 도메인 이름을 IP 주소로 변환하며, 로컬 캐시 또는 DNS 서버를 통해 빠르게 처리된다.
3. TCP 연결: 클라이언트와 서버 간 안정적인 연결을 위해 3Way 핸드셰이크를 수행한다.
4. TLS 핸드셰이크 (HTTPS): 보안 연결을 위해 인증서 검증과 세션 키 교환을 통해 데이터를 암호화 한다.
5. HTTP 요청/응답: 브라우저가 서버에 리소스를 요청하고, 서버는 HTML, CSS, 이미지 등으로 응답한다.
6. 렌더링
	- HTML을 파싱해 DOM을 구축하고 CSS를 적용해 렌더 트리를 생성
	- 자바스크립트를 실행해 동적 콘텐츠를 처리
	- 레이아웃 계산, 페인팅, 합성을 통해 화면에 페이지를 표시

## ⚙️EndNote

### 사전 지식

- **OSI 7계층**: DNS(TCP/UDP), HTTP, TLS는 응용/전송 계층에서 동작.
- **TCP/IP 모델**: 인터넷 프로토콜 스택의 기본 구조 이해.
- **브라우저 엔진**: Webkit, Blink, Gecko의 렌더링 방식 차이.

### 더 알면 좋을 것들

- **웹 성능 최적화**: Critical Rendering Path, Lazy Loading.
- **보안**: CORS, CSRF, XSS 방지 기법.
- **모니터링**: Lighthouse, Web Vitals로 성능 측정.
- **프로그레시브 웹 앱(PWA)**: 오프라인 캐싱과 빠른 로딩.
- **브라우저 개발자 도구**: 네트워크 탭과 성능 분석 활용.

### 참조 자료

- [[네트워크] 주소창에 URL을 입력하면 일어나는 일](https://velog.io/@forest_xox/%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-%EC%A3%BC%EC%86%8C%EC%B0%BD%EC%97%90-URL%EC%9D%84-%EC%9E%85%EB%A0%A5%ED%95%98%EB%A9%B4-%EC%9D%BC%EC%96%B4%EB%82%98%EB%8A%94-%EC%9D%BC)
- [DNS cache and DNS lookup: What happens from typing in a URL to displaying a website? (Part 1)](https://medium.com/@alysachan830/what-happens-from-typing-in-a-url-to-displaying-a-website-part-1-dns-cache-and-dns-lookup-86441848ea59)
- [[네트워크] 브라우저 주소창에 URL을 입력 시 일어나는 일 정리 (DNS)](https://hyunki99.tistory.com/109)