---
publish: true
draft: false
title: GitHub Actions 트리거와 시나리오
description: 자동화된 CI/CD 파이프라인
author: Nine
date: 2025-08-03T00:00:00
categories:
  - DevOps
  - GitHubActions
tags:
  - devlog
  - github-actions
  - trigger
  - CI
  - CI/CD
  - automation
  - 배포자동화
  - 파이프라인
# image: 
Status: Done
id: 019ce76a-c1ab-7614-9459-eae06d13441e
slug: b9f1-devlog-github-actions-트리거와-시나리오
---

## 📌개요

CI/CD 자동화는 트리거(Trigger)를 어떻게 설정하느냐에 따라 큰 차이가 있다.

GitHub Actions에서 사용 가능한 다양한 트리거 유형과 각 트리거가 적합한 실전 시나리오를 정리해보자.
워크플로우 실행 조건을 전략적으로 설정하면 효율적이고 예측 가능한 자동화를 구현할 수 있다.

## 📌내용

### GitHub Actions 트리거 유형과 용도

| 트리거 유형                | 설명                  | 대표 시나리오               |
| --------------------- | ------------------- | --------------------- |
| `push`                | 브랜치나 태그에 push될 때 작동 | `main` 브랜치 병합 후 자동 배포 |
| `pull_request`        | PR 생성/수정 시 작동       | PR 단위로 빌드 및 테스트       |
| `workflow_dispatch`   | 수동 실행 버튼            | QA 테스트 후 직접 배포        |
| `schedule`            | cron 표현식 기반 정기 실행   | 새벽마다 DB 백업, 주간 리포트 생성 |
| `repository_dispatch` | 외부 앱의 API 호출로 작동    | CMS 수정 시 블로그 자동 재배포   |
| `workflow_call`       | 다른 워크플로우에서 호출       | 공통 빌드/테스트 재사용         |
| `issue_comment`       | 특정 댓글이 달릴 때         | “/deploy” 댓글로 수동 배포   |
| `release`             | GitHub Release 생성 시 | 태그 기반 배포              |
| `create` / `delete`   | 브랜치/태그 생성 또는 삭제 시   | 브랜치 생성 시 테스트 환경 설정    |

### 시나리오 예시

#### 1. 자동 테스트와 빌드

PR 생성 시마다 테스트 자동 실행

```yaml
on:
  pull_request:
    branches: [main, develop]
```

#### 2. 배포 자동화

main 브랜치로 push 시 프로덕션 자동 배포

```yaml
on:
  push:
    branches: [main]
```

#### 3. 수동 배포 버튼

QA 검증 완료 후 사람이 버튼을 눌러 배포

```yaml
on:
  workflow_dispatch:
```

#### 4. 정기 실행 자동화

새벽마다 DB 백업 스크립트 실행

```yaml
on:
  schedule:
    - cron: '0 3 * * *' # 매일 03:00
```

#### 5. 댓글 기반 배포 자동화

이슈나 PR에 `/deploy` 댓글 달리면 배포

```yaml
on:
  issue_comment:
    types: [created]
jobs:
  deploy:
    if: github.event.comment.body == '/deploy'
```

## 🎯결론

> CI/CD 자동화는 ‘언제’ 실행할지를 똑똑하게 고르는 것이 핵심이다.

GitHub Actions의 트리거를 전략적으로 활용하면 반복 작업을 줄이고, 안정적인 자동화 파이프라인을 구성할 수 있다.

## ⚙️EndNote

### 사전 지식

* GitHub 저장소와 브랜치 개념
* YAML 문법
* CI/CD 개요

### 더 알아보기

* [GitHub Actions 트리거 공식 문서](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
* [GitHub Actions cron syntax](https://crontab.guru/)
* [Reusable workflows 공식 문서](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows)
