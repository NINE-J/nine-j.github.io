---
publish: true
draft: false
title: "알고리즘과 자료구조: 기초 정렬"
description: 기초 정렬을 이해할 수 있다.
author: Nine
date: 2025-02-09
categories:
  - 알고리즘
  - 이론
tags:
  - devlog
  - algorithms
  - 알고리즘
  - 이론
  - theory
  - 선수학습
  - 정렬
  - sort
  - bubble-sort
  - selection-sort
  - insertion-sort
# image: Status: Done
---
## 📌개요

알고리즘과 자료구조의 기본 원리를 이해하기 위한 정렬의 기초를 알아본다.

## 📌내용

>[!info] `Bubble Sort`, `Selection Sort`, `Insertion Sort` 같은 기초적인 정렬 알고리즘은 실제로 실무에서 거의 쓰이지 않지만, 더 효율적인 정렬 알고리즘을 이해하기 위한 기초 개념으로 중요한 역할을 한다.

### 버블 정렬(Bubble Sort)

>시간 복잡도: O(n^2)

인접한 요소들을 비교하여 정렬하는 알고리즘으로, 반복문을 통해 정렬이 완료될 때까지 계속 비교 및 교환한다.

#### Pseudo Code

구현에 앞서 `Pseudo Code`를 작성해본다.

```
BubbleSort(A):
	for i from 0 to length(A) - 1:
		for j from 0 to length(A) - i - 1:
			if A[j] > A[j + 1]:
				swap(A[j], A[j + 1])
```

1. `BubbleSort(A)`
   - 정렬할 배열 `A`를 인자로 받는 함수.
2. `for i from 0 to length(A) - 1`
   - 바깥쪽 반복문은 배열 전체를 순회한다. `i`는 0부터 배열의 길이-1까지 증가한다.
   - 배열의 마지막 요소는 이미 정렬되었을 가능성이 높기 때문에, 매번 마지막 요소는 비교하지 않는다.
3. `for j from 0 to length(A) - i - 1`
   - 안쪽 반복문은 배열의 첫 번째 요소부터 배열의 마지막에서 `i`번째 요소까지 순회한다. 
   - `i`가 증가할수록 비교해야 할 범위가 줄어든다.
4. `if A[j] > A[j + 1]`
   - 현재 요소 `A[j]`가 다음 요소 `A[j + 1]`보다 큰지 확인한다.
5. `swap(A[j], A[j + 1])`
   - 만약 현재 요소가 다음 요소보다 크다면, 두 요소의 위치를 교환(swap)한다.
   - 이 과정을 통해 큰 값이 점점 배열의 끝으로 이동하게 된다.

#### JavaScript Code

정렬할 배열: [5, 3, 8, 4, 2]

- 1회차: [3, 5, 4, 2, 8]
- 2회차: [3, 4, 2, 5, 8]
- 3회차: [3, 2, 4, 5, 8]
- 4회차: [2, 3, 4, 5, 8]

```js
function bubbleSort(A) {
    let n = A.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (A[j] > A[j + 1]) {
                // A[j]과 A[j + 1]의 위치를 변경한다.
                let temp = A[j];
                A[j] = A[j + 1];
                A[j + 1] = temp;
            }
        }
    }
    return A;
}
```

### 선택 정렬(Selection Sort)

>시간 복잡도: O(n^2)

매번 최솟값을 찾아서 정렬되지 않은 부분의 첫 번째 요소와 교환하는 알고리즘이다.

#### Pseudo Code

구현에 앞서 `Pseudo Code`를 작성해본다.

```
SelectionSort(A):
    for i from 0 to length(A) - 1:
        minIndex = i
        for j from i + 1 to length(A):
            if A[j] < A[minIndex]:
                minIndex = j
        if minIndex != i:
            swap(A[i], A[minIndex])
```

1. `SelectionSort(A)`
    - 정렬할 배열 `A`를 인자로 받는 함수.
2. `for i from 0 to length(A) - 1`
    - 바깥쪽 반복문은 배열 전체를 순회한다. `i`는 0부터 배열의 길이-1까지 증가한다.
3. `minIndex = i`
    - 현재 반복의 시작 위치를 최솟값 인덱스로 설정한다.
4. `for j from i + 1 to length(A)`
    - 안쪽 반복문은 현재 요소의 다음 요소부터 배열의 끝까지 순회한다.
5. `if A[j] < A[minIndex]`
    - 현재 요소 `A[j]`가 현재까지의 최솟값 `A[minIndex]`보다 작은지 확인한다.
6. `minIndex = j`
    - 만약 현재 요소가 최솟값보다 작다면, 최솟값 인덱스를 현재 요소의 인덱스로 업데이트한다.
7. `if minIndex != i`
    - 최솟값 인덱스가 현재 반복의 시작 인덱스와 다르다면, 두 요소의 위치를 교환(swap)한다.

#### JavaScript Code

정렬할 배열: [5, 3, 8, 4, 2]

- 1회차: [2, 3, 8, 4, 5]
- 2회차: [2, 3, 8, 4, 5]
- 3회차: [2, 3, 4, 8, 5]
- 4회차: [2, 3, 4, 5, 8]

```js
function selectionSort(A) {
    let n = A.length;
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            if (A[j] < A[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex != i) {
            // A[i]과 A[minIndex]의 위치를 변경한다.
            let temp = A[i];
            A[i] = A[minIndex];
            A[minIndex] = temp;
        }
    }
    return A;
}
```

### 삽입 정렬(Insertion Sort)

>시간 복잡도: O(n^2)

정렬된 부분과 정렬되지 않은 부분을 나누고, 정렬되지 않은 부분의 요소를 적절한 위치에 삽입하여 정렬한다.

#### Pseudo Code

구현에 앞서 `Pseudo Code`를 작성해본다.

```
InsertionSort(A):
    for i from 1 to length(A) - 1:
        key = A[i]
        j = i - 1
        while j >= 0 and A[j] > key:
            A[j + 1] = A[j]
            j = j - 1
        A[j + 1] = key
```

1. `InsertionSort(A)`
    - 정렬할 배열 `A`를 인자로 받는 함수.
2. `for i from 1 to length(A) - 1`
    - 바깥쪽 반복문은 배열의 두 번째 요소부터 마지막 요소까지 순회한다.
3. `key = A[i]`
    - 현재 요소를 `key` 변수에 저장한다.
4. `j = i - 1`
    - 현재 요소의 이전 요소 인덱스를 `j`에 저장한다.
5. `while j >= 0 and A[j] > key`
    - 현재 요소의 이전 요소들이 `key`보다 큰 동안 반복한다.
6. `A[j + 1] = A[j]`
    - 현재 요소를 한 칸 뒤로 이동시킨다.
7. `j = j - 1`
    - 인덱스를 한 칸 앞으로 이동시킨다.
8. `A[j + 1] = key`
    - `key`를 올바른 위치에 삽입한다.

#### JavaScript Code

정렬할 배열: [5, 3, 8, 4, 2]

- 1회차: [3, 5, 8, 4, 2]
- 2회차: [3, 5, 8, 4, 2]
- 3회차: [3, 4, 5, 8, 2]
- 4회차: [2, 3, 4, 5, 8]

```js
function insertionSort(A) {
    let n = A.length;
    for (let i = 1; i < n; i++) {
        let key = A[i];
        let j = i - 1;
        while (j >= 0 && A[j] > key) {
            A[j + 1] = A[j];
            j = j - 1;
        }
        A[j + 1] = key;
    }
    return A;
}
```

## ⚙️EndNote

### Pseudo Code

`Pseudo Code`는 실제 프로그래밍 언어의 구문과 유사하지만, 특정 프로그래밍 언어의 문법에 얽매이지 않고 알고리즘의 논리적인 흐름을 설명하는 데 사용되는 간단한 서술 형태다.

1. **언어 독립성**: 특정 프로그래밍 언어의 문법을 따르지 않으며, 누구나 쉽게 읽고 이해할 수 있다.
2. **간결함**: 복잡한 문법 요소를 생략하고 핵심 알고리즘 로직만을 표현한다.
3. **가독성**: 사람이 읽기 쉽게 작성되어, 알고리즘의 흐름과 동작을 쉽게 파악할 수 있다.