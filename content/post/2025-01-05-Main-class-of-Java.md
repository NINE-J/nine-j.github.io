---
publish: true
title: Java의 main 클래스
description: main은 왜 main이지?
author: Nine
Created: 2025-01-05
categories:
  - Java
  - 기초
tags:
  - devlog
  - Java
  - JLS
  - MainClass
# image: Status: Done
---
## 📌개요

Java의 `public static void main(String[] args)`

## 📌내용

Java 프로젝트를 생성하고 IDE에서 제공하는 메인 템플릿을 생성하게 되면 아래와 같은 코드를 확인할 수 있다.

>`백준` 같은 알고리즘 풀이 사이트에선 채점 시 제출한 코드를 `Main.java`로 가정하여 받는다.

```java
public class SampleProject {
	public static void main(String[] args) {
		...
	}
}
```

>[!info] Java 는 애플리케이션이 실행되면 제일 먼저 메인(main)메소드를 실행한다.

Java에서 `public static void main(String[] args)` 메서드의 형태가 항상 동일한 이유는 **Java 언어 명세**에 명시되어 있기 때문이다.
이는 Java 프로그램의 시작 지점을 정의하기 위한 약속(규약, convention)이다.

## 📌왜 `main` 메서드의 형태가 고정되어 있을까?

### JVM(Java Virtual Machine)의 요구 사항

Java 프로그램은 JVM에서 실행되며, JVM은 프로그램의 시작 지점을 찾기 위해 특정 형태의 메서드를 탐색한다.
이때 `main` 메서드는 반드시 아래와 같은 조건을 만족해야 한다.

- `public`: JVM이 프로그램 외부에서 호출할 수 있어야 함.
- `static`: JVM이 클래스의 인스턴스를 생성하지 않고도 호출할 수 있어야 함.
- `void`: 반환값이 필요하지 않음. 프로그램의 시작점으로 동작하기 때문.
- `String[] args`: 명령줄 인수를 받을 수 있어야 함.

### Java 언어 명세 (Java Language Specification, JLS)

JLS의 **12.1.4 "Invoke the main Method"** 섹션에 이 규칙이 명시되어 있다.
JVM은 실행 시 지정된 클래스에서 다음과 같은 메서드를 찾아 호출한다.

```java
public static void main(String[] args)
```

### 일관성 및 예측 가능성 

프로그램의 진입점을 표준화함으로써 개발자들이 Java 프로그램의 구조를 쉽게 이해할 수 있다.
다른 사람이 작성한 코드를 보더라도 어디에서 실행이 시작되는지 즉시 알 수 있다.

## 📌변경하면 안 될까?

- 접근 제한자 변경: `private` 또는 `protected`로 바꾸면 JVM이 메서드를 찾지 못하고 `NoSuchMethodError`가 발생한다.
- static 제거: JVM은 클래스 인스턴스를 생성하지 않으므로 `static`이 없으면 호출할 수 없다.
- 매개변수 변경: `String[] args` 대신 다른 매개변수를 사용하면 JVM이 인식하지 못한다.

## 📌예외 사항

### Overloading

`main` 메서드는 오버로딩할 수 있다.

>[!warning] 그러나 JVM은 여전히 `public static void main(String[] args)`를 실행한다.

```java
public class SampleProject {
	public static void main(String[] args) {
		 System.out.println("Hello, World!");
	}
	public static void main() {
		 System.out.println("This won't be called by JVM!");
	}
}
```

### Entry Point 변경

Java 11 이상에서는 `public static void main(String[] args)` 없이도 `java.util.function` 인터페이스를 활용하여 프로그램을 실행할 수 있다.
예를 들어, `java -cp . MyProgram` 형태로 실행 가능하다.

## 📌결론

`public static void main(String[] args)`는 Java의 규약이며, Java 언어 명세에 명시된 내용이다.
이 형태를 따르지 않으면 JVM이 프로그램의 진입점을 찾을 수 없으므로 반드시 이 구조를 따라야 한다.

## ⚙️EndNote

### main 메서드의 구성 요소

1. `public` (공개 접근 제어자)
    - JVM이 프로그램을 실행할 때 `main` 메서드를 호출해야 하므로, 외부에서 접근 가능하도록 `public`이어야 한다.
2. `static` (정적 메서드)
    - Java에서 메서드를 호출하려면 일반적으로 객체를 생성해야 하지만, `main`은 프로그램 시작점이므로 객체 없이 호출 가능해야 한다.
    - 따라서 `static`으로 선언하여 JVM이 클래스 로딩 후 바로 실행할 수 있도록 한다.
3. `void` (반환 값 없음)
    - `main` 메서드는 실행이 목적이므로 별도의 반환 값이 필요하지 않다. 
	    - 필요한 경우 상황에 맞게 변경하여 사용한다.
    - 프로그램 종료 상태는 `System.exit(status)`를 통해 반환할 수 있다.
4. `String[] args` (명령행 인자)
    - 프로그램 실행 시 전달되는 명령행 인자(Arguments)를 배열로 받는다.
    - 예를 들어, `java Main hello world` 명령어를 실행하면 `args[0] = "hello"`, `args[1] = "world"`가 된다.