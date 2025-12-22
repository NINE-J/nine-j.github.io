---
publish: true
draft: false
title: "Java 객체지향: 클래스의 구성 멤버"
description: 필드, 생성자, 메서드를 이해한다.
author: Nine
Created: 2025-03-29
categories:
  - Java
  - 객체지향
tags:
  - devlog
  - Java
  - Class
  - 객체지향
  - OOP
# image: Status: Done
---
## 📌개요

`Java`의 `Class`는 OOP(객체 지향 프로그래밍)의 핵심 요소이다.
`Field`(필드), `Constructor`(생성자), `Method` (메서드)라는 세 가지 주요 구성 멤버로 이루어져 있다.
각 구성 멤버는 클래스의 속성과 동작을 정의하는 데 중요한 역할을 한다.

## 📌내용

### Field

클래스 내에서 선언된 변수를 의미하며, 객체의 속성 또는 상태를 나타낸다.
객체의 데이터를 저장하고 관리한다.

```java
public class Person {
	String name; // 필드: 이름
	int age;     // 필드: 나이
}
```

### Constructor

객체가 생성될 때 호출되는 특별한 메서드

- 객체의 초기화를 담당하며, 필드의 초기값을 설정한다.
- 반환 타입이 없다.
- 클래스의 이름과 동일한 이름을 가진다.
- 여러 개의 생성자를 정의하여 다양한 방법으로 객체를 초기화할 수 있다.

```java
public class Person {
	String name;
	int age;

	// 기본 생성자
	public Person() {
		name = "이름 없음";
		age = 0;
	}

	// 매개변수가 있는 생성자
	public Person(String name, int age) {
		this.name = name;
		this.age = age;
	}
}
```

#### 생성자를 정의하지 않았을 때 Java의 기본 동작

`Java`에서 클래스를 정의할 때 생성자를 명시적으로 작성하지 않으면, 컴파일러는 자동으로 기본 생성자(default contructor)를 생성한다.
기본 생성자는 매개변수가 없는 생성자이며, 클래스의 필드를 기본값으로 초기화한다.

##### 기본 생성자의 특징

- 기본 생성자는 어떠한 매개변수도 받지 않는다.
- 클래스에 생성자가 하나도 정의되어 있지 않은 경우에만 컴파일러가 자동으로 생성한다.
- 객체 생성 시 필드를 기본값으로 초기화한다.
	- 숫자 타입(int, double 등): 0 또는 0.0
	- boolean 타입: false
	- 참조 타입(String, 객체 등): null

```java
public class Person {
	String name;
	int age;

	public void introduce() {
		System.out.println("이름: " + name + ", 나이: " + age);
	}

	public static void main(String[] args) {
		Person person = new Person(); // 기본 생성자 호출
		person.introduce(); // 이름: null, 나이: 0
	}
}
```

- 클래스에 매개변수가 있는 생성자라도 하나 이상 정의하면 컴파일러는 기본 생성자를 자동으로 생성하지 않는다.
	- 이 경우 매개 변수가 없는 생성자가 필요한 경우 명시적으로 정의해야 한다.
- 기본 생성자는 객체를 생성하고 필드를 기본값으로 초기화하는 간단한 작업을 수행하지만, 때로는 객체 생성 시 특정 값으로 초기화해야 하는 경우가 있다.
	- 이 경우 매개변수가 있는 생성자를 정의해야 한다.

### Method

클래스 내에서 정의된 함수를 의미하며, 객체의 동작 또는 기능을 나타낸다.
객체의 행위를 정의하고, 필요한 연산을 수행한다.

```java
public class Person {
	String name;
	int age;

	// 메서드: 자기소개
	public void introduce() {
		System.out.println("제 이름은 " + name + "이고, " + age + "살입니다.");
	}
}
```


### 예제 코드 종합

```java
public class Person {
	String name;
	int age;

	// 기본 생성자
	public Person() {
		name = "이름 없음";
		age = 0;
	}

	// 매개변수가 있는 생성자
	public Person(String name, int age) {
		this.name = name;
		this.age = age;
	}

	// 메서드: 자기소개
	public void introduce() {
		System.out.println("제 이름은 " + name + "이고, " + age + "살입니다.");
	}

	public static void main(String[] args) {
		// 기본 생성자를 사용하여 객체 생성
		Person person1 = new Person();
		person1.introduce(); // 제 이름은 이름 없음이고, 0살입니다.

		// 매개 변수가 있는 생성자를 사용하여 객체 생성
		Person person2 = new Person("홍길동", 30);
		person2.introduce(); // 제 이름은 홍길동이고, 30살입니다.
	}
}
```

## ⚙️EndNote

### 메서드 시그니처

메서드의 이름이 같더라도 매개변수의 타입, 개수, 순서가 다르면 여러 개의 생성자를 선언할 수 있다.
이는 `Java`의 `Method Overloading` 오버로딩 개념에 해당되며, 생성자도 메서드의 한 종류이기 때문에 오버로딩이 적용된다.

