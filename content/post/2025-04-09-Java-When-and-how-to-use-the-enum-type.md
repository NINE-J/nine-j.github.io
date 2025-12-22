---
publish: true
draft: false
title: Java Enum
description: 제한된 상수의 타입 안정성
author: Nine
Created: 2025-04-09
categories:
  - Java
  - 문법
tags:
  - devlog
  - Java
  - enum
# image: Status: Done
---
## 📌개요

Java의 `enum`(열거형)은 타입 안전성(Type-Safety)과 코드 가독성을 제공하는 고정된 상수 집합 관리 도구다.

기존의 `public static final` 상수보다 발전된 형태로, 제한된 선택지를 표현할 때 주로 사용된다.

>[!info] 핵심 특징
>- Java 5부터 공식 지원 (J2SE 5.0)
>- 클래스의 확장 기능 제공 (필드, 메서드 추가 가능)
>- `Comparable`, `Serializable` 자동 구현

## 📌내용

### enum은 왜 만들어졌는가?

#### 기존 방식의 한계

```java
public class Status {
	public static final int ORDERED = 1;
	public static final int PAID = 2;
	public static final int DELIVERED = 3;
}
```

문제점:
- 타입 안정성 부족: `int status = 100;` 처럼 유효하지 않은 값 할당 가능
- 가독성 낮음: `if (status == 1)` vs `if(status == Status.ORDERED)`
- 확장성 부족: 상수에 메서드나 속성을 추가할 수 없음

#### enum의 해결 방안

```java
public enum Status {
	ORDERED, PAID, DELIVERED
}
```

- 컴파일 타입 검증 `Status status = Status.ORDERED`만 허용 (잘못된 값 컴파일 오류)
- 명시적 표현으로 코드 가독성 향상
- 객체처럼 메서드/속성 추가 가능

#### 내부 동작 원리

enum은 컴파일러에 의해 클래스로 변환된다.

- `java.lang.Enum` 상속 `compareTo()`, `name()`, `ordinal()` 기본 제공
- 생성자 `private` 외부 인스턴스화 불가
- `values()`, `valueOf()` 자동생성

```java
public final class Status extends java.lang.Enum<Status> {
    // Enum 상수 = static final 인스턴스
    public static final Status ORDERED = new Status("ORDERED", 0);
    public static final Status PAID = new Status("PAID", 1);
    // ...

    private static final Status[] $VALUES = { ORDERED, PAID };

    private Status(String name, int ordinal) {  // 생성자는 private
        super(name, ordinal);
    }

    public static Status[] values() { return $VALUES.clone(); }
    public static Status valueOf(String name) { /*...*/ }
}
```

### 언제부터 본격적으로 사용됐을까?

- Java 5부터 본격 도입 - J2SE 5.0 (Tiger)에서 공식적으로 추가됐다고 한다.
- 2000년대 중반부터 도메인 모델링에서 enum이 적극 활용되기 시작됐다고 한다.
- Spring, JPA와 같은 프레임워크에서 enum을 권장한다. (예: `@Enumerated(EnumType.STRING)`)

#### 어떤 것을 대체할 수 있었나

- `public static final` 상수
- `interface`에 상수 정의(`interface Status { int ORDERED = 1; }`)
- `Map`이나 `List`로 관리하던 것들

#### enum을 사용하게 된 결정적 이유?

| 비교 대상                 | 문제점              | enum의 장점            |
| --------------------- | ---------------- | ------------------- |
| `public static final` | 타입 안전성 X, 가독성 낮음 | **타입 체크 O, 명시적 이름** |
| `interface` 상수        | 구현 클래스가 강제됨      | **독립적인 타입**         |
| `Map`/`List` 관리       | 런타임 오류 가능성       | **컴파일 타임 검증**       |

## 🎯결론

- `enum`은 기본 타입이 아니라 Java 컴파일러에 의해 특별히 처리되는 클래스다.
- `public static final` 상수의 문제점인 타입 안정성과 가독성을 해결
- 제한된 선택지를 안전하게 관리하기 위한 특수한 클래스

## ⚙️EndNote

### 성능 최적화

`==` vs `equals()`

```java
Status status = Status.PAID;
if (status == Status.PAID) {} // 권장 (빠름)
if (status.equals(Status.PAID)) {} // 동작하지만 불필요
```

### 더 알아보기

- JPA 연동: `@Enumerated(EnumType.String)`
- Enum 단점: 새로운 상수 추가 시 모든 `switch` 검토 필요
- Enum 과 싱글톤 관계

### 참고 자료

- [Oracle Docs - Enum Types](https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html)
- Effective Java Item 34: "Use enums instead of int constants"