---
publish: false
draft: true
title: No.2738 행렬 덧셈
description: baekjoon, Java
author: Nine
date: 2025-11-19T12:50:00
categories:
  - 알고리즘
  - 백준
tags:
  - algorithms
  - baekjoon
  - Bronze
  - Java
id: 019ce76a-c2e3-711d-8367-5722851917e4
slug: b9f1-devlog-no2738-행렬-덧셈
---

## 📌행렬 덧셈

| 시간 제한 | 메모리 제한 |
| ----- | ------ |
| 1 초   | 128 MB |

## 📌문제

`N*M`크기의 두 행렬 A와 B가 주어졌을 때, 두 행렬을 더하는 프로그램을 작성하시오.

## 📌입력

첫째 줄에 행렬의 크기 N 과 M이 주어진다. 둘째 줄부터 N개의 줄에 행렬 A의 원소 M개가 차례대로 주어진다. 이어서 N개의 줄에 행렬 B의 원소 M개가 차례대로 주어진다. N과 M은 100보다 작거나 같고, 행렬의 원소는 절댓값이 100보다 작거나 같은 정수이다.

## 📌출력

첫째 줄부터 N개의 줄에 행렬 A와 B를 더한 행렬을 출력한다. 행렬의 각 원소는 공백으로 구분한다.

## 📌예제

### 예제 1

#### 예제 입력 1

```
3 3
1 1 1
2 2 2
0 1 0
3 3 3
4 4 4
5 5 100
```

#### 예제 출력 1

```
4 4 4
6 6 6
5 6 100
```

## 📌풀이

### import

```java
import java.io.*;
import java.util.StringTokenizer;
```

`BufferedReader`, `InputStreamReader`, `IOException` 등 I/O 관련 클래스를 임포트한다.
편리하게 와일드 카드를 사용하는 방법도 있고 익숙해지고 싶은 건 명시적으로 임포트하자.

> \[!INFO]
> \==명시적 임포트와 와일드카드 임포트의 성능 차이는 **거의 없으며**==, 런타임 성능에는 영향을 주지 않습니다. 컴파일 시점에는 와일드카드 임포트가 컴파일러가 클래스 이름을 검색해야 하므로 컴파일 속도가 약간 느려질 수 있습니다. 하지만 최종적으로 생성되는 바이트 코드에는 차이가 없어, 실행 속도는 동일합니다.

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

1. 처음 N, M이 주어지는 것을 체크
2. 1에 대한 입력이 N=3, M=3 이라고 가정하면 N개의 행이 두 번 총 6행, 각 행에는 3개의 원소가 있을 것이다.
3. 1행과 4행, 2행과 5행, 3행과 6행 각 원소의 합을 새로운 행렬로 출력

```java
import java.io.*;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine(), " ");
        int n = Integer.parseInt(st.nextToken());
        int m = Integer.parseInt(st.nextToken());
        
        int[][] a = new int[n][m];
        for(int i = 0; i < n; i++) {
            st = new StringTokenizer(br.readLine(), " ");
            for(int j = 0; j < m; j++) {
                a[i][j] = Integer.parseInt(st.nextToken());
            }
        }
        
        StringBuilder sb = new StringBuilder();
        for(int i = 0; i < n; i++) {
            st = new StringTokenizer(br.readLine(), " ");
            for(int j = 0; j < m; j++) {
                int val = a[i][j] + Integer.parseInt(st.nextToken());
                sb.append(val);
                if(j < m-1) sb.append(" ");
            }
            sb.append("\n");
        }
        System.out.println(sb.toString());
        br.close();
    }
}
```

***

## 📌회고

`StringBuilder`는 `java.lang` 패키지에 속해 있고, `java.lang` 패키지는 자바 컴파일러가 자동으로 임포트한다.

이차원 배열을 사용하는 게 맞는지 의문이었는데 일단 문제를 푸는 게 목적이니까 더 좋은 방법을 구상하기 전에 문제를 풀 수 있는 방법부터 시도해야 한다.
