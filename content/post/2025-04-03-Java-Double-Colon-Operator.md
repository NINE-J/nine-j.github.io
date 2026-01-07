---
publish: true
 draft: false
title: Java의 이중 콜론 연산자
description: Double Colon Operator
author: Nine
date: 2025-04-03
categories:
  - Java
  - 문법
tags:
  - devlog
  - Java
  - lambda
  - 함수형_프로그래밍

Status: Done
---
## 📌개요

Java 8에서 도입된 이중 콜론 연산자 `::`는 메서드 참조(`Methods Reference`)를 간결하게 표현하기 위한 연산자다.

코드의 간결성과 재사용성을 높이는 데 초점을 맞춘 문법으로, 람다 표현식(`lambda expression`)을 더 간단히 작성할 수 있게 해준다.

주로 함수형 인터페이스와 함께 사용되며, Java의 함수형 프로그래밍 스타일을 지원하는 핵심 기능 중 하나다.

## 📌내용

### 기본 사용법

이중 콜론 연산자는 다음과 같은 형태로 사용된다.

```java
ClassName::methodName // 클래스명::메서드명
// 또는
object::methodName //객체::메서드명
```

### 메서드 참조의 유형

이중 콜론 연산자는 4가지 주요 유형으로 메서드를 참조할 수 있다.
각 유형은 호출 방식과 컨텍스트에 따라 다르다.

#### 정적 메서드 참조

클래스의 정적 메서드(static method)를 참조한다.
객체 생성 없이 클래스 이름으로 직접 호출 가능한 메서드를 대상으로 한다.

- 형태: `ClassName::staticMethod`
- 람다 대체: `(args) -> ClassName.staticMethod(args)`

`Integer::parseInt`는 `Integer` 클래스의 정적 메서드 `parseInt`를 참조하며, 객체 없이 동작한다.

```java
// 람다 표현식
Function<String, Integer> lambda = (s) -> Integer.parsInt(s);

// 메서드 참조
Function<String, Integer> ref = Integer::parseInt;

System.out.println(ref.apply("123"));
```

#### 특정 객체의 인스턴스 메서드 참조

이미 생성된 특정 객체의 인스턴스 메서드를 참조한다.
메서드를 호출할 객체가 고정되어 있다.

- 형태: `object::instanceMethod`
- 람다 대체: `(args) -> object.instanceMethod(args)`

`System.out` 객체의 `println` 메서드를 참조해 리스트를 출력한다.

```java
List<String> names = Arrays.asList("한놈", "두식", "석삼");

// 람다 표현식
names.forEach(s -> System.out.println(s));

// 메서드 참조
names.forEach(System.out::println);

// 출력:
// 한놈
// 두식
// 석삼
```

#### 임의 객체의 인스턴스 메서드 참조

>[!info] 특정 객체의 인스턴스 메서드 참조랑 뭐가 다른 거야?
특정 객체의 인스턴스 메서드 참조는 고정된 객체의 메서드를 호출하는 반면, 임의 객체의 인스턴스 메서드 참조는 호출 시 제공되는 객체에 따라 메서드가 실행된다.

특정 타입의 객체에서 호출할 인스턴스 메서드를 참조한다.
메서드를 호출할 객체는 호출 시점에 외부에서 제공된다.

- 형태: `ObjectType::instanceMethod`
- 람다 대체: `(obj, args) -> obj.instanceMethod(args)`

`String` 클래스의 `toUpperCase` 메서드를 참조해 문자열 변환
`String::toUpperCase`는 `String` 타입의 어떤 객체든 받아서 `toUpperCase`를 호출한다.
호출 시 제공된 객체에 따라 동작한다.

```java
List<String> words = Arrays.asList("java", "is", "fun");

// 람다 표현식
words.stream().map(s -> s.toUpperCase()).forEach(System.out::println);

// 메서드 참조
words.stream().map(String::toUpperCase).forEach(System.out::println);
// 출력:
// JAVA
// IS
// FUN
```

#### 생성자 참조

객체 생성을 위한 생성자를 참조한다.
새로운 객체를 생성하는 작업을 간소화한다.

- 형태: `ClassName::new`
- 람다 대체: `(args) -> new ClassName(args)`

`ArrayList`의 기본 생성자를 참조해 리스트 생성
`ArrayList::new`는 `ArrayList` 클래스의 기본 생성자를 참조하며, 호출 시점에 새 객체를 생성한다.

```java
// 람다 표현식
Supplier<List<String>> lambda = () -> new ArrayList<>();

// 메서드 참조
Supplier<List<String>> ref = ArrayList::new;

List<String> list = ref.get(); // new ArrayList<>()와 동일
```


## 🎯결론

이중 콜론 연산자 `::` 의 장점

- 코드 가독성 향상: 불필요한 람다 표현식을 줄여 코드 가독성을 높인다.
- 불필요한 매개변수 제거: 단순히 메서드를 호출하는 경우 중복 코드를 없앤다.
- 의도가 명확성: 메서드 이름만으로 동작을 직관적으로 이해할 수 있다.

이 연산자는 주로 `Stream API`, `Optional` 함수형 인터페이스(`Function`, `Supplier`, `Consumer`)와 함께 사용되며, Java의 함수형 프로그래밍 스타일을 강화한다.

## ⚙️EndNote

### `::` 왜 이런 모양이야?

카더라 같긴 하지만 유력한? `C++` 같은 언어에서 이미 정적 참조나 스코프를 나타낼 때 `::` 형태로 사용한 것으로 보인다.
이것으 영향을 받은 것이 아닐까?

### 생성자 참조 더 알아보기

생성자를 참조하게 되면 지연 생성에 유리하다고 하는데, 일부러 지연을 시킨다는 게 이해가 잘 되지 않았다.

지연의 목적은 필요할 때 객체를 생성해서 메모리를 효율적으로 관리하기 위한 것.
결국 동작은 생성자 참조를 보관했다가 나중에 생성하는 것.

Java 8 이전과 이후를 비교해서 무슨 의미인지 더 알아본다.

#### Java 7까지 생성자 참조 불가능

- 생성자를 변수에 저장할 수 없었다.
- 객체 생성을 지연시키려면 익명 클래스나 리플렉션 같은 복잡한 방법을 써야 했다.

```java
// Java 7 방식: 익명 클래스로 우회
Supplier<List<String>> supplier = new Supplier<>() {
	@Override
	public List<String> get() {
		return new ArrayList<>();
	}
}
```

#### Java 8 이후 생성자 참조 가능

```java
// Java 8+ : 생성자 참조
Supplier<List<String>> supplier = ArrayList::new; // new ArrayList<>()와 동일
```

#### 왜 이전에는 안 됐는데?

1. 생성자는 일급 객체가 아니었다.
	- Java 8 이전에는 생성자가 메서드처럼 독립적으로 전달될 수 없는 개념이었다.
	- 람다와 함수형 인터페이스가 도입되며 생성자도 함수처럼 다루는 것이 가능해졌다.
2. 컴파일러의 한계
	- `::` 이중 콜론 연산자(Double Colon Operator)와 타입 추론 기능이 없어서 기술적으로 구현이 어려웠다.

#### 비교 보기

| 비교 항목  | Java 7 이전            | Java 8 이후               |
| ------ | -------------------- | ----------------------- |
| 생성자 전달 | 불가능 (`new`는 문법적 예약어) | `ClassName::new`로 참조 가능 |
| 지연 생성  | 익명 클래스로 복잡하게 구현      | 함수형 인터페이스로 간단히 구현       |
| 유연성    | 하드코딩된 생성             | 런타임에 생성 방식 변경 가능        |

예를 들어 조건에 따라 다른 생성자 사용이 가능하다.

```java
Supplier<Shape> shapeSupplier = isCircle ? Circle::new : Square::new;
Shape shape = shapeSupplier.get(); // 조건에 맞는 객체 생성
```