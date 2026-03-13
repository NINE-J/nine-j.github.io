---
publish: true
draft: false
title: AWS 배포 클래식
description: EC2 & RDS
author: Nine
date: 2025-06-23
categories:
  - AWS
tags:
  - devlog
  - AWS
  - SpringBoot
  - EC2
  - RDS
  - SSH
  - 보안그룹
  - 클라우드
  - 클라우드배포
  - 실전배포
# image: 
Status: Done
id: 019ce76a-c19b-77ef-bf30-0e82aa901dfc
slug: b9f1-devlog-aws-배포-클래식
---

## 📌개요

Spring Boot + PostgreSQL 앱을 AWS에 배포해 보려고 한다.
보안에 주의해야 할 부분들을 고려하면서 진행해 보자.

## 📌내용

### EC2 인스턴스 생성

Spring Boot 실행하기 위해 EC2를 사용한다.

#### 이름 및 태그

원하는 서버 이름으로 설정한다.

#### 애플리케이션 및 OS 이미지(Amazon Machine Image)

옵션이 다양해서 필요에 맞게 설정한다.

* AMI: Amazon Linux 또는 Ubuntu
  * 이번엔 Ubuntu 22.04 LTS
  * 64비트(x86)
* 인스턴스 유형: `t2.micro` FreeTier 사용 가능

#### 키 페어

키 페어 생성:

* `.pem` 파일 다운로드 (SSH 접속용)
* 생성 시 다운로드 되는 파일 보관

#### 네트워크 설정

> \[!WARNING]
> 테스트에만 사용하고 운영 시에는 특정 IP 또는 CloudFront, ALB 등으로 제한해야 한다.
> 특히 사용하지 않을 땐 아예 보안 그룹에서 제거하고 필요할 때 다시 구성해서 사용하는 것이 좋다.

대부분 자동 설정이고 원격 접속을 위해 SSH 설정

SSH 트래픽 허용:

* 현재 필요에 맞게 내 ip만 허용 또는 위치 무관 0.0.0.0/0
* 추후 보안 그룹 탭에서 변경 가능

#### 스토리지 구성

> \[!info]
> 프리 티어를 사용할 수 있는 고객은 최대 30GB의 EBS 범용(SSD)또는 마그네틱 스토리지를 사용할 수 있다.

스토리지까지 설정했다면 인스턴스 생성을 클릭해서 인스턴스 생성

#### 보안 그룹 수정

AWS에서 제공하는 방화벽 인바운드, 아웃바운드 규칙이 존재한다.

* 인바운드(Inbound): 외부에서 `EC2`, `RDS` 등의 내부로 접근할 때 사용되는 방화벽 규칙
* 아웃바운드(Outbound): `EC2`, `RDS` 등의 내부에서 외부로 접근할 때 사용되는 방화벽 규칙

`EC2 > 네트워크 및 보안 > 보안 그룹`으로 이동해서 보안 그룹 설정.
인스턴스 생성 시 설정했던 일부 보안 그룹을 확인할 수 있다.

생성 시 구성된 것 외에 필요에 맞게 보안 그룹 생성을 눌러 새로운 보안 그룹을 생성하고 구성한다.

##### 인바운드 규칙

1. 인바운드 규칙1:
   * 유형: 사용자 지정 TCP
   * 프로토콜: TCP
   * 포트 범위: 8080
   * 소스 유형: Anywhere-IPv4
   * 소스: 0.0.0.0/0
   * 설명 - 선택사항: Spring Boot
2. 인바운드 규칙2:
   * 유형: SSH
   * 프로토콜: TCP
   * 포트 범위: 22
   * 소스 유형: Anywhere-IPv4
   * 소스: 0.0.0.0/0
   * 설명 - 선택사항: SSH 연결
3. 인바운드 규칙3:
   * 유형: HTTP
   * 프로토콜: TCP
   * 포트 범위: 80
   * 소스 유형: Anywhere-IPv4
   * 소스: 0.0.0.0/0
   * 설명 - 선택사항: HTTP 요청
4. 인바운드 규칙4:
   * 유형: HTTPS
   * 프로토콜: TCP
   * 포트 범위: 443
   * 소스 유형: Anywhere-IPv4
   * 소스: 0.0.0.0/0
   * 설명 - 선택사항: HTTPS 요청

#### 인스턴스에 보안 그룹 적용

인스턴스 > 작업 > 보안 > 보안 그룹 변경 화면으로 이동해서

생성했던 보안 그룹 추가 후 저장

#### 인스턴스 연결

예를 들어 아래와 같은 명령으로 SSH 클라이언트에서 접속 시도할 수 있다.

```bash
ssh -i "sshKey.pem" ubuntu@ec1-2-34-56-789.ap-northeast-1.compute.amazonaws.com

# 연결 시 서버 정보 출력 예시
Welcome to Ubuntu 22.04.5 LTS (GNU/Linux 6.8.0-1029-aws x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Mon Jun 23 04:47:28 UTC 2025

  System load:  0.08              Processes:             101
  Usage of /:   5.8% of 28.89GB   Users logged in:       0
  Memory usage: 20%               IPv4 address for eth0: 172.31.39.182
  Swap usage:   0%

 * Ubuntu Pro delivers the most comprehensive open source security and
   compliance features.

   https://ubuntu.com/aws/pro

Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


The list of available updates is more than a week old.
To check for new updates run: sudo apt update


The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.
```

#### 어떻게 배포하는 게 적절할까?

| 상황                                      | 추천 방법                   |
| --------------------------------------- | ----------------------- |
| 빠른 실험, 개인 개발, MVP                       | **JAR 수동 업로드**          |
| 팀 개발, 협업, 배포 자동화 예정                     | **GitHub 클론 → 빌드 → 실행** |
| CI/CD (CodeDeploy, GitHub Actions 등) 준비 | **GitHub 기반**이 장기적으로 효율 |

### RDS에 PostgreSQL 생성

RDS > 데이터베이스 생성 화면에서 진행한다.

#### RDS 생성 시 주의 사항

* 엔진: PostgreSQL
* 인증 정보: 사용자명, 비밀번호 설정
* 퍼블릭 액세스: 비활성화
* 보안 그룹: EC2 인스턴스의 보안 그룹만 허용하도록 설정\`

#### 데이터베이스 생성 방식 선택

표준 생성 또는 손쉬운 생성 선택

#### 엔진 옵션

엔진 유형:

* Aurora(MySQL Compatible)
* Aurora(PostgreSQL Compatible)
* MySQL
* PostgreSQL
* MariaDB
* Oracle
* Microsoft SQL Server
* IBM Db2
  엔진 버전:
* 다중 AZ DB 클러스터를 지원하는 버전만 표시(토글)
* 엔진 버전: PostgreSQL 17.4-R1
* RDS 확장 지원 활성화(체크)

#### 템플릿

템플릿 선택:

* 프로덕션
* 개발/테스트
* 프리 티어

#### 가용성 및 내구성

> \[!INFO]
> 사용 사례에 필요한 가용성과 내구성을 제공하는 배포 옵션을 선택하세요. AWS는 선택한 배포 옵션에 따라 일정 수준의 가동 시간을 제공하기 위해 최선을 다하고 있습니다. [Amazon RDS SLA(서비스 수준 계약)에 포함되지 않습니다.](https://aws.amazon.com/rds/sla) .에서 자세히 알아보세요.

배포 옵션:

* 다중 AZ DB 클러스터 배포(인스턴스 3개)
* 다중 AZ DB 인스턴스 배포(인스턴스 2개)
* 단일 AZ DB 인스턴스 배포(인스턴스 1개)
  * 템플릿 프리 티어의 경우 1개만 선택 가능

#### 설정

* DB 인스턴스 식별자
  * DB 인스턴스 이름을 입력. 이름은 현재 AWS 리전에서 AWS 계정이 소유하는 모든 DB 인스턴스에 대해 고유해야 한다.
* 자격 증명 설정
  * 마스터 사용자 이름: DB 인스턴스의 마스터 사용자에 로그인 ID를 입력
  * 자격 증명 관리: AWS Secrets Manager를 사용하거나 마스터 사용자 자격 증명을 관리할 수 있다.
    * AWS Secrets Manager에서 관리 - \_가장 뛰어난 안정성\_RDS는 자동으로 암호를 생성하고 AWS Secrets Manager를 사용하여 전체 수명 주기 동안 암호를 관리한다.
    * 자체 관리사용자가 암호를 생성하거나 RDS에서 암호를 생성하고 사용자가 관리할 수 있다.
  * 암호 자동 생성(체크): Amazon RDS에서 자동으로 암호를 생성하거나 사용자가 직접 암호를 지정할 수 있다.
    * 마스터 암호, 마스터 암호 확인

#### 인스턴스 구성

DB 인스턴스 구성 옵션은 위에서 선택한 엔진에서 지원하는 옵션으로 제한된다.

DB 인스턴스 클래스(라디오):

* 스탠다드 클래스(m 클래스 포함)
* 메모리 최적화 클래스(r 및 x 클래스 포함)
* 버스터블 클래스(t 클래스 포함)
  * db.t4g.micro
  * 2 vCPUs, 1 GiB RAM, 네트워크: 최대 2,085Mbps

#### 스토리지

스토리지 유형:

* 범용 SSD(gp2): 볼륨 크기에 따라 기준 성능 설정
* 범용 SSD(gp3): 스토리지와 독립적으로 성능 조정
* 프로비저닝된 IOPS SSD(io1): I/O 프로비저닝 유연성
* 프로비저닝된 IOPS SSD(io2): 지연 시간에 짧고 내구성이 뛰어나며 I/O 집약적인 스토리지
* 마그네틱: 최대 1,000 IOPS로 제한됨(권장되지 않음)
  할당된 스토리지
* 얼만큼의 용량을 할당할 것인지 입력
* 할당된 스토리지 값은 20GiB\~6,144GiB여야 한다.
* 이후 필요에 따라 추가 스토리지 구성

#### 나머지 설정

* EC2 컴퓨팅 리소스에 연결, EC2 인스턴스 선택 등
* 데이터베이스 인증 방식 선택
* 모니터링 설정
* 추가 구성 설정

필요에 맞게 구성을 설정한 후 데이터베이스 생성

### EC2 연결 후 설치 및 설정

#### DB 설정

먼저 EC2에 접속한 상태에서 PostgreSQL 클라이언트를 설치하고, `postgres` 사용자로 접속한다.

```bash
# 1. PostgreSQL 클라이언트 설치 (Ubuntu 기준)
sudo apt update
sudo apt install postgresql-client -y

# 2. RDS에 접속
psql -h your-rds-endpoint.rds.amazonaws.com -U postgres -d postgres
# 비밀번호 입력하라고 나옴
# 비밀번호는 RDS 생성 시 설정한 `postgres` 사용자 비번
```

연결에 성공하면 앱 실행을 테스트를 위해 DB, Schema, 사용자를 생성한다.

DDL 스크립트를 작성한 sql 파일을 EC2에 배치한 뒤 psql 명령으로 테이블을 생성한다.

#### Java 설치

OpenLogic OpenJDK 17으로 프로젝트 테스트를 했지만 굳이 불필요하다면 openjdk-17-jdk로 충분하다.

```bash
# 1. 패키지 업데이트
sudo apt update

# 2. OpenJDK 17 설치 (기본은 OpenJDK, OpenLogic은 따로 설치)
sudo apt install openjdk-17-jdk -y
# 설치 후 터미널에서 설정 화면이 나타나는데 필요에 맞게 spacebar로 선택 후 enter

# 3. 버전 확인
java -version
```

### 빠르게 수동 테스트

간단하고 빠른 확인을 위해 빌드 후 수동 업로드로 테스트해본다.

##### JAR 빌드

> \[!WARNING]
> 빌드 전 RDS 인스턴스를 생성하고 DB 설정을 마무리한 후 그 정보로 `application-prod.yaml`을 구성한다.

```bash
./gradlew bootJar 
# 또는 ./mvnw package
```

##### EC2로 전송

ssh 원격 접속 프로토콜을 기반으로 한 SecureCopy(scp)의 약자.
원격지에 있는 파일과 디렉터리를 보내거나 가져올 때 사용하는 파일 전송 프로토콜

* 로컬에서
  ```bash
  # 경로 `~`는 `/home/ubuntu`를 의미한다.
  scp -i "sshKey.pem" build/libs/app.jar ubuntu@ec1-2-34-56-789.ap-northeast-1.compute.amazonaws.com:~
  ```
* 이후 EC2 내부에서 실행하는데 실행 시 프로파일 지정
  ```bash
  cd ~
  java -jar app.jar --spring.profiles.active=prod
  # 정상 실행 후 올라오는 주소 확인
  # http://[퍼블릭IP]:8080
  ```

80 포트로 바로 실행하는 경우 1024 아래의 포트라서 ubuntu에서 권한 관련 오류를 만날 수 있다.
Nginx를 사용해서 80 포트 접속 시 8080 포트의 사이트를 연결할 수 있도록 포트 포워딩 설정하는 방식이 안전할 수 있다. 필요에 따라 고민해보자.

### 보안 그룹 설정 확인

| 리소스 | 포트   | 설명                        |
| --- | ---- | ------------------------- |
| EC2 | 8080 | 외부에서 접속 가능해야 함 (브라우저 확인용) |
| RDS | 5432 | EC2 보안 그룹에서만 접근 허용        |

### 웹 접속 테스트

`http://[EC2 퍼블릭 IP]:8080/` 또는 `http://[EC2 퍼블릭 IP]:80/` 주소로 접속 테스트
Spring Boot 앱이 정상 작동하면 성공!

### DBeaver 클라이언트 테스트 (선택)

RDS에서 퍼블릭 접속을 허용하지 않도록 설정했기 때문에 SSH 터널링을 통해 클라이언트 연결을 시도해야 한다.

별도 설정이 필요했던 부분만 정리한다.

* 새로운 연결 생성 > Main 탭
  * EC2 입장에서 로컬 접속할 수 있게 설정한다.
* SSH 탭
  * Use SSH 터널 체크
  * Settings 섹션
    * Host/IP: EC2 엔드포인트, Port: 22
    * User Name: EC2 생성 시 User
    * Authentication Method: Public Key
    * Private Key: 생성 시 발급 받은 `*.pem` 선택
  * Advanced settings 섹션
    * Remote host: RDS DB 엔드포인트, Remote Port: 5432

### 다음 단계 (선택)

필요한 경우 아래와 같은 설정으로 더 효율적인 운영 구조를 만들 수 있다.

* EC2에서 systemd로 백그라운드 실행 설정
* PostgreSQL 보안 최적화
* Route53 + HTTPS 연결
* CloudWatch 로그 연결

## 🎯결론

> **보안성과 실용성을 모두 갖춘 Spring Boot + PostgreSQL의 AWS 수동 배포 구조를 성공적으로 구현했다.**
>
> 퍼블릭 IP를 열지 않고도 EC2 내부에서 RDS를 안전하게 연결하고, 외부에서는 HTTP/Nginx로만 접근 가능한 구조를 통해 실무에서도 적용 가능한 배포 경험을 확보했다.

* 실습 기반의 배포 경험은 인프라 지식과 보안 개념까지 익힐 수 있는 좋은 기회였다.
* Spring Boot 애플리케이션을 EC2에 안전하게 배포하고, RDS 연결 및 DB 초기 설정까지 포함한 완전한 구성 흐름을 경험했다.
* 추후 systemd 등록, TLS 인증서 추가, CI/CD 적용까지 이어질 수 있는 확장 가능한 구성이다.

## ⚙️EndNote

### 사전 지식

* AWS EC2, RDS의 기본 개념
* SSH 키 기반 원격 접속
* Spring Boot JAR 빌드 및 실행 방식
* PostgreSQL 기초 쿼리 및 사용자 권한 설정

### 더 알아보기

* [Amazon EC2 공식 문서](https://docs.aws.amazon.com/ec2/)
* [Amazon RDS 공식 문서](https://docs.aws.amazon.com/rds/)
* [Spring Boot 배포 가이드](https://docs.spring.io/spring-boot/docs/current/reference/html/deployment.html)
* Nginx 리버스 프록시 설정
* [DBeaver 공식 사이트](https://dbeaver.io/)
* SSH 터널링 개념
