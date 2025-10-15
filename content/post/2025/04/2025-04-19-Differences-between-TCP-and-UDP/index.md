---
title: TCP vs UDP
description: 신뢰와 속도 프로토콜 비교
author: Nine
date: 2025-04-19 10:00:00
categories:
  - CS
  - Network
tags:
  - devlog
  - TCP
  - UDP
  - 전송계층
  - 네트워크
  - 스트리밍
  - 패킷
  - 프로토콜
  - 웹
  - web
image: cover.png
---
## 📌개요

네트워크 기초에서 가장 먼저 마주치는 질문 중 하나 "TCP와 UDP는 뭐가 다른가?"
이 두 전송 계층 프로토콜의 구조적 차이, 성능 트레이드오프, 사용 사례 등을 알아보자.

## 📌내용

### 전송 계층의 두 얼굴

>[!INFO] 패킷이란?
>정보 기술에서 패킷 방식의 컴퓨터 네트워크가 전달하는 데이터의 형식화된 블록이다.
>즉, 컴퓨터 네트워크에서 데이터를 주고 받을 때 정해 놓은 규칙이다.

인터넷은 데이터를 잘게 나눈 패킷을 여러 장비를 통해 전달하는 구조다.
이때 각 패킷이 어떤 방식으로 전송되는지를 결정짓는 핵심이 바로 전송 계층의 프로토콜이다.
대표적으로 TCP(Transmission Control Protocol)과 UDP(User Datagram Protocol)이 있다.

#### TCP란?

- 연결 지향(Connection-oriented) 방식
- 데이터 전달의 신뢰성 보장: 손실, 순서 뒤바뀜, 중복 등 방지
- 3-way handshake로 연결 성립
- 흐름 제어 및 혼잡 제어 존재
- 대표 사례: HTTP, HTTPS, FTP, 이메일(SMTP/IMAP)

#### UDP란?

- 비연결형(Connectionless) 방식
- 빠르지만 신뢰성 없음: 패킷 손실, 순서 바뀜 감수
- handshake 없음, 오버헤드 낮고 속도가 빠름
- 대표 사례: 스트리밍, 게임, VoIP(인터넷 전화), 실시간 방송

### 빠르게 비교해보기

|구분|TCP|UDP|
|---|---|---|
|연결 방식|연결형 (3-way handshake)|비연결형|
|신뢰성|높음 (재전송, 순서 보장)|낮음 (유실 감수)|
|속도|느림|빠름|
|헤더 크기|20바이트 이상|8바이트|
|사용 사례|웹, 파일 전송, 이메일|게임, 영상/음성 스트리밍, DNS|

택배와 엽서로 예를 들어보자.

- TCP = 택배
    - 받는 사람 확인
    - 배송 상태 추적
    - 중간에 깨지면 다시 보내줌
    - 도착 순서 지켜줌
- UDP = 엽서
    - 우체통에 넣으면 바로 간다
    - 누가 받았는지 모름
    - 중간에 없어지면 그냥 잃어버림
    - 빨리 도착함

### 선택 기준

| 상황                                         | 추천 프로토콜 |
| ------------------------------------------ | ------- |
| 데이터 유실이 치명적인 경우 (예: 은행 송금, 로그인 등)          | **TCP** |
| 속도가 중요하고, 약간의 유실은 괜찮은 경우 (예: 실시간 영상통화, 게임) | **UDP** |

## 🎯결론

TCP는 신뢰, UDP는 속도
전송 계층에서 무엇을 우선시하느냐에 따라 선택이 달라진다.

- 정확성이 생명인 금융 거래, 로그인 등은 TCP
- 실시간성과 속도가 중요한 게임, 방송은 UDP

## ⚙️EndNote

### 사전 지식

- OSI 7계층 모델 중 전송 계층의 역할
- IP(인터넷 프로토콜)가 패킷을 어떻게 전달하는지 개념 이해
- 클라이언트-서버 모델에 대한 기초

### 더 알아보기

- [Wireshark로 TCP/UDP 패킷 캡쳐하기](https://www.wireshark.org/)
- [RFC 793 (TCP)](https://datatracker.ietf.org/doc/html/rfc793)
- [RFC 768 (UDP)](https://datatracker.ietf.org/doc/html/rfc768)
- [3-way handshake 개념과 흐름도](https://en.wikipedia.org/wiki/Transmission_Control_Protocol#Connection_establishment)