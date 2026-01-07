---
publish: true
draft: false
title: "Java 문법: Primitive VS Wrapper"
description: 두 타입을 알아보고 비교해보자
author: Nine
date: 2025-04-10
categories:
  - Java
  - 문법
tags:
  - devlog
  - Java
  - Primitive
  - Wrapper

Status: Done
---
## 📌개요

Java의 Primitive Type(기본형)과 Wrapper Class(래퍼 클래스)는 본질적으로 같은 데이터를 다루지만, 존재 목적과 사용 방식에서 근본적인 차이가 있다.

## 📌내용

### 기본 개념

#### Primitive Type 기본형

- Java에서 제공하는 가장 기본적인 데이터 타입
- `byte`, `short`, `int`, `long`, `float`, `double`, `char`, `boolean` 8가지 존재
- 스택(Stack) 메모리에 직접 값 저장
- null 값을 가질 수 없음
- 산술 연산 가능
- 기본 값 존재 (예: `int`는 0, `boolean`은 false)

#### Wrapper Class 래퍼 클래스

- Primitive type을 객체로 감싸는 클래스
- `Byte`, `Short`, `Integer`, `Long`, `Float`, `Double`, `Character`, `Boolean`
- 힙(Heap) 메모리에 저장
- null 값 허용
- 다양한 유틸리티 메서드 제공

### 주요 차이점

| 특징                | Primitive Type | Wrapper Class |
| ----------------- | -------------- | ------------- |
| 저장 위치             | Stack          | Heap          |
| null 허용           | 불가             | 가능            |
| 메모리 사용량           | 적음             | 많음            |
| 접근 속도             | 빠름             | 상대적으로 느림      |
| 기본값 존재            | 있음             | 없음(null)      |
| 유틸리티 메서드          | 없음             | 있음            |
| Collection 요소로 사용 | 불가             | 가능            |

### Boxing & Unboxing

#### 오토 박싱 Autoboxing

- 원시 타입 → Wrapper 클래스로 자동 변환
	- 컴파일러가 내부적으로 `Integer.valueOf()`를 호출

```java
int primitiveInt = 100;
Integer autoBoxedInt = primitiveInt; // 오토박싱 (자동)
```

#### 오토 언박싱 Autounboxing

- Wrapper 클래스 → 원시 타입으로 자동 변환  
    - 컴파일러가 내부적으로 `intValue()`를 호출

```java
Integer wrapperInt = 200;
int autoUnboxedInt = wrapperInt; // 오토언박싱 (자동)
```

#### 명시적 박싱 (Explicit Boxing)

- 직접 Wrapper 클래스의 메서드(`valueOf()`)를 호출

```java
int primitiveInt = 300;
Integer explicitBoxedInt = Integer.valueOf(primitiveInt); // 명시적 박싱
```

#### 명시적 언박싱 (Explicit Unboxing)

- 직접 Wrapper 클래스의 메서드(`intValue()`)를 호출

```java
Integer wrapperInt = 400;
int explicitUnboxedInt = wrapperInt.intValue(); // 명시적 언박싱
```

#### 차이점 정리

| 구분          | 예제                                  | 변환 방식          |
| ----------- | ----------------------------------- | -------------- |
| **오토박싱**    | `Integer a = 100;`                  | 컴파일러가 자동 처리    |
| **명시적 박싱**  | `Integer b = Integer.valueOf(100);` | 개발자가 직접 메서드 호출 |
| **오토언박싱**   | `int c = wrapperInt;`               | 컴파일러가 자동 처리    |
| **명시적 언박싱** | `int d = wrapperInt.intValue();`    | 개발자가 직접 메서드 호출 |


### 언제 사용하지?

#### Primitive Type

1. 성능이 중요한 경우
2. null 값이 필요하지 않은 경우
3. 대량의 데이터를 다룰 때 (메모리 효율성)
4. 단순한 산술 연산이 필요한 경우

#### Wrapper Class

1. null 값이 필요할 때
	- 데이터의 부재를 표현해야 하는 경우
2. 컬렉션(Collection)에 저장해야 할 때
	- Java 컬렉션 프레임워크는 객체만 저장 가능
	- 예: `List<int>` 불가,  `List<Integer>` 가능
3. 객체의 메서드를 사용해야 할 때
	- `Integer.parseInt()`, `Character.isLetter()` 등
4. 제네릭 타입으로 사용해야 할 때
	- `<T>`에는 객체만 사용 가능

### 성능 고려사항

- Boxing/Unboxing은 추가적인 오버헤드를 발생 시킨다.
- 반복문 등에서 자주 발생하면 성능 저하 가능성이 있다.
- 최신 JVM에서는 일부 상황에서 최적화되지만, 불필요한 Boxing/Unboxing은 피해야 한다.

```java
// 비효율적인 예 (반복적인 boxing/unboxing)
Long sum = 0L;
for(long i = 0; i < Integer.MAX_VALUE; i++) {
	sum += i; // 매번 iteration에서 unboxing & boxing 발생
}

// 개선된 예
long sum = 0L;
for(long i = 0; i < Integer.MAX_VALUE; i++) {
	sum += i; // primitive 연산만 발생
}
```

### 실무에선 언제 사용하지?

1. 의도가 명확한 코드 작성
2. JPA/Hibernate 엔티티 필드
	- 기본키(ID)는 Wrapper로 선언 (null 가능성)
	- 다른 필드는 상황에 따라 선택
3. DTO 설계
	- API 응답에서 값이 없을 수 있는 필드는 Wrapper 사용
4. 메서드 반환 타입
	- 값이 없을 수 있는 경우 `Optional<Primitive>` 대신 Wrapper 고려

## 🎯결론

동일한 데이터를 다루지만 메모리 구조, 성능, 사용 목적에서 차이가 있으므로 상황에 맞게 선택해야 한다.

핵심 원칙:
- 성능이 중요하면 Primitive
- 객체 지향 기능이 필요하거나 null 표현이 필요하면 Wrapper

| 구분         | Primitive Type (기본형)       | Wrapper Class (래퍼 클래스)                                 |
| ---------- | -------------------------- | ------------------------------------------------------ |
| **메모리/성능** |                            |                                                        |
| 저장 위치      | 스택(Stack) 메모리              | 힙(Heap) 메모리                                            |
| 메모리 사용량    | 적음 (값 직접 저장)               | 많음 (객체로 감싸서 저장)                                        |
| 연산 속도      | 빠름                         | 상대적으로 느림 (객체 접근 오버헤드)                                  |
| **기능/유연성** |                            |                                                        |
| null 허용    | 불가능                        | 가능                                                     |
| 메서드 지원     | 없음                         | 다양한 유틸리티 메서드 제공                                        |
| **주요 사용처** |                            |                                                        |
| 적합한 경우     | 대량 연산, 성능이 중요한 로직<br>로컬 변수 | 컬렉션(Collection) 사용 시<br>제네릭 타입 필요 시<br>null 표현이 필요한 필드 |

## ⚙️EndNote

### 더 알아보기

1. AutoBoxing 최적화
	- `Integer.valueOf()`의 캐싱 매커니즘
	- `Long` VS `long` 반복문 성능 비교 실습
2. Java 메모리 모델
	- Stack VS Heap 메모리 동장 방식
	- Primitive가 스택에 저장되는 이유
3. Java 컬렉션과 제네릭
	- 왜 컬렉션은 Primitive를 허용하지 않는가?
	- `IntStream`, `Eclipse Collections` 등 대안 라이브러리
4. JPA/Hibernate 매핑
	- 엔티티 필드 타입 선택 가이드
	- `@Column(nullable = false)`와 Primitive/Wrapper 관계
5. Java 8 이후 변화
	- `OptionalInt` VS `Optional<Integer>`
	- 람다식에서의 자동 형변환 동작



