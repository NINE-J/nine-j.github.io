---
publish: true
title: 모듈러 연산
description: 다양한 알고리즘에 활용할 수 있는 모듈러 연산을 알아본다.
author: Nine
Created: 2025-03-09
categories:
  - 알고리즘
tags:
  - devlog
  - algorithms
  - modular
  - MathJax
  - Latex
image:
Status: Done
---
## 📌개요

다양한 알고리즘(암호학, 해시 함수, 알고리즘 최적화 등)에 활용할 수 있는 모듈러 연산(Modular Arithmetic)의 동작 원리를 알아 본다.

## 📌내용

모듈러 연산(Modular Arithmetic)은 숫자를 특정 값(모듈러, modulus)으로 나눈 나머지를 구하는 연산이다.

### 기본 개념

$$A \mod  M = R$$

- $A$ : 피연산자(나누려는 수)
- $M$ : 모듈러 값(나누는 수)
- $R$ : 나머지(결과값)

예를 들어, $17 \mod  5$를 계산하면

$$17÷5=3(몫),나머지=2$$

따라서,

$$17 \mod  5=2$$

### 동치 관계

$$A \equiv B \pmod{M}$$

이 식은 A와 B가 같은 나머지를 가지는 경우를 의미한다.  

$$17 \equiv 2 \pmod{5}$$

이는 17과 2는 5로 나눴을 때 같은 나머지를 가진다는 뜻이다.

### 주요 성질

#### 덧셈

두 수의 합을 구한 뒤 모듈러 연산을 수행하는 것과, 각각의 수에 대해 먼저 모듈러 연산을 수행한 후 더하는 것은 결과가 같다.

$$(A+B) \mod M = [(A \mod M)+(B \mod M)] \mod M$$

#### 뺄셈

두 수의 차이를 구한 뒤 모듈러 연산을 수행하는 것과, 각각 모듈러 연산 후 뺀 값을 모듈러 연산하는 것은 동일하다.
다만, 결과가 음수일 경우 $M$을 더해 양수로 변환한다.

$$(A−B) \mod M = [(A \mod M)−(B \mod M) + M] \mod M$$

#### 곱셈

두 수의 곱을 직접 모듈러 연산하는 것과, 각각의 수에 대해 먼저 모듈러 연산을 수행한 후 곱한 값을 다시 모듈러 연산하는 것은 동일하다.

$$(A×B) \mod M = [(A \mod M) × (B \mod M)] \mod M$$
#### 거듭제곱

거듭제곱 후 모듈러 연산을 수행하는 것과, 밑수를 먼저 모듈러 연산한 후 거듭제곱하여 모듈러 연산하는 것은 동일하다.

빠르게 계산하는 방법: 모듈러 거듭제곱

$$A^B \mod M=[(A \mod M)^B] \mod M$$

#### 나눗셈

모듈러 연산에서 나눗셈은 일반적인 나눗셈이 아니라, $B$의 모듈러 역원(곱셈 역원)을 찾아 곱셈으로 변환하여 계산해야 한다.

역원 개념 필요, 보통 확장된 유클리드 알고리즘 사용

$$(A/B) \mod M=(A×B^{−1}) \mod M$$

## Pseudo Code

각 연산에 대해 `Pseudo code`를 작성해 보자.

### 기본 모듈러 연산

>시간 복잡도: O(1)

```
FUNCTION modular(A, M):
	RETURN A - (A // M) * M  # (A를 M으로 나눈 나머지)
```

- 입력: $A,M$
- 출력: $A \mod  M$

### 모듈러 덧셈

>시간 복잡도: O(1)

```
FUNCTION modular_add(A, B, M):
	RETURN (A % M + B % M) % M
```

### 모듈러 뺄셈

>시간 복잡도: O(1)

```
FUNCTION modular_subtract(A, B, M):
	result = (A % M - B % M) % M
	IF result < 0:
		result += M # 음수가 되지 않도록 보정
	RETURN result
```

### 모듈러 곱셈

>시간 복잡도: O(1)

```
FUNCTION modular_multiply(A, B, M):
	RETURN (A % M * B % M) % M
```

### 모듈러 거듭제곱 (빠른 거듭제곱)

거듭제곱을 직접 계산하면 O(B) 이므로, 빠르게 계산하는 방법(O(log B))을 사용해야 한다.

>시간 복잡도: O(log B) (빠른 거듭제곱)

```
FUNCTION modular_exponentiation(A, B, M):
	result = 1
	base = A % M
	WHILE B > 0:
		IF B % 2 == 1: # B가 홀수라면
			result = (result * base) % M
			base = (base * base) % M
			B = B // 2
	RETURN result
```

### 모듈러 나눗셈 (모듈러 역원)

>시간 복잡도: O(log M)

$A/B \mod M$ 를 계산하려면, $B$의 모듈러 역원 $B^{-1}$을 찾아야 한다.

페르마의 소정리, M이 소수일 때
$$ B^{−1} \equiv B^{M−2} \pmod{M} $$

```
FUNCTION modular_inverse(B, M):
	RETURN modular_exponentiation(B, M-2, M) # B^(M-2) % M 계산
```

- M이 소수일 때만 사용 가능

## 🎯결론

- 모듈러 연산은 시간복잡도 O(1)로 계산할 수 있어 효율적이다.
- 거듭제곱은 O(log B)로 최적화 가능하다.
- 나눗셈은 모듈러 역원을 활용해야 한다.
- 암호학, 해시 함수, 수학적 최적화 등에 널리 사용된다.

## ⚙️EndNote

### Markdown 수학식 표현

`Markdown`에서 수학식을 표현하는 방법은 `LaTeX 수식`(TeX 수식) 또는 `MathJax`라고 한다.

- **LaTeX(레이텍) 수식**: 수학 기호와 공식을 작성하는 데 사용되는 문법
- **MathJax(매스잭스)**: 웹에서 LaTeX 스타일의 수식을 렌더링하는 라이브러리

#### 인라인 수식

##### 예시

```
# 인라인 수식
모듈러 수학식 $A \mod M=R$ 
```

##### 결과

인라인 수식: $A \mod M=R$ 

#### 블록 수식

##### 예시

```
# 블록 수식 `$$ ... $$` 형태로 작성한다.
$$ A \mod M=R $$
```

##### 결과

$$ A \mod M=R $$