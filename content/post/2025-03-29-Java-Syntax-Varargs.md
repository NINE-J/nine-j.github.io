---
publish: true
title: "Java 문법: 가변 인자"
description: Java의 가변 인자를 이해하고 적절히 사용할 수 있다.
author: Nine
Created: 2025-03-29
categories:
  - Java
  - 문법
tags:
  - devlog
  - Java
  - 객체지향
  - OOP
  - Polymorphism
  - Dynamic-Binding
# image: Status: Done
---
## 📌개요

`Java`의 `Variable Arguments`(가변 인자)는 메서드에 전달되는 인자의 개수를 유동적으로 처리할 수 있는 기능이다.
가변 인자를 사용하면 메서드 호출 시 인자의 개수를 미리 정하지 않아도 되므로, 코드의 유연성과 가독성을 높일 수 있다.

## 📌내용

### Variable Arguments

가변 인자는 메서드 매개변수 목록에서 `타입... 변수명` 형태로 선언된다.

```java
public void printNumbers(int... numbers) {
	// ...
}
```

- 가변 인자는 내부적으로 배열로 처리된다. 따라서 메서드 내부에서는 가변 인자를 배열처럼 다룰 수 있다.
- 가변 인자에는 0개 이상의 인자를 전달할 수 있고 개수 제한이 없다.
- 가변 인자는 메서드 매개변수 목록에서 반드시 마지막에 위치해야 한다.

### 동작 방식

1. 메서드를 호출할 때 가변 인자에 해당하는 인자들을 쉼표로 구분하여 전달한다.
2. 컴파일러는 전달된 인자들을 배열로 묶어서 메서드에 전달한다.
3. 메서드 내부에서는 전달 받은 배열을 사용하여 작업을 수행한다.

### 가변 인자의 장점

- 다양한 개수의 인자를 처리하는 메서드를 여러 개 오버로드할 필요 없이 하나의 메서드로 처리할 수 있어서 코드가 간결해진다.
- 메서드 호출 시 인자의 개수를 유연하게 조절할 수 있다.
- 배열을 명시적으로 생성하지 않고도 여러 인자를 쉽게 전달할 수 있다.

## 📌대체 또는 보완

가변 인자는 편리하지만, 내부적으로 배열을 생성하므로 많은 인자가 자주 전달되는 경우에는 성능에 영향을 미칠 수 있다.
이러한 성능 문제를 해결하거나 완화할 수 있는 몇 가지 방법이 있다.

### 배열 또는 컬렉션 직접 전달

가변 인자 대신 배열이나 `List`와 같은 컬렉션을 직접 메서드에 전달하는 것이 좋다.
메서드 호출 시마다 배열을 새로 생성하는 오버헤드를 줄일 수 있다.

```java
public void processNumbers(int[] numbers) {
	// ...
}

public void processNumbers(List<Integer> numbers) {
	// ...
}

int[] numbers = {1, 2, 3, 4, 5};
processNumbers(numbers);

List<Integer> numberList = Array.asList(1, 2, 3, 4, 5);
processNumbers(numberList);
```

### 메서드 오버로딩

자주 사용되는 인자 개수에 따라 메서드를 오버로딩하여 가변 인자 사용을 최소화할 수 있다.

```java
public void processNumbers(int a) {
	// ...
}

public void processNumbers(int a, int b) {
	// ...
}

public void processNumbers(int a, int b, int c) {
	// ...
}

public void processNumbers(int... numbers) {
	// ...
}
```

### 성능에 민감한 경우 특수화된 메서드 사용

성능이 매우 중요한 경우에는 가변 인자를 전혀 사용하지 않고 특정 개수의 인자를 받는 특수화된 메서드를 사용하는 것이 좋다.
예를 들어, 인자가 최대 10개까지 자주 사용된다면, 인자가 1개부터 10개까지인 메서드를 모두 구현할 수 있다.

## 📌사용 시 주의사항

### 매개변수의 마지막에 위치해야 한다

가변 인자는 메서드 매개변수 목록에서 반드시 마지막에 위치해야 한다.
그렇지 않으면 컴파일 에러가 발생한다.

#### 오류 예시

```java
public class VarargsErrorExample {
	public static void printValues(int... numbers, String message) {
		// ...
	}

	public static void main(String[] args) {
		printValues(1, 2, 3, "Hello");
	}
}

// VarargsErrorExample.java:2: error: variable arity parameter must be the last parameter public static void printValues(int... numbers, String message) { ^ 1 error
```

#### 올바른 사용

```java
public class VarargsCorrectExample {
	public static void printValues(String message, int... numbers) {
		System.out.println(message);
		for(int number : numbers) {
			System.out.println(number);
		}
	}

	public static void main(String[] args) {
		printValues("Numbers:", 1, 2, 3);
	}
}
```

### 오버로딩 시 주의

가변 인자를 사용하는 메서드를 오버로딩할 때 모호성이 발생할 수 있으므로 주의해야 한다.

#### 오류 예시

비단 예시만이 아니라 모호성 오류가 발생할 수 있는 케이스는 상속 관계와 제네릭, null 값의 전달, 와일드 카드 제네릭 등 더 있지만 간단한 예제로 알아본다.

`Java`는 기본 자료형인 `int`와 래퍼 클래스인 `Integer` 사이의 자동 변환을 지원한다.
이 때문에 `int` 값을 `Integer`로 자동 변환하여 `Integer...` 매개 변수에 전달할 수 있게 된다.

컴파일러는 전달된 인자들을 배열로 묶어야 하는데 자동 박싱 때문에 `int` 배열 또는 `Integer` 배열을 만들 수 있는 두 가지 선택지가 생긴다.

컴파일러는 어떤 배열을 생성해야 할지 결정할 수 없으므로 `모호성 오류`가 발생한다.

```java
public class VarargsOverloadingError {
	public static void printValues(int... numbers) {
		System.out.println("int 가변 인자 메서드");
		for(int number : numbers) {
			System.out.print(number + " ");
		}
		System.out.println();
	}

	public static void printValues(Integer... numbers) {
		System.out.println("Integer 가변 인자 메서드");
		for(Integer number : numbers) {
			System.out.print(number + " ");
		}
		System.out.println();
	}

	public static void main(String[] args) {
		printValues(1, 2, 3); // 컴파일 오류, 어떤 메서드를 호출해야 할지 모호함
	}
}

// reference to printValues is ambiguous both method printValues(int...) in VarargsOverloadingError and method printValues(Integer...) in VarargsOverloadingError match
```

#### 올바른 사용

```java
public class VarargsOverloadingSuccess {
	public setatic void printValues(String message, int... numbers) {
		System.out.println(message);
		for(int number : numbers) {
			System.out.print(number + " ");
		}
		System.out.println();
	}

	public static void printValues(int... numbers) {
		System.out.println("int 가변 인자 메서드");
		for(int number : numbers) {
			System.out.print(number + " ");
		}
		System.out.println();
	}

	public static void main(String[] args) {
		printValues(1, 2, 3); // int 가변 인자 메서드 호출
		printValues("Numbers:", 4, 5, 6); // String, int 가변 인자 메서드 호출
	}
}
```

## 🎯결론

- 가변 인자는 편리하지만 성능 문제가 발생할 수 있으므로 상횡에 따라 적절한 방법을 선택하여 사용하는 것이 중요하다.
- 특히, 많은 인자가 자주 전달되는 경우에는 배열 또는 컬렉션을 직접 전달하거나 메서드 오버로딩과 같은 방법을 고려하는 것이 좋다.
- 성능이 매우 중요한 경우에는 가변 인자를 전혀 사용하지 않고 특정 개수의 인자를 받는 특수화된 메서드를 사용하는 것이 좋다.

## ⚙️EndNote

### 컬렉션 빌더

`Java9`부터 도입된 `List.of()` 또는 `Stream.of()`와 같은 컬렉션 빌더를 사용하여 불변 컬렉션을 생성하고 이를 메서드에 전달할 수 있다.

```java
public void processNumbers(List<Integer> numbers) {
	// ...
}

processNumbers(List.of(1, 2, 3, 4, 5));
```

컬렉션 빌더는 가변 인자를 내부적으로 사용하지만, 몇 가지 중요한 차이점으로 성능 및 메모리 관리 측면에서 가변 인자를 직접 사용하는 것과 다르다.

#### 불변 컬렉션 생성

- 컬렉션 빌더는 수정할 수 없는 불변 컬렉션을 생성한다.
- 생성 후에는 요소를 추가, 삭제, 변경할 수 없다.
- 컬렉션의 크기가 고정되어 있음을 의미하며, 런타임에 동적으로 크기를 조정할 필요가 없다.

#### 최적화된 구현

- 소수의 요소를 처리하는 경우에 대해 특수화된 구현을 제공하여 배열 생성 및 복사 비용을 최소화한다.

#### 메모리 효율성

- 불변 컬렉션은 크기가 고정되어 있으므로 필요한 메모리를 미리 할당하고 재할당할 필요가 없다.
- 또한, 불변성은 메모리 공유 및 캐싱을 용이하게 하여 메모리 효율성을 높일 수 있다.

#### 가변 인자의 직접 사용과의 차이

- 가변 인자는 인자의 개수에 따라 매번 새로운 배열을 생성하므로 메모리 오버헤드가 발생할 수 있다.
- 컬렉션 빌더는 특정 범위(예: 0~10개)의 인자를 처리할 때 미리 할당된 메모리를 사용하여 성능을 최적화한다.