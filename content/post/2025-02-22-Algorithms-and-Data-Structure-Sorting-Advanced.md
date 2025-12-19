---
publish: true
title: "알고리즘과 자료구조: 고급 정렬"
description: 고급 정렬을 이해할 수 있다.
author: Nine
Created: 2025-02-22
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
  - counting-sort
  - radix-sort
  - tim-sort
image:
  path:
  lqip:
  alt:
Status: Done
---
## 📌개요

고급 정렬 알고리즘을 이해하고, 더 복잡한 정렬 방식과 응용을 살펴본다.

## 📌내용

> [!info] `Counting Sort`, `Radix Sort`, `Tim Sort` 같은 고급 정렬 알고리즘은 특정한 상황에서 매우 효율적이며, 실무에서도 활용되는 경우가 많다.

### 계수 정렬(Counting Sort)

>시간 복잡도: O(n + k) (k는 최대값)

데이터의 크기를 기반으로 개수를 세어 정렬하는 알고리즘으로, 숫자의 범위가 제한적일 때 매우 효율적이다.

#### Pseudo Code

```
CountingSort(A, k):
    C = array of size k+1 initialized to 0
    B = array of size length(A)
    for i from 0 to length(A) - 1:
        C[A[i]] += 1
    for i from 1 to k:
        C[i] += C[i - 1]
    for i from length(A) - 1 down to 0:
        B[C[A[i]] - 1] = A[i]
        C[A[i]] -= 1
    return B
```

#### JavaScript Code

```js
function countingSort(A, k) {
    let C = new Array(k + 1).fill(0);
    let B = new Array(A.length);
    
    for (let i = 0; i < A.length; i++) C[A[i]]++;
    for (let i = 1; i <= k; i++) C[i] += C[i - 1];
    for (let i = A.length - 1; i >= 0; i--) {
        B[C[A[i]] - 1] = A[i];
        C[A[i]]--;
    }
    return B;
}
```

### 기수 정렬(Radix Sort)

>시간 복잡도: O(nk) (k는 자릿수)

자릿수를 기준으로 정렬을 반복하여 전체 배열을 정렬하는 알고리즘이다.

#### Pseudo Code

```
RadixSort(A, d):
    for i from 0 to d - 1:
        A = StableCountingSort(A, i)
    return A
```

#### JavaScript Code

```js
function radixSort(A) {
    let maxNum = Math.max(...A).toString().length;
    let divisor = 1;
    for (let i = 0; i < maxNum; i++) {
        let buckets = [...Array(10)].map(() => []);
        for (let num of A) buckets[Math.floor(num / divisor) % 10].push(num);
        A = [].concat(...buckets);
        divisor *= 10;
    }
    return A;
}
```

### 팀 정렬(Tim Sort)

>시간 복잡도: 최악 O(n log n), 평균 O(n log n)

합병 정렬과 삽입 정렬을 조합하여 최적의 성능을 보장하는 정렬 알고리즘이다.

#### Pseudo Code

```
TimSort(A):
    for each run in A:
        sort run using InsertionSort
    merge sorted runs using MergeSort
```

#### JavaScript Code

```js
function timSort(A) {
    const RUN = 32;
    
    function insertionSort(A, left, right) {
        for (let i = left + 1; i <= right; i++) {
            let temp = A[i], j = i - 1;
            while (j >= left && A[j] > temp) {
                A[j + 1] = A[j];
                j--;
            }
            A[j + 1] = temp;
        }
    }
    
    for (let i = 0; i < A.length; i += RUN) {
        insertionSort(A, i, Math.min(i + RUN - 1, A.length - 1));
    }
    
    let size = RUN;
    while (size < A.length) {
        for (let left = 0; left < A.length; left += 2 * size) {
            let mid = left + size - 1;
            let right = Math.min(left + 2 * size - 1, A.length - 1);
            merge(A, left, mid, right);
        }
        size *= 2;
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