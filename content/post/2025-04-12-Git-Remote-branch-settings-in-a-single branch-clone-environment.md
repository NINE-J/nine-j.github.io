---
publish: true
title: Git 원격 브랜치 설정
description: feat.싱글 브랜치 클론 환경
author: Nine
date: 2025-04-12
categories:
  - VersionControl
  - Git
tags:
  - devlog
  - Git
# image: Status: Done
---
## 📌개요

싱글 브랜치 명령어를 사용해서 특정 브랜치만 클론한 저장소에서는 원격 저장소의 다른 브랜치를 확인할 수 없다.

이런 상황에서 원격 브랜치를 추가, 삭제, 추적하는 방법을 알아보자.

## 📌내용

### 어떤 상황이냐면?

```bash
git clone -b <브랜치_이름> --single-branch <원격_저장소_URL>
```

위 명령으로 특정 브랜치만 클론하면 `.git/config` 파일에 해당 브랜치에 대한 정보만 기록된다.

특정 브랜치만 추적하기 위해 의도적으로 싱글 브랜치 클론을 받은 거라서 문제라고 하긴 뭐하지만, 추가적으로 다른 브랜치를 확인하고 싶은 경우를 예로 든다.

`git remote show <저장소>` 또는 `git branch -a` 명령어를 실행해도 원격 저장소의 다른 브랜치 목록을 확인할 수 없다.

`git checkout` 또는 `git switch` 명령어를 사용하여 원격의 다른 브랜치로 전환할 수 없다.
특정 브랜치만 로컬로 가져와 추적하고 원격 저장소에 또 다른 어떤 브랜치가 있는지 모르기 때문이다.

### 어떡하지?

#### 원격 브랜치 확인

```bash
# 로컬, 원격 모두 보기
git branch -a
# 또는 원격 브랜치 보기
git branch -r
```

하지만 싱글 브랜치 옵션으로 로컬에 클론했기 때문에 특정 브랜치만 확인되고 나머지 원격 저장소에 존재하는 브랜치를 확인할 수 없다.

#### 원격 브랜치 추가 추적

1개 또는 그 이상의 브랜치를 추적할 수 있게 추가한 뒤 `fetch` 명령으로 브랜치에 대한 업데이트를 가져온다.

`git remote set-branches` 명령 사용 시 옵션을 함께 사용하지 않으면 덮어쓰기 되는 걸 주의하자.

```bash
# 옵션 없이 사용하면 .git/config 덮어쓰기 된다.
git remote set-branches origin <브랜치_이름1> <브랜치_이름2> ...
# --add 옵션과 함께
git remote set-branches origin --add <브랜치_이름1> <브랜치_이름2> ...
# 이후 조회 <저장소> = origin 또는 upstream
git remote show <저장소>
# 조회 후 업데이트 가져오기
git fetch
```

원격 브랜치 정보를 가져왔고 전환할 수 있게 됐다면,
직접 전환하거나 브랜치 목록을 추가할 수 있다.

```bash
# 추적하며 전환
git checkout -t <브랜치_이름>
# 또는 로컬 브랜치를 생성하며 원격 브랜치를 추적하도록 설정
git checkout -b <브랜치_이름> origin/<브랜치_이름>
```

브랜치 전환이 정상적으로 됐다면 원격 브랜치를 제대로 추적하고 있는지 확인한다.

```bash
git branch -vv

# 출력 결과
#  브랜치명1 1q2w3e4r [origin/브랜치명1] Merge pull request
#* 브랜치명2 4r3e2w1q [origin/브랜치명2] feat: shomething
```

### 추가가 된다면 삭제는?

`git remote set-branches` 명령어에는 `--add` 옵션이 있어서 추가할 수 있지만 삭제 옵션은 없다.
덮어쓰기가 가능하다는 점을 이용해서 추적 중지하고 싶은 브랜치를 제외하고 등록한다.

```bash
# 옵션 없이 사용하면 .git/config 덮어쓰기 된다.
git remote set-branches origin <브랜치_이름1> <브랜치_이름2> ...
# 이후 조회 <저장소> = origin 또는 upstream
git remote show <저장소>
```

## 🎯결론

추적 브랜치를 조정하는 작업은 `fetch` 명령 시 업데이트 정보를 확인하거나 브랜치를 전환하기 위함이다.

- 원격 저장소에 브랜치가 많은데 모두 받긴 싫고 특정 브랜치로만 작업하고자 한다면 싱글 브랜치로 특정 브랜치만 가진 클론을 생성할 수 있다.
- 이후 추가적으로 다른 브랜치의 정보도 확인이 필요하다면 조정할 수 있다.

추적 브랜치를 추가하면 브랜치 목록에서 확인할 수 있다.
하지만 한 번이라도 추적이 된 브랜치라면 `git remote set-branches` 명령을 통해 제외하더라도 `git branch -r` 또는 `git branch -a` 옵션을 통한 명령어의 결과에선 계속 확인된다.

`fetch` 설정과 원격 브랜치 목록 조회 명령어가 서로 다른 정보를 사용하기 때문이다.

## ⚙️EndNote

### 최후의 수단

`.git/config` 파일을 직접 수정한다.

1. `.git/config` 파일을 텍스트 편집기로 연다.
2. `[remote "origin"]`과 같이 원하는 섹션에서 삭제하려는 브랜치에 대한 `fetch` 항목을 찾아 삭제하고 파일을 저장한다.

파일 정보를 예를 들면 아래와 같다.

```text
[remote "origin"]
  url = <원격_저장소_URL>
  fetch = +refs/heads/브랜치명2:refs/remotes/origin/브랜치명2
  fetch = +refs/heads/브랜치명3:refs/remotes/origin/브랜치명3
  fetch = +refs/heads/브랜치명4:refs/remotes/origin/브랜치명4
```