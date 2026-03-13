---
publish: false
draft: true
title: No.2754 학점계산
description: baekjoon, Java
author: Nine
date: 2025-12-25T04:30:00
categories:
  - 알고리즘
  - 백준
tags:
  - algorithms
  - baekjoon
  - Bronze
  - Java
id: 019ce76a-c2e7-7717-ac6c-31003a7bdc92
slug: b9f1-devlog-no2754-학점계산
---

## 📌개수 세기

| 시간 제한 | 메모리 제한 |
| ----- | ------ |
| 1 초   | 128 MB |

## 📌문제

어떤 사람의 C언어 성적이 주어졌을 때, 평점은 몇 점인지 출력하는 프로그램을 작성하시오.

```
A+: 4.3, A0: 4.0, A-: 3.7
B+: 3.3, B0: 3.0, B-: 2.7
C+: 2.3, C0: 2.0, C-: 1.7
D+: 1.3, D0: 1.0, D-: 0.7
F: 0.0
```

## 📌입력

첫째 줄에 C언어 성적이 주어진다. 성적은 문제에서 설명한 13가지 중 하나이다.

## 📌출력

첫째 줄에 C언어 평점을 출력한다.

## 📌예제

### 예제 1

#### 예제 입력 1

```
A0
```

#### 예제 출력 1

```
4.0
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

1. 각 학점은 규칙을 갖는다. `A0`: 기본 점수, `A+`: `A0`+0.3, `A-`: `A0`-0.3
2. 입력을 위한 `grade`, 출력을 위한 `score` 필드 변수 생성
3. 선제적으로 `F`에 대한 0점 처리
4. 입력 받은 학점의 0, 1자리를 각각 `letter`, `sign`으로 구분하여 케이스 처리
5. `letter`에 따라 `base` 변수를 생성해서 기본 값 할당
6. 이후 `sign`에 따라 가감한 점수를 `score`에 할당
7. `printf`를 사용해서 출력 형태에 맞게 출력.

```java
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String grade = br.readLine();
        double score;
        
        if(grade.length() == 1 && "F".equals(grade)) {
            score = 0.0;
        } else {
            char letter = grade.charAt(0);
            char sign = grade.charAt(1);
            double base;
            
            switch(letter) {
                case 'A':
                    base = 4;
                    break;
                case 'B':
                    base = 3;
                    break;
                case 'C':
                    base = 2;
                    break;
                case 'D':
                    base = 1;
                    break;
                default:
                    base = 0;
                    break;
            }
            

            if(sign == '+') score = base + 0.3;
            else if(sign == '-') score = base - 0.3;
            else score = base;
        }
        
        System.out.printf("%.1f%n", score);
    }
}
```

***

## 📌회고

그냥 Map, HashMap 등에 다 하드코딩으로 넣어두고 입력에 맞게 출력만 해도 되지만 규칙을 찾아서 확장성 있게 풀이하는 방법도 있었다.

실행 중 `StringIndexOutOfBounds` 오류가 발생했는데 JS처럼 비교 연산자를 사용한 게 문제였다. 동일성/동등성 체크도 잘하자.

* `==`
  * 원시 타입(primitive, 예: int, char 등)에 대해 값(value)을 비교한다.
  * 참조 타입(reference, 객체)에 대해선 "참조(주소) 동등성" 즉 두 변수가 같은 객체를 가리키는지(동일한 인스턴스인지) 비교한다.
* `equals(Object o)`
  * Object에 선언된 인스턴스 메서드로 "논리적 동등성"(내용 비교)을 정의하기 위해 오버라이드된다.
  * `String`, `Integer` 등 표준 클래스들은 내용을 비교하도록 `equals`를 오버라이드해둔다.
  * 기본 `Object.equals`는 `==`와 동일하게 동작(참조 비교)한다.
