---
publish: true
 draft: false
title: No static resource
description: .well-known/appspecific/com.chrome.devtools.json.
author: Nine
date: 2025-05-20 11:18:19
categories:
  - Browser
  - DevTools
tags:
  - devlog
  - chrome-devtools
  - automatic-workspace
  - debugging
  - Spring-MVC

Status: Done
---
## 📌개요

Spring 서버를 실행하고 크롬에서 로컬 호스트를 접속한 뒤 개발자 모드를 활성화 할 때 계속 같은 오류가 발생했다.

오류가 발생한 시점은 사용자 정의 예외를 공통으로 처리하기 위해 클래스를 추가한 시점에 발생했다.

프로그램에는 영향이 없는 것 같았지만 오류니까 거슬린다.
프로덕션 환경에선 문제 없는 것 같은데 로컬 개발 환경에서 자주 발견되는 것 같다.

## 📌내용

```bash
[http-nio-8080-exec-7] ERROR GlobalExceptionHandler - [시스템 오류] No static resource .well-known/appspecific/com.chrome.devtools.json.
```

로그 포맷을 변경해서 일반적이진 않겠지만 이 부분 `.well-known/appspecific/com.chrome.devtools.json.`,
개발자 모드를 활성화할 때마다 정적 리소스를 요청한다.

크로미움 기반 브라우저에서 로컬 호스트의 개발 서버를 열 때 재현할 수 있는 것 같은데 그래서 저 오류가 뭔지 궁금했다.

[Chromium DevTools Ecosystem Guide](https://chromium.googlesource.com/devtools/devtools-frontend/+/main/docs/ecosystem/README.md)문서에서 관련 내용을 확인할 수 있다.

### 어떤 해결 방법이 있을까

크롬 개발자 도구가 자동으로 .well-known/appspecific/... 파일을 요청하면서 생기는 현상.
서버에 실제로 해당 정적 리소스가 없어서 Spring이 오류를 던지는 것이며, 보안 위험은 없다.

- 무시하거나
- 더미 리소스를 만들어주거나
- 요청 경로 필터링으로 처리한다.

### 코드 기반으로 살펴 보기

일단 내 경우는 에러 핸들러 추가까진 안 보이다가 로그를 남기는 시점에 보이기 시작했다.

땜빵(?)을 하긴 했지만 별로 좋은 해결책은 아닌 것 같고.. 일단 코드 대충 보고 원인부터 알아보자.

```java
@ControllerAdvice  
public class GlobalExceptionHandler {  

    private static final Logger log = LogManager.getLogger(GlobalExceptionHandler.class);  
  
    @ExceptionHandler(BusinessException.class)  
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e) {  
        log.error("[서비스 오류] code: {}, messageKey: {}", e.getErrorCode().getCode(), e.getErrorCode().getMessageKey(), e);  
        ErrorCode errorCode = e.getErrorCode();  
        HttpStatus status = mapToHttpStatus(errorCode);  
        ...
        return ResponseEntity.status(status).body(response);  
    }  
  
    @ExceptionHandler(Exception.class)  
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception e) {  
    
        // 크롬 버전 때문에 출력되는 에러  
        if (e.getMessage().equals("No static resource .well-known/appspecific/com.chrome.devtools.json.")) {  
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();  
        }  
        log.error("[시스템 오류] {}", e.getMessage(), e);  
        ...
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); 
    }  
  
    private HttpStatus mapToHttpStatus(ErrorCode errorCode) {  
        ...
    }  
}
```

Spring MVC는 기본적으로 다음과 같이 예외를 처리한다.
- 정적 리소스를 찾지 못하면 `NoResourceFoundException` 또는 `NoHandlerFoundException`을 발생 시킨다.
- 이 예외는 기보적으로 Spring 내부 DispatcherSevlet이 처리하고 브라우저엔 404 응답만 보내지 로그로 남기지 않는다.

그런데... 이렇게 명시적으로 로그를 박아 버리면
- Spring의 내부 예외 처리 메커니즘을 가로챈다
- `.well-known/...` 같은 요청에서 발생하는 예외도 잡힌다.
- 핸들러는 알 수 없는 시스템 오류로 간주하고 log.error()를 남긴다.
- 그 결과 크롬 개발자 도구에서 자동으로 보내는 요청에서도 에러 로그가 쌓인다.
    ```java
    @ExceptionHandler(Exception.class)  
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception e) {  
        log.error("[시스템 오류] {}", e.getMessage(), e);
        ...
    }  
    ```

#### 지금의 나로선..

- `.well-known` 요청을 필터나 핸들러에서 따로 무시 처리
- 또는 `@ExceptionHandler`의 범위를 좁혀서 시스템 예외 외에는 무시
- 가장 깔끔한 방법은 필요 없는 경로의 예외는 **로깅하지 않도록 분기 처리**하는 것

### Automatic Workspace Folders란?

> **Chrome DevTools (버전 M-135 이상)** 에서 도입된 기능으로, DevTools가 개발 서버(devserver)로부터 프로젝트 디렉토리 정보를 자동으로 인식해, 로컬 워크스페이스로 연결하는 기능이다.

기존의 Workspaces 기능을 **자동화**한 것으로, 디버깅 중 DevTools에서 소스 코드를 수정할 때 해당 수정 사항이 **로컬 파일에 직접 반영될 수 있도록 설정**해준다고 한다.


#### 이런 기능이 생긴 배경

기존 DevTools Workspaces 기능(M-63 도입)은 다음과 같은 불편이 있었다.

1. **수동 설정이 필요**함 (Workspace 탭에서 직접 폴더 지정)
2. **프로젝트별 관리가 불편**함 (매번 폴더 추가/삭제 필요)

#### 작동 방식

Chrome DevTools는 다음 조건을 만족할 때 자동으로 `.well-known/appspecific/com.chrome.devtools.json` 파일을 요청한다.

- **브라우저에서 여는 페이지의 origin이 `localhost`**
- DevTools가 열려 있는 상태

이 파일이 존재하면 DevTools는 해당 정보를 기반으로 자동으로 워크스페이스로 연결한다.

#### 요청되는 JSON 파일

- 요청 경로: `/.well-known/appspecific/com.chrome.devtools.json`
- 이 JSON 파일은 다음과 같은 구조를 가진다.
    ```json
    {
      "workspace": {
        "root": "/Users/foobar/Projects/my-awesome-web-project",
        "uuid": "53b029bb-c989-4dca-969b-835fecec3717"
      }
    }
    ```
- 각 필드 설명
    - `workspace.root`: 프로젝트 디렉토리의 **절대 경로**
    - `workspace.uuid`: 프로젝트 고유 식별자 (v4 UUID 등 무작위로 생성)

#### 사용 조건

- **M-135** 이상에서 사용 가능
- **M-136**에서는 기본적으로 **기능이 활성화되어 있음**
- **이전 버전**에서는 다음 두 플래그를 활성화해야 함
    ```
    chrome://flags#devtools-project-settings
    chrome://flags#devtools-automatic-workspace-folders
    ```

#### 요약 정보

| 항목      | 내용                                                  |
| ------- | --------------------------------------------------- |
| 기능 이름   | Automatic Workspace Folders                         |
| 도입 버전   | M-135 (기능 비활성화), M-136 (기본 활성화)                     |
| 목적      | DevTools에서 로컬 프로젝트와 자동 연결하여 코드 수정 반영                |
| 작동 조건   | origin이 `localhost`일 때 DevTools에서 JSON 요청           |
| 경로      | `/.well-known/appspecific/com.chrome.devtools.json` |
| JSON 필드 | `workspace.root`, `workspace.uuid`                  |
| 부가 도구   | Vite 플러그인 존재, `npx serve` 예시 제공됨                    |

## 🎯결론

명확한 해결책은 없지만 불필요한 로그를 출력하지 않게 설정하는 것이 좋겠다.
크롬 기능에 대해 실제 사용 예시나 한계, 조건 등을 알아보는 것도 좋겠다.

## ⚙️EndNote

### 참고 자료

- https://github.com/withastro/astro/issues/13789
- [Chromium DevTools Ecosystem Guide](https://chromium.googlesource.com/devtools/devtools-frontend/+/main/docs/ecosystem/README.md)
- [Chrome 135의 DevTools의 새로운 기능](https://developer.chrome.com/blog/new-in-devtools-135?hl=ko)