---
publish: true
draft: false
title: ACID
description: 트랜잭션 4대 원칙
author: Nine
date: 2025-06-15 16:50:13
categories:
  - DB
  - Transaction
tags:
  - devlog
  - ACID
  - DB
  - 데이터베이스
  - 일관성
  - 격리성
  - 무결성
  - 분산시스템

Status: Done
---
## 📌개요

데이터베이스나 분산 시스템에서 트랜잭션은 안정성을 보장하는 핵심 개념이다.
특히 ACID(원자성, 일관성, 고립성, 지속성) 속성은 신뢰할 수 있는 데이터 처리를 위한 기본 토대다.

이번 글에서는 ACID 각각의 속성이 보장되지 않을 때 어떤 문제들이 발생할 수 있는지 예시와 일반적인 해결책을 간단히 알아본다.

## 📌내용

### Atomicity - 원자성

>모든 작업이 수행되거나, 아무것도 수행되지 않아야 한다.

원자성이 깨지면, 하나의 트랜잭션 안에서 일부 작업만 처리되고 나머지가 실패한 상태가 될 수 있다.

- **예시**: A → B로 계좌 이체 중 A 계좌에서 출금은 됐지만 B 계좌로 입금이 되기 전 장애가 발생한 경우 → 금액 손실.
- **문제점**: 시스템 상태가 불완전하게 갱신되어 데이터 손실 가능.
- **해결 방안**:
    - DBMS가 제공하는 **트랜잭션 롤백**(Rollback) 메커니즘 사용.
    - `try-catch`를 통해 예외 발생 시 `rollback()` 호출하도록 처리.
        ```java
        try {
            connection.setAutoCommit(false);
            withdraw(fromAccount);
            deposit(toAccount);
            connection.commit();
        } catch (Exception e) {
            connection.rollback(); // 전체 트랜잭션이 되돌아감
        }
        ```

### Consistency - 일관성

>트랜잭션 전후의 데이터 상태는 항상 시스템 규칙을 만족해야 한다.

일관성은 데이터베이스에 정의된 **제약 조건, 외래키, 트리거, 비즈니스 규칙 등**이 항상 유지되어야 한다는 의미다.

- **예시**: 주문 시 존재하지 않는 상품 ID가 참조되거나, 재고가 음수가 되는 경우.
- **문제점**: 무결성이 깨진 데이터가 DB에 저장될 수 있음.
- **해결 방안**:
    - DB 레벨: 외래 키, 유일성 제약, `CHECK`, `NOT NULL` 등의 **제약 조건 설정**
    - 애플리케이션 레벨: 추가적인 **비즈니스 유효성 검사** 코드 구현

>[!WARNING]
>단, 일관성은 트랜잭션이 **성공적으로 끝났을 경우에만** 보장된다. 실패한 트랜잭션은 원자성과 함께 롤백되어 무결성을 해치지 않음.

### Isolation - 고립성

>각 트랜잭션은 서로 독립적으로 실행돼야 한다.

고립성이 깨지면 동시에 실행 중인 트랜잭션들이 서로 영향을 주며 비정상적인 데이터가 조회되거나 저장될 수 있다.

- **주요 문제 유형:**

|문제|설명|예시|
|---|---|---|
|**Dirty Read**|다른 트랜잭션이 아직 커밋하지 않은 데이터를 읽음|B가 업데이트 중인 데이터를 A가 미리 읽음|
|**Non-repeatable Read**|같은 조건으로 두 번 조회했는데 결과가 달라짐|A가 한 사용자의 나이를 두 번 조회하는 사이 B가 그 값을 수정|
|**Phantom Read**|같은 조건으로 조회했는데 행 개수가 달라짐|A가 “나이 ≥ 30” 조건으로 조회한 후 B가 새로운 30세 사용자를 삽입|

- **격리 수준 비교 (ANSI SQL 기준):**

|수준|보장 범위|발생 가능한 문제|
|---|---|---|
|READ UNCOMMITTED|아무것도 보장 안 됨|Dirty Read, Non-repeatable Read, Phantom Read|
|READ COMMITTED|커밋된 데이터만 읽음|Non-repeatable Read, Phantom Read|
|REPEATABLE READ|동일 쿼리 결과 동일|Phantom Read|
|SERIALIZABLE|가장 강력, 완전한 고립|성능 저하 가능성|

- **해결 방안**:
    - DB 격리 수준을 적절히 설정 (성능 vs 고립성 트레이드오프 고려)
    - 비즈니스 중요도에 따라 적용 수준을 유연하게 구성

### Durability - 지속성

>트랜잭션이 커밋되면, 그 결과는 영구히 저장되어야 한다.

지속성이 보장되지 않으면, 트랜잭션이 커밋되었더라도 시스템 장애 발생 시 데이터가 유실될 수 있다.

- **예시**: 사용자가 결제를 완료했는데, 직후 서버 다운으로 주문 내역이 저장되지 않음 → 신뢰성 손상
- **문제점**: 커밋 이후에도 데이터 유실 가능 → 사용자 신뢰도 하락
- **해결 방안**:
    - DBMS의 **WAL(Write-Ahead Logging)**: 로그를 먼저 디스크에 기록하고 나서 커밋 처리
    - **RAID, 이중화 스토리지**, 디스크 플러시(sync) 전략
    - 분산 시스템에서는 **Replication, Quorum 기반의 커밋** 방식도 사용됨

## 🎯결론

트랜잭션의 ACID 속성은 단순한 개념이 아니라, 실제 시스템에서 **데이터 무결성과 안정성의 최후 보루**다.

속성이 하나라도 무너지면 “커밋됐지만 저장되지 않음”, “이체했는데 금액이 사라짐”, “동시 접속 시 데이터 꼬임” 같은 치명적 문제가 발생할 수 있다.

결국 이는 **비즈니스 신뢰성**과 **사용자 경험**에 직결된다.

## ⚙️EndNote

### 사전 지식

- 트랜잭션 정의와 트랜잭션 경계 설정
- 데이터베이스의 커밋/롤백 메커니즘
- SQL 격리 수준과 락(lock) 종류 (공유 락, 배타 락 등)

### 더 알아보기

- [PostgreSQL Isolation Levels 공식 문서](https://www.postgresql.org/docs/current/transaction-iso.html)
- [MySQL 트랜잭션 격리 수준 비교](https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html)
- [Martin Kleppmann](https://martin.kleppmann.com/)