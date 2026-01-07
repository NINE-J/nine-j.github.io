---
publish: true
 draft: false
title: DDL VS DML
description: DDL과 DML의 차이점과 주요 명령어
author: Nine
date: 2025-06-02 08:34:00
categories:
  - DB
  - SQL
tags:
  - devlog
  - SQL
  - DDL
  - DML
  - 데이터베이스
  - DB

Status: Done
---
## 📌개요

SQL은 데이터베이스를 다루기 위한 언어지만, 그 목적에 따라 크게 두 가지로 나뉜다.

바로 **DDL(Data Definition Language)** 과 **DML(Data Manipulation Language)**

이 둘의 차이점을 명확히 정리하고, 각각의 대표적인 명령어와 그 용도를 알아보자.

## 📌내용

### DDL: 데이터 정의 언어 (Data Definition Language)

DDL은 데이터베이스의 구조를 정의하는 데 사용된다.
즉, **테이블, 스키마, 인덱스, 뷰** 등을 생성, 변경, 삭제할 때 사용하는 명령어들이다.
이러한 작업은 데이터의 틀을 잡는 작업이므로, 주로 개발 초기나 데이터 모델링 단계에서 많이 사용된다.

#### 대표 명령어

- **CREATE**
    - 테이블이나 데이터베이스 객체를 생성
    ```sql
    CREATE TABLE users (
        id INT PRIMARY KEY,
        name VARCHAR(50)
    );
    ```   
- **ALTER**
    - 기존 테이블의 구조 변경 (컬럼 추가/수정/삭제 등)
    ```sql
    ALTER TABLE users ADD email VARCHAR(100);
    ```
- **DROP**  
    - 테이블이나 객체를 삭제
    ```sql
    DROP TABLE users;
    ```
- **TRUNCATE**  
    - 테이블을 비우되, 테이블 구조는 남김
    ```sql
    TRUNCATE TABLE users;
    ```

>[!WARNING]
>DDL 명령은 대부분 **자동 커밋(autocommit)** 되어, 되돌릴 수 없는 경우가 많다.

### DML: 데이터 조작 언어 (Data Manipulation Language)

DML은 이미 정의된 테이블 내의 **데이터를 다루는 데** 사용된다.
즉, 데이터를 조회하고, 추가하고, 수정하고, 삭제하는 등의 "행위"에 관련된 명령어들이다.

#### 대표 명령어

- **SELECT**
    - 데이터를 조회
```sql
SELECT * FROM users WHERE id = 1;
```
- **INSERT**
    - 새로운 데이터를 추가
```sql
INSERT INTO users (id, name) VALUES (1, 'Alice');
```
- **UPDATE**
    - 기존 데이터를 수정
```sql
UPDATE users SET name = 'Bob' WHERE id = 1;
```
- **DELETE**
    - 데이터를 삭제
```sql
DELETE FROM users WHERE id = 1;
```

>[!TIP]
>DML 명령은 **트랜잭션(transaction)** 에 의해 제어되며, `COMMIT` 혹은 `ROLLBACK`이 가능하다.

### DDL vs DML 요약 비교

| 항목    | DDL                | DML             |
| ----- | ------------------ | --------------- |
| 목적    | 데이터 구조 정의          | 데이터 조작          |
| 대상    | 테이블, 뷰, 인덱스 등      | 테이블 내 행(row)    |
| 트랜잭션  | 자동 커밋(rollback 불가) | 트랜잭션 제어 가능      |
| 사용 시점 | 설계, 구조 변경          | 운영, 조회/수정/삭제/추가 |

### DDL, DML, DCL이란?

| 분류                                            | 명령어                                         | 설명                                                        |
| --------------------------------------------- | ------------------------------------------- | --------------------------------------------------------- |
| **DML**(Data Manipulation Language)데이터 조작어    | `SELECT`                                    | 데이터베이스에 저장된 데이터를 조회하거나 검색하는 명령어.일명 `RETRIEVE`라고도 함.       |
|                                               | `INSERT` `UPDATE` `DELETE`                  | 테이블에 데이터를 삽입, 수정, 삭제하는 명령어.                               |
| **DDL**(Data Definition Language)데이터 정의어      | `CREATE` `ALTER` `DROP` `RENAME` `TRUNCATE` | 테이블, 뷰, 인덱스 등 데이터 구조를 정의(생성, 변경, 삭제, 이름변경 등)하는 명령어.       |
| **DCL**(Data Control Language)데이터 제어어         | `GRANT` `REVOKE`                            | 사용자에게 데이터베이스 객체에 대한 권한을 부여하거나 회수하는 명령어.                   |
| **TCL**(Transaction Control Language)트랜잭션 제어어 | `COMMIT` `ROLLBACK` `SAVEPOINT`             | DML 명령으로 변경된 데이터를 트랜잭션 단위로 확정하거나 취소하거나, 중간 저장점을 설정하는 명령어. |

## 🎯결론

DDL은 구조를, DML은 내용을 다룬다.
데이터베이스를 이해하고 활용하려면 이 두 가지의 차이를 명확히 아는 것이 핵심이다.
DDL로 틀을 만들고, DML로 그 틀 안을 채우는 구조로 SQL을 학습해 보자.

## ⚙️EndNote

### 사전 지식

- 데이터베이스 기본 개념 (테이블, 행, 열)
- SQL 구문 기본 문법

### 더 알아보기

- [PostgreSQL Documentation – SQL Commands](https://www.postgresql.org/docs/current/sql-commands.html)
- [SQLBolt – Learn SQL the easy way](https://sqlbolt.com/)
- [W3Schools SQL Tutorial](https://www.w3schools.com/sql/)