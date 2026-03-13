---
publish: false
draft: true
title: No.9086 문자열
description: baekjoon, Java
author: Nine
date: 2025-12-25T06:00:00
categories:
  - 알고리즘
  - 백준
tags:
  - algorithms
  - baekjoon
  - Bronze
  - Java
id: 019ce76a-c2ed-70e2-ba99-055211552ad1
slug: b9f1-devlog-no9086-문자열
---

## 📌개수 세기

| 시간 제한 | 메모리 제한 |
| ----- | ------ |
| 1 초   | 128 MB |

## 📌문제

문자열을 입력으로 주면 문자열의 첫 글자와 마지막 글자를 출력하는 프로그램을 작성하시오.

## 📌입력

입력의 첫 줄에는 테스트 케이스의 개수 T(1 ≤ T ≤ 10)가 주어진다. 각 테스트 케이스는 한 줄에 하나의 문자열이 주어진다. 문자열은 알파벳 A\~Z 대문자로 이루어지며 알파벳 사이에 공백은 없으며 문자열의 길이는 1000보다 작다.

## 📌출력

각 테스트 케이스에 대해서 주어진 문자열의 첫 글자와 마지막 글자를 연속하여 출력한다.

## 📌예제

### 예제 1

#### 예제 입력 1

```
3
ACDKJFOWIEGHE
O
AB
```

#### 예제 출력 1

```
AE
OO
AB
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

1. 첫 줄의 테스트 케이스 개수 확인
2. 이후 문자열의 첫 문자와 마지막 문자를 나란히 배치하여 출력, 만약 한 글자라면 첫 문자와 마지막 문자가 동일하다

```java
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int count = Integer.parseInt(br.readLine());
        String line;
        
        for(int i = 0; i < count; i++) {
            line = br.readLine();
            String char1 = String.valueOf(line.charAt(0));
            String char2 = String.valueOf(line.charAt(line.length() - 1));
            
            System.out.println(char1 + char2);
        }
    }
}
```

***

## 📌회고

`charAt`은 `char` 타입이라서 `String`으로 변환해줘야 한다.
`String`은 원시 타입이 없다.

`Character.toString()`은 내부적으로 `String.valueOf()`를 사용해서 성능 차이가 없다.
