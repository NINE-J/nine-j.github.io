---
publish: true
draft: false
title: WSL에서 PSQL 사용하기
description: Windows PostgreSQL 서버와의 연결 설정
author: Nine
date: 2025-06-27T10:11:44
categories:
  - WSL
tags:
  - devlog
  - PostgreSQL
  - psql
  - 윈도우서버연결
  - 데이터베이스
  - 개발환경
  - 리눅스설정
# image: 
Status: Done
id: 019ce76a-c324-735a-800e-ef04102e8195
slug: b9f1-devlog-wsl에서-psql-사용하기
---

## 📌개요

백엔드 개발을 진행하다 보면 WSL에서 `psql`을 사용해 Windows에 설치된 PostgreSQL에 접속하고 싶은 상황이 있다.

그러나 단순한 클라이언트 설치만으로는 접속이 되지 않는다. 방화벽, 접속 허용 설정, 포트 개방 등 네트워크 보안 요소를 고려해야 하기 때문이다.

WSL에서 PostgreSQL 접속 방법을 알아보자.

## 📌내용

### PostgreSQL 클라이언트 설치

Windows에 구성된 PostgreSQL에 접속하기 위해 클라이언트를 설치해야 한다.

```bash
sudo apt update
sudo apt install postgresql-client
```

> \[!TIP]
> `apt-get`은 더 오래된 전통적인 CLI 툴
>
> * 스크립트나 자동화에 주로 사용
>
> `apt`는 `apt-get`과 `apt-cache`의 여러 기능을 합쳐 사용자 친화적으로 만든 통합 명령어
>
> * 2014년 즈음부터 Debian/Ubuntu에 포함되었고 Ubuntu 16.04부터 기본으로 권장
> * 깔끔한 출력과 심플한 옵션 제공
>
> 일상적인 사용에 `apt`가 권장되며 스크립트 자동화, 하위 호환에 `apt-get`을 사용할 수 있다.

### Windows IP 확인

PostgreSQL 서버가 설치된 Windows 쪽 IP를 알아야 접속이 가능하다.
이때 `ifconfig`이 아니라 다음 명령어를 사용해야 정확하다.

```bash
ip route | grep default
# 예시 결과
default via 172.27.208.1 dev eth0
```

`172.27.208.1`이 **WSL에서 Windows를 바라보는 IP (게이트웨이 IP)** 이므로 이 주소를 접속 대상 IP로 사용한다.

### Windows PostgreSQL 서버 설정 변경

#### postgresql.conf

Windows에 설치된 PostgreSQL 설정 디렉토리에서 아래 설정을 찾아 수정한다.

보통은 기본 설치 경로에 있다. `C:\Program Files\PostgreSQL\{version}\data`

```bash
listen_addresses = '*'
# 또는 원하는 IP만
listen_addresses = 'localhost,172.27.208.1'
```

> \[!TIP]
> `*` 와일드 카드로 전체를 여는 것보다 특정 IP에서 들어오는 것만 명시적으로 지정하는 것이 보안상 안전하다.

#### pg\_hba.conf

해당 대역(WSL 내부 IP 포함)을 명시적으로 허용해야 접속 가능하다.

```bash
host    all    all    172.27.208.1    md5
```

수정 후에는 반드시 PostgreSQL 서비스를 재시작해야 설정이 반영된다.

Windows의 `services.msc`에서 PostgreSQL을 다시 시작하거나 명령어를 사용해 재시작한다.

### Windows 방화벽에서 포트 열기

WSL은 Windows의 입장에선 외부 네트워크로 간주된다.
기본적으로 TCP 5432 포트는 차단되어 있다.

따라서 명시적으로 인바운드 규칙을 추가해야 한다.
기본적인 설정으로 가정하고 정리한다.

설정 경로:

* Windows의 실행 > `wf.msc` (Windows Defender 방화벽 고급 보안)
  * 또는 제어판에서 방화벽 > 고급 설정
* 인바운드 규칙에서 새 규칙 추가
  * 유형: 포트
  * 프로토콜: TCP
  * 포트: 5432
  * 작업: 연결 허용
  * 프로필: 도메인/개인/공용 모두 선택
  * 이름: Allow PostgreSQL 5432 for WSL

### 연결 테스트

WSL 터미널에서 명령 실행 확인

```bash
nc -zv 172.27.208.1 5432
# 포트 정상적으로 붙게 되면
Connection to 172.27.208.1 5432 port [tcp/postgresql] succeeded!
```

그 다음 실제 접속

```bash
# 호스트, 유저, DB
psql -h 172.27.208.1 -U postgres -d postgres
```

## 🎯결론

> WSL은 로컬처럼 보이지만 네트워크적으로는 별개의 장치로 취급된다.

단순히 PostgreSQL을 설치하는 것만으로 접속이 불가능하다.
`listen_addresses`, `pg_hba.conf`, 방화벽 인바운드 설정까지 모두 갖춰져야 제대로 동작한다.

## ⚙️EndNote

### 사전 지식

* WSL 기본 개념
* PostgreSQL 서버와 클라이언트 구조
* Windows 방화벽 설정

### 더 알아보기

* [WSL 공식 문서](https://learn.microsoft.com/en-us/windows/wsl/)
* [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
* [`listen_addresses` 설명](https://www.postgresql.org/docs/current/runtime-config-connection.html)
* [`pg_hba.conf` 인증 가이드](https://www.postgresql.org/docs/current/auth-pg-hba-conf.html)
