---
publish: true
 draft: false
title: Git Reset VS Checkout
description: reset과 checkout의 차이를 이해한다.
author: Nine
date: 2025-03-30
categories:
  - VersionControl
  - Git
tags:
  - devlog
  - 형상관리
  - VersionControl
  - Git

Status: Done
---
## 📌개요

`git reset`과 `git checkout`은 과거 커밋으로 이동하거나 작업 상태를 수정하는 데 사용되는 명령어다.
두 명령어는 서로 다른 목적과 작동 방식을 가지며, 특히 `staging` 영역을 다룰 때도 활용한다.
그 목적과 작동 방식에 대한 차이를 알아본다.

## 📌내용

### reset

잘못된 커밋을 취소하거나 과거의 특정 시점으로 브랜치를 완전히 되돌려야 할 때 사용한다.
이 명령어는 커밋 이력뿐만 아니라 `staging` 영역과 작업 디렉토리 상태를 조정할 수 있다.

3가지 옵션과 함께 사용할 수 있으며 `git reset [--option] [commitHash]` 형태로 사용한다.
옵션을 지정하지 않으면 기본 옵션은 `--mixed`로 실행된다.

```bash
# 커밋 기록만 되돌리고 작업 디렉토리와 스테이징 영역의 변경 사항은 유지
git reset --soft
# 커밋 기록과 스테이징 영역을 되돌리고 작업 디렉토리에 변경 사항은 유지
git reset
git reset --mixed
# 커밋 기록, 스테이징 영역, 작업 디렉토리 모두를 되돌린다.(주의: 되돌린 변경 사항은 복구할 수 없다.)
git reset --hard
```

| 옵션        | 커밋 기록         | 스테이징 영역         | 작업 디렉토리         | 설명                                                                                                                                      |
| --------- | ------------- | --------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `--soft`  | ❗지정된 커밋으로 되돌림 | 변경 사항 유지        | 변경 사항 유지        | 커밋 기록만 되돌리고 변경 사항은 유지한다. 되돌린 커밋 이후의 변경 사항을 다시 커밋하려는 경우에 유용하다.                                                                           |
| `--mixed` | ❗지정된 커밋으로 되돌림 | ❗지정된 커밋 상태로 되돌림 | 변경 사항 유지        | 커밋 기록과 스테이징 영역을 되돌리고 작업 디렉토리의 변경 사항은 유지된다. 되돌린 커밋 이후의 변경 사항을 수정하거나 다시 스테이징하려는 경우 사용한다. (기본 옵션)                                          |
| `--hard`  | ❗지정된 커밋으로 되돌림 | ❗지정된 커밋 상태로 되돌림 | ❗지정된 커밋 상태로 되돌림 | ❗커밋 기록, 스테이징 영역, 작업 디렉토리 모두를 되돌린다. 되돌린 커밋 이후의 모든 변경 사항은 완전히 삭제되며, 복구할 수 없다. 변경 사항을 완전히 버리고 과거 시점으로 되돌아 가려는 경우에 사용해야 한다. (주의해서 사용해야 한다.) |

#### staging 영역과 reset

`git reset`이 스테이징 영역에 사용되는 이유는 `--mixed`와 `--soft` 옵션은 스테이징 영역을 조작할 수 있기 때문이다.
예를 들어 `git reset --mixed HEAD`는 스테이징 영역의 모든 파일을 `unstage` 상태로 내리고 작업 디렉토리의 변경 사항은 유지한다.
이는 잘못 스테이징한 파일을 내리거나 커밋 전에 스테이징 상태를 재조정할 때 유용하다.

```bash
git add file1.txt # file1.txt를 staging에 추가
git reset HEAD file1.txt # file1.txt를 staging에서 내림
```

#### reset 명령 후 기존 HEAD로 돌아가는 방법

##### ORIG_HEAD 사용

- `git reset` 명령어를 실행하면 Git은 `ORIG_HEAD`라는 특수한 참조에 이전 `HEAD` 위치를 저장한다.
- `git reset --hard ORIG_HEAD` 명령어를 사용하여 `reset` 실행 직전의 `HEAD` 위치로 돌아갈 수 있다.
- 이 방법은 `reset` 실행 직후에만 사용할 수 있으며, 다른 명령어를 실행하면 `ORIG_HEAD`가 변경될 수 있다.

```bash
$ git log --oneline
2f8b5a0 세 번째 커밋
817f30a 두 번째 커밋
55c82a4 첫 번째 커밋

$ git reset HEAD~1
Unstaged changes after reset:
M file2.txt

$ git log --oneline
817f30a 두 번째 커밋
55c82a4 첫 번째 커밋

$ git reset --hard ORIG_HEAD
HEAD is now at 2f8b5a0 세 번째 커밋

$ git log --oneline
2f8b5a0 세 번째 커밋
817f30a 두 번째 커밋
55c82a4 첫 번째 커밋
```

##### reflog 사용

- `git reflog`는 Git 저장소에서 `HEAD`가 이동한 모든 기록을 보여준다. 이를 통해 `reset` 실행 전의 `HEAD` 위치를 찾을 수 있다.
- `git reflog` 명령어를 실행하면 `HEAD`가 이동한 기록과 해당 커밋의 해시값이 표시된다.
- 기존 `HEAD`위치의 커밋 해시값을 찾은 후 `git reset --hard [커밋 해시값]` 명령어를 사용하여 해당 위치로 돌아갈 수 있다.

```bash
$ git log --oneline
2f8b5a0 세 번째 커밋
817f30a 두 번째 커밋
55c82a4 첫 번째 커밋

$ git reset HEAD~1
Unstaged changes after reset:
M file2.txt

$ git log --oneline
817f30a 두 번째 커밋
55c82a4 첫 번째 커밋

$ git reflog
817f30a HEAD@{0}: reset: moving to HEAD~1
2f8b5a0 HEAD@{1}: commit: 세 번째 커밋
817f30a HEAD@{2}: commit: 두 번째 커밋
55c82a4 HEAD@{3}: commit (initial): 첫 번째 커밋

$ git reset --hard HEAD@{1}
HEAD is now at 2f8b5a0 세 번째 커밋

$ git log --oneline
2f8b5a0 세 번째 커밋
817f30a 두 번째 커밋
55c82a4 첫 번째 커밋
```

### checkout

과거의 특정 시점의 파일 상태를 확인하거나, 다른 브랜치로 전환할 때 사용한다.

1. 브랜치로 이동하면 해당 브랜치의 최신 커밋으로 작업 디렉토리와 스테이징 영역의 상태가 변경되고 새로운 커밋은 해당 브랜치에 추가된다.
2. 특정 커밋으로 이동하면 `detached HEAD` 상태가 되어 새로운 커밋을 만들면 현재 브랜치와 분리된 별도의 커밋 기록이 생성된다.
	- 현재 브랜치와 분리된 임시적인 커밋 기록에 생성된다.
	- 이 임시 커밋 기록은 특정 브랜치에 열결되지 않으므로 나중에 브랜치에 병합하거나 저장하지 않으면 사라질 수 있다.
	- 임시 커밋의 작업 내용을 유지하려면 새로운 브랜치를 생성해야 한다.

#### staging 영역과 checkout

`git checkout`이 스테이징 영역에 사용되는 이유는 `git checkout -- [file]` 명령은 특정 파일을 마지막 커밋 상태로 되돌리며, 스테이징 영역에서도 해당 파일을 `unstaged` 상태로 내린다.
이는 작업 디렉토리와 스테이징 영역의 변경 사항을 취소하고 저장소 상태로 되돌릴 때 유용하다.

```bash
git add file1.txt # file1.txt를 staging에 추가
git checkout -- file1.txt # file1.txt의 변경 사항
```

#### checkout 명령 후 기존 HEAD로 돌아가는 방법

##### ORIG_HEAD 사용

- `git reset` 명령어를 실행하면 Git은 `ORIG_HEAD`라는 특수한 참조에 이전 `HEAD` 위치를 저장한다.
- `git checkout ORIG_HEAD` 명령어를 사용하여 `checkout` 실행 직전의 `HEAD` 위치로 돌아갈 수 있다.
- 이 방법은 `reset` 실행 직후에만 사용할 수 있으며, 다른 명령어를 실행하면 `ORIG_HEAD`가 변경될 수 있다.

```bash
$ git log --oneline
2f8b5a0 세 번째 커밋
817f30a 두 번째 커밋
55c82a4 첫 번째 커밋

$ git checkout HEAD~1
HEAD is now at 817f30a 두 번째 커밋

$ git log --oneline
817f30a 두 번째 커밋
55c82a4 첫 번째 커밋

$ git branch
* (HEAD detached at 817f30a) master

$ git checkout ORIG_HEAD
Switched to branch 'master'

$ git log --oneline
2f8b5a0 세 번째 커밋
817f30a 두 번째 커밋
55c82a4 첫 번째 커밋

$ git branch
* master
```

##### reflog 사용

- `git reflog`는 Git 저장소에서 `HEAD`가 이동한 모든 기록을 보여준다. 이를 통해 `checkout` 실행 전의 `HEAD` 위치를 찾을 수 있다.
- `git reflog` 명령어를 실행하면 `HEAD`가 이동한 기록과 해당 커밋의 해시값이 표시된다.
- 기존 `HEAD` 위치의 커밋 해시값을 찾은 후 `git checkout [커밋 해시값]` 명령어를 사용하여 해당 위치로 돌아간다.

```bash
$ git log --oneline
2f8b5a0 세 번째 커밋
817f30a 두 번째 커밋
55c82a4 첫 번째 커밋

$ git checkout HEAD~1
HEAD is now at 817f30a 두 번째 커밋

$ git log --oneline
817f30a 두 번째 커밋
55c82a4 첫 번째 커밋

$ git branch
* (HEAD detached at 817f30a) master

$ git reflog
817f30a HEAD@{0}: checkout: moving to HEAD~1
2f8b5a0 HEAD@{1}: commit: 세 번째 커밋
817f30a HEAD@{2}: commit: 두 번째 커밋
55c82a4 HEAD@{3}: commit (initial): 첫 번째 커밋

$ git checkout HEAD@{1}
Switched to branch 'master'

$ git log --oneline
2f8b5a0 세 번째 커밋
817f30a 두 번째 커밋
55c82a4 첫 번째 커밋

$ git branch
* master
```

### staging 영역에서 reset과 checkout의 사용 이유

`git reset`과 `git checkout`은 스테이징 영역을 다룰 때 활용되는데 이는 두 명령어가 파일 상태를 조정하는 방식 때문이다.

#### reset

- 스테이징 영역의 파일을 내리는 데 주로 사용된다.
- 변경된 파일을 작업 디렉토리에 남기고 스테이징 상태만 초기화할 때 유용하다.
	- 예: 실수로 스테이징한 파일을 내리고 다시 수정하고 싶을 때

#### checkout

- 스테이징 영역과 작업 디렉토리의 변경 사항을 모두 취소하며 파일을 마지막 커밋 상태로 되돌린다.
- 스테이징에 올린 파일을 버리고 원래 상태로 복구할 때 사용된다.
	- 예: 실수로 수정한 파일을 완전히 되돌리고 싶을 때

## 🎯결론

`reset`은 과거를 수정하고, `checkout`은 현재를 전환한다고 볼 수 있다.
두 명령어는 스테이징 영역을 다룰 때 보완적으로 사용되며, 상황에 따라 적절히 선택해야 한다.

### reset

주로 커밋 히스토리를 수정하거나 스테이징 영역과 작업 디렉토리를 특정 상태로 되돌릴 때 사용한다.

- `git reset`은 브랜치의 커밋 이력을 변경하여 특정 커밋으로 되돌리는데 사용된다.
- 커밋이력 자체를 변경한다.

### checkout

브랜치 간 전환이나 특정 파일/커밋 상태를 작업 디렉토리에 반영할 때 사용한다.

- `git checkout`은 작업 디렉토리와 스테이징 영역의 상태를 특정 커밋 또는 브랜치로 변경하는 데 사용된다.
- 파일의 특정 시점 정보를 확인하기 위함.
- 브랜치 전환에 사용.

### 차이점

- `reset`은 커밋 히스토리와 상태를 적극적으로 변경하며 되돌리기 중심.
- `checkout`은 주로 상태 확인이나 전환에 초점, 히스토리 변경 없음.