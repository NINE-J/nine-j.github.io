---
publish: true
 draft: false
title: "알고리즘과 자료구조: 중급 정렬"
description: 중급 정렬을 이해할 수 있다.
author: Nine
date: 2025-02-10
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
  - merge-sort
  - quick-sort
  - heap-sort

Status: Done
---
## 📌개요

더 효율적인 정렬 알고리즘을 이해하기 위해 중급 정렬 알고리즘을 살펴본다.

## 📌내용

> [!info] `Heap Sort`, `Merge Sort`, `Quick Sort` 같은 중급 정렬 알고리즘은 실무에서도 많이 사용되며, 고급 정렬 알고리즘을 이해하는 데 중요한 개념을 제공한다.

### 병합 정렬(Merge Sort)

> 시간 복잡도: O(n log n)

분할 정복(Divide and Conquer) 방식을 사용하여 배열을 반씩 나누고 병합하며 정렬하는 알고리즘이다.

#### 특징

- 안정적인 정렬 (Stable Sort) → 동일한 값의 상대적 순서 유지
- 외부 정렬(External Sort)에 적합하다. 디스크나 네트워크에서 데이터를 읽으며 정렬 가능하다.
- 데이터가 이미 정렬된 경우에도 성능을 유지한다.
- 연결 리스트(Linked List) 정렬에 유리하다. 연속된 메모리 공간을 필요로 하지 않는다.

#### 실무 사용 예시

- 안정성이 중요한 경우에 사용한다.
	- 데이터베이스에서 인덱스 정렬 등
- 대용량 데이터 정렬.
	- 외부 정렬 알고리즘에서 많이 사용한다.
- 연결 리스트 정렬
	- 배열보다 메모리 재배열이 어려운 경우

#### Pseudo Code

```
Merge(left, right):
	result = empty array
	i = 0, j = 0
	while i < length(left) and j < length(right):
		if left[i] < right[j]:
			append left[i] to result
			increment i
		else:
			append right[j] to result
			increment j
	append remaining elements of left to result (if any)
	append remaining elements of right to result (if any)
	return result

MergeSort(A, left, right):
    if left < right:
        mid = (left + right) / 2
        MergeSort(A, left, mid)
        MergeSort(A, mid + 1, right)
        Merge(A, left, mid, right)
```

#### JavaScript Code

```js
function merge(left, right) {
  let result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  return result.concat(left.slice(i), right.slice(j));
}

function mergeSort(A) {
    if (A.length < 2) return A;
    let mid = Math.floor(A.length / 2);
    let left = mergeSort(A.slice(0, mid));
    let right = mergeSort(A.slice(mid));
    return merge(left, right);
}
```

### 퀵 정렬(Quick Sort)

> 시간 복잡도: 평균 O(n log n), 최악 O(n^2)

피벗(Pivot)을 기준으로 작은 값과 큰 값으로 나누어 정렬하는 알고리즘이다.
- `QuickSort` 함수는 배열을 재귀적으로 나누어 정렬한다.
- `Partition` 함수는 `pivot`을 기준으로 배열을 두 두분으로 분할하는 과정이다.
	- `pivot`보다 작은 값들은 왼쪽, 큰 값들은 오른쪽으로 이동시킨 후 새로운 `pivot`을 반환한다.

#### 특징

- 비교 기반 정렬 중 가장 빠른 평균 속도
- 추가적인 메모리가 거의 필요 없다.
- 데이터가 랜덤하게 분포되어 있을 때 성능이 뛰어나다
- 병합 정렬보다 캐시 친화적이다.

#### 실무 사용 예시

- 대용량 데이터 정렬
- 일반적인 데이터 정렬 (데이터가 랜덤 분포일 경우)

>[!warning] 정렬된 배열을 받는 경우 최악의 성능을 자랑한다. 최악의 케이스를 모두 피할 순 없지만, `pivot`을 작은 값 또는 큰 값이 아닌 중간 값 또는 랜덤 선택 등으로 지정하는 방법을 사용해볼 수 있다.

#### Pseudo Code

```
Partition(A, low, high):
    pivot = A[high]
    i = low - 1
    for j = low to high - 1:
        if A[j] < pivot:
            i += 1
            swap(A[i], A[j])
    swap(A[i + 1], A[high])
    return i + 1

QuickSort(A, low, high):
    if low < high:
        pivotIndex = Partition(A, low, high)
        QuickSort(A, low, pivotIndex - 1)
        QuickSort(A, pivotIndex + 1, high)
```

#### JavaScript Code

```js
function partition(A, low, high) {
    let pivot = A[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (A[j] < pivot) {
            i++;
            [A[i], A[j]] = [A[j], A[i]];
        }
    }
    [A[i + 1], A[high]] = [A[high], A[i + 1]];
    return i + 1;
}

function quickSort(A) {
    if (A.length <= 1) return A;
    let pivotIndex = partition(A, 0, A.length - 1);
    return [
        ...quickSort(A.slice(0, pivotIndex)),
        A[pivotIndex],
        ...quickSort(A.slice(pivotIndex + 1)),
    ];
}
```

### 힙 정렬(Heap Sort)

>시간 복잡도: O(n log n)

힙(Heap) 자료구조를 활용하여 최댓값 또는 최솟값을 빠르게 찾는 방식으로 정렬하는 알고리즘이다.

#### 특징

- 최악의 경우에도 동일한 시간 복잡도를 보장한다.
- 추가적인 메모리 사용이 거의 없다.
- 우선순위 큐에서 응용 가능하다.

#### 실무 사용 예시

- 우선순위 큐 기반의 정렬
	- 최소/최대 힙을 이용한 정렬
- 실시간 데이터 스트림 정렬
	- 항상 정렬된 상태를 유지해야 하는 경우
- 메모리 사용을 최소화해야 하는 정렬

#### Pseudo Code

```
HEAP_SORT_ASCENDING(A):
    BUILD_MAX_HEAP(A)

    FOR i FROM length(A) - 1 DOWNTO 1:
        SWAP(A[0], A[i])
        MAX_HEAPIFY(A, 0, i)

    RETURN A

BUILD_MAX_HEAP(A):
    FOR i FROM FLOOR(length(A) / 2) - 1 DOWNTO 0:
        MAX_HEAPIFY(A, i, length(A))

MAX_HEAPIFY(A, i, heapSize):
    largest ← i
    left ← 2 * i + 1
    right ← 2 * i + 2

    IF left < heapSize AND A[left] > A[largest]:
        largest ← left
    IF right < heapSize AND A[right] > A[largest]:
        largest ← right

    IF largest ≠ i:
        SWAP(A[i], A[largest])
        MAX_HEAPIFY(A, largest, heapSize)
```

```
HEAP_SORT_DESCENDING(A):
    BUILD_MIN_HEAP(A)

    FOR i FROM length(A) - 1 DOWNTO 1:
        SWAP(A[0], A[i])
        MIN_HEAPIFY(A, 0, i)

    RETURN A

BUILD_MIN_HEAP(A):
    FOR i FROM FLOOR(length(A) / 2) - 1 DOWNTO 0:
        MIN_HEAPIFY(A, i, length(A))

MIN_HEAPIFY(A, i, heapSize):
    smallest ← i
    left ← 2 * i + 1
    right ← 2 * i + 2

    IF left < heapSize AND A[left] < A[smallest]:
        smallest ← left
    IF right < heapSize AND A[right] < A[smallest]:
        smallest ← right

    IF smallest ≠ i:
        SWAP(A[i], A[smallest])
        MIN_HEAPIFY(A, smallest, heapSize)

```

#### JavaScript Code

```js
function heapSortAscending(A) {
	let n = A.length;
	buildMaxHeap(A);
	
	for (let i = n - 1; i > 0; i--) {
		[A[0], A[i]] = [A[i], A[0]];
		maxHeapify(A, 0, i);
	}
	return A;
}

function heapSortDescending(A) {
	let n = A.length;
	buildMinHeap(A);
	
	for (let i = n - 1; i > 0; i--) {
		[A[0], A[i]] = [A[i], A[0]];
		minHeapify(A, 0, i);
	}
	return A; 
}

function buildMaxHeap(A) {
	let heapSize = A.length;
	
	for (let i = Math.floor(heapSize / 2) - 1; i >= 0; i--) {
		maxHeapify(A, i, heapSize);
	}
}

function buildMinHeap(A) {
	let heapSize = A.length;
	
	for (let i = Math.floor(heapSize / 2) - 1; i >= 0; i--) {
		minHeapify(A, i, heapSize);
	}
}

function maxHeapify(A, i, heapSize) {
	let largest = i;
	let left = 2 * i + 1;
	let right = 2 * i + 2;
	
	if (left < heapSize && A[left] > A[largest]) {
		largest = left;
	}
	if (right < heapSize && A[right] > A[largest]) {
		largest = right;
	}
	if (largest !== i) {
		[A[i], A[largest]] = [A[largest], A[i]];
		maxHeapify(A, largest, heapSize);
	}
}

function minHeapify(A, i, heapSize) {
	let smallest = i;
	let left = 2 * i + 1;
	let right = 2 * i + 2;
	
	if (left < heapSize && A[left] < A[smallest]) {
		smallest = left;
	}
	if (right < heapSize && A[right] < A[smallest]) {
		smallest = right;
	}
	if (smallest !== i) {
		[A[i], A[smallest]] = [A[smallest], A[i]];
		minHeapify(A, smallest, heapSize);
	}
}
```

## 📌적절한 사용 전략

- 빠른 정렬이 필요하면? → 퀵 정렬 (일반적인 경우)
- 안정적인 정렬이 필요하면? → 병합 정렬 (데이터 정렬 순서를 유지해야 할 때)
- 메모리를 절약하면서 안정적인 성능을 원하면? → 힙 정렬

| 정렬 알고리즘            | 평균 시간 복잡도 | 최악 시간 복잡도 | 공간 복잡도  | 안정성 | 특징 및 사용 사례                     |
| ------------------ | --------- | --------- | ------- | --- | ------------------------------ |
| 퀵 정렬 (Quick Sort)  | O(nlogn)  | O(n2)     | O(logn) | ❌   | 가장 빠른 평균 속도, 제자리 정렬, 랜덤 데이터 정렬 |
| 병합 정렬 (Merge Sort) | O(nlogn)  | O(nlogn)  | O(n)    | ✅   | 안정적 정렬, 외부 정렬 및 연결 리스트 정렬      |
| 힙 정렬 (Heap Sort)   | O(nlogn)  | O(nlogn)  | O(1)    | ❌   | 우선순위 큐 기반 정렬, 메모리 절약 필요 시      |

## ⚙️EndNote

### Pseudo Code

`Pseudo Code`는 실제 프로그래밍 언어의 구문과 유사하지만, 특정 프로그래밍 언어의 문법에 얽매이지 않고 알고리즘의 논리적인 흐름을 설명하는 데 사용되는 간단한 서술 형태다.

1. **언어 독립성**: 특정 프로그래밍 언어의 문법을 따르지 않으며, 누구나 쉽게 읽고 이해할 수 있다.
2. **간결함**: 복잡한 문법 요소를 생략하고 핵심 알고리즘 로직만을 표현한다.
3. **가독성**: 사람이 읽기 쉽게 작성되어, 알고리즘의 흐름과 동작을 쉽게 파악할 수 있다.