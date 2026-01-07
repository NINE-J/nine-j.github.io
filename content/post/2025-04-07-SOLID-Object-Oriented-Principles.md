---
publish: true
draft: false
title: "SOLID 원칙: 객체지향의 5가지 원칙"
description: 더 유연한 소프트웨어를 위한 설계 지침
author: Nine
date: 2025-04-07
categories:
  - 설계
tags:
  - devlog
  - SOLID
  - 설계

Status: Done
---
## 📌개요

>[!info] 한 언어에만 국한되는 내용이 아닌 객체지향 프로그래밍의 핵심 설계 방식이다.

SOLID 원칙은 2000년대 초반 로버트 C. 마틴(Robert C. Martin) - '엉클 밥(Uncle Bob)' 미국의 소프트웨어 공학자가 정리했지만, 그 기원은 1980년대 후반부터 시작된 객체 지향 설계 연구에 뿌리를 두고 있다.

- SOLID 원칙이 핵심 원칙이라 불리는 이유?
	- 변경 비용 감소: 기능 추가/수정 시 영향 범위 최소화
	- 시스템 수명 연장: 유지보수성 향상으로 기술 부채 감소
	- 팀 협업 효율화: 코드 가독성과 예측 가능성 증가

각 원칙에 대한 정의와 그 의미를 알아보고 간단한 Java 코드로 예시시를 확인해본다.

## 📌내용

### SRP (Single Responsibility Principle) - 단일 책임 원칙

>[!info] **정의**: 한 클래스는 하나의 책임만 가져야 한다.

클래스를 변경하는 이유는 단 하나여야 한다는 원칙으로, 여러 책임이 있는 클래스는 변경이 필요할 때마다 영향을 받을 가능성이 높다.

하나의 책임을 갖는다는 건 변경의 이유도 하나를 갖는다는 의미가 된다.

#### 잘못된 예

- `User` 클래스가 두 가지 책임(사용자 정보 관리 + 데이터베이스 작업)을 동시에 가진다.
- 만약 데이터베이스 로직이 변경되면 `User` 클래스도 수정해야 한다.
- 사용자 정보의 필드 변경 시에도 `User` 클래스를 수정해야 하므로 변경의 이유가 두 가지가 된다.

```java
class User {
	private String name;
	private String email;

	// 사용자 정보 관련 책임
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }

	// 데이터베이스 관련 책임 (SRP 위반)
	public void saveUserToDatabase(User user) { /* ... */ }
	public User getUserFromDatabase(String userId) { /* ... */ }
}
```

#### 올바른 예

- `User` 클래스는 사용자 정보 관리만 담당한다.
- `UserRepository` 클래스는 데이터베이스 작업만 담당한다.
- 데이터베이스 로직이 변경되어도 `User` 클래스는 영향을 받지 않으며 반대의 경우도 마찬가지다.

```java
class User {
	private String name;
	private String email;

	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
}

class UserRepository {
	public void saveUserToDatabase(User user) { /* ... */ }
	public User getUserFromDatabase(String userId) { /* ... */ }
}
```

### OCP (Open/Closed Principle) - 개방/폐쇄 원칙

>[!info] **정의**: 소프트웨어 개체는 확장에는 열려 있어야 하고, 수정에는 닫혀 있어야 한다.

기존 코드를 변경하지 않고도 시스템의 기능을 확장할 수 있어야 하며, 이는 추상화와 다형성을 통해 구현된다.

#### 잘못된 예

- 수정에 닫혀 있지 않음
	- 새로운 도형(예: 삼각형)이 추가될 때마다 `AreaCalcurator` 클래스의 `calculateArea()` 메서드를 계속 수정해야 한다.
	- 확장 시 `if-else` 블럭을 추가해야 되는 안티패턴은 유지보수성이 떨어지고, 기존 코드의 안정성이 위협 받는다.
- 확장에 열려 있지 않음
	- 새로운 기능을 추가하려면 기존 클래스의 로직을 직접 변경해야 한다.

```java
class AreaCalculator {
	public double calculateArea(Object shape) {
		if(shape instanceof Circle) {
			Circle circle = (Circle) shape;
			return Math.PI * circle.radius * circle.radius;
		} else if (shape instanceof Rectangle) {
			Rectangle rect = (Rectangle) shape;
			return rect.width * rect.height;
		}
		throw new IllegalArgumentException("Unknown shape");
	}
}
```

#### 올바른 예

- 추상화 도입
	- 모든 도형이 `calculateArea()` 메서드를 구현하도록 강제한다.
	- 새로운 도형이 추가되어도 `AreaCalculator`는 변경되지 않는다.
- 다형성 활용
	- `AreaCalculator`는 구체적인 도형 클래스를 알 필요 없이 인터페이스에 의존한다.
	- 도형의 종류가 늘어나도 `calculateArea()` 메서드는 한 번만 구현하면 된다.

```java
interface Shape {
	double calculateArea();
}

class Circle implements Shape {
	public double radius;

	@Override
	public double calculateArea() {
		return Math.PI * radius * radius;
	}
}

class Rectangle implements Shape {
	public double width;
	public double height;

	@Override
	public double calculateArea() {
		return width * height;
	}
}

class AreaCalculator {
	public double calculateArea(Shape shape) {
		return shape.calculateArea();
	}
}
```

### LSP(Liskov Subtitution Principle) - 리스코프 치환 원칙

>[!info] **정의**: 프로그램의 객체는 프로그램의 정확성을 깨뜨리지 않으면서 하위 타입의 인스턴스로 바꿀 수 있어야 한다.

부모 클래스가 사용되는 모든 곳에서 자식 클래스를 안전하게 사용할 수 있어야 하며 이때 프로그램의 정확성이 깨지지 않아야 한다.

즉, 클라이언트가 상위 타입에 기대하는 동작을 하위 타입에서도 동일하게 제공해야 한다.

- 계약적 설계 개념:
	- **사전 조건**: 메서드 실행 전 만족해야 하는 조건
	- **사후 조건**: 메서드 실행 후 보장되는 조건
	- **불변 조건**: 객체 생명주기 동안 유지되는 조건

- LSP의 3가지 핵심 조건:
	1. **메서드 시그니처 호환성**: 하위 클래스는 상위 클래스의 모든 메서드를 동일한 시그니처로 구현해야 한다.
	2. **사전 조건 약화**: 하위 클래스의 메서드 사전 조건(입력 제약)은 상위 클래스보다 강하지 않아야 한다.
	3. **사후 조건 강화**: 하위 클래스의 메서드 사후 조건(출력 보장)은 상위 클래스보다 약하지 않아야 한다.

#### 잘못된 예

- 계약 위반:
    - `Bird`의 `fly()`는 "날 수 있다"는 행동을 보장하지만,
    - `Penguin`은 이를 부정하며 예외를 던진다.
- 클라이언트 충격:
    - `watchFlight()`은 모든 `Bird`가 날 것이라 기대하지만,
    - 펭귄 전달 시 시스템이 비정상 종료된다.
- 일상적 직관과 충돌:
    - 생물학적으로 펭귄은 새이지만,
    - 프로그래밍에서는 상속 관계가 적합하지 않다.

```java
// 부모 클래스: 새
class Bird {
    public void fly() {
        System.out.println("날개짓 하며 날아간덩");
    }
    
    public void eat() {
        System.out.println("먹이를 먹는덩");
    }
}

// 자식 클래스: 펭귄 (LSP 위반)
class Penguin extends Bird {
    @Override
    public void fly() {
        throw new UnsupportedOperationException("펭귄은 날 수 없덩");
    }
}

// 클라이언트 코드
class BirdWatcher {
    public void watchFlight(Bird bird) {
        bird.fly();  // 펭귄 전달 시 예외 발생
    }
    
    public static void main(String[] args) {
        Bird bird = new Penguin();
        new BirdWatcher().watchFlight(bird);  // 런타임 예외!
    }
}
```

#### 올바른 예

- 생물학적 분류 != 프로그래밍적 상속
- **"is-a" 관계가 아닌 경우 상속 금지**
- 상속 대신 확장 포인트 제공

```java
interface Bird {
    void eat();
}

interface Flyable {
    void fly();
}

class Sparrow implements Bird, Flyable {
    public void fly() {
	    System.out.println("날개짓 하며 날아간덩");
    }
    public void eat() {
	    System.out.println("먹이를 먹는덩");
    }
}

class Penguin implements Bird {
    public void eat() {
	    System.out.println("먹이를 먹는덩");
    }
    // fly() 메서드 없음
}

// 클라이언트 코드
class BirdWatcher {
    // 날 수 있는 새만 처리
    public void watchFlight(FlyingBird bird) {
        bird.fly();  // 펭귄은 컴파일 타임에 전달 불가
    }
    
    // 모든 새 처리
    public void watchFeeding(Bird bird) {
        bird.eat();  // 펭귄도 안전하게 호출
    }
}
```

### ISP (Interface Segregation Principle) - 인터페이스 분리 원칙

>[!info] **정의**: 특정 클라이언트를 위한 인터페이스 여러 개가 범용 인터페이스 하나보다 낫다.

클라이언트가 자신이 사용하지 않는 메서드에 의존하지 않아야 한다.
`ISP`는 `SRP`의 인터페이스 버전이라고 볼 수 있다.

#### 잘못된 예

- 불필요한 의존성
	- `RobotWorker`는 `eat()`, `sleep()` 메서드를 전혀 사용하지 않지만 구현해야 함
	- 더미 코드나 예외 발생으로 처리해야 하는 문제
- 계약 위반
	- `Worker` 인터페이스가 너무 많은 책임을 가진다.
	- 새로운 기능(예: `charge()`) 추가 시 모든 클래스가 영향 받음

```java
interface Worker {
	void work();
	void eat();
	void sleep();
}

class HumanWorker implements Worker {
	public void work() { /* 일하기 */ }
	public void eat() { /* 먹기 */ }
	public void sleep() { /* 자기 */ }
}

class RobotWorker implements Worker {
	public void work() { /* 일하기 */ }
	public void eat() { /* 로봇은 먹지 않는데 구현해야 함 */ }
	public void sleep() { /* 로봇은 자지 않는데 구현해야 함 */ }
}
```

#### 올바른 예

- 명확한 계약
	- 각 인터페이스는 단일 기능만 정의
	- `RobotWorker`는 `work()`만 구현하면 된다.
- 유연한 확장
	- 새로운 기능(`Rechargeable`) 추가 시 기존 코드 수정 불필요

```java
interface Workable {
	void work();
}

interface Eatable {
	void eat();
}

interface Sleepable {
	void sleep();
}

class HumanWorker implements Workable, Eatable, Sleepable {
	public void work() { /* 일하기 */ }
	public void eat() { /* 먹기 */ }
	public void sleep() { /* 자기 */ }
}

class RobotWorker implements Workable {
	public void work() { /* 일하기 */ }
}
```

### DIP (Dependency Inversion Principle) - 의존관계 역전 원칙

>[!info] **정의**: 고수준 모듈은 저수준 모듈에 의존해서는 안 된다. 둘 다 추상화에 의존해야 한다.

구체적인 구현이 아닌 추상화에 의존해야 한다.

#### 잘못된 예

- 고수준 모듈이 저수준 모듈에 직접 의존
- 강한 결합도
	- `Switch`는 `LightBulb`에 강하게 결합되어 다른 기기 추가가 불가능
	- 전구 구현 변경 시 `Switch`도 수정 필요

```java
class LightBulb {
    public void turnOn() { System.out.println("전구 켜짐"); }
    public void turnOff() { System.out.println("전구 꺼짐"); }
}

class Switch {
    private LightBulb bulb;  // 문제 1: 구체 클래스에 직접 의존
    
    public Switch(LightBulb bulb) {
        this.bulb = bulb;  // 문제 2: 생성자 주입도 구체 클래스 사용
    }
    
    public void operate() {
        if (Math.random() > 0.5) {
            bulb.turnOn();  // 문제 3: 고수준 모듈이 저수준 구현을 직접 호출
        } else {
            bulb.turnOff();
        }
    }
}
```

#### 올바른 예

- 결합도 감소
	- `Switch`는 이제 `LightBulb`, `Fan` 등 어떤 `Switchable` 기기와도 작동
- 계층 구조 역전
	- DIP 적용 전: `Switch(고수준)` → `LightBulb(저수준)`
	- DIP 적용 후: `Switch(고수준)` ← `Switchable(추상화)` → `LightBulb(저수준)`
- 실제 적용 사례
	- Spring Framework의 `@Autowired`
	- 로깅에서 `LoggerInterface` 사용 (실제 로거 구현과 분리)

```java
// 추상화 인터페이스 정의 (고수준)
interface Switchable {
    void turnOn();
    void turnOff();
}

// 저수준 모듈들이 추상화에 의존
class LightBulb implements Switchable {
    public void turnOn() { System.out.println("LED 전구 켜짐"); }
    public void turnOff() { System.out.println("LED 전구 꺼짐"); }
}

class Fan implements Switchable {
    public void turnOn() { System.out.println("팬 작동 시작"); }
    public void turnOff() { System.out.println("팬 정지"); }
}

// 고수준 모듈이 추상화에 의존
class Switch {
    private Switchable device;  // 추상화에 의존
    
    public Switch(Switchable device) {
        this.device = device;  // DI - Dependency Injection(의존성 주입)
    }
    
    public void operate() {
        if (Math.random() > 0.5) {
            device.turnOn();  // 다형성 호출
        } else {
            device.turnOff();
        }
    }
}
```

## 🎯결론

SOLID 원칙은 서로 연관되어 전체적인 설계 안정성을 이루며, 각 원칙을 종합적으로 적용해야 유연하고 견고한 시스템을 구축할 수 있다.

- `SRP`가 클래스를 단순하게 유지하면 `OCP` 적용이 쉬워지고
- `LSP`가 상속 계층을 안정화하면 `DIP`로 확장하기 용이해지며
- `ISP`는 `SRP`와 `DIP`를 자연스럽게 지원하는 선순환 구조를 만든다.

### SRP (단일 책임 원칙)

- **핵심 가치**: **응집도 ↑, 유지보수성 ↑**
- **실천 방안**: 
    - 클래스 설계 시 **"이 클래스를 수정하는 이유는 단 하나인가?"** 자문하기 
    - 책임이 복잡하면 **분할**하고, 관련성 높은 기능은 **응집**시키기

### OCP (개방/폐쇄 원칙)

- **핵심 가치**: **확장성 ↑, 기존 코드 안정성 ↑**
- **실천 방안**: 
    - **변하는 부분은 추상화** (인터페이스/상속), **변하지 않는 부분은 고정** 
    - **"인터페이스에 프로그래밍하라"** → 예시처럼 `Shape` 인터페이스처럼 확장 포인트 제공

### LSP (리스코프 치환 원칙)

- **핵심 가치**: **다형성 안정성 ↑, 계약 준수성 ↑**
- **실천 방안**:  
    - 하위 클래스는 **상위 클래스의 행동 규약을 반드시 지켜야 함** 
    - 생물학적 분류 != 프로그래밍적 상속
    - **"is-a" 관계가 아닌 경우 상속 금지** → 예시처럼 `Penguin`은 `Bird`를 상속하면 안 됨
    - 상속 대신 확장 포인트 제공

### ISP (인터페이스 분리 원칙)

- **핵심 가치**: **불필요한 의존성 ↓, 클라이언트 맞춤 설계**
- **실천 방안**: 
    - **"클라이언트는 자신이 사용하지 않는 메서드에 의존하지 말아야 한다"** 
    - 거대한 인터페이스는 **작은 단위로 분할** (예: `UserAPI` → `ReaderAPI` + `WriterAPI`)

### DIP (의존 역전 원칙)

- **핵심 가치**: **모듈 간 결합도 ↓, 유연성 ↑**
- **실천 방안**: 
    - **"추상화에 의존하라, 구체화에 의존하지 말라"** 
    - **"프로그램을 플러그인 아키텍처로 만든다"**
    - 모든 의존성이 추상화를 향하도록 설계하면, 시스템은 유연한 **레고 블록**처럼 조립 가능해진다.

### 핵심 질문 정리

| 원칙      | 키워드      | 핵심 질문                            |
| ------- | -------- | -------------------------------- |
| **SRP** | 단일 책임    | "이 클래스를 변경하는 이유는 하나인가?"          |
| **OCP** | 확장 개방    | "새 기능을 추가할 때 기존 코드를 수정하는가?"      |
| **LSP** | 치환 가능    | "하위 클래스를 상위 클래스로 대체해도 문제없는가?"    |
| **ISP** | 인터페이스 분리 | "클라이언트가 필요 없는 메서드를 구현하도록 강제하는가?" |
| **DIP** | 추상화 의존   | "고수준 모듈이 저수준 모듈에 직접 의존하는가?"      |

## ⚙️EndNote

### 사전 지식

- 객체 지향 프로그래밍(OOP) 기본 개념 (클래스, 객체, 상속, 다형성 등)
- 인터페이스와 추상 클래스의 차이
- 의존성 주입(Dependency Injection) 개념

### 더 알면 좋은 것들?

- **GRASP 원칙**: SOLID 외에도 일반적인 책임 할당을 위한 소프트웨어 패턴
- **디자인 패턴**: SOLID 원칙을 적용한 구체적인 설계 예시들 (팩토리, 전략, 옵저버 패턴 등)
- **리팩토링 기법**: SOLID 원칙을 준수하도록 코드를 개선하는 방법
- **테스트 주도 개발(TDD)**: SOLID 원칙과 잘 어울리는 개발 방법론
- **의존성 주입 프레임워크**: Spring, Guice 등 DIP를 쉽게 적용할 수 있게 도와주는 도구들