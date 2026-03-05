---
publish: false
draft: true
title: No.2744 대소문자 바꾸기
description: baekjoon, Java
author: Nine
date: 2025-12-02T13:50:00
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

영어 소문자와 대문자로 이루어진 단어를 입력받은 뒤, 대문자는 소문자로, 소문자는 대문자로 바꾸어 출력하는 프로그램을 작성하시오.

## 📌입력

첫째 줄에 영어 소문자와 대문자로만 이루어진 단어가 주어진다. 단어의 길이는 최대 100이다.
## 📌출력

첫째 줄에 입력으로 주어진 단어에서 대문자는 소문자로, 소문자는 대문자로 바꾼 단어를 출력한다.

## 📌예제

### 예제 1

#### 예제 입력 1

```
WrongAnswer
```

#### 예제 출력 1

```
wRONGaNSWER
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

1. 입력 받은 문자열 읽기
2. 문자열을 한 글자씩 처리하기 위해 `toCharArray()` 사용
3. StringBuilder 클래스를 사용해서 변환된 문자열을 보관할 공간 마련
4. for문 안에서 `Character` 클래스의 `isUpperCase()`, `isLowerCase()`, `toUpperCase()`, `toLowerCase()` 사용하여 변환
5. StringBuilder를 문자열로 출력

```java
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        StringBuilder sb = new StringBuilder();
        
        for(char ch : line.toCharArray()) {
            if(Character.isUpperCase(ch)) {
                sb.append(Character.toLowerCase(ch));
            } else {
                sb.append(Character.toUpperCase(ch));
            }
        }
        
        System.out.println(sb);
    }
}
```

---
## 📌회고

이런 기본적인 건 할 일이 없었는데 막상 하려니 이론만 떠오르고 결국 다 검색해서 찾아봐야 했다. 클래스를 포함하는 패키지가 뭔지도 기억이 안 나서 다시 찾아보는 시간이 됐다.

검색하면 사용 방법에 대한 블로그 글도 많지만 대부분 어떤 패키지의 클래스인지 누락돼서 공식 문서 검색을 습관화하면 좋을 것 같다.
- 예: `site:docs.oracle.com BufferedReader`