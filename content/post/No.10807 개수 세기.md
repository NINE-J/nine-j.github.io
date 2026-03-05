---
publish: false
draft: true
title: No.10807 개수 세기
description: baekjoon, Java
author: Nine
date: 2025-11-17T19:00:00
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

총 N개의 정수가 주어졌을 때, 정수 v가 몇 개인지 구하는 프로그램을 작성하시오.

## 📌입력

첫째 줄에 정수의 개수 N(1 ≤ N ≤ 100)이 주어진다. 둘째 줄에는 정수가 공백으로 구분되어져있다. 셋째 줄에는 찾으려고 하는 정수 v가 주어진다. 입력으로 주어지는 정수와 v는 -100보다 크거나 같으며, 100보다 작거나 같다.

## 📌출력

첫째 줄에 입력으로 주어진 N개의 정수 중에 v가 몇 개인지 출력한다.

## 📌예제

### 예제 1

#### 예제 입력 1

```
11
1 4 1 2 4 2 4 2 3 4 4
2
```

#### 예제 출력 1

```
3
```

### 예제 2

#### 예제 입력 2

```
11
1 4 1 2 4 2 4 2 3 4 4
5
```

#### 예제 출력 2

```
0
```

## 📌풀이

### import

```java
import java.io.*;
import java.util.StringTokenizer;
```

`BufferedReader`, `InputStreamReader`, `IOException` 등 I/O 관련 클래스를 임포트한다.
편리하게 와일드 카드를 사용하는 방법도 있고 익숙해지고 싶은 건 명시적으로 임포트하자.

>[!INFO]
>==명시적 임포트와 와일드카드 임포트의 성능 차이는 **거의 없으며**==, 런타임 성능에는 영향을 주지 않습니다. 컴파일 시점에는 와일드카드 임포트가 컴파일러가 클래스 이름을 검색해야 하므로 컴파일 속도가 약간 느려질 수 있습니다. 하지만 최종적으로 생성되는 바이트 코드에는 차이가 없어, 실행 속도는 동일합니다.

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

```java
import java.io.*;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        
        // 입력의 한 줄씩 소비하며 필요한 데이터로 파싱
        int numberCount = Integer.parseInt(br.readLine());
        StringTokenizer st = new StringTokenizer(br.readLine());
        int v = Integer.parseInt(br.readLine());
        
        // 두 번째 줄 정수들을 순회하며 v와 일치하는 정수 카운트
        int count = 0;
        for(int i = 0; i < numberCount; i++) {
            if(Integer.parseInt(st.nextToken()) == v) {
                count++;
            }
        }
        
        System.out.println(count);
    }
}
```

---
## 📌회고

알고리즘 풀이는 결국 `암기 + 문제 해결`이라고 생각한다.
문제를 통으로 외우라는 의미가 아니라 자주 사용되는 클래스, 메서드, 패턴 등은 어쩔 수 없이 암기가 된다.

다양한 방식을 고민하지 않고 암기한 것으로만 문제 해결에 도전한다면 무차별 대입(Brute Force)으로 어렵게 해결해야 하겠지만 되긴 된다는 것도 또 하나의 매력(?)

결론: 똑똑하게 사고하자.

### 왜 BufferedReader를 사용했나?

온라인 코딩 테스트에서 입력 크기가 커질 가능성이 있는 문제를 풀 때 입력 파싱 성능은 전체 실행 시간에 큰 영향을 미친다.

`Scanner`는 편리하지만 내부적으로 정규식 기반 토큰화를 사용하고 여러 객체를 생성하므로 작업 비용이 비교적 크다.

반면 `BufferedReader`는 라인 단위 또는 바이트 스트림으로 묶어서 읽어온 뒤 `StringTokenizer` 또는 수동 파싱으로 처리하면 메모리/객체 생성량을 줄여 GC 부담을 낮추고 실행 속도를 향상시킬 수 있다.

>[!abstract]
>Java 입출력과 파싱의 종류는 굉장히 많다. 아직 필요하지 않은데 학습하고 기록하는 건 비효율적이라고 생각한다.
>
>- 입력 크기가 크고 제한 시간이 타이트한 경우가 많으므로 입력 파싱 성능을 우선한다.
>- `BufferedReader` + `StringTokenizer` 조합은 `Scanner` 보다 일반적으로 더 빠르고 경량이다.
>
>이후 더 높은 성능이 필요하다면 `BufferedInputStream` 등을 더 찾아보자.