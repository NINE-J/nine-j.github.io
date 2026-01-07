---
publish: true
 draft: false
title: 공공데이터포털 API
description: SERVICE_KEY_IS_NOT_REGISTERED_ERROR
author: Nine
date: 2025-06-06 11:28:27
categories:
  - CS
  - Network
tags:
  - devlog
  - 공공데이터포털
  - OpenAPI
  - Encoding
  - URI
  - URL
  - RestTemplate
  - Java
  - Spring
  - SpringBoot

Status: Done
---
## 📌개요

공공데이터포털의 API 사용 시

- 포털에서 발급 받은 Encoding 또는 Decoding 키를 이용해 포털에서 테스트 응답 확인이 가능하다.
- Postman 등 REST API를 테스트할 수 있는 툴에서 동일하게 응답 확인이 가능하다.
- 프로젝트에서 `.http` 테스트하거나 프로그램 실행 시 `SERVICE_KEY_IS_NOT_REGISTERED_ERROR` 오류를 만난다?

## 📌내용

### URL 인코딩

#### 퍼센트 인코딩

URL 인코딩에서는 퍼센트 인코딩(Percent encoding)이라는 방식을 사용한다.
퍼센트 인코딩은 [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986)에 정의되어 있다.

"퍼센트 인코딩 URL 인코딩" 뿐만 아니라 URI, URN에도 사용될 수 있고 정확히는 '퍼센트 인코딩(Percent encoding)'이라는 용어가 더 적합하다고 한다.

퍼센트 인코딩을 하는 이유는 인터넷에서 주고 받을 수 있는 문자는 ASCII 문자 뿐이기 때문이다.
따라서 ASCII가 아닌 문자는 전송 가능한 형태로 인코딩을 해야 한다.

- 퍼센트 인코딩은 URL에서 URL로 사용할 수 없는 문자나 URL로 사용할 순 없지만 의미가 외곡될 수 있는 문자를 `%XX` (XX는 16진수)로 변환하는 방법이다.
    - 예를 들어 한글은 ASCII가 아니기 때문에 UTF-8과 같은 방식으로 인코딩해야 한다.
        - 예: 감자 -> %EA%B0%90%EC%9E%90
    - ASCII라도 예약된 의미를 가진 문자의 경우 그 문자 자체를 전달하고 싶다면 escape 처리가 필요하다.
        - 예를 들어 `/` URL의 각 레벨을 구분, `&` 쿼리 파라미터를 구분, `=` 쿼리 파라미터 값 지정
        - `A&B`라는 글자를 보내고 싶을 땐 `A%26B` 이런 식으로 `&`을 이스케이프 처리
URL Encoding 사이트를 이용할 수도 있다.
https://www.url-encode-decode.com/

#### 공공데이터포털 Open API

공공데이터포털에서 제공하는 apiKey는 W3C recommendations for URI addressing에 따라 `+`를 `%2B`로 변환한다.

문제는 `new URI()`, `URIComponents` 등을 사용해도 발생하는 `SERVICE_KEY_IS_NOT_REGISTERED_ERROR` 오류였다.

##### `RestTemplate.getForEntity()`

내부 코드를 좀 살펴보면 첫 번째 파라미터가 `URI` 타입인 것을 확인할 수 있고 `new URI()`로 맛있게 말아서 넘겨도 똑같은 오류를 만난다.

```java
@Override  
public <T> ResponseEntity<T> getForEntity(URI url, Class<T> responseType) throws RestClientException {  
  RequestCallback requestCallback = acceptHeaderRequestCallback(responseType);  
  ResponseExtractor<ResponseEntity<T>> responseExtractor = responseEntityExtractor(responseType);  
  return nonNull(execute(url, HttpMethod.GET, requestCallback, responseExtractor));  
}
```

그 원인은 `+` 기호가 인코딩 시 제외되는 문자이기 때문이었다.
따라서 아래와 같이 문제가 되는 기호를 먼저 정리하고 넘기는 방식으로 성공적인 응답을 받을 수 있었다.

```java
// + 기호는 인코딩에서 제외되기 때문에 미리 변환하고  
// URI 클래스를 사용하면 URL 전송 할 때 문자열 그대로 날아가는 것이 아닌, 한 번 인코딩을 해서 보내준다  
return new URI(base.replace("+", "%2B"));
```

물론 이런 패턴 말고 다른 방법도 있을 수 있지만 인터넷에서 주고 받는 URL 인코딩에 대해 더 알아 볼 수 있었다.

## 🎯결론

`SERVICE_KEY_IS_NOT_REGISTERED_ERROR`의 원인은 잘못된 URL 인코딩 처리였다.

공공데이터포털에서 제공하는 Open API는 `+` 기호를 `%2B`로 인코딩해야 하며, 이를 올바르게 처리하지 않으면 인증 오류가 발생한다. `RestTemplate`이나 `URI`를 사용할 때도 인코딩 방식의 차이를 주의 깊게 살펴야 한다.

퍼센트 인코딩의 정확한 이해와 사전 처리만으로도 오류를 쉽게 해결할 수 있었다.

## ⚙️EndNote

### 사전 지식

- 퍼센트 인코딩(Percent Encoding) 또는 URL 인코딩의 개념
- ASCII 문자 집합과 URL에서 허용되는 문자
- Java의 `URI`, `URLEncoder`, `RestTemplate`의 동작 방식 차이
- 공공데이터포털의 OpenAPI 인증 구조

### 더 알아보기

- [RFC 3986 - URI Generic Syntax](https://datatracker.ietf.org/doc/html/rfc3986)
- [`URLEncoder` vs `URI` 차이점](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/net/URLEncoder.html)
- [Spring Framework RestTemplate 공식 문서](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/client/RestTemplate.html)

### 참고 자료

- [공공데이터포털 SERVICE_KEY_IS_NOT_REGISTERED_ERROR 원인 파헤치기](https://velog.io/@yeahg_dev/%EA%B3%B5%EA%B3%B5%EB%8D%B0%EC%9D%B4%ED%84%B0%ED%8F%AC%ED%84%B8-SERVICEKEYISNOTREGISTEREDERROR-%EC%9B%90%EC%9D%B8-%ED%8C%8C%ED%97%A4%EC%B9%98%EA%B8%B0)