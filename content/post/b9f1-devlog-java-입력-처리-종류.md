---
publish: true
draft: false
title: Java 입력 처리 종류
description: 간단한 사용법과 성능
author: Nine
date: 2025-12-02 14:40:41
categories:
  - Java
  - 문법
tags:
  - devlog
  - Java
  - Syntax
  - 문법
# image: 
Status: ToDo
id: 019ce76a-c30b-7488-acca-bfb25eff8888
slug: b9f1-devlog-java-입력-처리-종류
---

## 📌개요

백준 같은 온라인 저지(Judge)에서 알고리즘 풀이 중 계속해서 입력 받는 부분을 작성하게 되는데 간편한 사용이 가능한 클래스부터 성능을 고려한 클래스까지 어떤 종류가 있는지 간략하게 정리해보자.

## 📌내용

### 문제

알고리즘 문제를 풀 때 입력은 빈번히 반복되는 부분이지만 입력 방식에 따라 개발 생산성과 실행 성능이 크게 달라진다.

따라서 편의성과 성능 사이에서 적절한 타협을 선택하거나 목적에 맞는 방식을 알고 있어야 한다.

### 제약

* 입력 타입: 표준 입력(System.in), 파일, 콘솔(Console) 등 환경에 따라 차이가 있다.
* 입력량: 몇 KB 정도의 작은 입력 vs 수백 MB 이상의 대용량에서 성능 요구가 다름
* 실행 환경: IDE 콘솔, 온라인 저지(예: 백준), 터미널, 서버 환경에 따라 콘솔 지원 및 리다이렉션 동작이 다름
* 예외 처리 및 문자 인코딩 처리 필요(주로 UTF-8)

### 주요 기법 및 사용법 요약

사용 편의성이 좋은 것부터 사용은 다소 복잡하지만 성능이 좋은 순서로 대표적인 방법들을 정리한다.

#### 1. Java.util.Scanner

가장 접근성이 높다. 사용하기 간편하다.

* 장점: 직관적인 API(nextInt, nextLine 등) 토큰화/정규식 지원.
* 단점: 많은 토큰 처리 시 느림
* 사용 목적 및 추천 상황
  * 학습용, 빠른 프로토타이핑, 문제 풀이 연습 초반
  * 입력이 적고 성능 요구가 낮은 간단한 스크립트나 도구
  * 코드 가독성이 중요하고 입력량이 작을 때
* 사용 예사:
  ```java
  Scanner sc = new Scanner(System.in);
  int n = sc.nextInt();
  String s = sc.next();
  sc.close();
  ```

#### 2. java.io.Console

* 장점: readLine, readPassword 제공. 콘솔 전용으로 편리
* 단점: IDE에서는 `System.console()`이 null일 수 있음.
* 사용 목적 및 추천 상황
  * 터미널에서 인터랙티브하게 사용자 입력을 받을 때(예: CLI 앱)
  * 비밀번호 입력처럼 마스킹이 필요한 경우
  * 자동 채점/리다이렉션되는 환경에서는 사용 불가하거나 제한적
* 사용 예시:
  ```java
  Console console = System.console();
  if(console != null) {
      String u = console.readLine("user: ");
      char[] pw = console.readPassword("pwd: ");
  }
  ```

#### 3. BufferedReader + InputStreamReader

실무/중간 성능의 텍스트 입력

* 장점: 라인 단위 처리에 적합하고 Scanner보다 빠르다.
* 단점: 토큰화는 직접 처리해야 한다.(String.split, StringTokenizer 등)
* 사용 목적 및 추천 상황:
  * 라인 단위 입력 처리나 로그/파일을 파싱할 때
  * 온라인 저지에서 Scanner로 TLE가 날 때 첫 번째로 바꿔볼 옵션
    * TLE: Time Limit Exceeded
  * 가독성과 성능의 균형이 필요할 때
* 사용 예시:
  ```java
  BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
  String line = br.readLine();
  int x = Integer.parseInt(line.trim());
  ```

#### 4. BufferedReader + String.split / Pattern

> StringTokenizer alternative

* 장점: Pattern을 미리 컴파일하면 반복 분할해서 성능 이점을 얻을 수 있다.
* 단점: 메모리 할당이 많다.
* 사용 목적 및 추천 상황:
  * 한 줄 단위로 여러 토큰을 빠르게 얻고 싶을 때
  * 분리 규칙이 단순하거나 정규식 처리로 충분할 때
* 사용 예시:
  * 간단한 공백 분리
    ```java
    String[] parts = br.readLine().trim().split("\\s+");
    int a = Integer.parseInt(parts[0]);
    ```
  * Pattern 재사용으로 성능 개선:
    ```java
    import java.util.regex.Pattern;
    Pattern WS = Pattern.compile("\\s+");
    String[] toks = WS.split(line.trim()); // 재사용 가능한 패턴
    ```

> \[!WARNING]
> split은 라인 길이가 매우 긴 경우 또는 자주 호출되는 경우 메모리 할당을 많이 할 수 있으므로 성능이 극히 중요한 경우에는 custom token parser 또는 FastScanner가 더 적절하다.

#### 5. BufferedInputStream + custom FastScanner

바이트 기반 고성능

* 장점: 바이트 단위 버퍼링 후 직접 숫자 파싱, 최대 성능.
* 단점: 구현이 길고 디버깅이 어렵다. 가독성이 저하된다.
* 사용 목적 및 추천 상황:
  * 입력 크기가 매우 크고 파싱 오버헤드로 인해 시간초과가 발생하는 문제
  * 온라인 대회의 시간 제한이 촉박한 경우
  * 표준 입력으로부터 매우 빠른 연속 파싱이 필요한 경우
* 사용 예시:

```java
class FastScanner {
    private final BufferedInputStream in = new BufferedInputStream(System.in);
    private final byte[] buf = new byte[1 << 16];
    private int ptr = 0, len = 0;
    private int read() throws IOException { ... }
    public int nextInt() throws IOException { ... }
}
```

#### 6. java.nio (Files.readAllBytes, FileChannel, MappedByteBuffer)

파일 전체 읽기/메모리 매핑

* 장점: 대용량 파일 처리에 강력하다. 특히 메모리 매핑
* 단점: 복잡도 증가, 표준 입력 스트림을 메모리맵으로 직접 사용하는 건 제한적
* 사용 목적 및 추천 상황:
  * 파일 기반 문제에서 파일 전체를 메모리에 올려 처리해도 메모리에 부담이 없는 경우
  * 매우 큰 파일을 고속으로 처리해야 하며 파일 I/O 병목이 주요 이슈일 때
  * 표준 입력으로 들어오는 데이터가 아니라 로그 프로세싱, 대규모 데이터 처리 등
* 사용 예시:
  ```java
  byte[] b = Files.readAllBytes(Path.of("input.txt"));
  String s = new String(b, StandardCharsets.UTF_8);
  ```

#### 7. DataInputStream

바이너리 입력 전용, 네트워크/파일 등에서 이진 포맷 고정 비트 구조의 정수/실수 읽기

* 텍스트 파싱에는 부적합하다.
* 사용 목적 및 추천 상황:
  * 바이너리 형식으로 저장된 데이터(예: 프로토콜 버퍼가 아닌 단순 고정 포맷)를 읽을 때
  * 텍스트 기반 문제(숫자나 문자열)에는 사용하지 않음
* 사용 예시:

```java
DataInputStream dis = new DataInputStream(new BufferedInputStream(System.in));
int x = dis.readInt(); // 4바이트 이진 정수 읽기
```

### 유사 기술 비교

#### Scanner vs BufferedReader

Scanner는 편하지만 내부 토큰화와 형 변환에서 오버헤드가 크다. 큰 입력에선 TLE 발생 가능
BufferedReader + split/Pattern 또는 FastScanner가 보통 더 빠르다.

#### BufferedInputStream(FastScanner) vs NIO

둘 다 빠르지만 NIO의 메모리 매핑은 파일 기반 대용량 처리에서 더 유리하다.
표준 입력 처리엔 바이트 기반 FastScanner가 실용적이다.

## 🎯결론

간략하게 Java 입력 처리 방식을 알아봤다.
입력 방식은 상황에 따라 골라 써야 할 것 같다.

* 간단/편의성 우선: Scanner, Console
* 안정적/중간 성능: BufferedReader + split/Pattern
* 최고 성능(대용량/경쟁 프로그래밍): BufferedInputStream + FastScanner 또는 NIO 메모리 매핑

각 방식 안에서도 성능 차이나 다양한 상황 등 자세한 건 다른 글로 다뤄봐야겠다.

> \[!TIP]
>
> * 성능 최적화는 FastScanner처럼 가독성, 유지보수성을 희생할 수 있다.
> * 환경에 따라 Console이 없을 수 있고 System.in을 닫지 않거나 잘못 처리하면 의도치 않은 동작이 발생할 수 있다.

## ⚙️EndNote

### 사전 지식

* Java 기본 문법 (클래스, 예외, 스트림)
* 표준 입출력 스트림의 개념(`System.in`/`System.out`)
* 기본 자료형과 문자열 파싱(Integer.parseInt 등)
* 예외 처리(IOException)

### 더 알아보기

* Oracle JavaDocs
  * Scanner: [https://docs.oracle.com/javase/8/docs/api/java/util/Scanner.html](https://docs.oracle.com/javase/8/docs/api/java/util/Scanner.html)
  * BufferedReader: [https://docs.oracle.com/javase/8/docs/api/java/io/BufferedReader.html](https://docs.oracle.com/javase/8/docs/api/java/io/BufferedReader.html)
  * InputStreamReader: [https://docs.oracle.com/javase/8/docs/api/java/io/InputStreamReader.html](https://docs.oracle.com/javase/8/docs/api/java/io/InputStreamReader.html)
  * Console: [https://docs.oracle.com/javase/8/docs/api/java/io/Console.html](https://docs.oracle.com/javase/8/docs/api/java/io/Console.html)
  * Files.readAllBytes: [https://docs.oracle.com/javase/8/docs/api/java/nio/file/Files.html#readAllBytes-java.nio.file.Path-](https://docs.oracle.com/javase/8/docs/api/java/nio/file/Files.html#readAllBytes-java.nio.file.Path-)
  * FileChannel.map (MappedByteBuffer): [https://docs.oracle.com/javase/8/docs/api/java/nio/channels/FileChannel.html#map-java.nio.channels.FileChannel.MapMode-long-long-](https://docs.oracle.com/javase/8/docs/api/java/nio/channels/FileChannel.html#map-java.nio.channels.FileChannel.MapMode-long-long-)
  * DataInputStream: [https://docs.oracle.com/javase/8/docs/api/java/io/DataInputStream.html](https://docs.oracle.com/javase/8/docs/api/java/io/DataInputStream.html)
* 라이브러리/툴
  * picocli (어노테이션 기반 CLI): [https://picocli.info/](https://picocli.info/)
  * Apache Commons CLI: [https://commons.apache.org/proper/commons-cli/](https://commons.apache.org/proper/commons-cli/)
  * JCommander: [https://jcommander.org/](https://jcommander.org/)
* 튜토리얼/아티클
  * Fast I/O in Java (Competitive Programming) — GeeksforGeeks: [https://www.geeksforgeeks.org/fast-io-in-java-in-competitive-programming/](https://www.geeksforgeeks.org/fast-io-in-java-in-competitive-programming/)
  * Java I/O 성능 비교 및 팁 모음 — 다양한 블로그/커뮤니티 글(검색 키워드: "Java fast input Scanner vs BufferedReader vs FastScanner")
