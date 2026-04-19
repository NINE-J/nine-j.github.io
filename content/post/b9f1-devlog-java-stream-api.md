---
publish: true
draft: false
title: Java Stream API
description: map() vs flatMap()
author: Nine
date: 2025-04-07T00:00:00
categories:
  - Java
  - 문법
tags:
  - devlog
  - Java
# image: 
Status: Done
id: 019ce76a-c241-7584-8089-d27e81653202
slug: b9f1-devlog-java-stream-api
---

## 📌개요

Java Stream API는 Java 8에서 도입된 강력한 데이터 처리 도구로, `map()`과 `flatMap()`은 스트림 요소를 변환하는 핵심 연산자이다.

두 메서드의 차이점을 명확히 구분하고, 실제 코드 예제를 통해 활용 방법을 설명한다.
함수형 프로그래밍 패러다임을 이해하고 복잡한 데이터 구조를 효율적으로 처리하는 방법을 학습할 수 있다.

## 📌내용

### 핵심 개념 비교

| 특성        | `map()`     | `flatMap()`                    |
| --------- | ----------- | ------------------------------ |
| 변환 방식     | 1:1 변환      | 1:N 변환 + 평탄화                   |
| 입/출력 관계   | A → B       | A → \[B1, B2, B3] → B1, B2, B3 |
| 반환 타입     | `Stream<R>` | `Stream<R>` (내부 스트림 풀어냄)       |
| 주요 사용 케이스 | 단순 값 변환     | 중첩 컬렉션 처리, 다중 값 생성             |
| 예시        | 문자열 길이 추출   | 문장을 단어로 분해                     |

### 동작 방식

![](/assets/images/Drawing%20Java-StreamAPI-map-and-flatMap%202025-04-07%2014.44.08.excalidraw.png)

#### map()

`map()`은 각 원소를 1:1로 변환하여 원본 배열과 동일한 길이의 새 배열을 반환한다.

* 단일 속성 추출, 단순 타입 변환 등 단순 계산
* 1:1 매핑이 보장된 경우

```java
// 대소문자 변환
List<String> names = Arrays.asList("java", "stream");
List<String> upperNames = names.stream().map(String::toUpperCase).collect(Collectors.toList());
// 결과: ["JAVA", "STREAM"]
```

#### flatMap()

`flatMap()`은 1:N 분해 후 평탄화로 길이를 가변적으로 만든다.

* 컬렉션 풀기, 문자열 토큰화, Optional 체이닝 등
* 하나의 입력이 여러 출력을 생성해야 할 때

```java
// 다중 리스트 평탄화
List<List<Integer>> numberLists = Arrays.asList(
    Arrays.asList(1, 2),
    Arrays.asList(3, 4, 5)
);
List<Integer> allNumbers = numberLists.stream().flatMap(List::stream).collect(Collectors.toList());
// 결과: [1, 2, 3, 4, 5]

// 문자열 토큰화
List<String> sentences = Arrays.asList("Hello World", "Java Stream");
List<String> words = sentences.stream().flatMap(s -> Arrays.stream(s.split(" "))).collect(Collectors.toList());
// 결과: ["Hello", "World", "Java", "Stream"]
```

#### 동작 방식 비교

| 연산자         | 입/출력 과정                                                                   | 길이 변화      |
| ----------- | ------------------------------------------------------------------------- | ---------- |
| `map()`     | `[A, B]` → `[f(A), f(B)]`                                                 | 유지 (n → n) |
| `flatMap()` | `[A, B]` → `[A1, A2, ...] + [B1, B2, ...]` → `[A1, A2, ..., B1, B2, ...]` | 가변 (n → m) |

## 🎯결론

`flatMap()`이 더 강력하지만, `map()`으로 해결 가능한 작업에는 `map()`을 사용하자.
중첩 구조 분해나 1:N 변환이 필요할 때만 `flatMap()`을 선택하는 것이 성능과 가독성 면에서 유리할 것이다.

### map()

* 단일 속성 추출, 단순 타입 변환 등 단순 계산
* 1:1 매핑이 보장된 경우
* 성능이 더 중요한 경우

### flatMap()

* 컬렉션 풀기, 문자열 토큰화, Optional 체이닝 등
* 하나의 입력이 여러 출력을 생성해야 할 때
* 내부 스트림 생성 오버헤드 존재

### 가독성 vs 기능

* 단순 변환은 `map()`이 더 직관적
* 복잡한 분해 로직은 `flatMap()`이 유리
* 대용량 데이터 처리 시 `map().flatMap()` 분리 고려

## ⚙️EndNote

### 필요한 사전 지식

1. 람다 표현식: `(x) -> x*2` 같은 간결한 함수 정의 방식
2. 함수형 인터페이스: `Function<T, R>`, `Predicate<T>` 등

### 더 알아보기

#### 성능 고려사항

* `flatMap()`은 중간 스트림 생성 오버헤드가 있을 수 있다.
* 병렬 스트림(`parallelStream()`)에서의 동작 차이

#### Optional의 `flatMap()`

* `Optional` 클래스에서도 동일한 개념 적용 가능

```java
Optional.of("hello").flatMap(s -> Optional.of(s.length()));
```

#### Reactivestreams와의 연관성

* RxJava/Project Reactor에서도 유사한 연산자 사용
