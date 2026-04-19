---
publish: true
draft: false
title: "Java 실행 환경: JVM 메모리 구조의 이해"
description: JVM 메모리 구조의 이해하고 Java를 실행하자.
author: Nine
date: 2025-04-06T00:00:00
categories:
  - Java
  - 런타임
tags:
  - devlog
# image: 
Status: Done
id: 019ce76a-c240-726f-8c09-f00cc2607d65
slug: b9f1-devlog-java-실행-환경-jvm-메모리-구조의-이해
---

## 📌개요

자바 소스 코드를 실행하는 JVM의 메모리 구조를 알아본다.
JVM은 자바 프로그램을 실행하기 위한 가상 머신으로, 플랫폼 독립성을 제공하며 메모리 관리, 스레드 동기화, 가비지 컬렉션 등의 기능을 수행한다.

## 📌내용

### Java 소스 실행

자바 소스 코드는 `.java` 파일로 저장되며, 이를 실행하기 위해 자바 컴파일러 `javac`가 바이트 코드(Byte code) `.class` 파일로 변환하게 된다.

바이트 코드는 JVM이 이해할 수 있는 중간 표현으로, 플랫폼 독립성을 제공한다.
바이트 코드로 변환하는 이유는 다음과 같다.

* **보안성**: 소스 코드를 직접 노출하지 않고 바이트 코드로 변환함으로써 코드의 내용을 보호할 수 있다.
* **효율성**: 컴파일 시 문법 검사와 최적화를 거치므로, 실행 시 추가적인 문법 검사가 필요 없어 시간이 절약된다.
* **플랫폼 독립성:** 바이트 코드는 JVM이 설치된 어떤 플랫폼에서든 실행 가능하다.

그러나 이 방식은 소스 코드가 변경될 때마다 컴파일을 하고 실행 시켜야 되기 때문에 초기 빌드 시간이 길어질 수 있다.

컴파일된 `.class` 파일은 클래스 로더(Class Loader)에 의해 JVM 메모리 영역인 런타임 데이터 영역(Runtime Data Area)로 로드된다.

이후 실행 엔진(Execution Engine)이 바이트 코드를 실행 가능한 기계어로 변환하여 프로그램을 실행한다.

### JVM 메모리 구조

JVM은 자바 프로그램을 실행할 때 메모리를 다음과 같은 주요 영역으로 나눠 관리한다.
각 영역은 특정 데이터를 저장하고 스레드 간 공유 여부나 가비지 컬렉션 대상 여부에 따라 역할이 나뉜다.

![](/assets/images/Drawing%20Java-Memory-Structure-JVM%202025-04-06%2016.41.26.excalidraw.png)

| 메모리 영역                                | 설명                                         | 특징                           |
| ------------------------------------- | ------------------------------------------ | ---------------------------- |
| **메소드 영역 (Method Area)**              | 클래스 정보, 정적 변수, 상수, 메서드 데이터, 바이트 코드 등이 저장됨. | 모든 스레드가 공유. JVM 시작 시 생성.     |
| **힙 (Heap)**                          | 객체와 배열 같은 동적 데이터가 저장됨.                     | 가비지 컬렉션(GC)이 관리. 모든 스레드가 공유. |
| **스택 (Stack)**                        | 메서드 호출 시 지역 변수, 매개변수, 호출 정보(리턴 주소 등)가 저장됨. | 스레드별 생성. LIFO 구조.            |
| **PC 레지스터 (PC Register)**             | 현재 실행 중인 JVM 명령어의 주소를 저장.                  | 스레드별 생성. 매우 빠른 접근.           |
| **네이티브 메소드 스택 (Native Method Stack)** | 네이티브 메서드 호출 시 사용되는 스택. C/C++ 코드 실행 시 활용.   | 스레드별 생성.                     |

### Method Area

JVM이 시작될 때 생성되며, 프로그램 종료 시까지 유지된다.
바이트 코드가 이 영역에 저장된다.

* 저장 데이터:
  * **클래스 정보**: 클래스 구조, 메서드, 필드 등의 메타데이터
  * **정적 변수(`static`)**: 클래스의 정적 멤버 변수
  * **상수 풀**: 문자열 리터럴, `final` 변수 등
  * **메서드 바이트 코드**: 컴파일된 메서드 코드.

Java 8 이후 `Metaspace`로 대체되었으며, 이는 네이티브 메모리를 사용하여 동적으로 확장 가능하다.
모든 스레드가 공유하므로 동기화가 필요할 수 있다.

### Heap

동적으로 생성된 객체와 배열이 저장되는 영역이다.
`new` 키워드로 생성된 모든 인스턴스는 힙에 할당된다.

해당 객체가 소멸되기 전이나 GC(Garbage Collector)가 정리하기 전까지 유지되는 영역으로 쉽게 소멸되는 데이터가 아니다.

* GC의 대상이 되는 공간이며 효율적인 GC를 실행하기 위해서 5가지 영역으로 나뉘게 된다.
  * **Young Generation**:
    * **Eden Space**: 새 객체가 처음 생성되는 곳
    * **Survivor Spaces**(S0, S1): Minor GC 후 살아남은 객체가 이동
  * **Old Generation**(Tenured): 오래된 객체가 저장됨.
  * **Permanent Generation**(Java 7까지, 이후 Metaspace로 대체): 클래스 메타데이터 저장
* 힙은 GC의 주요 대상이며, 더 이상 참조되지 않는 객체를 정리하여 메모리를 회수한다.
  * Minor GC: Young Generation에서 발생
  * Major/Full GC: Old Generation과 전체 힙을 대상으로 함

모든 스레드가 공유하므로 동기화가 필요하다.

### Stack

각 스레드마다 독리적으로 생성되며, 메서드 호출 시마다 프레임(Frame)이 생성되어 스택에 쌓인다.

* 프레임 구성:
  * 지역 변수 배열: 메서드의 지역 변수와 매개변수
  * 피연산자 스택: 연산 중간 결과 저장
  * 프레임 데이터: 메서드 호출 정보(리턴 주소 등)

메서드 호출이 종료되면 해당 프레임이 스택에서 제거되고, 지역 변수는 소멸된다.
참조형 변수(예: 객체 참조)는 스택에 저장되지만, 실제 객체는 힙에 저장된다.

스레드별로 독립적이므로 동기화가 필요 없다.

### PC Register

* 스레드별로 생성되며, 현재 실행 중인 JVM 명령어의 주소를 저장한다.
* JVM이 명령어를 실행할 때 다음에 실행할 명령어 위치를 추적한다.
* 스레드가 실행 중단(예: 컨텍스트 스위칭) 시 현재 상태를 저장하여 재개 시 올바른 위치에서 실행을 계속할 수 있다.

### Native Method Stack

* Java가 아닌 네이티브 언어(`C`, `C++` 등)로 작성된 메서드를 실행할 때 사용된다.
* JNI(Native Method Interface)를 통해 호출된 네이티브 메서드의 호출 스택을 관리한다.
* 스레드별로 독립적으로 생성된다.

### Execution Engine

클래스 로더가 로드한 바이트 코드를 실행 가능한 기계어로 변환하여 실행한다.

* 구성:
  * **Interpreter**: 바이트 코드를 한 줄씩 해석하여 실행. 초기 실행 속도는 빠르지만 반복 실행 시 비효율적
  * **JIT(Just-In-Time) Compiler**: 자주 실행되는 코드를 런타임에 기계어로 컴파일하여 캐싱. 이후 실행 속도가 빨라진다.
  * **Garbage Collector**: 더 이상 참조되지 않는 객체를 힙에서 제거한다.

힙과 Method Area는 스레드 간 공유되므로 동기화 매커니즘이 필요하다.
`synchronized` 키워드나 `Lock` 객체를 사용하여 동기화 처리.

### Native Method Interface (JNI)

Java 코드와 네이티브 코드(`C`/`C++` 등) 간의 인터페이스를 제공하는 프레임워크.
성능 최적화, 기존 `C` 라이브러리 활용하는 용도이다.

* Java 코드에서 `native` 키워드로 선언된 메서드를 호출
* JNI가 해당 네이티브 메서드를 찾아 실행
* 네이티브 메서드는 네이티브 메소드 스택을 사용하여 실행

### Native Method Libraries

JNI가 호출하는 네이티브 메서드의 구현체가 포함된 라이브러리.

* `.dll` (Windows), `.so` (Linux) 등의 동적 라이브러리 형태로 제공
* JVM은 `System.loadLibrary()`를 통해 필요한 라이브러리를 로드한다.

### Java의 실행과 각 메모리 영역

Java 프로그램의 생명 주기를 단계별로 살펴보며 각 메모리 영역이 어떻게 활용되는지 분석한다.

1. **소스 코드 작성 및 컴파일**:
   * `.java` 파일을 작성하고 `javac`로 컴파일하여 `.class` 파일(바이트 코드) 생성.
   * 바이트 코드는 플랫폼 독립적이며, JVM이 이해할 수 있는 중간 언어.
2. **Class Loading**:
   * Class Loader가 `.class` 파일을 읽어 Method Area에 클래스 정보(메타 데이터, 바이트 코드 등)를 로드한다.
   * 정적 변수(`static`)도 Method area에 할당한다.
3. **프로그램 실행**:
   * Execution Engine이 바이트 코드를 해석/컴파일하여 실행한다.
   * `main` 메서드 호출 시 스레드가 생성되고, 해당 스레드의 Stack에 `main` 메서드 프레임이 생성된다.
   * PC Register는 현재 실행 중인 명령어 주소를 추적한다.
4. **객체 생성**:
   * `new` 키워드로 객체를 생성하면 Heap에 객체가 할당된다.
   * 객체 참조는 Stack의 지역 변수로 저장된다.
5. **메서드 호출**:
   * 메서드 호출 시 새로운 프레임이 Stack에 추가된다.
   * 지역 변수와 매개변수는 프레임 내에 저장된다.
   * 메서드 종료 시 프레임이 제거되고 지역 변수는 소멸된다.
6. **스레드 동기화**:
   * 여러 스레드가 Heap 또는 Method Area에 데이터를 공유할 경우 동기화 필요
   * 예: `synchronized` 블록을 사용하여 공유 자원에 대한 접근 제어.
7. **가비지 컬렉션**:
   * 더 이상 참조되지 않는 객체를 `Heap`에서 제거한다.
   * Young Generation에서 자주 발생하는 Minor GC와 전체 힙을 대상으로 하는 Full GC로 나뉜다.
8. **네이티브 메서드 호출**:
   * `native` 메서드 호출 시 JNI를 통해 네이티브 코드를 실행한다.
   * Native Method Stack에 호출 정보 저장
   * Native Method Libraries에서 해당 메서드 구현체 실행

### 효율적인 메모리 관리 전략

1. **Heap 메모리 최적화**:
   * 불필요한 객체 생성을 최조화
   * 객체 풀(Object Pool)을 사용하여 자주 생성/소멸되는 객체 재사용.
   * 적절한 GC 튜닝(예: `-Xms`, `-Xmx`로 초기/최대 힙 크기 설정)
2. **Stack 메모리 관리**:
   * 깊은 재귀 호출을 피하여 StackOverflowError 방지
   * 지역 변수 사용을 최소화하고, 불필요한 변수 선언 줄이기
3. **Method Area 관리**:
   * 클래스 로딩 최소화: 불필요한 클래스 로딩 방지
   * Metaspace 크기 조정 (예: `-XX:MaxMetaspaceSize` 옵션)
4. **가비지 컬렉션 최적화**:
   * Young/Old Generation 크기 조정
   * 적절한 GC 알고리즘 선택 (예: G1GC, CMS)
   * 메모리 누수 방지: 강한 참조(Strong Reference) 대신 약한 참조(Weak Reference) 사용
5. **네이티브 메모리 관리**:
   * 네이티브 메서드 호출 시 메모리 누수 주의
   * JNI로 할당된 네이티브 메모리를 적절히 해제

## 📌Java 실행 예제

> \[!info] Native Method Libraries
> Native Method Libraries는 JDK에 포함된 기본 라이브러리가 아니라 사용자가 별도로 작성하거나 서드파티 라이브러리로 제공 받아야 하는 네이티브 라이브러리다.

### 프로젝트 생성

Windows에서 Gradle, Java 17, Groovy 프로젝트 생성 후 테스트할 예정이다.
`com.java.JVMMemoryExample` 클래스를 생성한다.

```java
import java.util.ArrayList;
import java.util.List;

public class JVMMemoryExample {
    // 정적 변수: Method Area에 저장됨
    private static int staticCounter = 0;

    // 인스턴스 변수: Heap에 저장됨 (객체가 생성될 때)
    private String message;

    public JVMMemoryExample(String message) {
        this.message = message;
    }

    // 메서드: Method Area에 바이트 코드로 저장됨
    public synchronized void incrementCounter() {
        // 지역 변수: Stack에 저장됨
        int localVar = 10;
        // 동기화: Heap/Method Area의 공유 자원(staticCounter)에 접근
        staticCounter += localVar;
        System.out.println(Thread.currentThread().getName() + " - Counter: " + staticCounter);
    }

    // 네이티브 메서드 선언: JNI를 통해 호출
    public native void callNativeMethod();

    // 네이티브 라이브러리 로드: Native Method Libraries에서 로드
    static {
        System.loadLibrary("NativeLib");
    }

    public static void main(String[] args) {
        System.out.println("프로그램 시작 - VisualVM 연결을 위해 15초 대기...");
        sleep(15000); // VisualVM 연결 시간 확보

        System.out.println("1. 객체 생성 단계 시작 (5초 간격)");
        List<JVMMemoryExample> examples = new ArrayList<>();
        for (int i = 0; i < 83; i++) {
            examples.add(new JVMMemoryExample("Object-" + i));
            if (i % 20 == 0) { // 20개마다 일시 정지
                System.out.println("  생성된 객체: " + (i+1) + "개, 5초 대기...");
                sleep(5000);
            }
        }

        System.out.println("2. 개별 객체 생성 및 스레드 시작 (10초 대기)");
        JVMMemoryExample example1 = new JVMMemoryExample("Hello");
        JVMMemoryExample example2 = new JVMMemoryExample("World");
        sleep(5000); // 객체 생성 후 대기

        JVMMemoryExample finalExample = example1;
        Thread t1 = new Thread(finalExample::incrementCounter, "Thread-1");

        JVMMemoryExample finalExample1 = example2;
        Thread t2 = new Thread(finalExample1::incrementCounter, "Thread-2");

        t1.start();
        t2.start();

        try {
            t1.join();
            t2.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("3. 네이티브 메서드 호출 전 10초 대기...");
        sleep(10000);

        System.out.println("4. 네이티브 메서드 호출");
        example1.callNativeMethod();
        sleep(5000); // 네이티브 호출 후 대기

        System.out.println("5. 참조 해제 및 GC 호출 단계");
        System.out.println("  example1, example2 참조 해제 (5초 대기)");
        example1 = null;
        example2 = null;
        sleep(5000);

        System.out.println("  첫 번째 GC 호출");
        System.gc();
        sleep(10000); // GC 후 메모리 변화 관찰

        System.out.println("  examples 리스트 클리어 (5초 대기)");
        examples.clear();
        sleep(5000);

        System.out.println("  두 번째 GC 호출");
        System.gc();
        sleep(10000); // GC 후 메모리 변화 관찰

        System.out.println("6. 프로그램 종료 대기 (30초)");
        sleep(30000);
    }

    private static void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

### NativeLib 생성

`NativeLib`을 생성해서 라이브러리까지 테스트한다.
이는 JNI(Java Native Interface)를 사용하여 `C`/`C++` 코드를 작성하고, 이를 동적 라이브러리 (`.dll`, `.so`, `.dylib`)로 컴파일 하는 과정을 포함한다.

#### 네이티브 메서드 헤더 파일 생성

1. `JVMMemoryExample` 클래스를 컴파일한다.

```bash
javac JVMMemoryExample.java

# 컴파일부터 인코딩 오류... 파일은 UTF-8, javac는 기본 ms-949
# 인코딩 옵션 추가해서 테스트
javac -encoding UTF-8 JVMMemoryExample.java
```

2. `javac -h` 명령어로 헤더 파일을 생성

```bash
javac -h . JVMMemoryExample.java

# 인코딩...
javac -encoding UTF-8 -h . JVMMemoryExample.java

# JVMMemoryExample.h 라는 파일이 생성된다. 내용은 아래와 같은 파일이 만들어진다.
# JNIEXPORT void JNICALL Java_JVMMemoryExample_callNativeMethod(JNIEnv *, jobject);
```

#### C 코드 작성

`NativeLib.c` 파일을 생성하고 네이티브 메서드를 구현한다.

```c
#include <jni.h>
#include <stdio.h>
#include "JVMMemoryExample.h"

JNIEXPORT void JNICALL Java_JVMMemoryExample_callNativeMethod(JNIEnv *env, jobject obj) {
    printf("네이티브 메서드가 호출되었습니다!\n");
}
```

#### 동적 라이브러리 컴파일

MinGW를 사용한다.
Java 환경 변수는 설정됐다고 가정한다.

`gcc` 컴파일러를 사용하기 위해 SourceForge에서 MinGW-w64 바이너리 배포판을 다운로드 받아 `C:\mingw-w64` 폴더 아래에 배치하고 환경 변수를 등록했다.

```text
C:\mingw-w64\
	mingw64\
		bin\ <- gcc.exe, g++.exe 등이 포함됨
		include\
		lib\
		...
```

환경 변수 등록 후 `gcc` 버전 확인

```bash
gcc --version

# gcc (x86_64-posix-seh-rev0, Built by MinGW-W64 project) 8.1.0
# Copyright (C) 2018 Free Software Foundation, Inc.
```

이후 컴파일 명령어 실행하면 `NativeLib.dll` 파일이 생성된다.

```bash
gcc -I"%JAVA_HOME%\include" -I"%JAVA_HOME%\include\win32" -shared -o NativeLib.dll NativeLib.c
```

#### 라이브러리 경로 설정

생성된 `NativeLib.dll`을 `java.library.path`에 추가하거나 IntelliJ에서 실행 시 경로를 지정한다.
`Run > Edit Configurations > VM options`에 추가해서 실행한다.

```bash
-Djava.library.path=NativeLib_파일_경로
# 예: -Djava.library.path=C:\libs
```

#### 실행 결과

일반적인 실행 결과

```bash
Thread-1 - Counter: 10
Thread-2 - Counter: 20
네이티브 메서드가 호출되었습니다!

BUILD SUCCESSFUL in 444ms
```

이 실행을 통해 JVM 메모리 구조를 확인하기 위해선 `VisualVM`, `JConsole` 또는 JVM 로그 옵션 `-XLog:gc`를 사용할 수 있다.

### VisualVM으로 JVM 메모리 구조 확인

뭔가 이름부터 눈으로 확인하기 좋을 것 같아서 JDK에 포함되어 있는 강력한 모니터링 도구 VisualVM으로 JVM의 메모리 사용량, 스레드 상태, GC 동작 등을 확인한다.

JDK 설치 경로에서 `jvisualvm.exe`이 있다면 실행한다.
없다면 직접 VisualVM을 다운로드 받는다.

* OpenJDK를 사용하고 있고 `jvisualvm.exe`가 포함되지 않은 배포판인 듯.
* [https://visualvm.github.io/download.html](https://visualvm.github.io/download.html) 직접 VisualVM을 다운로드 받았다.
* 독립적으로 실행 가능해서 별도 위치에 배치한 후 `visualvm_2110\bin\visualvm.exe`를 실행했다.

실행 후 자동으로 JDK가 감지되지만 직접 JDK를 지정하여 VisualVM을 실행할 수 있다.

```bash
# VisualVM이 설치된 디렉토리로 이동한 후 JDK 경로를 지정하여 VisualVM을 실행
# 예시 경로이므로 실제 경로를 사용한다.
visualvm.exe --jdkhome "C:\Program Files\java\openlogic-openjdk-17.0.14+7-windows-x64"
```

![](/assets/images/Pasted%20image%2020250406205638.png)

실행 후 좌측 패널에서 JVMMemoryExample을 확인할 수 있고 각 탭에서 필요한 정보를 찾아 확인해볼 수 있다.

실행 예제를 테스트하기 위해 VisualVM의 상단 툴바에서 `Tools > Plugins > Available Plugins`을 보면 `Visual GC`가 있다. 이걸 설치하고 확인해본다.

![](/assets/images/Pasted%20image%2020250406221818.png)

## 🎯결론

JVM의 메모리 구조를 이해하고 프로그램이 실행될 때 시각적으로 확인해볼 수 있었다.
VisualVM은 다시 한 번 다뤄야겠다.

## ⚙️EndNote

### Garbage Collector

가비지 컬렉터 GC는 더 이상 참조되지 않는 객체를 힙에서 제거하여 메모리를 회수하는 역할을 갖는다.

#### 종류

* Serial GC: 단일 스레드로 GC 수행. 소규모 애플리케이션에 적합
* Parallel GC: 여러 스레드로 GC 수행. 처리량 중점
* CMS (Concurrent Mark-Sweep): 애플리케이션 스레드와 동시에 실행. 낮은 지연 시간 중점
* G1GC: 대규모 힙에서 효율적인 GC. Java 9부터 기본 GC.

#### 동작

1. Mark: 더 이상 참조되지 않는 객체 식별
2. Sweep: 식별된 객체 제거
3. Compact (일부 GC): 메모리 조각화 방지

#### 최적화 팁

* GC 로그 분석 (`-Xlog:gc` 옵션)
* 애플리케이션 특성에 맞는 GC 선택
* 불필요한 객체 생성 방지
