---
publish: true
draft: false
title: Kafka vs Confluent
description: 오픈 소스와 관리형 데이터 스트리밍 인프라
author: Nine
date: 2025-10-16 14:48:14
categories:
  - Infra
tags:
  - devlog
  - Kafka
  - Confluent
  - EventStreaming
  - DistributedSystems
  - MessagingQueue
  - EventDriven
  - DataPipeline
  - Infra
  - CloudService

Status: Done
---
## 📌개요

이벤트 기반 아키텍처에서 Kafka는 시스템 간 메시지 정합성을 유지하는 핵심 역할을 한다. 그런데 이 Kafka를 어떻게 배포할 것인지 선택해야 한다.

직접 서버에 구축할 수도 있고 AWS MSK 같은 클라우드 관리형 서비스를 쓸 수도 있고 Confluent Cloud처럼 Kafka 전문 업체의 완전 관리형 서비스를 이용할 수도 있다.

각 배포 방식의 특징과 장단점을 비교하여 프로젝트에 맞는 Kafka 인프라 선택 기준을 알아보자.

## 📌내용

### Kafka 배포 방법

Kafka를 배포하는 방법은 크게 세 가지로 나눌 수 있다.

#### 1. 자체 배포

**직접 서버에 Kafka 설치 및 운영**

- **배포 환경**: 온프레미스 서버, AWS EC2, Azure VM, GCP Compute Engine 등
- **설치 방법**: 
    - 바이너리 다운로드 후 수동 설치
    - Docker/Kubernetes를 통한 컨테이너 배포
    - Ansible, Terraform 등 IaC 도구 활용
- **구성**:
    - Kafka 브로커 클러스터 (보통 3대 이상)
    - 메타데이터 관리 (Kafka 4.x는 KRaft 자체 관리)
    - 모니터링 스택 (Prometheus, Grafana 등)
    - Kafka Connect, Schema Registry 등 별도 구축
- **장점**
    - 완전한 제어권: 모든 설정과 튜닝 가능
    - 비용 최적화: 대규모 트래픽에서 인프라 비용 절감
    - 데이터 주권: 온프레미스나 특정 리전에 데이터 보관
    - 커스터마이징: 특수한 요구사항 반영 가능
- **단점**
    - 높은 운영 부담: 2-3명의 전담 인력 필요
    - 전문성 요구: Kafka 내부 구조 이해 필수
    - 장애 대응: 24/7 온콜 체계 구축 필요
    - 초기 구축 시간: 안정화까지 수주~수개월 소요

#### 2. 클라우드 관리형 서비스

**클라우드 제공자의 Kafka 관리 서비스 이용**

- **AWS MSK (Managed Streaming for Kafka)**
    - AWS가 Kafka 클러스터 및 인프라 관리
    - VPC 내부에서 프라이빗 연결
    - CloudWatch 통합 모니터링
    - 자동 패치 및 버전 업그레이드
- **Azure Event Hubs for Kafka**
    - Kafka 프로토콜 호환 이벤트 스트리밍 서비스
    - Azure 네이티브 통합
- **Google Cloud Managed Kafka (Preview)**
    - GCP에서 관리하는 Kafka 서비스
- **장점**
    - 인프라 관리 자동화: 서버 관리, 패치 불필요
    - 클라우드 생태계 통합: Lambda, S3, IAM 등 쉽게 연결
    - 빠른 프로비저닝: 클릭 몇 번으로 클러스터 생성
    - 자체 배포보다 낮은 운영 부담
- **단점**
    - 제한된 제어권: 일부 고급 설정 불가
    - Kafka 지식 여전히 필요: 토픽, 파티션, 컨슈머 그룹 관리는 직접
    - 추가 도구 별도 구축: Kafka Connect, Schema Registry 등
    - 비용: 자체 배포보다 비쌈 (편의성 프리미엄)

#### 3. 완전 관리형 서비스

**Kafka 전문 업체의 SaaS형 서비스**

- **Confluent Cloud**: Kafka 창시자들이 만든 엔터프라이즈 플랫폼
- **Aiven for Apache Kafka**: 멀티 클라우드 지원
- **Instaclustr**: 관리형 Kafka 서비스

**Confluent Cloud 중심 설명**

- **제공하는 것**
    - Kafka 클러스터 완전 관리 (인프라부터 운영까지)
    - 120+ 사전 구축 커넥터 (DB, SaaS, 클라우드)
    - Schema Registry 관리형 제공
    - ksqlDB 및 Apache Flink 통합 (스트림 처리)
    - Stream Catalog (데이터 계보 추적)
    - 고급 보안 및 컴플라이언스 (SOC 2, HIPAA 등)
    - 24/7 전문가 지원
- **장점**
    - 제로 운영 부담: 인프라 걱정 없이 바로 사용
    - 개발 생산성 극대화: 커넥터, 스키마 관리 등 즉시 활용
    - 자동 스케일링: 트래픽 변화에 자동 대응
    - 멀티 클라우드/리전: 글로벌 서비스 쉽게 구축
    - 빠른 실험: PoC부터 프로덕션까지 빠르게 전환
- **단점**
    - 비용: 소규모에서는 경제적이나 대규모에서는 비쌈
    - 벤더 락인: Confluent 고유 기능 사용 시 이전 어려움
    - 제어권 제한: 내부 설정 접근 불가
    - 데이터 외부 전송: 온프레미스 전용 환경에서는 사용 불가

### 배포 방식별 비교 매트릭스

| 비교 항목 | 자체 배포 | 클라우드 관리형 (AWS MSK) | 완전 관리형 (Confluent Cloud) |
|---------|---------|----------------------|--------------------------|
| **운영 복잡도** | 높음 (전담 팀 필요) | 중간 (Kafka 지식 필요) | 낮음 (제로 운영) |
| **초기 구축 시간** | 수주~수개월 | 수일~1주 | 수분~수시간 |
| **전문 인력 필요** | 필수 (2-3명) | 필요 (1명) | 선택 (개발자만) |
| **Kafka 지식 요구** | 깊은 이해 필수 | 중급 수준 | 기본 개념만 |
| **비용 (소규모)** | 높음 (인력+인프라) | 중간 | 낮음~중간 |
| **비용 (대규모)** | 낮음 (최적화 시) | 중간 | 높음 |
| **확장성** | 수동 계획 필요 | 반자동 | 완전 자동 |
| **보안/컴플라이언스** | 직접 구현 | 기본 제공 | 엔터프라이즈급 |
| **커넥터/도구** | 직접 구축 | 직접 구축 | 120+ 즉시 사용 |
| **글로벌 복제** | 수동 구성 | 복잡함 | 클릭 몇 번 |
| **적합한 규모** | 월 10TB+ | 중소 규모 | 스타트업~중견 |

### 실전 선택 가이드

#### 자체 배포를 선택해야 할 때

1. **대규모 트래픽**: 월 10TB 이상의 안정적인 트래픽
2. **온프레미스 필수**: 데이터 외부 반출이 불가능한 환경
3. **특수 커스터마이징**: Kafka 내부 동작을 깊이 제어해야 할 때
4. **장기적 비용 최적화**: 인프라 비용을 최소화해야 할 때
5. **이미 운영 중**: Kafka 운영 경험과 전담 팀이 있는 경우

**비용 예시 (AWS 기준, 2025년 10월)**
- EC2 브로커 3대 (t3.medium): 월 약 25만원
- EBS 스토리지 500GB: 월 약 5만원
- 네트워크 비용: 변동
- **인력 비용**: 월 500만원+ (DevOps 엔지니어 1명)
- **총 비용**: 월 530만원+ (인프라만 30만원)

#### 클라우드 관리형(AWS MSK)을 선택해야 할 때

1. **AWS 중심 아키텍처**: Lambda, S3 등과 긴밀한 통합 필요
2. **중간 규모**: 월 1TB~10TB 정도의 트래픽
3. **운영 부담 경감**: 인프라 관리는 자동화하고 싶지만 Kafka는 직접 관리
4. **클라우드 벤더 선호**: AWS 생태계 내에서 모든 것을 해결
5. **보안 요구사항**: AWS IAM, VPC와의 통합 필요

**비용 예시 (AWS MSK, 2025년 10월)**
- kafka.t3.small 3대: 월 약 $150 (약 20만원)
- 스토리지: 별도 과금
- **인력 비용**: 월 300만원+ (Kafka 지식 보유 개발자)
- **총 비용**: 월 320만원+

#### 완전 관리형(Confluent Cloud)을 선택해야 할 때

1. **빠른 MVP 검증**: 이벤트 스트리밍 아키텍처를 신속하게 실험
2. **전담 인력 부족**: Kafka 전문가 채용이 어렵거나 비용 부담
3. **소규모 스타트업**: 월 100GB~1TB 정도의 트래픽
4. **글로벌 서비스**: 멀티 리전 복제가 필요한 경우
5. **개발 집중**: 인프라 걱정 없이 비즈니스 로직에 집중
6. **규제 산업**: SOC 2, HIPAA 등 컴플라이언스 인증 필요

**비용 예시 (Confluent Cloud, 2025년 10월)**
> USD 1달러 = 약 1,419원 기준

- Basic 클러스터: 월 $730 (약 100만원)
- 스토리지 50GB: 월 $5 (약 7천원)
- 네트워크 100GB: 월 $9 (약 1만원)
- **인력 비용**: 0원 (일반 개발자만 있으면 됨)
- **총 비용**: 월 101만원 (소규모)
- **프리 크레딧**: $400 제공 (약 55만원 상당)

### 하이브리드 전략: 단계적 접근

많은 기업이 채택하는 현실적인 전략:

**Phase 1: 초기 단계 (Confluent Cloud)**
- PoC 및 MVP 빠르게 검증
- 초기 서비스 런칭 (월 트래픽 ~1TB)
- 팀 규모: 개발자 2-3명
- 비용: 월 100~200만원

**Phase 2: 성장 단계 (계속 Confluent 또는 MSK 검토)**
- 트래픽 증가 (월 1TB~10TB)
- 비용 분석 시작
- Kafka 전문 인력 1명 채용 고려
- 비용: 월 200~500만원

**Phase 3: 성숙 단계 (자체 배포 전환 검토)**
- 대규모 트래픽 (월 10TB+)
- 전담 인프라 팀 구성
- 자체 배포로 전환하여 TCO 60% 절감
- 비용: 월 500~1,000만원 (하지만 트래픽은 10배+)

**병행 사용 예시**
- 핵심 서비스: 자체 배포 (안정성, 비용 최적화)
- 실험적 프로젝트: Confluent Cloud (빠른 실험)
- 글로벌 리전: Confluent Cloud (멀티 리전 자동 복제)

## 🎯결론

세 가지 배포 방식은 각각 명확한 장단점이 있으며 정답은 조직의 상황에 달려 있다.

**자체 배포** 는 대규모 트래픽과 전문 인력이 있을 때 최적의 선택이다.
완전한 제어권과 비용 최적화를 얻지만 운영 복잡도와 인력 투자가 크다.

**클라우드 관리형(AWS MSK)** 은 AWS 생태계를 쓰면서 운영 부담을 줄이고 싶을 때 중간 지점이다. 인프라는 자동화되지만 Kafka 지식은 여전히 필요하다.

**완전 관리형(Confluent Cloud)** 은 빠른 실행과 제로 운영 부담이 필요할 때 최선이다.
소규모에서는 인력 비용 고려 시 가장 경제적이지만 대규모에서는 비용이 높아질 수 있다.

Kafka 인프라를 관리하는 데 시간을 쓸 것인지 아니면 고객 가치를 만드는 데 집중할 것인지 스스로 질문해보자.

## ⚙️EndNote

### 사전 지식

**필수 개념**
- **Apache Kafka 기본**: Topic, Partition, Producer, Consumer, Broker
- **이벤트 기반 아키텍처**: 비동기 메시징, 이벤트 소싱
- **클라우드 서비스 모델**: IaaS, PaaS, SaaS 차이

**알아두면 좋은 개념**
- **분산 시스템**: 복제, 파티셔닝, 합의 알고리즘
- **DevOps**: CI/CD, 모니터링, IaC (Infrastructure as Code)
- **Kafka 생태계**: Kafka Connect, Kafka Streams, Schema Registry

### 더 알아보기

**공식 문서**
- [Apache Kafka Documentation](https://kafka.apache.org/documentation/) - 오픈소스 공식 문서
- [Confluent Documentation](https://docs.confluent.io/) - Confluent Platform 문서
- [AWS MSK Documentation](https://docs.aws.amazon.com/msk/) - AWS 관리형 Kafka
- [CONFLUENT의 어필 - Confluent와 Apache Kafka® 비교](https://www.confluent.io/ko-kr/apache-kafka-vs-confluent/)

**핵심 개념 심화**
- **Kafka Connect**: 외부 시스템(DB, SaaS)과 데이터 파이프라인 구축
- **Schema Registry**: Avro/Protobuf 스키마 버전 관리
- **Kafka Streams**: 자바 기반 스트림 처리 라이브러리
- **ksqlDB**: SQL로 스트림 처리
- **Apache Flink**: 대규모 상태 기반 복잡한 스트림 처리

**AWS 연동 가이드**
- [AWS Lambda + Kafka 연동](https://docs.aws.amazon.com/lambda/latest/dg/with-msk.html)
- [VPC 피어링으로 Confluent Cloud 연결](https://docs.confluent.io/cloud/current/networking/peering/aws-peering.html)
- [MSK vs Confluent Cloud 비교](https://www.confluent.io/aws-msk-alternative/)