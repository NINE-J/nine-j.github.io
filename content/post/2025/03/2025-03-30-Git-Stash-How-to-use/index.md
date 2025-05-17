---
title: Git Stash
description: 지금 커밋하고 싶지 않아!
author: Nine
date: 2025-03-30
categories:
  - Version-control
  - Git
tags:
  - devlog
  - 형상관리
  - VersionControl
  - Git
image: cover.png
---
## 📌개요

`stash` 명령어는 작업 중인 변경사항을 임시로 저장하고 나중에 다시 적용할 수 있게 해주는 유용한 기능이다.
`stack` 자료구조 형태로 동작한다.
- 가장 최근에 저장한 `stash`가 맨 위 `stash@{0}`
- 그 다음으로 최근에 저장한 `stash`가 `stash@{1}`
- 이런 식으로 숫자가 커질 수록 오래된 `stash`가 된다.

## 📌내용

### stash

`stash`는 현재 작업 중인 변경사항을 임시로 저장하여 작업 디렉토리를 깨끗한 상태(`HEAD`와 동일한 상태)로 만들고 나중에 저장했던 변경 사항을 다시 적용할 수 있게 해주는 Git 명령어다.

### 사용 목적

- **브랜치 전환**: 현재 작업 중인 변경 사항을 커밋하지 않고 다른 브랜치로 전환해야 할 때
- **긴급 수정**: 갑자기 긴급한 버그 수정이 필요할 때 현재 작업을 일시 중단해야 할 경우
- **작업 중단 및 재개**: 작업을 임시로 중단하고 나중에 다시 시작해야 할 때
- **충돌 방지**: pull 등의 명령어로 인한 충돌을 피하고 싶을 때
- **실험적 변경 사항 관리**: 확신이 없는 변경 사항을 안전하게 저장해두고 싶을 때

### 기본 명령어

- 대괄호(`[]`)는 명령어 설명에서 선택적 매개변수를 나타낸다.
- 중괄호(`{}`)는 stash 인덱스의 실제 구문의 일부이므로 명령어 실행 시 반드시 포함해야 한다.

#### 변경 사항 저장

```bash
# 기본
git stash

# 메시지 기록
git stash save "메시지"
```

#### 저장된 stash 목록 확인

```bash
git stash list

# 출력 예시
stash@{0}: WIP on main: 1a2b3c4 이전 커밋 메시지
stash@{1}: On feature-branch: 상세 메시지
```

#### 저장된 stash 적용하기

```bash
# 가장 최근의 stash 적용
git stash apply

# 특정 stash 적용
git stash apply stash@{n}
```

#### stash 적용 후 삭제

```bash
# 가장 최근의 stash 적용 후 삭제
git stash pop

# 특정 stash 적용 후 삭제
git stash pop stash@{n}
```

#### 특정 stash 삭제

```bash
git stash drop stash@{n}
```

#### 모든 stash 삭제

```bash
git stash clear
```

#### stash의 내용 확인하기

```bash
# 최근 stash와 현재 디렉토리의 차이점 보기
git stash show

# 더 자세한 차이점 보기
git stash show -p

# 특정 stash의 차이점 보기
git stash show -p stash@{n}
```


### 심화 사용법

- 대괄호(`[]`)는 명령어 설명에서 선택적 매개변수를 나타낸다.
- 중괄호(`{}`)는 stash 인덱스의 실제 구문의 일부이므로 명령어 실행 시 반드시 포함해야 한다.

#### 특정 파일만 stash

```bash
git bash push -m "메시지" 파일1 파일2
```

#### Untracked 파일도 함께 stash하기

```bash
git stash -u
# 또는
git stash --include-untracked
```

#### 새 브랜치에 stash 적용

```bash
git stash branch 새브랜치명 [stash@{n}]
```

#### stash로부터 특정 파일만 복원

```bash
git checkout stash@{n} -- 파일경로
```

## 📌실제 활용 시나리오

### 작업 중 급한 버그 수정하기

```bash
# 현재 작업 중인 변경 사항 저장
git stash save "현재 기능 개발 중"

# main 브랜치로 전환
git checkout main

# 버그 수정 브랜치 생성
git checkout -b hotfix

# 버그 수정 작업...

# 버그 수정 커밋
git commit -a -m "중요 버그 수정"

# main 브랜치에 병합
git checkout main
git merge hotfix
git branch -d hotfix

# 원래 작업 브랜치로 돌아가기
git checkout feature-branch

# 저장해둔 작업 복원
git stash pop
```

### 충돌 해결하기

```bash
# 변경 사항 저장
git stash

# 원격 변경 사항 가져오기
git pull

# 저장한 변경 사항 적용 시도
git stash pop
```

#### 충돌이 발생하는 경우

충돌을 텍스트 편집기, IDE 등에서 수동으로 해결한 후

```bash
git add .
git commit -m "충돌 해결 및 stash 적용"
```

### 여러 개의 stash 관리

```bash
# 첫 번째 작업 저장
git stash save "기능 A 작업 중"

# 다른 작업 후 저장
git stash save "기능 B 작업 중"

# stash 목록 확인
git stash list

# 기능 A 작업으로 돌아가기
git stash apply stash@{1}
```

## 📌주의사항

- `stash`는 임시 저장소이므로 너무 오랫동안 중요한 변경 사항을 `stash`에만 보관하지 않는 것이 좋다.
- 여러 `stash`를 사용할 때는 명확한 메시지를 사용하여 구분하는 것이 중요하다.
- `stash`는 주로 로컬 작업에 사용되며 원격 저장소에 공유되지 않는다.
- 병합 충돌이 있는 파일은 `stash`할 수 없다.

## ⚙️EndNote

### Git config을 통한 stash 관련 설정

필요에 따라 적용한다.

```bash
# stash 시 untracked 파일을 항상 포함하도록 설정
git config --global stash.showIncludeUntracked true

# stash 명령 별칭(alias) 설정
git config --global alias.st stash
git config --global alias.stp 'stash pop'
git config --global alias.stl 'stash list'
```

### stash options

| 옵션                   | 축약형 | 영어 설명                                                                   | 한글 설명                                                       |
| ---------------------- | ------ | --------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `--all`                | `-a`   | include ignored files                                                       | 무시된(ignored) 파일까지 포함하여 stash한다.                    |
| `--include-untracked`  | `-u`   | include untracked files                                                     | 추적되지 않는(untracked) 파일까지 포함하여 stash한다.           |
| `--keep-index`         | `-k`   | all changes already added to the index are left intact                      | 이미 인덱스(스테이징 영역)에 추가된 변경사항은 그대로 유지한다. |
| `--message`            | `-m`   | specify stash description                                                   | stash에 대한 설명(메시지)을 지정한다.                           |
| `--no-keep-index`      |        | all changes already added to the index are undone                           | 인덱스에 추가된 변경사항도 모두 되돌린다.                       |
| `--patch`              | `-p`   | interactively select hunks from diff between HEAD and working tree to stash | HEAD와 작업 디렉토리 간의 차이를 대화형으로 선택하여 stash한다. |
| `--pathspec-file-nul`  |        | pathspec elements are separated with NUL character                          | 경로 지정자(pathspec) 요소가 NUL 문자로 구분된다.               |
| `--pathspec-from-file` |        | read pathspec from file                                                     | 파일에서 경로 지정자(pathspec)를 읽는다.                        |
| `--quiet`              | `-q`   | suppress all output                                                         | 모든 출력을 억제한다.                                           |

### stash show options

# Git Stash Show 옵션 테이블

| 옵션                         | 축약형     | 영어 설명                                                                            | 한글 설명                                                                     |
| ---------------------------- | ---------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `--abbrev`                   |            | use specified digits to display object names                                         | 객체 이름을 표시할 때 지정된 자릿수를 사용한다.                               |
| `--anchored`                 |            | generate diffs using the "anchored diff" algorithm                                   | "anchored diff" 알고리즘을 사용하여 차이점을 생성한다.                        |
| `--binary`                   |            | in addition to --full-index, output binary diffs for git-apply                       | `--full-index`와 함께 사용하면 git-apply를 위한 바이너리 차이점을 출력한다.   |
| `--break-rewrites`           | `-B`       | break complete rewrite changes into pairs of given size                              | 완전 재작성된 변경사항을 지정된 크기의 쌍으로 분리한다.                       |
| `--cc`                       | `-c`       | combined diff format for merge commits                                               | 병합 커밋을 위한 결합된 diff 형식을 사용한다.                                 |
| `--check`                    |            | warn if changes introduce trailing whitespace or space/tab indents                   | 변경사항이 후행 공백이나 공백/탭 들여쓰기를 도입하는 경우 경고한다.           |
| `--color`                    |            | show colored diff                                                                    | 색상이 있는 diff를 표시한다.                                                  |
| `--color-moved`              |            | color moved lines differently                                                        | 이동된 라인을 다른 색상으로 표시한다.                                         |
| `--color-moved-ws`           |            | configure how whitespace is ignored when performing move detection for --color-moved | `--color-moved` 사용 시 이동 감지에서 공백을 무시하는 방법을 설정한다.        |
| `--color-words`              |            | show colored-word diff                                                               | 단어 단위로 색상이 있는 diff를 표시한다.                                      |
| `--compact-summary`          |            | generate compact summary in diffstat                                                 | diffstat에 간결한 요약을 생성한다.                                            |
| `--cumulative`               |            | synonym for --dirstat=cumulative                                                     | `--dirstat=cumulative`의 동의어.                                              |
| `--diff-algorithm`           |            | choose a diff algorithm                                                              | diff 알고리즘을 선택한다.                                                     |
| `--diff-filter`              |            | select certain kinds of files for diff                                               | diff를 위한 특정 종류의 파일을 선택한다.                                      |
| `--dirstat`                  |            | generate dirstat by amount of changes                                                | 변경 양에 따라 dirstat을 생성한다.                                            |
| `--dirstat-by-file`          |            | generate dirstat by number of files                                                  | 파일 수에 따라 dirstat을 생성한다.                                            |
| `--dst-prefix`               |            | use given prefix for destination                                                     | 대상 파일에 주어진 접두사를 사용한다.                                         |
| `--exit-code`                |            | report exit code 1 if differences, 0 otherwise                                       | 차이가 있으면 종료 코드 1, 그렇지 않으면 0을 반환한다.                        |
| `--ext-diff`                 |            | allow external diff helper to be executed                                            | 외부 diff 도우미 실행을 허용한다.                                             |
| `--find-copies`              | `-C`       | detect copies as well as renames with given scope                                    | 주어진 범위 내에서 이름 변경뿐만 아니라 복사도 감지한다.                      |
| `--find-copies-harder`       |            | try harder to find copies                                                            | 복사본을 찾기 위해 더 많은 노력을 기울인다.                                   |
| `--find-object`              |            | look for differences that change the number of occurrences of specified object       | 지정된 객체의 발생 횟수를 변경하는 차이점을 찾는다.                           |
| `--find-renames`             | `-M`       | detect renames with given scope                                                      | 주어진 범위 내에서 이름 변경을 감지한다.                                      |
| `--follow`                   |            | continue listing the history of a file beyond renames                                | 파일 이름이 변경된 경우에도 파일 기록을 계속 나열한다.                        |
| `--full-index`               |            | show full object name of pre- and post-image blob                                    | 변경 전후 이미지 blob의 전체 객체 이름을 표시한다.                            |
| `--histogram`                |            | generate diffs with histogram algorithm                                              | 히스토그램 알고리즘으로 diff를 생성한다.                                      |
| `--ignore-all-space`         | `-w`       | ignore white space when comparing lines                                              | 라인 비교 시 모든 공백을 무시한다.                                            |
| `--ignore-blank-lines`       |            | ignore changes whose lines are all blank                                             | 빈 줄만 있는 변경사항을 무시한다.                                             |
| `--ignore-cr-at-eol`         |            | ignore carriage-return at end of line                                                | 줄 끝의 캐리지 리턴(CR)을 무시한다.                                           |
| `--ignore-matching-lines`    | `-I`       | ignore changes whose lines all match regex                                           | 모든 라인이 정규식과 일치하는 변경사항을 무시한다.                            |
| `--ignore-space-at-eol`      |            | ignore changes in whitespace at end of line                                          | 줄 끝의 공백 변경을 무시한다.                                                 |
| `--ignore-space-change`      | `-b`       | ignore changes in amount of white space                                              | 공백 양의 변경을 무시한다.                                                    |
| `--ignore-submodules`        |            | ignore changes to submodules                                                         | 서브모듈 변경을 무시한다.                                                     |
| `--inter-hunk-context`       |            | combine hunks closer than N lines                                                    | N 라인보다 가까운 헝크를 결합한다.                                            |
| `--irreversible-delete`      | `-D`       | omit the preimage for deletes                                                        | 삭제에 대한 이전 이미지를 생략한다.                                           |
| `--ita-invisible-in-index`   |            | hide 'git add -N' entries from the index                                             | 인덱스에서 'git add -N' 항목을 숨긴다.                                        |
| `--line-prefix`              |            | prepend additional prefix to every line of output                                    | 출력의 모든 라인에 추가 접두사를 붙인다.                                      |
| `--minimal`                  |            | spend extra time to make sure the smallest possible diff is produced                 | 가능한 가장 작은 diff를 생성하기 위해 추가 시간을 사용한다.                   |
| `--name-only`                |            | show only names of changed files                                                     | 변경된 파일의 이름만 표시한다.                                                |
| `--name-status`              |            | show only names and status of changed files                                          | 변경된 파일의 이름과 상태만 표시한다.                                         |
| `--no-color`                 |            | turn off colored diff                                                                | 색상 diff를 끈다.                                                             |
| `--no-color-moved-ws`        |            | don't ignore whitespace when performing move detection                               | 이동 감지 시 공백을 무시하지 않는다.                                          |
| `--no-ext-diff`              |            | disallow external diff helper to be executed                                         | 외부 diff 도우미 실행을 허용하지 않는다.                                      |
| `--no-indent-heuristic`      |            | disable heuristic that shifts diff hunk boundaries to make patches easier to read    | 패치를 더 쉽게 읽을 수 있게 하는 diff 헝크 경계 이동 휴리스틱을 비활성화한다. |
| `--no-patch`                 | `-s`       | suppress diff output                                                                 | diff 출력을 억제한다.                                                         |
| `--no-prefix`                |            | do not show any source or destination prefix                                         | 소스나 대상 접두사를 표시하지 않는다.                                         |
| `--no-renames`               |            | turn off rename detection                                                            | 이름 변경 감지를 끈다.                                                        |
| `--no-textconv`              |            | do not allow external text conversion filters to be run when comparing binary files  | 바이너리 파일 비교 시 외부 텍스트 변환 필터 실행을 허용하지 않는다.           |
| `--numstat`                  |            | generate more machine-friendly diffstat                                              | 기계 친화적인 diffstat을 생성한다.                                            |
| `--output`                   |            | output to a specific file                                                            | 특정 파일로 출력한다.                                                         |
| `--output-indicator-context` |            | specify the character to indicate a context line                                     | 컨텍스트 라인을 나타내는 문자를 지정한다.                                     |
| `--output-indicator-new`     |            | specify the character to indicate a new line                                         | 새 라인을 나타내는 문자를 지정한다.                                           |
| `--output-indicator-old`     |            | specify the character to indicate a old line                                         | 이전 라인을 나타내는 문자를 지정한다.                                         |
| `--patch`                    | `-u`, `-p` | generate diff in patch format                                                        | 패치 형식으로 diff를 생성한다.                                                |
| `--patch-with-raw`           |            | generate patch but also keep the default raw diff output                             | 패치를 생성하지만 기본 raw diff 출력도 유지한다.                              |
| `--patch-with-stat`          |            | generate patch and prepend its diffstat                                              | 패치를 생성하고 그 앞에 diffstat을 추가한다.                                  |
| `--patience`                 |            | generate diffs with patience algorithm                                               | patience 알고리즘으로 diff를 생성한다.                                        |
| `--pickaxe-all`              |            | when -S finds a change, show all changes in that changeset                           | -S가 변경을 찾으면 해당 변경 세트의 모든 변경을 표시한다.                     |
| `--pickaxe-regex`            |            | treat argument of -S as regular expression                                           | -S의 인수를 정규식으로 처리한다.                                              |
| `--raw`                      |            | generate default raw diff output                                                     | 기본 raw diff 출력을 생성한다.                                                |
| `--relative`                 |            | exclude changes outside and output relative to given directory                       | 주어진 디렉토리 외부의 변경을 제외하고 상대적으로 출력한다.                   |
| `--rename-empty`             |            | use empty blobs as rename source                                                     | 빈 blob을 이름 변경 소스로 사용한다.                                          |
| `--rotate-to`                |            | show the change in specified path first                                              | 지정된 경로의 변경을 먼저 표시한다.                                           |
| `--shortstat`                |            | generate summary diffstat                                                            | 요약 diffstat을 생성한다.                                                     |
| `--skip-to`                  |            | skip the output to the specified path                                                | 지정된 경로까지의 출력을 건너뛴다.                                            |
| `--src-prefix`               |            | use given prefix for source                                                          | 소스에 주어진 접두사를 사용한다.                                              |
| `--stat`                     |            | generate diffstat instead of patch                                                   | 패치 대신 diffstat을 생성한다.                                                |
| `--stat-count`               |            | generate diffstat with limited lines                                                 | 제한된 라인으로 diffstat을 생성한다.                                          |
| `--stat-graph-width`         |            | generate diffstat with a given graph width                                           | 주어진 그래프 너비로 diffstat을 생성한다.                                     |
| `--stat-width`               |            | generate diffstat with a given width                                                 | 주어진 너비로 diffstat을 생성한다.                                            |
| `--submodule`                |            | select output format for submodule differences                                       | 서브모듈 차이에 대한 출력 형식을 선택한다.                                    |
| `--summary`                  |            | generate condensed summary of extended header information                            | 확장 헤더 정보의 간결한 요약을 생성한다.                                      |
| `--text`                     | `-a`       | treat all files as text                                                              | 모든 파일을 텍스트로 취급한다.                                                |
| `--textconv`                 |            | allow external text conversion filters to be run when comparing binary files         | 바이너리 파일 비교 시 외부 텍스트 변환 필터 실행을 허용한다.                  |
| `--unified`                  | `-U`       | generate diff with given lines of context                                            | 주어진 라인 수의 컨텍스트로 diff를 생성한다.                                  |
| `--word-diff`                |            | show word diff                                                                       | 단어 단위 diff를 표시한다.                                                    |
| `--word-diff-regex`          |            | specify what constitutes a word                                                      | 단어를 구성하는 것을 지정한다.                                                |
| `--ws-error-highlight`       |            | specify where to highlight whitespace errors                                         | 공백 오류를 강조 표시할 위치를 지정한다.                                      |
| `-G`                         |            | look for differences whose added or removed line matches the given regex             | 추가되거나 제거된 라인이 주어진 정규식과 일치하는 차이점을 찾는다.            |
| `-O`                         |            | output patch in the order of glob-pattern lines in given file                        | 주어진 파일의 glob-패턴 라인 순서대로 패치를 출력한다.                        |
| `-R`                         |            | do a reverse diff                                                                    | 역방향 diff를 수행한다.                                                       |
| `-S`                         |            | look for differences that add or remove the given string                             | 주어진 문자열을 추가하거나 제거하는 차이점을 찾는다.                          |
| `-l`                         |            | limit number of rename/copy targets to run                                           | 실행할 이름 변경/복사 대상 수를 제한한다.                                     |
| `-z`                         |            | use NUL termination on output                                                        | 출력에 NUL 종료를 사용한다.                                                   |
