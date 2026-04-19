---
publish: true
draft: false
title: useWatch 사용한 리렌더링 최적화
description: react에서 form을 다룰 때 리렌더링 최적화 전략
author: Nine
date: 2025-01-25T21:00:00
categories:
  - react
  - react-hook-form
tags:
  - devlog
  - react
  - react-hook-form
  - useForm
  - useWatch
  - form
# image: 
Status: Done
id: 019ce76a-c31e-761d-a429-34e8f0208ad1
slug: b9f1-devlog-usewatch-사용한-리렌더링-최적화
---

## 📌개요

* 폼 제출을 필요로하는 부모 페이지에서 `useForm`을 생하고 각 값을 자식 컴포넌트와 연결한다.
* 특정 조건에 따라 동적으로 자식 컴포넌트의 `disabled`, `readonly` 등을 반영하되 리렌더링을 최소화한다.

## 📌내용

진행 중인 `React + typescript` 프로젝트에서 `form` 전략을 고민했고,
`useForm`을 생성해서 `FormProvider`로 감싼 내부에 입력 컴포넌트들을 배치한다.

### 직접 참조와 함수 내부에서 할당하여 반환하는 방식의 차이

> \[!info] `useWatch`를 직접 참조하는 것과 참조한 값을 반환하는 것은 다르게 동작한다.

#### 직접 참조

`useForm`에서 해당 필드의 값이 변경되면 리렌더링이 발생한다.
`useWatch`를 직접 참조하는 컴포넌트는 값이 변경될 때마다 리렌더링되며, 자식 컴포넌트들도 모두 리렌더링된다.

이는 `useState`와 `useEffect`를 사용하여 값이 변경될 때마다 상태가 업데이트되고, 컴포넌트가 리렌더링되기 때문이다.

```javascript
const test = useWatch({name: someName, control: someControl});
```

#### 함수 내부에서 할당하여 반환

`test` 함수는 `useWatch`를 직접 참조하지 않고, 내부의 `nameValue`가 `useWatch`를 통해 최신 값을 가지게 된다.
따라서 `test` 함수는 리렌더링을 발생 시키지 않고 `useForm`의 특정 필드에 대한 최신 값을 반환하는 함수가 된다.

`useWatch` 훅을 함수 내부에서 사용하여 값을 반환하는 경우, 해당 함수는 리액트 컴포넌트의 리렌더링을 트리거하지 않는다.
이는 함수가 호출될 때마다 최신 값을 반환하지만, 해당 함수가 리렌더링을 직접적으로 유발하지 않기 때문이다.

```javascript
const test = () => {
	const nameValue = useWatch({name: someName, control: someControl});

    return nameValue;
};

function test() {
    return useWatch({name: someName, control: someControl});
};
```

### watch VS useWatch

직접 참조를 기준으로 테스트한 결과를 정리해본다.

#### useForm.watch

useForm 훅에서 제공하는 watch 메서드를 사용하면 값이 변경될 때 useForm의 값을 사용하는 컴포넌트들을 모두 리렌더링한다.

#### useWatch

useWatch 훅은 useForm의 특정 값을 참조하는 컴포넌트만 리렌더링한다.

## 🎯결론

일단, 각 방식의 장단점을 고려하여 적절히 사용하면 된다.

* useForm의 값을 사용하는 폼이 몇 개 안 될 땐 useForm.watch를 사용해서 간편하게 리렌더링을 발생 시키며 UI를 업데이트할 수 있다.
* 폼이 꽤 많아지거나 리렌더링으로 인해 데이터 핸들링이 복잡한 경우 `useWatch`를 사용해 내부적으로 변경된 최신 값을 적용하며 불필요한 리렌더링을 방지할 수 있다.
  * `useWatch`를 직접 참조하는 방식은 간결하고 이해하기 쉽지만, 리렌더링이 발생할 수 있다.
  * 함수 내부에서 할당하여 반환하는 방식은 리렌더링을 최소화할 수 있지만, 사용 방식이 다소 복잡할 수 있다.

React 훅은 기본적으로 상태나 컨텍스트의 변화를 감지하고 리렌더링을 트리거한다.
훅을 함수 내부에서 사용하고 값을 반환하는 방식은 참조 불변성을 이용한 접근법이라고 볼 수 있고특정 상황에 유리할 수 있다.

`useWatch`뿐만 아니라 다른 React 훅들도 직접 참조하지 않고 함수 내부에서 사용한다면 리렌더링을 트리거하지 않을 수도 있다.

결국, 커스텀 훅을 정의하는 것과 같은 행위라고 볼 수 있다.

## ⚙️EndNote

### useForm

> \[!info] `useForm`은 `react-hook-form` 라이브러리에서 제공하는 훅으로 폼 상태 및 유효성 검사를 관리하는 데 사용된다.

`useForm` 훅을 사용하면 폼을 쉽게 설정하고 관리할 수 있다.
이를 통해 폼의 각 입력 필드를 등록하고, 폼 상태를 추적하며, 유효성 검사를 수행할 수 있다.
또한, 폼 제출 시 처리할 함수를 정의할 수 있다.

#### 장점

1. **간편한 설정**:
   * `useForm`은 사용하기 매우 간단하며, 폼 상태 관리와 유효성 검사를 쉽게 구현할 수 있다.
2. **성능 최적화**:
   * `react-hook-form`은 리렌더링을 최소화하도록 설계되어 있어 성능이 뛰어나다.
3. **유연성**:
   * 다양한 유효성 검사 규칙을 쉽게 적용할 수 있으며, 커스텀 유효성 검사도 지원한다.
4. **타입스크립트 지원**:
   * 타입스크립트를 완벽히 지원하여 타입 안전성을 보장한다.
5. **작은 번들 크기**:
   * 라이브러리의 번들 크기가 작아 애플리케이션의 전체 크기에 거의 영향을 주지 않는다.

#### 단점

1. **러닝 커브**:
   * 초기 설정과 사용법을 익히는 데 약간의 러닝 커브가 있을 수 있다.
   * 특히 초보자에게는 복잡하게 느껴질 수 있다.
2. **제한된 내장 구성 요소**:
   * 다른 폼 라이브러리와 달리 `react-hook-form`은 내장된 스타일링이나 UI 구성 요소를 제공하지 않으므로, 직접 스타일링을 해야 한다.
3. **외부 라이브러리와의 통합**:
   * 일부 외부 컴포넌트 라이브러리와의 통합이 까다로울 수 있다.
     * 이 경우, 별도의 어댑터나 커스텀 훅을 작성해야 할 수 있다.

### useWatch

> \[!info] `useWatch`는 `react-hook-form` 라이브러리에서 제공하는 훅으로 `useForm`의 특정 필드를 실시간으로 관찰(watch)한다.

관련 필드의 값이 변경될 때마다 업데이트된 값을 반환하는 훅이다.
이를 통해 사용자는 특정 필드의 값이 변경될 때마다 적절한 동작을 수행할 수 있다.

#### 장점

1. **실시간 값 추적**:
   * `useWatch`를 사용하면 특정 필드의 값을 실시간으로 추적할 수 있다.
   * 사용자가 입력한 값에 따라 즉각적으로 UI를 업데이트할 수 있다.
2. **간편한 사용**:
   * `useWatch`는 간단한 API를 제공한다.
   * 복잡한 상태 관리나 값 추적 로직을 간단하게 구현할 수 있다.
3. **성능 최적화**:
   * 필요한 필드만 관찰할 수 있다.
   * 불필요한 렌더링을 줄이고 성능을 최적화할 수 있다.
4. **동적 폼 구성**:
   * 특정 필드의 값에 따라 다른 필드나 UI 요소를 동적으로 변경하거나 조건부 렌더링을 쉽게 구현할 수 있다.

#### 단점

1. **복잡한 폼에서는 코드 관리가 어려울 수 있음**:
   * 여러 필드를 관찰해야 하는 복잡한 폼의 경우, `useWatch`를 사용한 코드가 복잡해질 수 있다. 이 경우 코드의 가독성과 유지보수성이 떨어질 수 있다.
2. **의존성 관리 필요**:
   * `useWatch` 훅을 사용할 때, 관찰할 필드가 변경되면 의존성을 적절히 관리해야 한다.
   * 그렇지 않으면 예상치 못한 동작이 발생할 수 있다.
3. **초기 값 설정**:
   * 폼 필드의 초기 값을 설정할 때 주의가 필요하다. `useWatch`는 폼 필드의 초기 값을 제대로 반영하기 위해 초기 값을 명확히 설정해야 한다.
4. **제한된 문서화**:
   * `useWatch`는 비교적 새로운 훅이기 때문에 관련 문서나 예제가 부족할 수 있다. (작성 시점)
   * 따라서 복잡한 사용 사례에 대한 정보를 찾기가 어려울 수 있다.

#### 코드

[react-hook-form](https://github.com/react-hook-form/react-hook-form)
useWatch에서 useEffect, useState를 어떻게 사용하고 있는지 간단하게 확인해본다.

```javascript
import { useEffect, useState } from 'react';
import { useFormContext } from './useFormContext';

function useWatch({ control, name }) {
  const methods = useFormContext();
  const actualControl = control || methods.control;
  
  const [value, setValue] = useState(actualControl.getValues(name));

  useEffect(() => {
    const subscription = actualControl.watch((values) => {
      setValue(values[name]);
    });
    
    return () => subscription.unsubscribe();
  }, [name, actualControl]);

  return value;
}
```
