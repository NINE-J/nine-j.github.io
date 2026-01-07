---
publish: true
 draft: false
title: Git 멀티 SSH 키 관리
description: Git/Linux/WSL 환경별 대응
author: Nine
date: 2025-10-15 18:30:33
categories:
  - VersionControl
tags:
  - devlog
  - SSH
  - SSH-Key
  - Git
  - GitHub
  - 멀티계정
  - Linux
  - WSL
  - Dev-Container
  - Docker
  - 권한-설정
  - VersionControl
  - Infra
  - DevOps

Status: Done
---
## 📌개요

PC에서 여러 GitHub 계정과 프로젝트에서 SSH 키를 효율적으로 관리하는 방법을 정리한다.

## 📌내용

### SSH 키 구성 예시

#### SSH 키 파일들

```bash
~/.ssh/
├── id_ed25519                   # 기본/개인 계정용 개인 키
├── id_ed25519.pub               # 기본/개인 계정용 공개 키
├── id_ed25519_company           # 회사 계정용 개인 키
├── id_ed25519_company.pub       # 회사 계정용 공개 키
└── config                       # SSH 설정 파일
```

#### SSH Config 설정 (`~/.ssh/config`)

>[!TIP]
>`~` 경로는 대부분의 OS에서 사용자 폴더를 의미한다.

```bash
# 기본 GitHub 설정 (개인 계정용)
Host github.com
HostName github.com
User git
IdentityFile ~/.ssh/id_ed25519

# 개인 계정 명시적 설정 (기본과 동일, 필요 시 변경)
Host github.com-personal
HostName github.com
User git
IdentityFile ~/.ssh/id_ed25519

# 회사 계정용 설정
Host github.com-company
HostName github.com
User git
IdentityFile ~/.ssh/id_ed25519_company
```

### 사용 방법

#### 1. 기본 사용

일반적인 GitHub URL을 그대로 사용:

```bash
git clone git@github.com:username/my-project.git
git remote add origin git@github.com:username/repository-name.git
```

#### 2. 명시적 개인 계정 사용

```bash
git clone git@github.com-personal:username/repository-name.git
git remote add origin git@github.com-personal:username/repository-name.git
```

#### 3. 회사 계정 사용

```bash
git clone git@github.com-company:CompanyOrg/repository-name.git
git remote add origin git@github.com-company:CompanyOrg/repository-name.git
```

### 새로운 계정/키 추가 방법

#### 1. 새 SSH 키 생성

```bash
ssh-keygen -t ed25519 -C "your-email@example.com" -f ~/.ssh/id_ed25519_newaccount
```

#### 2. SSH Config에 설정 추가

```bash
# ~/.ssh/config에 추가
Host github.com-newaccount
HostName github.com
User git
IdentityFile ~/.ssh/id_ed25519_newaccount
```

#### 3. GitHub에 공개 키 등록

```bash
# 공개 키 내용 복사
cat ~/.ssh/id_ed25519_newaccount.pub
```

`GitHub Settings > SSH and GPG keys`에서 등록

#### 4. 사용

```bash
git clone git@github.com-newaccount:NewAccount/repository-name.git
```

### SSH 연결 테스트

각 계정별로 SSH 연결을 테스트할 수 있다.

```bash
# 기본 계정
ssh -T git@github.com

# 개인 계정 명시적 테스트
ssh -T git@github.com-personal

# 회사 계정
ssh -T git@github.com-company
```

성공시 다음과 같은 메시지가 출력된다.

```text
Hi [계정명]! You've successfully authenticated, but GitHub does not provide shell access.
```

### 프로젝트별 설정 확인

현재 프로젝트가 어떤 SSH 키를 사용하는지 확인

```bash
git remote -v
git config --list | grep remote.origin.url
```

### 권한 설정

SSH 파일들의 올바른 권한 설정은 **Unix/Linux 기반 시스템에서 필수**다.

#### 권한 설정이 필요한 환경

- ✅ **Linux/Ubuntu**
- ✅ **macOS** 
- ✅ **WSL (Windows Subsystem for Linux)**
- ✅ **Docker 컨테이너**
- ✅ **개발 컨테이너 (Dev Container)**
- ❌ **Windows 네이티브** (NTFS 권한으로 자동 관리)

#### Windows vs Unix/Linux 차이점

| 환경                   | 권한 시스템   | SSH 권한 설정 |
| -------------------- | -------- | --------- |
| Windows 네이티브         | NTFS ACL | 불필요 (자동)  |
| WSL/Linux/macOS      | Unix 권한  | **필수**    |
| Docker/Dev Container | Unix 권한  | **필수**    |

#### Windows에서 SSH 사용하기

##### Windows 네이티브 환경

```powershell
# PowerShell 또는 Command Prompt에서
# SSH 키 생성
ssh-keygen -t ed25519 -C "your-email@example.com"

# SSH 키는 보통 C:\Users\[username]\.ssh\ 에 저장
# 권한 설정은 Windows가 자동으로 관리
```

**Windows 네이티브 특징:**
- `chmod` 명령어 없음
- NTFS 권한으로 자동 관리
- SSH 클라이언트가 적절한 권한 자동 설정
- 수동 권한 설정 불필요

##### WSL 환경

```bash
# WSL에서는 Linux와 동일하게 권한 설정 필요
chmod 700 ~/.ssh
chmod 600 ~/.ssh/config
chmod 600 ~/.ssh/id_*
chmod 644 ~/.ssh/*.pub
```

**WSL 특징:**
- Linux 파일 시스템 사용
- Unix 권한 모델 적용
- 권한 설정 필수

### macOS: Darwin

#### SSH가 권한을 엄격하게 요구하는 이유 (Unix/Linux)

- Unix/Linux 시스템에서 SSH가 엄격한 권한을 요구하는 이유:
    1. **보안 정책**: 개인 키가 다른 사용자에게 노출되는 것을 방지
    2. **인증 무결성**: 권한이 올바르지 않으면 SSH 연결 자체가 거부됨
    3. **파일 보호**: 중요한 인증 정보의 무단 접근 차단

#### 올바른 권한 설정

```bash
# SSH 디렉토리 권한 (소유자만 접근 가능)
chmod 700 ~/.ssh

# config 파일 권한 (소유자만 읽기/쓰기)
chmod 600 ~/.ssh/config

# 개인 키 파일들 권한 (소유자만 읽기/쓰기)
chmod 600 ~/.ssh/id_*

# 공개 키 파일들 권한 (소유자 읽기/쓰기, 다른 사용자 읽기만)
chmod 644 ~/.ssh/*.pub

# 소유권 설정 (현재 사용자로 설정)
sudo chown -R $USER:$USER ~/.ssh
```

#### 권한 확인

```bash
# 현재 권한 상태 확인
ls -la ~/.ssh/

# 올바른 출력 예시:
# drwx------  (700) 소유자만 SSH 디렉토리 접근
# -rw-------  (600) 소유자만 개인 키/config 파일 접근  
# -rw-r--r--  (644) 공개 키는 다른 사용자도 읽기 가능
```

### 문제 해결

#### 권한 오류 해결

오류 메시지

```text
Bad owner or permissions on /home/node/.ssh/config
fatal: Could not read from remote repository.
```

- **원인:** SSH 파일들의 권한이 너무 개방적이거나 소유권이 잘못됨
- **해결 단계:**
    1. **권한 확인**:
       ```bash
       ls -la ~/.ssh/
       ```
    2. **권한이 `777` (rwxrwxrwx)인 경우 수정**:
       ```bash
       sudo chmod 700 ~/.ssh
       sudo chmod 600 ~/.ssh/config
       sudo chmod 600 ~/.ssh/id_*
       sudo chmod 644 ~/.ssh/*.pub
       ```
    3. **소유권 문제인 경우**:
       ```bash
       sudo chown -R $USER:$USER ~/.ssh
       ```
    4. **권한 설정 후 테스트**:
       ```bash
       ssh -T git@github.com
       ```

#### SSH 키가 인식되지 않는 경우

SSH Agent에 키 추가
 
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
ssh-add ~/.ssh/id_ed25519_company
```

#### 잘못된 키 사용

원격 URL 확인 및 수정

```bash
# 현재 설정 확인
git remote -v

# 원격 URL 변경
git remote set-url origin git@github.com-[account]:owner/repository.git
```

### 예시 프로젝트 설정

**my-blog**: 기본 설정 사용 (`git@github.com:username/my-blog.git`)

- SSH 키: `~/.ssh/id_ed25519`
- GitHub 계정: 개인 계정

### 확장 계획

향후 새로운 계정이나 프로젝트가 추가될 때는 패턴으로 관리

```bash
Host github.com-[account-name]
HostName github.com
User git
IdentityFile ~/.ssh/id_ed25519_[account-name]
```

이를 통해 체계적이고 확장 가능한 SSH 키 관리가 가능하다.

### 현재 구성 검증

현재 SSH 구성이 올바르게 작동하는지 확인해본다.

1. **권한 설정 (필수!)**:

   ```bash
   # 모든 권한을 한 번에 설정
   sudo chmod 700 ~/.ssh
   sudo chmod 600 ~/.ssh/config ~/.ssh/id_*
   sudo chmod 644 ~/.ssh/*.pub
   sudo chown -R $USER:$USER ~/.ssh
   ```

2. **SSH 연결 테스트**:

   ```bash
   ssh -T git@github.com
   # 성공시: "Hi [username]! You've successfully authenticated..."
   ```

3. **Git push 테스트**:

   ```bash
   git push origin master
   ```

**⚠️ 중요:** 권한 설정 없이는 SSH가 작동하지 않을 수 있다.
`Bad owner or permissions` 오류가 발생하면 반드시 위의 권한 설정을 먼저 수행하자.

## 🎯결론

로컬/WSL/컨테이너 등에서 SSH 충돌 없이 깔끔하게 멀티 계정을 운용하는 방법을 정리해봤다.

- 새 계정 추가는 키 생성, `~/.ssh/config`에 Host 추가, 공개키 등록, `ssh -T` 테스트, 원격 URL 설정의 5단계 
- WSL은 **리눅스 홈 경로**에 `.ssh`를 두고, 필요 시 `includeIf`/`url.insteadOf`로 **디렉터리별 자동 라우팅**을 적용하면 실수할 일이 줄어든다.

## ⚙️EndNote

### 사전 지식

- **SSH 키 쌍**: `ed25519`가 권장(짧고 안전, 빠름). 공개키는 등록·공유, 개인키는 비밀 유지.
- **SSH 설정 파일**: `~/.ssh/config`로 Host 단위 설정(별칭, `IdentityFile`, `IdentitiesOnly`).
- **퍼미션 기초**: `~/.ssh`(700), 개인키(600), 공개키/`config`(644~600).
- **WSL/NTFS 차이**: NTFS 마운트 경로는 퍼미션 판정이 달라 OpenSSH가 거부할 수 있음. **리눅스 홈** 사용.
- **ssh-agent**: 메모리 상에 키를 보관·서명. 키가 많으면 인증 실패가 늘어남 → `IdentitiesOnly`로 해결.
- **Git 원격 URL 형태**: `git@HOST:OWNER/REPO.git`(SCP 구문) 또는 `ssh://git@HOST/OWNER/REPO.git`.
- **Git 라우팅 자동화(선택)**: `~/.gitconfig`의 `includeIf`(디렉터리 기준 설정), `url.<base>.insteadOf`(호스트 치환).

### 더 알아보기

- GitHub Docs: _Connecting to GitHub with SSH_, _About SSH certificate authorities_, _Managing multiple accounts_
- OpenSSH Manual: `ssh(1)`, `ssh_config(5)`, `ssh-agent(1)`, `ssh-add(1)`
- Git Documentation: `git-config(1)`(특히 `includeIf`, `url.<base>.insteadOf`), `git-remote(1)`
- Microsoft Docs: _WSL 파일 권한 & NTFS 상호작용_ 가이드
- 보안 심화: _ed25519-sk_(FIDO2/보안키 기반), `ProxyJump`(점프호스트), `KnownHosts` 고급 설정