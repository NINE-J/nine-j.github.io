---
publish: true
draft: false
title: Race condition 뿌리부터 잡기
description: 자바 실전 대응 전략
author: Nine
date: 2025-08-16
categories:
  - Backend
  - Concurrency
tags:
  - devlog
  - race-condition
  - 멀티스레딩
  - 동시성처리
  - 동시성제어
  - Concurrency
  - synchronized
  - ReentrantLock
  - volatile
  - AtomicInteger
  - CAS
  - LongAdder
  - ConcurrentHashMap
  - jcstrees

Status: Done
---
## 📌개요

트래픽이 두 배가 되는 순간, 가장 먼저 터지는 건 **성능**이 아니라 **정합성**이다.

멀티스레드 환경의 대표적 복병 **경쟁 상태(Race Condition)** 는 재현도 어렵고 한 번 새면 데이터 신뢰도가 무너진다.

운영 환경에서 빈번하게 마주치는 **경쟁 상태의 원인**, **재현 패턴**, **해결 전략의 우선순위**를 정리한다.

## 📌내용

### 경쟁 상태란 무엇인가?

> [!INFO] 정의  
> 여러 스레드가 **공유 상태(shared state)** 를 동시에 읽고/쓰기 하며 실행 타이밍에 따라 결과가 달라지는 상황.  
> 핵심 원인 축: **AVR** - Atomicity(원자성), Visibility(가시성), Reordering(재배치).

- **Atomicity**: `x = x + 1` 같은 RMW(Read–Modify–Write) 연산이 중간에 끼어들기로 깨지면서 lost update 발생
- **Visibility**: 한 스레드의 쓰기가 다른 스레드에 늦게 보여 stale value(오래된 값) 관측, 잘못된 분기
    - stale value: 다른 스레드가 최신 값을 썼음에도 불구하고, 캐시/레지스터 등 중간 계층에 남아있던 **이전 값**
    - 이 때문에 **중복 및 누락**뿐 아니라 `if (value==0)` 같은 **조건 분기 오류**가 발생
- **Reordering**: CPU out-of-order 실행이나 JIT 최적화로 happens-before 순서가 무너짐

### 위험 신호와 재현 패턴

- **증상**: 카운터 불일치, 중복/누락, “가끔” 실패하는 테스트, 운영 환경에서만 나타나는 버그(Heisenbug)
- **패턴**:
    - `if(없으면 저장)` 후 put (TOCTOU)
    - 캐시 초기화 동시 접근
    - 통계 카운터 증가
    - 잘못된 Lazy init

>[!INFO] Heisenbug
>하이젠버그는 프로그래밍에서 테스트를 수행할 때 발생되는 버그의 형태 중의 하나로서 문제를 발견하고 수정하기 위한 디버깅을 수행하려고 하면 문제점이 사라지는 형태의 버그를 말한다.

> [!INFO] TOCTOU (Time Of Check to Time Of Use)  
> 검사 시점과 사용 시점 사이의 틈새에서 다른 스레드가 상태를 바꿔 **예상치 못한 버그 및 보안 취약점**을 유발하는 **클래식 경쟁 조건 유형**.

### 최소 예제로 보는 버그

> [!WARNING] 원자적이지 않은 연산  
> `value++` 는 단일 연산처럼 보이지만, JVM 바이트코드 레벨에서는 `getfield` → `iconst_1` → `iadd` → `putfield` 로 분해된다.
> 중간에 다른 스레드가 끼어들어 lost update 발생. `volatile`은 가시성만 보장해도 원자성은 보장 못 한다.

```java
class BrokenCounter {
    private int value = 0;
    void inc() { value++; }  // 경쟁 상태
    int get() { return value; }
}
```

#### 바이트코드 관점(필드 증가)

- `getfield value` → `iconst_1` → `iadd` → `putfield value`
- 단일 연산이 아니라 여러 명령어로 분해됨 → 원자성 깨짐

#### Interleaving 예 (두 스레드)

- 두 번 증가 의도 → 최종 값 1 (한 번만 반영)
- DB의 **Lost Update anomaly**와 동일한 문제

### 가시성까지 얽히면 더 위험

- A 스레드가 `1` 저장해도, B 스레드는 캐시 coherence 지연으로 여전히 `0`(stale value) 관측
- 결과:
    1. 카운터 중복·누락
    2. 조건 분기 오류 (예: `if (get()==0) init()`이 중복 실행)

### 왜 `volatile`로 해결되지 않나?

- `volatile`은 가시성(Visibility)과 재배치(Reordering) 방지 일부를 보장한다.
- 하지만 `value++` 같은 RMW 원자성은 보장 못 함

```java
volatile int value;
void inc() { value++; } // 여전히 lost update 가능
```

### 해결 전략: 락보다 설계가 먼저

#### 상태 자체를 줄여라

- 불변 객체(Immutable), Copy-on-Write, 메시지 패싱/Actor 모델, 이벤트 루프

#### 스레드 컨파인먼트

- `ThreadLocal`, 키 파티셔닝(같은 키는 동일 워커로)

#### 원자 연산 & 동시 컬렉션 (J.U.C)

- `AtomicInteger.incrementAndGet()` (CAS 기반)
    - CAS(Compare-And-Swap)는 **재시도 루프(spin)** 구조로 동작한다. 즉, 경쟁이 심하면 충돌이 잦아지고 성능이 급격히 저하될 수 있다.
- 고경합 환경엔 `LongAdder`
    - 내부적으로 셀(Cell) 배열에 분산 저장하여 스레드 충돌을 줄인다.
    - 주기적 집계를 통해 최종 값을 계산 → CAS 충돌 병목이 적음.
- `ConcurrentHashMap.computeIfAbsent/merge`로 TOCTOU 제거

> [!INFO] CAS와 성능  
> CAS는 실패 시 루프를 돌며 재시도하는 **spin 기반 알고리즘**이다.
> 경쟁이 적을 땐 락보다 빠르지만, 경쟁이 많으면 계속 충돌 → 재시도로 인해 오히려 락보다 느려질 수 있다.
> 이 때문에 고경합 상황에서는 `LongAdder` 같은 분산 구조가 더 유리하다.

#### 동기화 (Synchronization)

- `synchronized` (간단, 확실)
- `ReentrantLock` (tryLock, 타임아웃 지원)
- `ReadWriteLock`, `StampedLock` (낙관적 읽기 성능 개선)
    - `StampedLock`의 **낙관적 읽기**는 실제 읽은 값이 도중에 다른 쓰기에 의해 깨지지 않았는지 `validate(stamp)` 호출로 반드시 검증해야 안전하다.

> [!INFO] StampedLock의 validate()  
> `long stamp = lock.tryOptimisticRead();` → 값 읽기 → `if (!lock.validate(stamp)) { ...재시도... }` 
> 낙관적 읽기는 무조건 성공하는 게 아니라, 읽은 후에 검증(validate)을 반드시 거쳐야 한다. 검증이 실패하면 일반적인 읽기 락을 다시 걸어야 한다.

#### 가시성 보장 & 안전한 게시

- `volatile` 플래그, `final` 필드
- Safe Publication (동기화 통해 객체를 게시)

#### 단일 실행 & 멱등(Idempotency)

- 멱등 설계, fencing token(순서 보장 토큰)

### 실전 시나리오별 추천 레시피

|시나리오|증상|해법|
|---|---|---|
|동시 카운팅/지표|증발(Lost update)|`LongAdder` → 주기적 집계|
|Lazy 초기화|중복 생성|`computeIfAbsent`, 초기화 전용 락|
|캐시 프리로드|중복 로드|키 파티셔닝 + 단일 워커|
|읽기 99%|락 경합|Copy-on-Write, `StampedLock` 낙관 읽기|
|고가 연산 임계구역|응답 지연|임계구역 축소, 분해락(키별 락)|
|키 충돌 업데이트|중복·경합|키별 락/Striped Lock, `merge`|

### 성능 vs 정확성 트레이드오프

1. **정확성 고정**: `synchronized`/ConcurrentHashMap으로 정합성 우선 확보
2. **핫스팟 튜닝**: 임계구역 축소, 자료구조 교체
3. **마지막에**: 락-프리/낙관적 기법 적용

### 테스트·검증 전략

- **jcstress** (OpenJDK 동시성 경계 테스트 프레임워크)
- **확률 테스트** (스레드 수·코어 수·JVM 옵션 다양화)
- **페일패스트 계측** (불가능 상태 assert)
- **장시간 soak test** (운영 유사 환경)
- 이런 버그는 **Heisenbug** 특성이 강함 → 반드시 장기간·다양 환경에서 검증 필요

## 🎯결론

**공유 상태를 최소화하라.**
남는 공유 상태는 반드시 **J.U.C(java.util.concurrent)** 와 **명시적 동기화**로 보호하라.
먼저 정합성을 보장하고, 이후 성능을 최적화하는 순서가 바람직하다.

## ⚙️EndNote

### 사전 지식

- Java Memory Model(JMM), happens-before
- monitor/synchronized, CAS(compare-and-swap)
- J.U.C(java.util.concurrent): 원자 클래스, 동시 컬렉션

### 더 알아보기

- Java Concurrency in Practice (Brian Goetz)
- Effective Java 동시성 아이템
- OpenJDK **jcstress**
- Oracle Concurrency 튜토리얼
- Martin Kleppmann: Idempotency / Exactly-once