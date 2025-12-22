---
publish: true
draft: false
title: "Java 객체지향: 추상 클래스"
description: 개념과 필요성을 알아보자
author: Nine
Created: 2025-04-10
categories:
  - Java
  - 객체지향
tags:
  - devlog
  - Java
  - Abstract
# image: Status: Done
---
## 📌개요

추상화는 복잡한 시스템에서 핵심적인 개념이나 기능을 추출하여 간단하게 표현하는 것을 말한다.
객체지향 프로그래밍에서는 불피룡한 세부 사항을 숨기고 필요한 부분만 표현하는 기법이다.

## 📌내용

### 클래스가 이미 추상화된 개념인데 추상 클래스?

클래스 자체가 추상화된 개념이지만, 추상 클래스는 더 높은 수준의 추상화를 제공한다.

#### 일반 클래스 vs 추상 클래스

1. 일반 클래스: 구체적인 구현을 포함하며 인스턴스화 가능
2. 추상 클래스: 부분적으로 구현된 상태로, 하위 클래스에서 완성해야 하는 추상 메서드를 가짐

```java
// 일반 클래스 - 구체적인 구현
class Dog {
	String name;

	void bark() {
		System.out.println(name + " says: Woof!");
	}
}

// 추상 클래스 - 부분적 구현 + 추상화
abstract class Canine {
	String name;

	void breath() {
		System.out.println(name + " is breathing.");
	}

	abstract void makeSound(); // 하위 클래스에서 구현 필요
}

class Wolf extends Canine {
	@Override
	void makeSound() {
		System.out.println(name + " says: Howl!");
	}
}

// 사용 예
public class Main {
	public static void main(String[] args) {
		Dog myDog = new Dog();
		myDog.name = "Buddy";
		myDog.bark();

		// Canine myCanine = new Canine(); // 컴파일 에러 - 추상 클래스는 인스턴스화 불가
		Wolf myWolf = new Wolf();
		myWolf.name = "Ghost";
		myWolf.breath();
		myWolf.makeSound();
	}
}
```

### 추상화의 필요성

1. **복잡성 감소**: 시스템의 복잡도를 낮춰 이해하기 쉽게 만든다.
2. **재사용성 증가**: 공통적인 특성을 추출해 여러 곳에서 재사용할 수 있다.
3. **유지보수 용이**: 변경이 필요한 경우 추상화된 부분만 수정하면 된다.
4. **포준화**: 인터페이스를 통해 표준화된 접근 방식을 제공한다.

### 행위 중심 추상화 vs 데이터 중심 추상화

OOP에서 중요한 건 객체와 객체 간의 상호 작용을 설계하는 것.
따라서 필드(데이터) 보다는 메서드(행위)를 중점으로 추상화 기법을 적용하여 객체를 설계하는 것이 중요하다.

그러나 필요에 따라 데이터를 중심으로 추상화 하여 객체 및 클래스를 설계하는 경우도 존재한다.
대표적으로 DTO(Data Transfer Object) 같은 클래스가 있다.

| 구분         | 설명                     | 예시                                   |
| ---------- | ---------------------- | ------------------------------------ |
| 행위 중심 추상화  | 객체가 수행할 **기능(행동)**에 초점 | `interface Runnable { void run(); }` |
| 데이터 중심 추상화 | 객체가 가진 **속성(데이터)**에 초점 | `abstract class Shape { int x, y; }` |

### 추상 클래스와 인터페이스

#### 공통점

1. **인스턴스 생성 불가**: 직접 객체를 생성할 수 없다.
2. **추상 메서드 포함**: 구현되지 않은 메서드를 가질 수 있다.
3. **다형성 지원**: 상속/구현을 통해 다형성을 제공한다.
4. **계층 구조 형성**: 클래스들의 관계를 구조화한다.

#### 차이점

추상 클래스는 인스턴스를 생성할 수 없는데 왜 생성자를 가질 수 있을까?

- 생성자의 존재는 "너는 이 클래스를 직접 쓰는 게 아니라, 하위 클래스를 만들 때 이 규칙으로 초기화해야 해"라는 의미로 해석할 수 있다.

| 특징         | 추상 클래스             | 인터페이스                                                   |
| ---------- | ------------------ | ------------------------------------------------------- |
| **키워드**    | `abstract class`   | `interface`                                             |
| **상속**     | 단일 상속만 가능          | 다중 구현 가능                                                |
| **변수**     | 인스턴스 변수, 상수 모두 가능  | 상수만 가능 (public static final)                            |
| **메서드**    | 추상/구현 메서드 모두 가능    | Java 8 이전: 모두 추상 메서드<br>Java 8+: default, static 메서드 가능 |
| **생성자**    | 가질 수 있음            | 가질 수 없음                                                 |
| **접근 제어자** | 다양한 접근 제어자 사용 가능   | 기본적으로 public                                            |
| **사용 목적**  | 관련 있는 클래스들의 공통점 정의 | 다른 계층의 클래스들에 공통 기능 정의                                   |

### 잘못된 추상화의 예시와 개선 방법

#### 불필요한 추상화

```java
// 너무 구체적인 것을 추상화한 경우
abstract class DatabaseConnector {
	abstract void connectToMySQL();
	abstract void connectToPostgreSQL();
	abstract void connectToOracle();
}

// 개선 방법: 공통적인 연결 개념으로 추상화
abstract class DatabaseConnector {
	abstract void connect(String url, String username, String password);
	abstract void disconnect();
}
```

### 언제 사용하지?

1. 관련 클래스들 사이의 공통점을 추출할 때
2. 일부 메서드는 구현하고, 일부는 하위 클래스에 **위임할 때**
3. 템플릿 메서드 패턴 구현 시
4. 계층 구조를 명확히 표현하고 싶을 때

## 🎯결론

Java의 추상화 개념, 추상 클래스와 인터페이스의 적절한 사용법, 그리고 잘못된 추상화의 예와 개선 방법을 알아보았다.

인터페이스가 서비스의 최소 규약인 것처럼, 추상 클래스는 클래스의 골격이 되고 클래스는 생성될 객체의 청사진이라고 이해할 수 있겠다.

## ⚙️EndNote

추가적으로 찾아보면 좋을 것들을 더 적어본다..

### 디자인 패턴에서의 추상화 활용

- 팩토리 메서드 패턴
- 템플릿 메서드 패턴
- 브리지 패턴

### SOLID 원칙과의 연관성

- 단일 책임 원칙(SRP)
	- 추상화를 통해 책임 분리 유도
- 개방-폐쇄 원칙(OCP)
	- 확장에는 열려 있고 변경에는 닫힌 설계
- 의존 역전 원칙(DIP)
	- 고수준 모듈이 저수준 모듈에 의존하지 않도록 추상화 계층 도입

### 실무 적용 시 고려사항

- 추상화의 적정선
	- YAGNI 원칙 (You Ain't Gonna Need It): 과도한 추상화는 복잡도 증가
	- 계층 깊이 vs 유연성 트레이드오프
- 성능 영향
	- 가상 메서드 테이블(VMT) 오버헤드 (극미량이지만 고성능 시스템에서 고려)
- 테스트 용이성
	- 추상 클래스는 Mocking이 어려울 수 있음 `@Spy` 사용 사례