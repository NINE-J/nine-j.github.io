---
publish: true
draft: false
title: "Java 객체지향: 오버로드와 오버라이딩"
description: 오버로드와 오버라이딩의 차이를 안다.
author: Nine
Created: 2025-03-29
categories:
  - Java
  - 객체지향
tags:
  - devlog
  - Java
  - 객체지향
  - OOP
  - Overload
  - Override
# image: Status: Done
---
## 📌개요

`Java`의 객체지향 프로그래밍에서 `Overload`(오버로드)와 `Override`(오버라이딩)은 `Polymorphism`(다형성)을 구현하는 핵심적인 개념이다.
이 두 개념을 이해하면 코드의 유연성과 재사용성을 높일 수 있다.

## 📌내용

### Overload

>같은 이름으로 선언할 수 있는 이유는 아래 메서드 시그니처에서 확인하자.

하나의 클래스 내에서 같은 이름을 가진 여러 개의 메서드를 정의하는 것.
같은 기능을 수행하지만, 다양한 형태의 입력을 처리할 목적으로 사용된다.
다양한 자료형의 데이터를 처리하거나, 여러 개의 매개변수를 사용하는 메서드를 만들 때 유용하다.

- 메서드 이름은 동일해야 한다.
- 매개변수의 타입, 개수 또는 순서가 달라야 한다.
- 반환 타입은 오버로드와 관련이 없다.

```java
public class Calculator {
	// 정수 덧셈
	public int add(int a, int b) {
		return a + b;
	}

	// 실수 덧셈
	public double add(double a, double b) {
		return a + b;
	}

	// 세 개의 정수 덧셈
	public int add(int a, int b, int c) {
		return a + b + c;
	}

	public static void main(String[] args) {
		Calculator calc = new Calculator();
		System.out.println(calc.add(1, 2)); // 3
		System.out.println(calc.add(1.5, 2.5)) // 4.0
		System.out.println(calc.add(1, 2, 3)) // 6
	}
}
```

### Override

상위 클래스에서 상속 받은 메서드를 하위 클래스에서 재정의하는 것.
`@Override` 어노테이션을 사용하여 오버라이딩을 명시할 수 있다.
상속 받은 클래스의 기능을 확장하거나 변경해야 할 때 유용하다. 특히, 추상 클래스나 인터페이스를 구현할 때 필수적으로 사용된다.

```java
class Animal {
	public void sound() {
		System.out.println("동물이 소리를 낸다!");
	}
}

class Dog extends Animal() {
	@Override
	public void sound() {
		System.out.println("강아지가 멍멍 짖는다.");
	}
}

public class OverrideExample {
	public static void main(String[] args) {
		Animal animal = new Animal();
		Dog dog = new Dog();

		animal.sound(); // 동물이 소리를 낸다!
		dog.sound(); // 강아지가 멍멍 짖는다.
	}
}
```

### 오버로드와 오버라이딩의 차이점

| 특징      | Overload(오버로드) | Override(오버라이딩) |
| ------- | -------------- | --------------- |
| 클래스 관계  | 동일 클래스         | 상속 관계 (상위-하위)   |
| 메서드 이름  | 동일             | 동일              |
| 매개변수 목록 | 다름             | 동일              |
| 반환 타입   | 무관             | 동일              |
| 목적      | 다양한 입력 처리      | 메서드 재정의         |

### 메서드 시그니처

`Method Signature`(메서드 시그니처)는 `Java` 가상 머신 `JVM`(Java Virtual Machine)이 메서드를 정확하게 식별하는 데 핵심적인 역할을 한다.
또한, 오버로딩과 오버라이딩과 같은 객체 지향 프로그래밍 개념에도 큰 영향을 미친다.

#### JVM의 메서드 식별

- `JVM`은 메서드를 호출할 때 메서드 시그니처를 사용하여 어떤 메서드를 실행해야 하는지 결정한다.
- 메서드 시그니처는 메서드 이름과 매개변수의 **타입, 개수, 순서**로 구성되며 `JVM`은 이 정보를 바탕으로 고유하게 식별한다.
- 반환 타입은 메서드 시그니처에 포함되지 않으므로 반환 타입만 다른 메서드는 `JVM`에서 구별할 수 없다.

#### 메서드 시그니처와 오버로딩

- 오버로딩은 같은 이름의 메서드를 여러 개 정의하는 건데 이때 **메서드 시그니처가 달라야 한다.**
- 컴파일러는 메서드 호출 시 전달된 인수의 타입과 개수를 기반으로 적절한 메서드를 선택하며 이는 메서드 시그니처를 통해 가능하다.
- 메서드 시그니처가 다르다는 것은 매개변수의 **타입, 개수, 순서** 중 하나 이상이 다르다는 것을 의미한다.

#### 메서드 시그니처와 오버라이딩

- 오버라이딩은 상위 클래스의 메서드를 하위 클래스에서 재정의하는 건데 이때 **메서드 시그니처가 동일해야 한다.**
- `JVM`은 런타임에 실제 객체의 타입을 확인하고, 하위 클래스에서 오버라이딩된 메서드가 있다면 해당 메서드를 호출한다.
- `@Override` 어노테이션은 오버라이딩 규칙을 준수했는지 컴파일러에게 확인하도록 지시한다.