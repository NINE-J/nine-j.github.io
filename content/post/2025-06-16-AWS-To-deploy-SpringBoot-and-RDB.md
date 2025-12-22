---
publish: true
draft: false
title: AWS 배포 기초
description: 가장 기초적인 개념
author: Nine
date: 2025-06-16 17:00:28
categories:
  - AWS
tags:
  - devlog
# image: Status: Done
---
## 📌개요

AWS에 배포하려면 반드시 알아야 할 기초적인 개념과 구성 요소들을 간단히 알아보자.

## 📌내용

### AWS 인프라 기초 개념

|항목|설명|
|---|---|
|**EC2**|AWS의 가상 서버. Spring Boot 애플리케이션을 직접 배포할 수 있음.|
|**RDS**|AWS에서 제공하는 관리형 관계형 데이터베이스 서비스. MySQL, PostgreSQL 등 선택 가능.|
|**S3**|파일(정적 리소스, 로그 등) 저장용 버킷.|
|**VPC**|Virtual Private Cloud. 네트워크 설정 단위. EC2, RDS는 VPC 내에 배치됨.|
|**IAM**|권한 관리. EC2, RDS에 접근 가능한 사용자/서비스 권한 설정.|
|**Security Group**|AWS 방화벽 설정. EC2, RDS 접근을 허용하는 IP/포트 지정.|

### 배포 순서별 필수 지식

#### 1.Spring Boot 앱 배포 준비

- **빌드**: `./gradlew bootJar` 또는 `mvn package`
- **환경 분리**: `application.yml` 혹은 `application-prod.yml`로 외부 DB 설정
- **로깅/에러 처리**: EC2 상에서 로그를 확인할 수 있어야 함 (`/var/log`, `nohup.out`, etc.)

#### 2.EC2 인스턴스 생성

- **Amazon Linux 2** 또는 **Ubuntu 22.04** 선택
- 포트 22(SSH), 8080(Spring 앱 포트) 열기
- 인바운드 규칙에 **내 PC의 IP만 허용** (보안상 중요)

#### 3.EC2에 접속 및 배포

- `scp`로 JAR 파일 전송하거나, `git clone`
- Java 설치 (`sudo yum install java-17` 등)
- 앱 실행: `java -jar your-app.jar`
- 실행 확인: `curl localhost:8080`, 또는 브라우저에서 접속

#### 4.RDS 인스턴스 생성 및 연결

- **DB 엔진** 선택: PostgreSQL, MySQL 등
- **VPC/Subnet**, 보안 그룹 설정
- 인스턴스 생성 후 **엔드포인트 + 포트 + 유저/비밀번호**를 Spring Boot `application.yml`에 입력
- DB 연결 확인: `psql`, `mysql` 등 CLI 도구 사용 가능

#### 5.배포 안정화 및 운영

- EC2 재부팅 시 앱 자동 실행: `systemd` 설정 또는 `cron`, `nohup`
- 로그 파일 분리: `logback`, `log4j2` 설정
- AWS CloudWatch 연동하면 서버 상태 모니터링 가능

### 반드시 체크해야 할 보안 요소

| 항목        | 설명                                                      |
| --------- | ------------------------------------------------------- |
| 보안 그룹     | 포트 제한 (22, 8080, 5432 등 최소화)                            |
| DB 접근 제한  | EC2의 private IP만 RDS 접근 허용                              |
| .pem 키 관리 | Git 업로드 절대 금지. 로컬에 안전하게 보관                              |
| 환경변수 관리   | DB 비밀번호는 코드에 하드코딩하지 말고 `.env` 또는 AWS Parameter Store 사용 |

### 실무적으로 꼭 알아야 할 추가 지식

| 주제                                    | 이유                      |
| ------------------------------------- | ----------------------- |
| **Elastic IP**                        | EC2 재시작 시 IP가 바뀌는 문제 방지 |
| **Route53 + 도메인 연결**                  | 도메인 연결 시 설정             |
| **S3 + CloudFront**                   | 정적 리소스 캐싱/배포            |
| **CodeDeploy / CodePipeline**         | CI/CD 자동 배포 구성          |
| **Parameter Store / Secrets Manager** | 민감 정보 안전하게 관리           |

## 🎯결론

직접 생성해보며 확인해야 할 부분이 있지만 일단 간략한 개념부터 정리하고 알아봤다.

### 기초 체크리스트

-  EC2 생성 및 SSH 접속
-  Spring Boot JAR 빌드 및 실행
-  RDS 생성 및 연결
-  포트 및 보안그룹 설정
-  로그 관리 및 서버 실행 유지
-  보안 설정 (환경변수, IP 제한 등)

## ⚙️EndNote

### 사전 지식

- 리눅스 CLI 명령어 (`scp`, `chmod`, `java`, `systemctl` 등)
- Spring Boot 프로파일, 환경변수 구조
- RDB 기본 설정 및 JDBC 연결 구조

### 더 알아보기

- [Overview of Deployment Options on AWS (공식 백서)](https://aws.amazon.com/whitepapers/overview-of-deployment-options-on-aws/)
- [AWS App Runner Developer Guide](https://docs.aws.amazon.com/apprunner/latest/dg/)
- [Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [Spring Boot + RDS 가이드 (Spring 공식)](https://spring.io/guides/gs/accessing-data-mysql/)