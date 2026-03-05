---
publish: false
draft: true
title: No.11654 아스키 코드
description: baekjoon, Java
author: Nine
date: 2025-11-19T15:20:00
categories:
  - 알고리즘
  - 백준
tags:
  - algorithms
  - baekjoon
  - Bronze
  - Java
---
## 📌개수 세기
| 시간 제한 | 메모리 제한 |
| ----- | ------ |
| 1 초   | 256 MB |

## 📌문제

알파벳 소문자, 대문자, 숫자 0-9중 하나가 주어졌을 때, 주어진 글자의 아스키 코드값을 출력하는 프로그램을 작성하시오.

## 📌입력

알파벳 소문자, 대문자, 숫자 0-9 중 하나가 첫째 줄에 주어진다.
## 📌출력

입력으로 주어진 글자의 아스키 코드 값을 출력한다.

## 📌예제

### 예제 1

#### 예제 입력 1

```
A
```

#### 예제 출력 1

```
65
```

### 예제 2

#### 예제 입력 2

```
C
```

#### 예제 출력 2

```
67
```

### 예제 3

#### 예제 입력 3

```
0
```

#### 예제 출력 3

```
48
```

### 예제 4

#### 예제 입력 4

```
9
```

#### 예제 출력 4

```
57
```

### 예제 5

#### 예제 입력 5

```
a
```

#### 예제 출력 5

```
97
```

### 예제 6

#### 예제 입력 6

```
z
```

#### 예제 출력 6

```
122
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

1. BufferedReader의 `readLine`은 입력을 String으로 받지만 `read` 메서드는 ascii 코드인 정수로 받게 된다.

```java
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        System.out.println(br.read());
    }
}
```

---
## 📌회고

1. `br.read()`가 반환하는 값
    - `BufferedReader.read()`는 한 문자(character, UTF‑16 코드 유닛)를 읽어서 그 문자 값을 int로 반환한다.
    - 정상 반환값 범위는 0..65535이고, 입력이 끝나면 -1을 반환한다.
    - 반환형이 int인 이유는 EOF(-1)를 구분하기 위해서라고 한다.
2. 왜 ASCII 코드(예: 'A' -> 65)가 나오는가
    - `InputStreamReader(InputStream)`를 통해 바이트를 문자로 디코딩한다.
        - `new InputStreamReader(System.in)` 사용
    - ASCII 문자는 유니코드의 하위 집합(코드포인트 0..127)이므로, UTF‑8(혹은 대부분의 인코딩)에서 1바이트로 표현되고 유니코드 값도 동일하다.
    - 따라서 사용자가 'A'를 입력하면 InputStreamReader가 바이트 65를 문자 'A'로 디코딩하고, br.read()는 그 문자(유니코드 코드 유닛)값 65를 int로 돌려준다. println은 그 int를 10진수로 출력해서 65를 보여준다.
3. 인코딩/멀티바이트 문자에 대한 주의
    - 입력이 UTF‑8일 때 InputStreamReader가 같은 인코딩으로 바이트를 문자로 디코딩해야 올바르게 동작한다.
    - `new InputStreamReader(System.in)` 플랫폼 기본 문자셋을 사용하므로, 안전하게 쓰려면 명시적으로 UTF‑8을 지정하는 것이 좋다.
        ```java
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in, StandardCharsets.UTF_8));
        ```