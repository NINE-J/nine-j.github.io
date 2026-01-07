---
publish: true
 draft: false
title: Git 추적 브랜치 관리
description: 근데 이제 Fork를 곁들인
author: Nine
date: 2025-04-08
categories:
  - VersionControl
  - Git
tags:
  - devlog

Status: Done
---
## 📌개요

Git 원격 저장소를 클론할 때 모든 브랜치를 클론하지 않고 필요한 특정 브랜치만 클론하는 방법.
`git fetch` 명령 시 업데이트를 확인할 브랜치를 지정하는 방법.
추가로 Fork한 저장소의 브랜치명이 바뀐 경우를 반영 방법을 알아본다.

## 📌내용

### 저장소 클론 시 특정 브랜치만

저장소 클론 시 특정 브랜치만 추적하고 싶다면 브랜치명과 `--single-branch`을 사용한다.

```bash
git clone -b <브랜치_이름> --single-branch <원격_저장소_URL>
```

이렇게 하나의 브랜치만 내려 받으면 하나의 브랜치만 추적 관리되고 `fetch` 명령 시 다른 브랜치의 업데이트는 확인하지 않아 필요한 브랜치만 업데이트 되니 효율적인 것 같다.

### 특정 브랜치의 업데이트만 확인

저장소에 브랜치가 너무 많거나 뭐 다른 이유가 있어서 `git fetch` 명령 실행 시 모든 브랜치를 업데이트하는 것이 아니라 특정 브랜치의 업데이트만 확인하고 싶을 때

```bash
# git remote -v 명령으로 조회한 저장소 이름 origin, upstream 등등
# 해당 명령은 실행마다 덮어씌워지는 점 참고
git remote set-branches <저장소 이름> <브랜치_이름1> <브랜치_이름2> ...
# 기존 목록은 유지한채로 특정 브랜치를 더 추가하고 싶다면
git remote set-branches <저장소 이름> <브랜치_이름1> <브랜치_이름2> --add <브랜치_이름3> <브랜치_이름4> ...

# 이후 적용 확인
# git remote -v 명령으로 조회한 저장소 이름 origin, upstream 등등
git remote show <저장소 이름>
```

- `git remote show` 명령으로 확인하면 특정 브랜치만 추적 설정된 게 보인다.
- `git remote -r` 또는 `git remote -a`의 경우 이미 추적된 브랜치는 계속 목록이 표시된다.
- 하지만 `git fetch` 명령에 가져오는 건 `git remote set-branches`명령으로 설정한 브랜치만 최신화 된다.
- 만약 `git remote set-branches` 설정 후 다른 브랜치의 업데이트도 확인해야 한다면 `git fetch --all`을 사용한다.

모든 브랜치를 다시 추적하겠다면 와일드 카-드

```bash
# git remote -v 명령으로 조회한 저장소 이름 origin, upstream 등등
git remote set-branches <저장소 이름> "*"
```

origin, upstream 저장소에서 삭제된 브랜치 로컬에 반영해서 추적 브랜치 최신화

```bash
git fetch --prune origin
# 또는
git fetch --prune upstream
```

### upstream 원본 저장소의 변경

Github에서 Fork한 저장소를 로컬에 클론하면 upstream을 등록하게 된다.
그럼 origin, upstream 두 remote를 가진 저장소에서 변경 사항을 어떻게 반영할지 고민해본다.


Github에서 포크한 저장소의 원본 저장소에서 브랜치명 변경이 발생한 케이스에 
Pull Request할 때 어떤 브랜치를 어떤 브랜치에 합칠 건지 선택하기 때문에 내가 포크한 저장소의 브랜치는 원본 브랜치와 꼭 동일하게 맞출 필요가 없긴 하다.

근데 일단 변경 사항과 동일하게 맞춰 보고 싶었다.

### 원하는 해결책

내 작업 사항은 유지하면서, 원본 저장소에서 변경된 브랜치를 고대~로 내가 포크한 저장소에 반영하고 싶음

### 문제

- Github에서 포크한 저장소의 경우 원본 저장소의 변경은 새롭게 받아올 수 있는데, 브랜치명만 바뀐 경우 반영할 수 있는 기능이 없음.
- Pull Request 걸려 있는 상태임
	- 브랜치명이 변경되면 PR은 자동으로 닫힘
	- PR 걸린 브랜치는 살려놔도 됨

### 신속한 해결책

그냥 깔끔하고 신속한 방법으로 맞추겠다 하면

- 깔끔하게 새롭게 포크 받기
- upstream에 대한 미러 클론을 로컬에 받아서 `.git` 파일을 기존 저장소에 교체
	- 로컬 브랜치와 충돌이 발생할 수 있음
	- 로컬 커밋 이력이 사라지고 새롭게 포크하는 것과 차이가 없음

### 복잡한 해결책

#### Github에서 브랜치 이름 수정

- 정성스럽게 각 브랜치의 이름을 변경한다.

#### 원본 저장소의 브랜치 변경을 일괄 적용

내가 작업한 브랜치만 남기고 모두 정리한 상태로 upstream에 변경된 브랜치들을 내려 받아 포크한 저장소에 반영할 예정

로컬 저장소의 origin을 upstream 주소로 변경
또는 upstream의 브랜치를 로컬에 생성

```bash
git branch -r | awk '{print $1}' | grep -v '^origin/HEAD$' | while read remote; do git branch --track "${remote#origin/}" "$remote"; done
```

모든 브랜치를 받아온 뒤 다시 origin 복구
이후 origin에 모든 브랜치 업로드

```bash
git branch | grep -v '^*' | while read branch; do
  git push origin "$branch";
done
```

마지막으로 필요한 브랜치만 남기고 모두 삭제

```bash
# main, develop, master, 특정브랜치이름 만 남기고 삭제
git branch | grep -v 'main\|develop\|master\|특정브랜치이름' | grep -v '^*' | xargs git branch -D
```

## ⚙️EndNote

### 물리 파일 수정

권장되지 않는 방법이지만 빠르게 반영되고 좋다.
`.git` 폴더 아래 필요한 파일들을 삭제하거나 수정한다.