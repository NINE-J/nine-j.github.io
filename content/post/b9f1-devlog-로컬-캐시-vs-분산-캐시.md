---
publish: true
draft: false
title: 로컬 캐시 vs 분산 캐시
description: 선택 기준과 실무 활용
author: Nine
date: 2025-08-30 13:25:20
categories:
  - Backend
  - Cache
tags:
  - devlog
  - LocalCache
  - DistributedCache
  - 로컬캐시
  - 분산캐시
  - 캐싱전략
  - 캐시전략
  - SpringCache
  - Redis
  - 성능최적화
# image: 
Status: Done
id: 019ce76a-c1e0-777c-939e-d22976ed3cbd
slug: b9f1-devlog-로컬-캐시-vs-분산-캐시
---

## 📌개요

애플리케이션의 성능 최적화에서 **캐시(Cache)** 는 빠질 수 없는 핵심 요소다.

캐시는 데이터를 반복적으로 계산하거나 DB에서 가져오지 않고, **빠른 접근이 가능한 저장소**에 보관해 재사용함으로써 응답 속도를 개선한다.

이번 글에서는 **로컬 캐시(Local Cache)** 와 **분산 캐시(Distributed Cache)** 의 개념적 차이를 살펴보고, 각각의 장단점, 그리고 실무에서 어떤 기준으로 선택해야 하는지 다룬다.

## 📌내용

### 1. 로컬 캐시(Local Cache)

* **정의**: 애플리케이션 프로세스 내부 메모리에 데이터를 저장하는 캐시.
* **예시**: Spring Boot에서 `@Cacheable`과 함께 사용하는 `ConcurrentHashMap`, Guava Cache, Caffeine 등.

#### 장점

* DB나 네트워크를 거치지 않고 **메모리 접근 속도**로 응답 → 극한의 성능.
* 설치나 운영이 간단하며, 외부 시스템 의존도가 없음.
* 트래픽이 적거나 단일 서버 애플리케이션에 적합.

#### 단점

* **확장성 부족**: 서버가 여러 대라면 각 인스턴스마다 캐시를 따로 관리해야 함 → 데이터 불일치(Inconsistency).
* 서버 재시작 시 캐시 데이터 손실.
* 캐시 메모리 크기가 서버 메모리에 직접 의존.

### 2. 분산 캐시(Distributed Cache)

* **정의**: 네트워크를 통해 여러 애플리케이션 인스턴스가 공유하는 외부 캐시 서버.
* **예시**: Redis, Memcached, Hazelcast, AWS ElastiCache.

#### 장점

* 여러 서버 간 **캐시 일관성 보장** (모든 노드가 같은 캐시 데이터 참조).
* 서버 재시작에도 데이터 유지 가능(특히 Redis 같은 Persistent Cache).
* 대규모 트래픽 처리와 수평 확장에 적합.

#### 단점

* 네트워크를 거치므로 로컬 캐시보다 접근 속도는 느림.
* 별도의 인프라 운영이 필요하며, 설정 및 비용 부담이 있음.
* 네트워크 장애 시 캐시 미스(cache miss) 폭발 가능성.

### 3. 실무에서의 선택 기준

| 기준         | 로컬 캐시 적합               | 분산 캐시 적합              |
| ---------- | ---------------------- | --------------------- |
| **트래픽 규모** | 소규모, 단일 서버             | 대규모, 다중 서버            |
| **일관성 요구** | 데이터 변동이 적거나 중요하지 않은 경우 | 강한 일관성이 필요한 경우        |
| **운영 복잡도** | 간단한 아키텍처 추구            | 별도 인프라 운영 가능          |
| **성능**     | 마이크로초 단위 응답            | 밀리초 단위 응답 (네트워크 오버헤드) |
| **장애 복원력** | 서버 재시작 시 캐시 유실         | 영속성 옵션을 통해 데이터 유지 가능  |

보통 **초기 단계**에서는 로컬 캐시(Caffeine 등)로 간단히 시작하고, 트래픽이 증가해 서버를 여러 대 띄우는 순간 **분산 캐시(Redis)** 로 전환하는 전략이 가장 합리적이다.

실제로 Spring에서도 `@Cacheable` 같은 어노테이션은 캐시 추상화를 제공해 **로컬 ↔ 분산 캐시 전환이 용이**하도록 설계되어 있다.

## 🎯결론

> \[!TIP]
> 지금 운영하는 서비스는 “속도"가 중요한가, “규모와 일관성”\*\*이 중요한가?
>
> 이 질문에 대한 답이 로컬 vs 분산 캐시 선택의 시작점이다.

프로젝트 초반에는 로컬 캐시로 충분하다. 그러나 **트래픽 증가·수평 확장·데이터 일관성 요구**가 생기는 순간 분산 캐시로 전환해야 한다.

## ⚙️EndNote

### 사전 지식

* 캐시의 기본 동작 원리 (Cache Hit / Cache Miss)
* Spring Cache 추상화 (`@Cacheable`, `@CachePut`, `@CacheEvict`)
* Redis, Memcached 같은 인메모리 DB의 개념

### 더 알아보기

* [Spring Framework Docs - Caching Abstraction](https://docs.spring.io/spring-framework/reference/integration/cache.html)
* [Redis 공식 문서](https://redis.io/docs/)
* [Caffeine Cache GitHub](https://github.com/ben-manes/caffeine)
* PostgreSQL의 캐시 활용 및 쿼리 최적화
* AWS ElastiCache
