---
publish: false
draft: true
title: No.5597 과제 안 내신 분..?
description: baekjoon, Java
author: Nine
date: 2025-11-17T21:00:00
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

X대학 M교수님은 프로그래밍 수업을 맡고 있다. 교실엔 학생이 30명이 있는데, 학생 명부엔 각 학생별로 1번부터 30번까지 출석번호가 붙어 있다.

교수님이 내준 특별과제를 28명이 제출했는데, 그 중에서 제출 안 한 학생 2명의 출석번호를 구하는 프로그램을 작성하시오.

## 📌입력

입력은 총 28줄로 각 제출자(학생)의 출석번호 n(1 ≤ n ≤ 30)가 한 줄에 하나씩 주어진다. 출석번호에 중복은 없다.

## 📌출력

출력은 2줄이다. 1번째 줄엔 제출하지 않은 학생의 출석번호 중 가장 작은 것을 출력하고, 2번째 줄에선 그 다음 출석번호를 출력한다.

## 📌예제

### 예제 1

#### 예제 입력 1

```
3
1
4
5
7
9
6
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
```

#### 예제 출력 1

```
2
8
```

### 예제 2

#### 예제 입력 2

```
9
30
6
12
10
20
21
11
7
5
28
4
18
29
17
19
27
13
16
26
14
23
22
15
3
1
24
25
```

#### 예제 출력 2

```
2
8
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

1. 학생 수와 미제출자 수가 명확하니 정적 체크 배열을 만든다.
    - 배열의 인덱스는 0부터 시작하는데 그걸 맞추는 것도 좋겠지만 학생 번호는 1~30이니까 간편하게 1부터 사용하고 최대 크기를 31로 잡는다.
2. 입력 값을 순회하며 1번에서 생성한 배열을 업데이트한다.
3. 1번 배열을 순회하며 값이 `false`인 것을 출력한다.

```java
import java.io.*;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        boolean[] submit = new boolean[31];
        
        // 제출자 28명을 순회하며 submit 배열 업데이트
        for(int i = 0; i < 28; i++) {
            int num = Integer.parseInt(br.readLine());
            submit[num] = true;
        }
        
        // submit 배열에서 제출하지 않은 학생 출력
        for(int i = 1; i <= 30; i++) {
            if(!submit[i]) {
                System.out.println(i);
            }
        }
    }
}
```

---
## 📌회고

주어진 문제가 명확하지만 유연하게 변동될 수 있는 걸 고민하려면 조금 더 복잡해질 수 있을 것 같다.

더 나은 방법에 대해 고민하는 건 좋은 습관이지만 그로 인해 학습이 지연된다면 과감히 넘어가자. 필요할 때 학습하는 게 더 기억에 오래 남는다.