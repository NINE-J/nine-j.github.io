---
title: 역정규화, 언제 그리고 왜 사용하는가?
description: 실전에서 역정규화를 선택하는 전략적 사고
author: Nine
date: 2025-06-02 08:57:20
categories:
  - DB
  - ERD
tags:
  - devlog
  - DB
  - 설계
  - 정규화
  - 역정규화
  - 최적화
  - 데이터베이스
  - 데이터모델링
image: cover.png
---
## 📌개요

데이터베이스 정규화는 이상 현상을 방지하고 데이터 일관성을 보장하기 위한 핵심 원칙이다.

그러나 실전에서는 정규화된 모델이 항상 최고의 선택은 아니다.
자세한 내용은 다음에 다뤄보고 이번엔 **역정규화(Denormalization)** 가 필요하게 되는 상황과, 이를 적용할 때의 고려사항 및 장단점을 간단한 사례와 함께 살펴본다.

## 📌내용

### 정규화와 현실의 간극

정규화는 테이블 간 중복을 줄이고 무결성을 유지하기 위한 훌륭한 이론이다.
하지만 현실에서는 다음과 같은 상황에서 정규화된 모델이 병목이 되기도 한다.

#### 역정규화가 필요한 대표적인 상황

1. **복잡한 조인이 빈번하게 발생하는 경우**
    - 예: 게시판 목록을 조회할 때 게시글, 작성자, 댓글 수 등 여러 테이블을 조인해야 하는 경우
2. **실시간 조회 성능이 중요한 경우**
    - OLTP 시스템 또는 사용자 피드, 홈화면 로딩 등 수 ms 단위 응답이 필요한 상황
3. **읽기 비율이 매우 높은 경우**
    - 쓰기보다 읽기가 훨씬 많고, 동일한 데이터를 반복 조회하는 경우 캐싱 효과를 극대화하기 위해 역정규화를 적용
4. **집계 데이터가 자주 필요한 경우**
    - 주문 총액, 리뷰 수, 좋아요 수 등 매번 COUNT, SUM을 하지 않고 별도로 저장

### 역정규화 적용 시 고려사항

|항목|고려 내용|
|---|---|
|데이터 정합성|중복된 컬럼이 여러 테이블에 있을 경우, 변경 시 일관성 유지가 어려움|
|유지보수 복잡도|역정규화된 필드는 직접 관리하거나 트리거, 애플리케이션 로직으로 동기화해야 함|
|성능 이점|조회 속도와 쿼리 단순화에는 확실한 효과가 있음|
|데이터 증가|중복 데이터로 인해 테이블 크기가 커질 수 있음|

→ **결국, ‘성능’과 ‘정합성’ 사이의 균형**을 고려하여 설계해야 한다.

### 장단점 비교

| 장점                                                         | 단점                                                         |
| ---------------------------------------------------------- | ---------------------------------------------------------- |
| - 조인 최소화로 인한 속도 향상  <br>- 쿼리 복잡도 감소  <br>- 집계 데이터 미리 보관 가능 | - 데이터 정합성 문제 가능성  <br>- 유지보수 로직 증가  <br>- 중복 데이터로 저장 공간 낭비 |

### 실무에서의 팁

- **정규화된 모델로 먼저 설계하고**, 필요한 곳에만 역정규화한다.
- **집계용 컬럼은 write-through 방식**으로 관리하거나, 이벤트 기반 비동기 처리도 고려한다.
- **Redis, ElasticSearch와 같은 서브 시스템**으로 조회 성능을 분산시키는 것도 대안이다.

## 🎯결론

> “모든 데이터베이스는 처음엔 정규화로 시작하고, 결국엔 역정규화로 최적화된다.”

정규화와 역정규화는 대립이 아닌 균형의 문제다.
목적에 맞는 데이터 구조 설계가 진짜 실력이다.

## ⚙️EndNote

### 사전 지식

- 제1정규형~제3정규형 이해
- 기본 SQL 조인과 인덱스 작동 방식
- 데이터베이스 성능 튜닝 기초

### 더 알아보기

- [Martin Fowler - Refactoring Databases](https://martinfowler.com/books/refactoringDatabases.html)
- PostgreSQL Performance Tuning
- CQRS (Command Query Responsibility Segregation) 아키텍처