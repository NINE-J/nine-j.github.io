---
publish: true
draft: false
title: IAM 사용자로 AWS 관리
description: 권한 관리 이유 및 방법
author: Nine
date: 2025-06-22T00:00:00
categories:
  - AWS
tags:
  - devlog
  - AWS
  - 보안
  - IAM
  - 클라우드
  - Cloud
  - 최소권한원칙
# image: 
Status: Done
id: 019ce76a-c19a-7534-b855-e93000681685
slug: b9f1-devlog-iam-사용자로-aws-관리
---

## 📌개요

AWS를 간단히 사용할 땐 Root 계정 하나로 로그인하고 필요한 것만 확인하고 참 편하긴 편하다.
하지만 몇 번의 프로젝트를 통해 Root 계정은 절대 일상적으로 써선 안 된다는 걸 온몸으로 배웠다.

Root 계정과 IAM 사용자 권한의 차이 그리고 왜 IAM 사용자로 운영하는 게 Best Practice인지에 대해 알아보자.

## 📌내용

### Root 계정은 일상적으로 사용하지 마라

AWS 문서에는 다음과 같이 적혀 있다.

> \[!WARNING]
> “We strongly recommend that you don't use the root user for your everyday tasks” [docs.aws.amazon.com+8docs.aws.amazon.com+8docs.aws.amazon.com+8](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html)

Root 계정은 결제 수단 변경, 계정 설정 수정, Support 플랜 변경 등 **IAM으로는 불가능한 민감 작업을 수행**할 수 있기 때문에 AWS는 **MFA 설정, 자동화 억제, 긴급 상황에서만 사용**하도록 권장한다.

### IAM 사용자로 운영하는 이유

| 항목           | 설명                                                  |
| ------------ | --------------------------------------------------- |
| **보안 강화**    | IAM 사용자는 권한을 세분화할 수 있어 최소 권한 원칙 구현 가능               |
| **역할 분리**    | 인프라 운영, 결제 조회, 개발자 접근 등을 구분해서 관리 가능                 |
| **추적과 감사**   | 누가 어떤 리소스를 언제 썼는지 CloudTrail로 기록 가능                 |
| **팀 확장 대응**  | 실습 → 팀 운영 → 기업 운영까지 유연하게 확장 가능                      |
| **비용/결제 보호** | 실수로 비싼 리소스를 생성하는 것 방지 가능 (예: GPU EC2, RDS Multi-AZ) |

### IAM 사용자 권한 관리 방법

처음엔 복잡할 수 있지만 차근차근 순서대로 진행하면서 IAM 사용자를 분리해서 관리해보면 안정감이 느껴지고 권한에 대해 이해할 수 있게 된다.

1. 루트 계정으로 로그인
2. 사용자 그룹 생성, IAM 사용자 생성 → 콘솔 접근 허용 + MFA 설정
3. 역할에 따라 다음과 같이 그룹화하는 것을 권장. 조직에서 정하는 방식으로 진행하면 된다.
   * `BillingViewerGroup` - 결제 정보만 조회
   * `InfraAdminGroup` - EC2, RDS 등 자원 생성/삭제
   * `ReadOnlyGroup` - 전체 리소스 조회만 가능
4. 정책은 AWS에서 제공하는 관리형 정책부터 시작
5. 필요 시 커스텀 정책 작성

### Root 계정에만 있는 특수 작업

평소 작업엔 IAM으로 권한을 분리하여 최소 권한 원칙을 지키며 사용해야겠지만 특수한 경우는 어쩔 수 없이 Root 계정으로 로그인해야 할 것이다.

Root 계정 로그인 시 단일 인증이 아닌 멀티 인증 방식도 제공하는 것 같다.
즉 2명 이상의 인증을 통해 로그인을 허용한다.

AWS에 따르면 Root 계정만 수행 가능한 작업은 다음과 같다:

* `Activate IAM Access`: IAM 사용자에게 Billing 콘솔 접근 활성화
* 루트 이메일 주소 및 결제 방식 변경
* 루트 계정 비밀번호 또는 액세스 키 재설정
* AWS 계정 종료

이러한 작업은 Root 계정이 반드시 있어야만 할 수 있으므로 평시에는 IAM 기반 사용자/역할로 운영하고 Root는 긴급시에만 사용하는 구조가 안전하다.

## 🎯결론

> Root 계정은 금고 열쇠와 같다. 평소에는 꺼내지도 말아야 하며 AWS 운영은 IAM 사용자 기반으로 최소 권한 원칙을 엄수해야 한다.

IAM 사용자 기반 운영은 번거로워 보여도 AWS에서 실수 없이 오래 살아남고 싶은 개발자라면 반드시 익숙해져야 할 **안전장치**다.

AWS 문서들이 일관되게 강조하는 IAM 기반 안전 운영 방식을 실천해야 한다.

## ⚙️EndNote

### ### 사전 지식

* AWS Root 계정과 IAM 사용자 구조 이해
* 기본적인 AWS Console UI 조작
* AWS 관리형 정책 및 인라인 정책 개념
* 최소 권한 원칙(Least Privilege Principle)

### 더 알아보기

* [IAM Best Practices (AWS 공식)](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
* [AWS Billing 및 Cost Management 정책 예시](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/billing-example-policies.html)
* [Well-Architected Framework](https://aws.amazon.com/ko/architecture/well-architected/?wa-lens-whitepapers.sort-by=item.additionalFields.sortDate\&wa-lens-whitepapers.sort-order=desc\&wa-guidance-whitepapers.sort-by=item.additionalFields.sortDate\&wa-guidance-whitepapers.sort-order=desc)
* [AWS Free Tier 안내](https://aws.amazon.com/free)
