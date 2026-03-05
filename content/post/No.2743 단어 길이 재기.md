---
publish: false
draft: true
title: No.2743 단어 길이 재기
description: baekjoon, Java
author: Nine
date: 2025-11-22T16:00:00
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
| 1 초   | 128 MB |

## 📌문제

알파벳으로만 이루어진 단어를 입력받아, 그 길이를 출력하는 프로그램을 작성하시오.

## 📌입력

첫째 줄에 영어 소문자와 대문자로만 이루어진 단어가 주어진다. 단어의 길이는 최대 100이다.
## 📌출력

첫째 줄에 입력으로 주어진 단어의 길이를 출력한다.

## 📌예제

### 예제 1

#### 예제 입력 1

```
pulljima
```

#### 예제 출력 1

```
8
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

1. BufferedReader의 `readLine`으로 문자열 확인 후 `length` 메서드로 문자열의 길이를 구한다.

```java
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String str = br.readLine();
        
        System.out.println(str.length());
    }
}
```

---
## 📌회고

복잡한 구현 작업과 알고리즘 문제 풀다가 만난 문제라 어렵게 생각할 뻔 했는데 그냥 문자열 길이를 구하는 것이었다.

근데 문자열 개수를 세는 내부는 어떻게 구현되어 있을까?

### `length` 내부 구현

`String.length()`는 문자 수를 위해 문자열 내용을 한 글자씩 훑지 않으며 O(1) 상수시간으로 내부에 저장된 길이(배열 길이 또는 길이 필드)를 반환한다.

다만 문자 수라는 의미는 Java에서의 UTF-16 코드 유닛(code units, 즉 char 단위)이라서 유니코드 보충 평면 문자는 2개의 char를 차지한다.

즉 `length()`는 코드 포인트 수가 아니라 UTF-16 코드 유닛 수를 반환한다.

구체적으로 구현은 Java 버전에 따라 달라진다.


>[!TIP]
> `length()`는 반복해서 세는 것이 아니라 내부 저장 정보(배열 길이 또는 길이 필드)를 즉시 반환하는 상수시간 연산이며, 반환값은 UTF‑16 코드 유닛 수라는 점을 염두에 두자.

>[!INFO]
>- 보충 평면(supplementary planes)은 유니코드에서 BMP(기본 다국어 평면, U+0000..U+FFFF) 밖에 있는 문자들이 속한 영역들이다.
>- 보충 평면에는 이모지, 고대 문자, 수학/음악 기호, 추가 한자 등 비교적 드물거나 나중에 추가된 문자가 들어간다.
>
>기술적 배경:
>- 초기 유니코드는 16비트(0..0FFFF)로 설계되어 BMP만 표현할 수 있었다. 이후 문자 수가 늘어나자 U+10000 이상을 표현하기 위해 추가 평면(보충 평면)을 도입했다.
>- UTF-16 인코딩은 16비트 단위(char)를 기본으로 하기 때문에 U+10000 이상의 문자는 서러게이트 쌍(surrogate pair)인 두 개의 char로 표현한다.

#### Java 6/7

- 내부 표현: `private final char[] value;` (과거에는 offset/count 필드가 따로 있던 시기도 있음)
- `length()`는 저장된 count(또는 value.length)를 반환한다.

```java
public int length() {
    return value.length; // 또는 오래된 구현에서는 return count;
}
```

#### Java 9 이상

- 내부 표현이 `char[]`에서 `byte[]`로 바뀌고 어떤 인코딩으로 저장했는지 나타내는 `coder` 필드가 추가된다. (예: LATIN1(ISO-8859-1) 또는 UTF-16)
- `value`는 바이트 배열이고 LATIN1이면 1바이트 = 1 char, UTF-16이면 2바이트 = 1char(UTF-16 코드 유닛)
- `legnth()`는 `coder`에 따라 value.length 또는 value.length/2 를 반환하므로 여전히 O(1)

```java
// 가정: coder == 0 -> LATIN1, coder == 1 -> UTF-16
public int length() {
    return (coder == LATIN1) ? value.length : (value.length >> 1);
}
```

주의점:
- `length()`는 UTF-16 코드 유닛 수를 반환하므로 이모지나 보충 평면 문자(예: U+1F600)는 `length() == 2`가 된다.
- 실제 유니코드 코드 포인트 수를 얻으려면 String.codePointCount(beginIndex, endIndex) 같은 메서드를 써야 하고 이 메서드는 보통 문자열을 스캔하므로 O(n)이 된다.
- 문자열 최대 길이는 내부 배열의 최대 크기에 의해 제한되며 실제로는 int 범위가 된다.