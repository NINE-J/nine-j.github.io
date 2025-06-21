---
title: AWS
description: What is Amazon Web Services
author: Nine
date: 2025-06-20 16:47:07
categories:
  - AWS
tags:
  - devlog
  - AWS
  - AmazonWebServices
image: cover.png
---
## 📌개요

"AWS란 무엇인가" 묻고 또 묻는 것 같은데 이해하고 넘어가는 건 개발자, 기업, 비즈니스 의사 결정자 모두에게 중요한 출발점이다.
AWS(Amazon Web Services)의 개념, 주요 서비스 그리고 그것이 가져다주는 실질적인 가치에 대해 알아 보자.

## 📌내용

### AWS란?

AWS는 Amazon이 제공하는 클라우드 컴퓨팅 서비스 플랫폼으로 인터넷을 통해 온디맨드 방식으로 컴퓨팅 파워, 데이터베이스 스토리지, 컨텐츠 전송 등 IT 리소스를 제공하는 서비스다.

개발자는 서버를 설치하고 운영하는 번거로움 없이 애플리케이션 개발과 서비스 운영에 집중할 수 있다.

- 온디맨드(On-demand): 수요자가 요청하는 시점에 맞춰 즉시 서비스를 제공하는 방식

### AWS의 핵심 구성 요소

AWS는 수많은 서비스를 제공하지만 대표적인 주요 구성 요소를 보면 다음과 같다.

|구성 요소|설명|
|---|---|
|**EC2**|가상 서버 인스턴스를 생성하고 관리할 수 있는 서비스|
|**S3**|파일 저장용 객체 스토리지 서비스|
|**RDS**|관리형 관계형 데이터베이스 서비스|
|**VPC**|사용자 전용 가상 네트워크를 구성하는 서비스|
|**IAM**|사용자 및 권한 관리를 위한 서비스|
|**CloudWatch**|모니터링 및 로깅 서비스|
|**CloudFormation**|인프라를 코드로 관리할 수 있게 해주는 템플릿 기반 리소스 생성 도구|

### AWS의 장점

- 확장성: 서비스 수요에 따라 리소스를 유연하게 확장 또는 축소할 수 있다.
- 비용 효율성: 사용한 만큼만 비용을 지불하는 `pay-as-you-go` 모델을 제공한다.
- 신뢰성 및 안정성: 전 세계에 걸쳐 있는 AWS 리전과 가용 영역을 통해 고가용성을 보장한다.
- 자동화 및 배포: CodeDeploy, Elastic Beanstalk, App Runner 등 다양한 자동 배포 서비스를 제공한다.

#### CodeDeploy

- CI/CD를 직접 구축하고 배포 전략을 세밀하게 제어하고 싶을 때 사용
- EC2, ECS에 직접 배포하고 싶을 때 사용
- 애플리케이션 코드를 EC2, Lambda, 온프레미스 서버에 자동으로 배포해주는 서비스
- 배포 전략(Blue/Green, In-place)을 지원하며 배포 중 오류가 나면 자동 롤백도 가능
- CI/CD 파이프라인 구성에 자주 사용됨
    - CodePipeline과 함께 쓰면 강력
- 코드 배포 자체에만 집중한 서비스
    - 서버 관리 인프라는 직접

#### Elastic Beanstalk

- 서버는 직접 쓰고 싶지만 너무 번거로운 건 피하고 싶을 때 사용
- 익숙한 환경에서 빠르게 배포해보고 싶은 스타트업이나 팀에서 고려해보면 좋음
- 애플리케이션만 업로드하면 나머지 인프라 생성부터 배포, 스케일링까지 AWS가 자동으로 해주는 PaaS (Platform as a Service)
- Java, Node.js, Python, PHP 등 다양한 플랫폼 지원
- EC2, RDS, Load Balancer 등 구성 요소를 AWS가 자동으로 설정해줌
- 인프라는 자동화되지만 필요 시 EC2 설정 같은 부분도 커스터마이징 가능

#### App Runner

- 빠르게 실서비스를 만들고 싶은 스타트업, 혹은 테스트 서비스 등
- 인프라를 신경쓰고 싶지 않은 프론트엔드 또는 백엔드
- 소스 코드(GitHub) 또는 컨테이너 이미지(ECR)만 연결하면 자동으로 웹 서비스를 만들어주는 완전 관리형 서비스
    - 서버? 인프라? 걱정할 필요가 없음
- 서버리스 개념: EC2, Load Balancer, Auto Scaling 등은 AWS가 전부 관리
- CI/CD 자동화 가능(커밋하면 자동 배포)
- 기본적인 웹 서비스 운영에만 집중 가능

#### 세 가지 요약 비교

|항목|CodeDeploy|Elastic Beanstalk|App Runner|
|---|---|---|---|
|배포 대상|EC2, ECS, Lambda 등|EC2 기반 웹 앱|웹 애플리케이션|
|인프라 관리|직접 설정|자동 설정, 필요 시 조정 가능|전부 AWS가 관리|
|배포 전략|세밀한 전략 설정 가능|기본 배포|자동 CI/CD 지원|
|서버 접근|가능|가능|불가능 (서버리스)|
|난이도|높음|중간|가장 쉬움|
|추천 대상|DevOps 팀, 대규모 운영|빠른 배포 & 커스터마이징|빠르게 서비스 만들어보고 싶은 개발자|

### 현실적인 과금과 보안 걱정

#### 무료로도 충분하다

>[!TIP]
>실습용이라면 `t2.micro` 또는 `t3.micro`, `RDS free tier`, `S3` 5GB 이하로만 사용해도 충분히 연습 가능

- 무료 티어(Free Tier)를 활용하면 대부분의 AWS 주요 서비스를 12개월간 또는 영구적으로 무료 사용이 가능하다.
- 실수로 과금될까 봐 불안하다면
    - 과금 알립(AWS Budgets)을 설정해서 월 예산을 초과하면 이메일/SMS로 알림
- 개발 중인 테스트 환경은 반드시 종료(terminate) 또는 자동 중지 스케줄 설정하는 습관이 중요

#### 기본만 지켜도 안전하다

>[!INFO]
>AWS는 기본적으로 보안 책임을 공유하는 구조 (Shared Responsibility Model)
>물리적인 데이터센터 보안은 AWS가, 계정, 데이터, 접근 제어 등은 사용자가 책임진다.
>하지만 AWS가 제공하는 도구와 정책을 잘 활용하면 훨씬 쉽게 보안을 유지할 수 있다.

- AWS는 세계 최고 수준의 보안 인프라를 갖추고 있다.
- 다만, 사용자가 기본 설정을 잘못하면 보안 이슈가 생기기 쉽다.

##### 필수 보안 수칙 3가지

1. IAM Root 계정으로 로그인 금지
2. 사용자 계정을 만들어 `MFA(이중 인증)` 설정
3. 퍼블릭 액세스 차단
    - S3 버킷, EC2 보안 그룹 설정 확인 (기본적으로 열려 있음)
    - CloudTrail, GuardDuty 활성화
        - 보안 로그 기록과 이상 탐지를 자동화

## 🎯결론

>[!TIP]
>“AWS는 단순한 서버 호스팅이 아니라, 개발자의 속도를 높이고 비즈니스의 확장을 돕는 ‘기술 기반 비즈니스 플랫폼’이다.”

이제 클라우드는 선택이 아니라 기본이다.  
여전히 각자의 방식이 있고, 로컬 서버나 온프레미스 환경이 필요한 곳도 존재하지만, AWS를 이해하는 것은 ‘현대적인 개발 생태계의 공통 언어’를 배우는 것과 같다.

배포 속도, 안정성, 확장성, 자동화…
우리가 제품을 만들 때 부딪히는 거의 모든 인프라 문제를 AWS는 일정 수준 이상 해결해준다.
결국 중요한 건 사용자에게 더 나은 경험을 더 빠르게 전달하는 것이다.

## ⚙️EndNote

### 사전 지식

- 기본적인 웹 서비스 구조에 대한 이해 (클라이언트–서버 구조)
- HTTP, 데이터베이스, 파일 저장소 등에 대한 기초 지식
- IaaS, PaaS, SaaS 개념

### 더 알아보기

- [AWS 공식 홈페이지](https://aws.amazon.com)
- [AWS Well-Architected Framework 공식 문서](https://aws.amazon.com/architecture/well-architected)
- [AWS 무료 티어 소개](https://aws.amazon.com/free)
- [AWS 과금 예측 및 관리 - Cost Explorer](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html)
- [AWS 보안 책임 모델 보기](https://aws.amazon.com/compliance/shared-responsibility-model)
- [App Runner Developer Guide](https://docs.aws.amazon.com/apprunner)