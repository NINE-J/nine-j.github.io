---
publish: false
draft: true
title: No.15964 이상한 기호
description: baekjoon, Java
author: Nine
date: 2025-12-25T06:30:00
categories:
  - 알고리즘
  - 백준
tags:
  - algorithms
  - baekjoon
  - Bronze
  - Java
id: 019ce76a-c2e0-7267-b33b-30380340b154
slug: b9f1-devlog-no15964-이상한-기호
---

## 📌개수 세기

| 시간 제한 | 메모리 제한 |
| ----- | ------ |
| 1 초   | 256 MB |

## 📌문제

부산일과학고등학교의 효진이는 수학의 귀재이다. 어떤 문제라도 보면 1분 내에 풀어버린다는 학교의 전설이 내려올 정도였는데, 이런 킹ㅡ갓 효진에게도 고민이 생겼다. 대부분의 문제에서 반복되는 연산이 있었기 때문이다! 이 연산은 너무 길어서 종이에 풀던 효진이는 너무 고통스러워서, 자신이 새로 연산자를 만들기로 했다.

연산자의 기호는 ＠으로, A＠B = (A+B)×(A-B)으로 정의내리기로 했다.

하지만, 효진이는 막상 큰 숫자가 들어오자 계산하기 너무 귀찮아졌다.

효진이를 도와 정수 A, B가 주어지면 A＠B를 계산하는 프로그램을 만들어주자!

## 📌입력

첫째 줄에 A, B가 주어진다. (1 ≤ A, B ≤ 100,000)

## 📌출력

첫째 줄에 A＠B의 결과를 출력한다.

## 📌서브태스크 1 (30점)

* A, B ≤ 1,000

## 📌서브태스크 2 (70점)

문제에서 주어진 제약 조건 외 제한 없음

## 📌예제

### 예제 1

#### 예제 입력 1

```
4 3
```

#### 예제 출력 1

```
7
```

### 예제 2

#### 예제 입력 2

```
3 4
```

#### 예제 출력 2

```
-7
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

1. 첫 줄을 읽고 `split`을 사용해 두 항을 얻는다.
2. 킹ㅡ갓 효진쓰의 연산자를 적용한다.

```java
import java.io.*;
  
public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String[] arr = br.readLine().split(" ");
        long n = Long.parseLong(arr[0]);
        long m = Long.parseLong(arr[1]);
  
        System.out.println((n + m) * (n - m));
    }  
}
```

***

## 📌회고

`StringTokenizer`는 레거시 코드가 됐지만 성능면에서 `split` 보다 좋은 경우가 있어서 알고리즘 풀이에서 가끔 사용된다.

### 서브태스크 문제

서브태스크 문제가 뭔지 몰라서 찾아봤다.

> [https://www.acmicpc.net/board/view/102295](https://www.acmicpc.net/board/view/102295)
>
> 문제의 태그를 보시면 "서브태스크"라는 것이 달려 있습니다. 이는 문제의 제한이 하나로 설정된 것이 아니라 각기 다른 제한을 가진 서브태스크들이 있고 이 서브태스크 내의 모든 케이스를 통과하면 그 서브태스크에 분배된 만큼의 점수를 획득하게 된다는 의미입니다.
>
> 이 코드를 제출해서 받으신 "시간"은 **통과된 서브태스크들 중** 가장 오래 걸린 시간을 의미합니다. 통과하지 못한 서브태스크에 대해서는 아예 계산되지 않고, 그 서브태스크를 통과하지 못한 이유가 시간 초과라면 이 코드가 100점을 받지 못하는 이유는 여전히 시간이 너무 오래 걸렸기 때문입니다. 각 서브태스크에 대한 채점 결과는 제출한 코드를 열어보시면 밑에 나와있습니다.
>
> 다른 사람들이 이 코드보다 시간이 오래 걸렸음에도 100점을 받는 것은 당연합니다. 그 코드들은 모든 서브태스크를 통과했으므로 제한이 가장 큰 서브태스크의 시간이 코드의 시간으로 기록되었을 것인데, 이 코드는 이 서브태스크에서 아예 주어진 시간 내에 실행되지 못해 시간 초과를 받았기 때문입니다.

문제의 제약 조건외 제한이 없다고 하니 범위인가 싶어서 `int`를 `long`으로 변경하니까 100점 됐다.

* `int`
  * 32bit(=4byte)
  * 정수를 나타내는 데이터 타입
  * 범위: -2147483648 \~ 2147483647 (약 $\pm$ 21억, $(2^{31}-1)$ 범위)
* `long`
  * 64bit(=8byte)
  * 정수를 나타내는 데이터 타입
  * 범위: -9223372036854775808 \~ 9223372036854775807 (약 $\pm$ 922경, $(2^{63}-1)$ 범위)
  * int형에 비해 많은 메모리를 필요로 하고 느린 속도

### 문자열에서 문자를 얻는 방법

다양한 방법이 있는데 깔끔하고 기억하기 편한 걸로 사용하면 되겠다.

#### 1. split + charAt

```java
String[] parts = line.trim().split(" "); // 또는 정규식 "\\s+"
char s1 = parts[0].charAt(0);
char s2 = parts[1].charAt(0);
```

#### 2. StringTokenizer

레거시 코드인 점을 주의하자.

```java
StringTokenizer st = new StringTokenizer(line);
char t1 = st.nextToken().charAt(0);
char t2 = st.nextToken().charAt(0);
```

#### 3. 공백 제거 후 toCharArray

```java
char[] arr = line.replace(" ", "").toCharArray();
```

#### 4. 스트림에서 직접 문자 읽기

입력 포맷이 정확할 때 사용할 수 있다.

```java
InputStreamReader isr = new InputStreamReader(System.in);
int c1 = isr.read();
isr.read(); // 공백 건너뛰기
int c2 = isr.read();
```
