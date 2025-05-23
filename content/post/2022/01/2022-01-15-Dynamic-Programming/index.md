---
title: Dynamic Programming
description: DP를 알아보자
author: Nine
date: 2022-01-15T10:00:00
categories:
  - 알고리즘
tags:
  - devlog
  - algorithms
  - DP
  - 동적계획법
  - 기저사례
image: cover.png
---
## 📌DP란

최적화 이론의 한 기술이며, 특정 범위까지의 값을 구하기 위해서 그것과 다른 범위까지의 값을 이용하여 효율적으로 값을 구하는 알고리즘 설계 기법이다.

앞에서 이미 구한 답을 다른 곳에서 재활용하는 것.
동적 계획법은 구체적인 알고리즘이라기보다 문제 해결 패러다임에 가깝다.

>어떤 문제를 풀기 위해 그 문제를 더 작은 문제의 연장선으로 생각하고 과거에 구한 해를 활용하는 방식의 알고리즘을 총칭한다.

## 📌접근 방식

### Top-Down 방식 (메모이제이션, Memoization)

**Top-Down** 방식은 주어진 문제를 해결하기 위해 재귀 호출을 사용하고, 각 하위 문제의 결과를 메모리에 저장하여 중복 계산을 방지한다. 이 방식은 다음과 같은 단계를 따른다.

1. **재귀 함수 정의**
    - 문제를 해결하기 위한 재귀 함수를 정의한다.
    - 이 함수는 현재 문제의 해결을 위해 하위 문제를 호출한다.
2. **메모리 저장소 설정**
    - 하위 문제의 결과를 저장할 데이터 구조를 설정한다.
    - 보통 배열이나 해시맵을 사용한다.
3. **기저 사례(Base Case) 정의**
    - 재귀 호출의 종료 조건을 설정한다.
4. **결과 계산 및 저장**
    - 재귀 호출을 통해 하위 문제를 해결하고, 그 결과를 메모리에 저장한다.
5. **문제 해결**
    - 최종적으로 원래 문제의 결과를 메모리에서 조회하거나 계산하여 반환한다.

**장점:**
- 코드가 직관적이고 이해하기 쉬울 수 있다.
- 메모이제이션을 통해 중복 계산을 방지할 수 있다.

**단점:**
- 재귀 호출로 인해 스택 오버플로우가 발생할 수 있다.
- 메모리 사용이 상대적으로 많을 수 있다.

### Bottom-Up 방식 (타뷸레이션, Tabulation)

**Bottom-Up** 방식은 하위 문제부터 해결하여 점차 원래 문제를 해결해 나가는 접근 방식이다. 이 방식은 일반적으로 반복문을 사용하여 DP 테이블을 채우는 방식이다.

1. **DP 테이블 설정**
    - 문제를 해결하기 위한 DP 배열 또는 테이블을 설정한다.
    - 이 테이블은 하위 문제의 결과를 저장한다.
2. **초기 조건 설정**  
    - DP 테이블의 초기값을 설정한다.
    - 보통 가장 간단한 하위 문제의 결과를 초기화한다.
3. **점화식 적용** 
    - 점화식을 사용하여 DP 테이블을 채워 나간다.
    - 반복문을 통해 테이블의 값을 갱신한다.
4. **문제 해결**
    - DP 테이블에서 원래 문제의 결과를 찾는다.

**장점:**
- 재귀 호출이 없으므로 스택 오버플로우의 위험이 없다.
- 메모리와 계산 효율이 좋을 수 있다.

**단점:**
- 코드가 복잡해질 수 있다.
- DP 테이블을 설정하는 데 시간이 필요할 수 있다.

### 요약

문제의 성격에 따라 두 방식 중 하나를 선택하여 문제를 해결할 수 있다.

Top-Down 방식은 문제를 자연스럽게 나누어 해결할 수 있는 경우에 적합하다.
- **Top-Down** 방식은 재귀 호출과 메모이제이션을 사용하여 하위 문제의 결과를 저장하고 중복 계산을 방지한다.

Bottom-Up 방식은 문제를 명확히 정의하고 순서대로 해결할 수 있는 경우에 유용하다.
- **Bottom-Up** 방식은 반복문을 사용하여 하위 문제부터 차근차근 해결하며 DP 테이블을 채워나간다.

## 📌그래서 언제 사용하는데?
### 문제 정의 및 분석
- 해결하고자 하는 문제를 명확히 이해한다.
- 문제의 입력, 출력, 제약 조건 등을 파악
- 문제를 작은 하위 문제로 나누어 생각해본다.

### 하위 문제 정의
- 문제를 더 작은 하위 문제로 나눌 수 있는 방법을 고민한다.
- 하위 문제의 결과가 원래 문제를 해결하는 데 어떻게 사용될 수 있는지 정의한다.

### 상태 정의
- 각 하위 문제의 상태를 정의한다. DP 배열이나 테이블의 인덱스가 될 수 있다.
- 예를 들어, 최적화 문제에서는 일반적으로 DP 배열의 인덱스가 문제의 현재 상태를 나타낸다.

### 점화식 수립
- 하위 문제의 해를 원래 문제의 해로 결합하는 방법을 정의하는 점화식을 설정한다.
- 점화식은 문제를 재귀적으로 정의하는 방식으로, 문제의 최적해를 작은 문제들의 최적해로 표현한다.

### 초기 조건 설정
- DP 배열의 초기값을 설정한다. 이는 문제의 가장 작은 하위 문제의 해결책을 정의하는 것으로, 일반적으로 `*기저 사례(Base Case)`이다.

### 문제 해결 및 결과 도출
- 점화식을 사용하여 DP 배열을 채워나간다.
- 최종적으로 DP 배열에서 원하는 결과를 찾는다. 이 결과는 문제의 최적해를 제공해야 한다.

### 시간 복잡도 및 공간 복잡도 분석
- 알고리즘의 시간 복잡도와 공간 복잡도를 분석하여 효율성을 검토한다.

## 📌예제: 피보나치 수열

DP를 사용하여 피보나치 수열을 구하는 과정을 보자.

### 문제 정의 및 분석
- 피보나치 수열의 n번째 항을 구하는 문제
- 입력: n(정수)
- 출력: n번째 피보나치 수

### 하위 문제 정의
- 피보나치 수열의 n번째 항을 구하기 위해, (n-1)번째와 (n-2)번째 항이 필요하다.

### 상태 정의
- `dp[i]`를 i번째 피보나치 수로 정의한다.

### 점화식 수립
- 점화식: `dp[i] = dp[i-1] + dp[i-2]`
- 초기 조건: `dp[0] = 0`, `dp[1] = 1`

### 초기 조건 설정
- `dp[0] = 0`, `dp[1] = 1`로 설정한다.

### 문제 해결 및 결과 도출
- DP 배열을 채우면서 `dp[n]`을 계산한다.

### 시간 복잡도 및 공간 복잡도 분석
- 시간 복잡도: O(n)
- 공간 복잡도: O(n)

## ⚙️EndNote

### 기저 사례 - Base Case
- 쪼개지지 않는 가장 작은 작업들을 가리켜 재귀 호출의 기저 사례(base case)라고 한다.

### 점화식
- 수열의 항 사이에 성립하는 관계식.
