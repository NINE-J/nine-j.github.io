---
title: SVN을 사용해보자.
description: "SVN: SubVersion"
author: Nine
date: 2022-04-12T10:00:00
categories:
  - VersionControl
  - SVN
tags:
  - devlog
  - SVN
  - SubVersion
  - VersionControl
  - 버전관리
  - 형상관리
image: cover.png
---
## 📌개요

이번 근무지에선 SVN을 사용한다.
SVN은 다양한 버전이 있고 사용하는 OS에 맞는 것을 선택할 수 있다.

## 📌설치

우선 사용 중인 `VISUALSVN SERVER`로 작성하겠다.
사이트에서 설치 파일을 받아 설치한다.

### 설치 과정

- 라이선스 동의
- 서버와 관리자 또는 관리자만, command line tools 환경 변수 등록 등 옵션 선택
- 설치 경로, 저장소 경로, 서버 포트, 백업 경로 등을 설정
- 색인 설정
- Subversion 또는 Windows 인증 방식 설정

## 📌저장소 생성

### 1.Repository Type

#### FSFS (Fast Secure File System)

표준 Subversion Repository로 기본적으로 사용하는 저장소

#### VDFS (VisutalSVN Distributed File System)

분산 파일 시스템과 유사한 형태를 지니며 특징은 다음과 같다.

 - Master / Slave 형태의 아키텍처로 구성  
 - Commit할 경우 Master Server로 적용된 후 Slave Server로 자동 복제 됨  
 - Slave Server로도 Commit 가능하며, 이 경우에 동이에 Master Server로도 자동 Commit 됨

>[!info] **Distributed VDFS는 FSFS repository와 기능적으론 동일**하다. 그렇기 때문에 **서버 구성을 어떻게 할 것인가**에 따라 FSFS / VDFS를 선택하면 된다.

### 2.Repository Structure

Repository Type을 선택한 후에는 Repository Structure를 선택해야 한다.

이 두가지의 차이는 간단하다.
하나의 Repository에 하나의 프로젝트를 관리하는지 아니면 여러 개의 프로젝트를 관리하는지에 따라 선택하면 된다.

- **Empty repository** : Standard Project로, 한 개의 Repository에 **여러 Project를 관리**할 수 있는 구조로 Repository를 생성한다.
- **Single-Project Repository** : 한 개의 Repository에 **하나의 Proeject를 관리**할 수 있는 구조로 Repository를 생성한다.

### 3.Respository Access Permissions

마지막으로 권한 설정이다.

- **Nobody has access** : 아무나 접근 가능
- **All Subversion users have Read/Write access** : SVN에 등록된 User들 접근 가능
- **Customize Permissions** : 커스터마이징에 따라 접근 가능

## 📌Checkout

SVN은 Git과 동작 방식이 다르다.
그래서 checkout 이후에 생기는 outgoing이 찝찝해서 알아봄.

### Checkout만 했는데 Outgoing이요?

- SVN에서는 Checkout 작업 자체가 로컬에 원격 저장소의 파일과 디렉토리를 가져오는 작업이다.
- 따라서 Checkout 이후에는 로컬 작업 디렉토리에 원격 저장소의 상태가 복제되어 추적된다. 이로 인해 변경된 사항이나 새로 생성된 파일 등이 발생할 수 있다.
- 따라서 새로운 Checkout은 변경된 내용이 있는 것처럼 Outgoing으로 표시될 수 있다.

1. 예를 들어 `TEST`라는 원격 저장소를 받았는데 자동으로 메이븐 업데이트며 유효성 검사며 빌드며.. 진행하면서 생기는 변경 사항들을 svn ignore 처리했는데도 `TEST`라는 폴더에 변경사항이 있다고 outgoing이 표시될 수 있다.
2. 이를 checkout 했다는 의미로 커밋을 하던, 무시하고 작업한 이후에 작업 내용과 함께 커밋을 하던 본인이나 팀의 방식대로 사용하는 것이 찝찝함을 없앨 수 있는 하나의 방법 같다.

### SVN과 Git은 다르다.

SVN에서는 Checkout 후에 변경 사항이 있는 것처럼 Outgoing이 표시될 수 있다.
이는 SVN이 원격 저장소와 로컬 사이의 상태를 비교하기 때문이다.
하지만 이렇게 표시되더라도 변경 사항이 없는 것이라면 이를 무시하거나 커밋하지 않고 무시할 수 있다.

Git의 경우에는 Clone 작업을 통해 저장소를 가져오더라도 파일의 추적이나 변경 사항이 바로 일어나지 않는다.
이는 Git의 동작 방식과 SVN의 동작 방식이 다르기 때문이다.
Git에서는 로컬에 있는 작업 디렉토리에서 명시적으로 `git add` 명령어를 사용하여 추적하거나 변경 사항을 스테이징해야 한다.

간단히 말하자면, SVN의 Checkout은 원격 저장소의 상태를 로컬에 복제하는 작업이다.
이로 인해 변경 사항이 있는 것처럼 Outgoing으로 표시될 수 있다.
그러나 변경 사항이 없다면 이를 무시하거나 커밋하지 않고 무시할 수 있다.
Git과 SVN는 다르게 동작하므로, Git의 Clone과 SVN의 Checkout은 이러한 점에서 차이가 있다.

## 🎯결론

필요한 SVN을 설치해서 저장소와 사용자 인증을 생성하고 URL을 공유할 수 있는 형태로 만든다.

공유 받은 URL을 사용해 형상 관리를 한다. 끝.