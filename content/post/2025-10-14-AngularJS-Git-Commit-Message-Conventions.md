---
publish: true
draft: false
title: AngularJS 커밋 컨벤션
description: 자동화와 협업을 만드는 규칙
author: Nine
date: 2025-10-15
categories:
  - VersionControl
  - Conventions
tags:
  - devlog
  - AngularJS
  - Conventions
  - VersionControl
# image: Status: Done
---
## 📌개요

우아한테크코스 8기 프리코스 과제 진행 요구 사항에서 제공하는 커밋 메시지 컨벤션인 [AngularJS Git Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)의 번역 내용을 정리하고 요약해본다.

## 📌AngularJS Commit Message Convention 요약 및 의의

### 왜 이런 컨벤션이 필요한가

AngularJS는 오픈소스 프로젝트로 수백 명의 개발자가 동시에 기여했기 때문에 모든 커밋이 **일관된 규칙 없이 작성되면 히스토리를 추적하기 어렵고** 릴리스마다 어떤 변경이 있었는지 정리하기가 굉장히 복잡했을 것.

> 즉, “코드 변경 이력의 가독성”과 “자동화 가능한 기록 관리”를 위한 규칙이었다.

### 이 컨벤션이 제공하는 주요 목적

|목적|설명|
|---|---|
|**CHANGELOG 자동 생성**|커밋 메시지의 패턴이 일정하기 때문에, `feat`, `fix`, `docs` 등 키워드를 기준으로 자동으로 릴리스 노트를 만들 수 있다.|
|**의미 없는 커밋 무시**|포맷 변경이나 주석 수정 같은 비핵심 커밋을 구분해 bisect(이진 검색) 과정에서 제외할 수 있다.|
|**히스토리 탐색 효율화**|커밋만 봐도 “어떤 모듈(scope)에서, 어떤 변경(type)이 있었는지”를 바로 이해할 수 있다.|
|**팀 간 의사소통 통일**|기여자가 많더라도 커밋 메시지의 구조가 같기 때문에 리뷰, 코드 히스토리, 배포 관리가 명확해진다.|
|**자동화 친화적 구조**|릴리스 스크립트나 CI 파이프라인에서 커밋을 분석해 changelog, 버전 태깅, 배포 메시지를 자동 생성할 수 있다.|

### AngularJS 방식의 구체적 특징

|항목|설명|
|---|---|
|**형식화된 구조**|`<type>(<scope>): <subject>` 구조를 고정 → 시각적 일관성 유지|
|**Type 구분 명확**|`feat`, `fix`, `docs`, `refactor`, `style`, `test`, `chore` 등으로 의도를 명확히 구분|
|**Scope 활용**|`$compile`, `$http`처럼 수정된 영역을 명시해 검색과 필터링이 용이|
|**Breaking Change 규정화**|`BREAKING CHANGE:` 키워드로 하위 호환성 깨짐을 명시 → 릴리스 관리 안정화|
|**Issue 연동**|`Closes #123` 등으로 GitHub 이슈 자동 닫기 가능|

### 이런 컨벤션의 장점

#### 자동화 가능한 릴리스 파이프라인

- 커밋 로그만으로 “어떤 변경이 포함되었는지” 기계적으로 분류 가능
- `semantic-release`, `standard-version` 같은 도구와 궁합이 좋다
- 버전 관리(예: Semantic Versioning: major/minor/patch)를 자동화 가능

#### 커뮤니케이션 비용 절감

- 리뷰어나 동료가 커밋만 보고도 “무엇을, 왜 바꿨는지” 즉시 이해
- 코드 리뷰 시 불필요한 맥락 설명이 줄어듦

#### 장기 유지보수에 강함

- 수년 뒤에도 “이 변경이 왜 필요했는가?”를 추적 가능
- `git blame`, `git log` 활용 시 문맥 파악이 쉬움
- 대규모 팀, 오픈소스 프로젝트에서 특히 효과적

#### 컨벤션 기반 문화 정착

- 일관된 규칙은 “프로젝트의 품질 기준”이 된다
- 코드뿐 아니라 **커밋도 문서화의 일부**가 된다

---

## 📌AngularJS Commit Message Convention

이 규칙은  [The AngularJS commit conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/)에서 채택한 것이다.

### 목표 (Goals)

- 스크립트를 이용해 CHANGELOG.md를 자동으로 생성할 수 있도록 한다.
- git bisect 시 중요하지 않은 커밋(예: 포맷 변경 등)을 무시할 수 있도록 한다.
- 히스토리를 탐색할 때 더 나은 정보를 제공한다.

---

### CHANGELOG.md 생성

변경 로그(changelog)는 다음 세 가지 섹션으로 구성된다:

- 새로운 기능 (new features)
- 버그 수정 (bug fixes)
- 호환성 깨짐 (breaking changes)

이 목록은 릴리스 시 관련 커밋 링크와 함께 스크립트를 통해 자동으로 생성될 수 있다.  
물론 실제 릴리스 전에 수동으로 수정할 수 있지만, 기본 뼈대를 자동으로 만들 수 있다.

이전 릴리스 이후 모든 커밋 메시지의 첫 줄 목록을 확인하려면 다음 명령을 사용한다:

```bash
git log <last tag> HEAD --pretty=format:%s
```

현재 릴리스의 새로운 기능만 확인하려면:

```bash
git log <last release> HEAD --grep feature
```

---

#### 중요하지 않은 커밋 식별하기

형식 변경(공백 추가/제거, 들여쓰기 수정), 세미콜론 누락, 주석 변경 등은 논리적 변화가 없는 커밋이다.  
이러한 커밋은 코드 변경을 추적할 때 무시할 수 있다.

bisect 중 이러한 커밋을 건너뛰려면 다음 명령을 사용할 수 있다:

```bash
git bisect skip $(git rev-list --grep irrelevant <good place> HEAD)
```

---

#### 히스토리 탐색 시 더 많은 정보 제공

이 방식은 “컨텍스트” 정보를 추가한다.  
다음과 같은 커밋 메시지들을 보자 (Angular의 실제 커밋 일부이다):

- Fix small typo in docs widget (tutorial instructions)
- Fix test for scenario.Application - should remove old iframe
- docs - various doc fixes
- docs - stripping extra new lines
- Replaced double line break with single when text is fetched from Google
- Added support for properties in documentation

이 메시지들은 모두 변경된 위치를 나타내려 하지만, 일정한 규칙을 공유하지 않는다.

다른 예를 보자:

- fix comment stripping
- fixing broken links
- Bit of refactoring
- Check whether links do exist and throw exception
- Fix sitemap include (to work on case sensitive linux)

이 메시지들로는 변경된 위치를 추측하기 어렵다.  
코드의 특정 부분(예: docs, docs-parser, compiler, scenario-runner 등)을 명시하는 것이 좋다.

물론 어떤 파일이 변경되었는지는 diff로 확인할 수 있지만, 속도가 느리다.  
git 히스토리를 볼 때 대부분의 사람들이 위치를 명시하려고 하지만, 공통된 규칙이 없을 뿐이다.

---

### 커밋 메시지 형식

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

커밋 메시지의 모든 줄은 100자를 넘지 않아야 한다.  
이렇게 하면 GitHub 및 다양한 git 도구에서 읽기 쉬워진다.

---

#### 제목 줄 (Subject line)

제목 줄에는 변경 사항에 대한 간결한 설명이 포함된다.

##### 허용되는 `<type>`

- **feat** (feature): 새로운 기능
- **fix** (bug fix): 버그 수정
- **docs** (documentation): 문서 관련 변경
- **style** (formatting, missing semi colons, …): 코드 포맷 등 비논리적 변경
- **refactor**: 코드 리팩토링
- **test**: 누락된 테스트 추가
- **chore**: 유지보수, 빌드, 환경 관련 변경

##### 허용되는 `<scope>`

Scope는 변경된 코드의 위치를 나타내며, 다음과 같은 예시가 있다:  
`$location`, `$browser`, `$compile`, `$rootScope`, `ngHref`, `ngClick`, `ngView`, 등등.

##### `<subject>` 텍스트 규칙

- 명령형, 현재 시제로 작성 (“change”, “fix” 등)
- 첫 글자는 대문자가 아니어야 함
- 끝에 마침표(`.`)를 붙이지 말 것

---

#### 메시지 본문 (Message body)

- 제목과 마찬가지로 명령형, 현재 시제를 사용 (“change” not “changed”)
- 변경의 **동기**, **이전 동작과의 차이점**을 포함한다

참고:  
[http://365git.tumblr.com/post/3308646748/writing-git-commit-messages](http://365git.tumblr.com/post/3308646748/writing-git-commit-messages)  
[http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)

---

#### 메시지 푸터 (Message footer)

##### 호환성 깨짐 (Breaking changes)

모든 호환성 깨짐은 푸터에 반드시 명시해야 하며, 변경 설명, 이유, 마이그레이션 방법을 포함한다.

```
BREAKING CHANGE: isolate scope bindings definition has changed and
    the inject option for the directive controller injection was removed.
    
    To migrate the code follow the example below:
    
    Before:
    
    scope: {
      myAttr: 'attribute',
      myBind: 'bind',
      myExpression: 'expression',
      myEval: 'evaluate',
      myAccessor: 'accessor'
    }
    
    After:
    
    scope: {
      myAttr: '@',
      myBind: '@',
      myExpression: '&',
      // myEval - usually not useful, but in cases where the expression is assignable, you can use '='
      myAccessor: '=' // in directive's template change myAccessor() to myAccessor
    }
    
    The removed `inject` wasn't generaly useful for directives so there should be no code using it.
```

##### 이슈 참조하기 (Referencing issues)

해결된 버그는 “Closes” 키워드로 푸터에 작성한다.

```
Closes #234
```

여러 개의 이슈를 한 번에 닫는 경우:

```
Closes #123, #245, #992
```

---

### 예시 (Examples)

>[!TIP]
>여기서 `feat($compile)` 같은 표현에서 `$compile` 같은 달러 기호는 예약어나 변수 같은 건가 했는데 Git 커밋 메시지 규칙상 `( )` 안에 들어가는 **scope(스코프)** 부분이고, **달러(`$`) 표시는 AngularJS 내부 네이밍 규칙**에서 비롯된 것 같다.

```
feat($browser): onUrlChange event (popstate/hashchange/polling)

Added new event to $browser:
- forward popstate event if available
- forward hashchange event if popstate not available
- do polling when neither popstate nor hashchange available

Breaks $browser.onHashChange, which was removed (use onUrlChange instead)
```

```
fix($compile): couple of unit tests for IE9

Older IEs serialize html uppercased, but IE9 does not...
Would be better to expect case insensitive, unfortunately jasmine does
not allow to user regexps for throw expectations.

Closes #392
Breaks foo.bar api, foo.baz should be used instead
```

```
feat(directive): ng:disabled, ng:checked, ng:multiple, ng:readonly, ng:selected

New directives for proper binding these attributes in older browsers (IE).
Added coresponding description, live examples and e2e tests.

Closes #351
```

```
style($location): add couple of missing semi colons
```

```
docs(guide): updated fixed docs from Google Docs

Couple of typos fixed:
- indentation
- batchLogbatchLog -> batchLog
- start periodic checking
- missing brace
```

```
feat($compile): simplify isolate scope bindings

Changed the isolate scope binding options to:
  - @attr - attribute binding (including interpolation)
  - =model - by-directional model binding
  - &expr - expression execution binding

This change simplifies the terminology as well as
number of choices available to the developer. It
also supports local name aliasing from the parent.

BREAKING CHANGE: isolate scope bindings definition has changed and
the inject option for the directive controller injection was removed.

To migrate the code follow the example below:

Before:

scope: {
  myAttr: 'attribute',
  myBind: 'bind',
  myExpression: 'expression',
  myEval: 'evaluate',
  myAccessor: 'accessor'
}

After:

scope: {
  myAttr: '@',
  myBind: '@',
  myExpression: '&',
  // myEval - usually not useful, but in cases where the expression is assignable, you can use '='
  myAccessor: '=' // in directive's template change myAccessor() to myAccessor
}

The removed `inject` wasn't generaly useful for directives so there should be no code using it.
```

---

## 🎯결론

AngularJS 커밋 컨벤션은 단순한 메시지 형식이 아니라 **자동화·가독성·협업 효율성·장기 유지보수성**을 극대화하기 위한 **개발 문화의 표준화 도구**이다.

## ⚙️EndNote

### 더 알아보기

이 AngularJS 규칙은 나중에 아래 규칙들의 **직접적인 기반**이 되었다고 한다.

| 표준                       | 설명                                               |
| ------------------------ | ------------------------------------------------ |
| **Conventional Commits** | AngularJS 규칙을 표준화한 버전, <br>현재 대부분의 오픈소스 프로젝트가 채택 |
| **Semantic Release**     | 커밋 메시지를 분석해 자동 버전 태깅 및 릴리스 노트를 생성                |
| **Commitizen**           | 커밋 시 대화형으로 Angular 스타일을 유도하는 CLI 툴               |
