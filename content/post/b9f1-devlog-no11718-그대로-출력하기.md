---
publish: false
draft: true
title: No.11718 그대로 출력하기
description: baekjoon, Java
author: Nine
date: 2025-12-25T05:30:00
categories:
  - 알고리즘
  - 백준
tags:
  - algorithms
  - baekjoon
  - Bronze
  - Java
id: 019ce76a-c2df-735e-9e6b-03f33fdb18bb
slug: b9f1-devlog-no11718-그대로-출력하기
---

## 📌개수 세기

| 시간 제한 | 메모리 제한 |
| ----- | ------ |
| 1 초   | 256 MB |

## 📌문제

입력 받은 대로 출력하는 프로그램을 작성하시오.

## 📌입력

입력이 주어진다. 입력은 최대 100줄로 이루어져 있고, 알파벳 소문자, 대문자, 공백, 숫자로만 이루어져 있다. 각 줄은 100글자를 넘지 않으며, 빈 줄은 주어지지 않는다. 또, 각 줄은 공백으로 시작하지 않고, 공백으로 끝나지 않는다.

## 📌출력

입력받은 그대로 출력한다.

## 📌예제

### 예제 1

#### 예제 입력 1

```
Hello
Baekjoon
Online Judge
```

#### 예제 출력 1

```
Hello
Baekjoon
Online Judge
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

1. BufferedReader를 사용해 한 줄씩 입력 받으면 곧바로 출력하여 입력 그대로 출력

```java
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line;
        while((line = br.readLine()) != null) {
            System.out.println(line);
        }
    }
}
```

***

## 📌회고

Stringbuilder를 사용해야 하나 고민하다가 곧바로 출력하는 게 가능하잖아?
