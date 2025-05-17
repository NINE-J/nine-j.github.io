---
title: Jekyll 블로그 빌드 속도 개선
description: 빌드 시간을 최적화 하는 방법
author: Nine
date: 2025-05-06 15:11:17
categories:
  - Jekyll
tags:
  - devlog
  - Jekyll
image: cover.png
---
## 📌개요

Jekyll은 간단하게 정적 블로그를 운영할 수 있는 훌륭한 도구다.
하지만 블로그 글이 많아질 수록 플러그인이 늘어날 수록 빌드 시간이 길어지는 문제가 생긴다.

배포 빌드에선 풀 빌드해야 하니 다른 전략에서 다루고 일단 로컬부터 빌드 최적화 방법을 정리해본다.

## 📌내용

### `--incremental` 옵션 활용

로컬에서 테스트할 때 가장 손쉽게 적용할 수 있는 옵션

```
bundle exec jekyll s --incremental
```

이 옵션은 마지막 빌드 후 변경된 파일만 다시 빌드해줘서 속도를 꽤 개선할 수 있다.
하지만 주의할 점은 새 파일 추가는 감지하지 못한다는 점이다.
그래서 새 포스트나 페이지를 추가한 경우엔 다시 풀 빌드를 돌려야 한다.

### `--limit_posts` 하나의 포스트만 빌드하기

parse & publish할 포스트의 개수를 제한해서 필요한 파일만 빠르게 빌드하고 확인한다.
최근 포스팅을 우선으로 빌드 되는 것 같다.

```bash
# bundle exec jekyll s --limit_posts <포스팅 수>
bundle exec jekyll s --limit_posts 1
```

### `--profile` 옵션으로 병목 찾기

어떤 파일이나 플러그인이 빌드 속도를 잡아먹는지 알고 싶다면 이 옵션을 사용해본다.

```
bundle exec jekyll s --profile
```

빌드 로그에 각각 파일의 처리 시간이 나오는데 유난히 시간이 많이 걸리는 파일이나 플러그인이 있으면 구조를 개선하거나 비활성화하는 방법을 찾을 수있다.

### `--jekyll clean`으로 캐시 초기화

증분 빌드를 계쏙 쓰다 보면 캐시 문제로 꼬이는 경우가 생긴다.
이때는 다음 명령어로 캐시를 초기화하면 깔끔하다.

```
bundle exec jekyll clean
```

매번 서버를 새로 켜기 전에 이걸 실행하면 문제 해결에 도움이 된다.

### `exclude`와 `keep_files`로 불필요한 파일 제외

`_config.yml` 파일에 다음 옵션을 추가해 빌드에서 제외할 파일을 명확히 설정하는 것도 중요하다.

```
exclude:
  - node_modules
  - README.md
  - Gemfile
  - vendor

keep_files:
  - .git
  - .svn
```

특히 `node_modules`나 대용량 폴더는 반드시 제외해야 한다.

### 디렉터리 구조 개선

컬렉션이나 커스텀 폴더를 많이 사용하고 있다면 구조를 간결하게 재정비하는 것도 도움이 된다.
복잡한 디렉터리 구조는 Jekyll의 내부 처리 속도를 저하시킬 수 있다.

### 플러그인 최소화 및 최적화

`jekyll-feed`, `jekyll-seo-tag` 등 기본 플러그인은 큰 문제가 없지만 커스텀 플러그인이 많아질 수록 속도가 느려진다.

불필요한 플러그인은 과감히 제거하고 꼭 필요하다면 코드를 최적화하거나 대안을 찾아보자.

### 이미지 최적화

이미지가 많다면 이미지 크기 최적화만으로도 빌드 속도가 향상된다.
필요하다면 이미지 자체를 외부 CDN으로 분리하는 것도 한 방법이다.

## 🎯결론

Jekyll은 심플함이 강점인 만큼 대규모 데이터엔 한계가 있다.
하지만 위 방법만 잘 적용해도 중형 블로그까지는 무리 없이 빠른 속도로 유지할 수 있다.

규모가 커진다면 다른 대체제를 고려해보자.

## ⚙️EndNote

### 참고 자료

- [Jekyll의 빌드 시간을 최적화하는 방법](https://selosele.github.io/2020/11/08/optimize-jekyll-slow-build-time/)
- [Jekyll 블로그 빌드속도 개선하기](https://yangeok.github.io/blog/2019/05/21/jekyll-caching.html)
