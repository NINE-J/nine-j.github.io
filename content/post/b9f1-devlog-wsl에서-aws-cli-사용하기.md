---
publish: true
draft: false
title: WSL에서 AWS-CLI 사용하기
description: aws-cli 설치 및 사용
author: Nine
date: 2025-06-27T12:44:22
categories:
  - WSL
tags:
  - devlog
# image: 
Status: Done
id: 019ce76a-c322-7442-8ced-0c2359a7b0cb
slug: b9f1-devlog-wsl에서-aws-cli-사용하기
---

## 📌개요

Windows에 AWS CLI를 설치했지만 WSL(Windows Subsystem for Linux)에서는 `aws` 명령어가 작동하지 않아 별도의 설치가 필요하다.

WSL 환경에 AWS CLI를 설치하고 기본 설정과 인증 테스트를 진행해보자.

## 📌내용

### AWS CLI 설치 후 명령어 없음

처음에 Windows에만 AWS CLI를 설치했을 때 `PowerShell`, `CMD`, `git bash`에서는 잘 동작했지만 WSL에서 `aws --version`을 입력하자 `command not found` 오류가 발생했다.

이는 WSL이 독립적인 Linux 환경이기 때문이다.
아래와 같은 순서로 문제를 해결했다.

#### WSL에서 AWS CLI 다운로드 및 설치

`curl`, `unzip` 역시 별도의 설치가 필요하다.
AWS CLI가 주목적이므로 문서 하단에 정리한다.

AWS CLI를 다운로드 받아 설치한다.

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
# 실행 시 다운로드
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 63.1M  100 63.1M    0     0  56.5M      0  0:00:01  0:00:01 --:--:-- 56.6M

# 다운로드 받은 파일 압축 해제 -> aws 폴더로 압축 해제된다.
unzip awscliv2.zip

# 압축 해제된 폴더에서 install 실행
sudo ./aws/install
```

#### 설치 확인

```bash
aws --version
# 출력 예시
aws-cli/2.16.1 Python/3.11.5 Linux/5.15.90.1-microsoft-standard-WSL2 exe/x86_64.ubuntu.20 prompt/off
```

#### 자격 증명 및 기본 리전 설정

```bash
aws configure
# 입력을 요구한다
AWS Access Key ID [None]: <AccessKey>
AWS Secret Access Key [None]: <SecretKey>
Default region name [None]: ap-northeast-2
Default output format [None]: json
```

#### 설정 확인

```bash
aws configure list
# 출력 예시
      Name                    Value             Type    Location
      ----                    -----             ----    --------
   profile                <not set>             None    None
access_key     ****************DW73 shared-credentials-file
secret_key     ****************KVdy shared-credentials-file
    region           ap-northeast-2      config-file    ~/.aws/config
```

#### 인증 테스트

```bash
aws sts get-caller-identity
# 출력 예시
{
    "UserId": "AIDAEXAMPLEID",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/your-username"
}
```

### 필요한 툴 설치

이미 WSL을 사용하고 있다면 초기에 설치를 했겠지만 만약 없다면 `curl`, `unzip` 역시 별도의 설치가 필요하다.

> \[!TIP] `sudo apt update`
> **패키지 목록(index) 갱신** 명령이다.
> 리눅스에서 패키지를 설치할 때는, 인터넷에서 즉시 최신 패키지를 내려받는 게 아니라\
> 먼저 로컬에 _“이 저장소에는 어떤 패키지가, 어떤 버전으로, 어떤 의존성을 가지고 있는지”_\
> 리스트를 저장해 두고 그걸 참조해서 설치한다.

```bash
# 패키지 목록 갱신
sudo apt update
# curl 설치
sudo apt install curl
# unzip 설치
sudo apt install unzip
```

## 🎯결론

WSL에 AWS CLI를 설치하려면 Windows와 별개의 환경으로 인식하고 Linux용 CLI를 직접 설치해야 한다.

## ⚙️EndNote

### 사전 지식

* WSL (Windows Subsystem for Linux)의 개념
* AWS IAM 사용자 Access Key와 Secret Key 발급 방법
* 기본 Linux 패키지 설치 (`apt` 명령)

### 더 알아보기

* [AWS CLI 공식 문서](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
* [AWS IAM 사용자 관리](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html)
* [WSL 공식 가이드](https://learn.microsoft.com/windows/wsl/)
