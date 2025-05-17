---
title: Java
description: 생성자 대신 팩토리 메서드를 고려하라
author: Nine
date: 2025-04-15
categories:
  - Java
  - 객체지향
tags:
  - devlog
  - Java
  - 객체지향
image: cover.png
---
## 📌개요

정적 팩토리 메서드는 객체 생성을 더 명확하고, 안전하며 유연하게 만들 수 있는 방법이다.
일반적인 생성자(`new`) 방식과 달리 이름을 자유롭게 부여할 수 있고, 객체 생성을 숨기거나 제어할 수 있다.

보통 생성자를 `private`으로 숨기고 정적 팩토리 메서드를 통해서만 객체 생성을 허용하는 방식으로 활용한다.

정적 팩토리 메서드의 장단점과 어떤 상황에서 효과적인지 알아보자.

## 📌내용

### 왜 쓰는데?

#### 명확한 의도 표현

생성자는 클래스명과 같아야 하므로 객체가 무엇을 위한 용도인지 코드만 보고 파악하기 어렵다.

```java
User user = new User(); // 이게 누구지? 회원? 관리자? 손님?
```

정적 팩토리 메서드는 이름을 자유롭게 지정할 수 있어 객체 생성의 의도와 맥락을 명확하게 전달할 수 있다.

```java
User guest = User.guest(); // 비회원
User fromJson = User.adminWith("READ", "WRITE"); // 권한 있는 관리자
User fromId = User.fromEmail("test@test.com"); // 이메일 기반 생성
```

그냥 아무나 데려오는 것과 목적과 정체가 분명한 사람을 요청하는 것은 다르다.
생성자의 경우 의도를 파악하기 어렵지만 정적 팩토리 메서드는 의도와 맥락을 명확히 드러낸다.

#### 객체 생성 제어

정적 팩토리 메서드를 사용하면 객체 생성을 직접 통제할 수 있다.
예를 들어 같은 손님(guest)는 한 번만 생성되도록 만들 수 있다.

```java
public class User {
	private static final User GUEST = new User("guest", "GUEST");

	private User(String name, String role) { ... }

	public static User guest() {
		return GUEST; // 항상 같은 객체를 반환
	}
}
```

"공용 컴퓨터 계정"처럼 같은 계정을 여러명이 공유하는 개념이다.
매번 새로운 객체를 만들지 않고 미리 정의된 인스턴스를 공유할 수 있다.

#### 반환 타입의 유연성

생성자는 반환 타입이 고정되어 있어서 유연하게 타입을 다루기 어렵다.

정적 팩토리 메서드는 상위 타입을 반환하고 내부적으로는 하위 클래스나 구현체를 사용할 수 있다.
덕분에 구현체를 숨기고 인터페이스 기반의 유연한 설계가 가능하다.

```java
public interface User {}

public class GuestUser implements User {}
public class AdminUser implements User {}

public class UserFactory {
    public static User guest() {
        return new GuestUser();
    }

    public static User adminWith(String... permissions) {
        return new AdminUser(permissions);
    }
}

```

웹서비스에서 "유저"라는 요청을 보내면 실제로는 "게스트" 혹은 "관리자"가 올 수 있다.
클라이언트는 "User"만 알고 어떤 타입인지는 서버가 알아서 판단한다.

#### 객체 생성 비용 절감

매번 DB나 외부 API를 통해 객체를 생성하는 건 성능에 부담이 된다.
정적 팩토리 메서드는 캐시를 활용하거나 지연 생성 전략을 적용할 수 있다.

```java
public class UserRepository {
	private static final Map<String, User> cache = new HashMap<>();

	public static User fromEmail(String email) {
		return cache.computeIfAbsent(email, User::loadFromDb);
	}
}
```

마치 이메일 계정으로 로그인할 때 이미 로그인한 적 있으면 바로 입장,
없으면 DB에서 불러와서 캐시에 저장 후 사용하는 전략이다.

#### 런타임 유연성

구현체가 없어도 설계 가능.
어떤 클래스가 어떤 구현을 가질지 작성 시점에 모를 수도 있다.

정적 팩토리 메서드는 인터페이스만 먼저 정의하고 구현은 나중에 환경 설정이나 조건에 따라 동적으로 결정할 수 있다.

```java
public static User ofType(String type) {
	return switch (type) {
		case "guest" -> guest();
		case "admin" -> adminWith("ALL");
		default -> throw new IllegalArgumentException();
	}
}
```

"유저 타입: guest"라는 요청이 들어오면,
필요한 타입의 유저로 찾아서 제공하는 유연한 구조가 가능하다.

### 생성자를 숨기면?

#### 불변 클래스 보장

생성자를 외부에서 호출하지 못하게 방지하면 객체 상태를 변경할 수 없도록 안전하게 설계할 수 있다.

```java
public final class User {
	private final String email;
	private final String role;

	private User(String email, String role) {
		this.email = email;
		this.role = role;
	}

	public static User fromEmail(String email) {
		return new User(email, "USER");
	}

	// 상태를 바꿀 수 있는 setter가 존재하지 않음
}
```

한 번 발급된 여권처럼 이름이나 생년월일을 나중에 바꿀 수 없다.
다시 만들려면 새 여권을 발급해야 한다.

#### 정교한 인스턴스 생성

정적 팩토리 내부에서 입력 검증이나 비즈니스 로직을 넣을 수 있다.

```java
public static User fromEmail(String email) {
	if (!email.contains("@")) throw new IllegalArgumentException();
	return new User(email, "USER");
}
```

"@ 없는 이메일은 회원가입 불가"처럼 생성 조건을 내부 로직에서 엄격히 관리할 수 있다.

#### 추상화 및 캡슐화 강화

내부 구현체를 외부에 노출하지 않고 인터페이스만 제공해 유연한 구조를 만들 수 있다.

```java
User user = UserFactory.ofType("admin");
```

여행자에게 여권만 주고 그 사람이 한국인이든 외국인이든 내부적으로 판단하는 구조.

### 팩토리 메서드 단점은 없나?

#### 상속 제약

정적 팩토리 메서드만 제공하고 `public` 또는 `protected` 생성자가 없으면 하위 클래스를 만들 수 없다.
하지만 실무에서는 대부분 `final`, 불변 객체, 캡슐화를 목적으로 사용하기에 장점이 되기도 한다.

#### 개발자의 인지

정적 팩토리 메서드는 생성자와 달리 이름이 자유롭기 때문에 개발자가 어떤 메서드가 객체를 생성하는지 알기 어려울 수 있다.
따라서 명확한 네이밍 규칙을 정하고 문서화를 잘해야 한다.

### 근데 생성자로도 되잖아?

정적 팩토리 메서드의 장점이라고 흔히 말하는 것들 중 상당수는 생성자만으로도 구현이 가능하다.
하지만 "가능하다"와 "적절하고 유연하게 된다"는 차원이 다른 이야기다.

핵심은 기능 자체가 아니라 "표현력 + 유연성 + 제어력"

#### 의도를 드러내는 이름 부여

```java
// 생성자: 의도 알기 힘듦
new User("guest", false);

// 정적 팩토리 메서드
User guest = User.createGuest();
User member = User.createMember();
```

생성자도 `new User("guest", false)` 처럼 사용해서 만들 수는 있다.
하지만 이게 어떤 의미인지 코드를 읽는 입장에서 바로 이해하기 어렵다.

즉, 기능이 있냐 보단 의도를 읽을 수 있냐가 중요하다. 

#### 같은 시그니처, 다른 로직

```java
User user1 = User.from("admin"); // 관리자
User user2 = User.from("guest"); // 게스트
```

입력 값에 따라 내부적으로 완전 다른 구현체나 로직을 선택할 수 있다는 의미다.
생성자는 오버로딩을 해야 하는데, 시그니처가 같으면 구분할 수가 없다.

생성자는 매번 객체를 새로 만들고 구분이 안 되는 반면, 정적 팩토리 메서드는 로직을 통합하고 선택적으로 처리 가능.

#### 하위 타입 반환

```java
public interface User { ... }

public class Guest implements User { ... }
public class Admin implements User { ... }

public static User from(String role) {
	if("admin".equals(role)) return new Admin();
	return new Guest();
}
```

생성자는 무조건 해당 클래스의 인스턴스만 반환하지만 정적 팩토리 메서드는 상위 타입을 반환함으로써 내부 구현을 숨길 수 있다.

이건 아예 설계 수준에서 다형성 추상화와 확장성이 달라지는 포인트다.

#### 객체 캐싱과 싱글톤 구현

```java
private static final User INSTANCE = new USER("singletone");

public static User getInstance() {
	return INSTANCE;
}
```

생성자는 호출할 때마다 새로운 객체를 만드니까 객체 재사용을 하려면 외부에서 별도로 관리해줘야 한다.
정적 팩토리 메서드는 내부에서 인스턴스를 통제하니까 객체 풀, 캐시, 싱글톤 등을 자연스럽게 구현할 수 있다.

## 🎯결론

정적 팩토리 메서드는 기능보다 표현력 + 제어력 + 추상화가 핵심이다.
생성자는 단순하고 직관적이지만 API 설계나 유지보수 측면에선 정적 팩토리 메서드가 더 유리하다.

그러나 상속 제약과 개발자의 인지 문제 등 단점도 존재하므로 상황에 맞게 적절히 사용하는 것이 중요하다.

| 기능                      | 생성자 | 정적 팩토리 메서드 |
| ------------------------- | ------ | ------------------ |
| 이름으로 생성 의도 표현   | ❌      | ✅                  |
| 같은 인자, 다른 로직 처리 | ❌      | ✅                  |
| 하위 타입 반환            | ❌      | ✅                  |
| 객체 재사용/캐싱          | ❌      | ✅                  |
| 다형성 추상화 설계        | ❌      | ✅                  |

## ⚙️EndNote

### 사전 지식

- **생성자:** 클래스의 인스턴스를 생성하는 특별한 메서드
- **정적 메서드:** 클래스의 인스턴스 없이 호출할 수 있는 메서드
- **싱글톤 패턴:** 클래스의 인스턴스를 하나만 생성하도록 제한하는 디자인 패턴
- **불변 클래스:** 객체 생성 후 내부 상태를 변경할 수 없는 클래스

### 더 알아보기

- Effective Java 3rd Edition, Item 1: Consider static factory methods instead of constructors
- [Java Constructors vs Static Factory Methods](https://www.baeldung.com/java-constructors-vs-static-factory-methods)
