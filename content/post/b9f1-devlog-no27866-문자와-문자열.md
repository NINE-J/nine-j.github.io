---
publish: false
draft: true
title: No.27866 문자와 문자열
description: baekjoon, Java
author: Nine
date: 2025-12-25T05:00:00
categories:
  - 알고리즘
  - 백준
tags:
  - algorithms
  - baekjoon
  - Bronze
  - Java
id: 019ce76a-c2e9-7564-99ed-1dd3a4fdfa4a
slug: b9f1-devlog-no27866-문자와-문자열
---

## 📌개수 세기

| 시간 제한 | 메모리 제한  |
| ----- | ------- |
| 1 초   | 1024 MB |

## 📌문제

단어 $S$와 정수 $i$가 주어졌을 때, $S$의 $i$번째 글자를 출력하는 프로그램을 작성하시오.

## 📌입력

첫째 줄에 영어 소문자와 대문자로만 이루어진 단어 $S$가 주어진다. 단어의 길이는 최대 $1,000$이다.

둘째 줄에 정수 $i$가 주어진다. ($1 \le i \le \left|S\right|$)

## 📌노트

문자열 $S$에 대해 $\left|S\right|$는 $S$의 길이를 의미한다.

## 📌출력

$S$의 $i$번째 글자를 출력한다.

## 📌예제

### 예제 1

#### 예제 입력 1

```
Sprout
3
```

#### 예제 출력 1

```
r
```

### 예제 2

#### 예제 입력 2

```
shiftpsh
6
```

#### 예제 출력 2

```
p
```

### 예제 3

#### 예제 입력 3

```
Baekjoon
4
```

#### 예제 출력 3

```
k
```

## 📌풀이

### import

```java
import java.io.*;
```

`BufferedReader`, `InputStreamReader`, `IOException` 등 I/O 관련 클래스를 임포트한다.
편리하게 와일드 카드를 사용하는 방법도 있고 익숙해지고 싶은 건 명시적으로 임포트하자.

### 기본 형태

Java로 문제를 제출할 때는 실행 가능한 형태의 `Main` 클래스를 작성해야 한다.

JVM(Java Virtual Machine)은 프로그램을 시작할 때 **정적 메서드**인 `public static void main(String[] args)`를 진입점(entry point)으로 호출한다.

백준을 포함한 대부분의 온라인 저지(Online Judge)는 제출된 Java 코드를 컴파일한 뒤, **`Main` 클래스의 `main` 메서드**를 기준으로 프로그램을 실행한다.

따라서 문제 풀이 시 다음 구조를 갖춘 코드를 작성하는 것이 일반적이다.

```java
public class Main {
    public static void main(String[] args) {
        // 문제 풀이 코드
    }
}
```

### 풀이

1. 입력 받은 문자열의 i-1번째 문자 출력

```java
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        int i = Integer.parseInt(br.readLine());
    
        System.out.println(line.charAt(i-1));
    }
}
```

***

## 📌회고

단순하게 i 위치를 출력했다가 실패했는데 쉬운 문제일수록 문제를 잘 읽어야 한다.
