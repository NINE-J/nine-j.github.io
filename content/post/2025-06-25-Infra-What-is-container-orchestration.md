---
publish: true
draft: false
title: 컨테이너 오케스트레이션
description: 자동 확장, 자가 복구, 선언형 인프라
author: Nine
date: 2025-06-25 22:17:57
categories:
  - Infra
tags:
  - devlog
  - Kubernetes
  - 컨테이너기술
  - 오케스트레이션
  - Docker
  - DevOps
  - 클라우드
  - 인프라
  - Infra
  - AutoScaling
  - K8s
  - 운영자동화
  - 마이크로서비스
  - MSA

Status: Done
---
## 📌개요

Docker는 컨테이너 단위의 애플리케이션 패키징과 실행이 뛰어나지만 실제 운영 환경에서는 수십, 수백 개의 컨테이너를 배포하고 유지해야 하는 복잡한 상황이 발생한다.

이 문제를 해결하기 위해 등장한 개념이 컨테이너 오케스트레이션(Container Orchestration)이다.

오케스트레이션의 핵심 개념과 필요성, Docker 단독 환경의 한계, Kubernetes를 중심으로 오케스트레이터가 해결하는 세 가지 주요 문제를 알아보자.

## 📌내용

### 컨테이너 오케스트레이션이란?

>[!INFO] 오케스트라(orchestra)에서 유래
>- 오케스트라: 수십 개의 악기가 각자 연주하지만 지휘자가 이를 정해진 순서와 규칙에 따라 통제하여 하나의 음악으로 만들어낸다.
>- 개발 시스템: 수많은 컨테이너, 서비스, 배포, 트래픽, 설정이 따로따로 존재하지만 오케스트레이터가 이를 자동으로 조율하여 하나의 애플리케이션처럼 작동하도록 한다.

컨테이너 오케스트레이션은 다음과 같은 작업을 자동화한다.

- 컨테이너의 배포 및 종료
- 헬스 체크 및 실패 시 자동 복구
- 트래픽에 따라 컨테이너 자동 확장/축소
- 로드 밸런싱, 서비스 디스커버리
- YAML을 활용한 선언적 구성(Declarative Configuration)을 통한 인프라 관리

단일 컨테이너 환경에서는 수작업이나 스크립트로 관리가 가능하지만 수십 개 이상의 컨테이너를 운영하는 클러스터 환경에서는 비효율과 오류를 피하기 어렵다.

### Docker 단독 사용 환경의 한계

Docker는 다음과 같은 측면에서 한계가 존재한다.

#### 수동 스케일링

- `docker run` 명령어로 컨테이너 개수를 수동 조정
- 실시간 트래픽 변화에 대응 불가

#### 제한된 복구 기능

- `--restart` 자동 재시작은 가능하지만, 헬스 체크 기반 복구, 다중 노드 상태 관리는 불가능

#### 서비스 수준 추상화 부족

- Docker Compose로 일부 기능(네트워크, 볼륨, 환경변수)은 구성 가능
- 하지만 로드밸런싱, 트래픽 분산, 서비스 디스커버리 등은 부족하거나 수동 구성 필요

### 오케스트레이션이 해결하는 주요 문제 3가지

#### 자동 확장 - Auto Scaling

- 문제: 트래픽 급증 시 컨테이너 수를 사람이 조정해야 함
- 해결: k8s는 `Horizontal Pod Autoscaler`를 통해 리소스(CPU, 메모리) 사용량 기준으로 Pod 수를 자동 조절
- 예시: CPU 사용률이 80% 이상일 때 3개에서 10개로 자동 확장

#### 자가 복구 - Self-Healing

- 문제: 컨테이너가 비정상 종료될 경우 사람이 직접 조치해야 함
- 해결: k8s는 `livenessProbe`, `readinessProbe`를 통해 주기적으로 상태를 체크하고 실패한 컨테이너는 자동 재시작 또는 교체
    - `livenessProbe`: "얘가 아직 살아 있나?" 판단하는 검사
        - 자동 재시작
        - 컨테이너가 비정상 상태일 경우 자동으로 재시작해줌
        - 예: 무한 루프에 빠졌거나 내부적으로는 죽었는데 프로세스는 살아 있는 경우
    - `readinessProbe`: "얘가 트래픽 받을 준비가 됐나?" 판단하는 검사
        - 장애 확산 방지
        - 준비되지 않은 컨테이너는 Service에 등록되지 않음
        - 앱이 시작은 됐지만 DB 연결이 아직 안 됐다면 트래픽 받지 않도록 막아줌

#### 선언적 인프라 - Declarative Infrastructure

- 문제: 수동 명령어는 현재 상태를 명확히 알기 어렵고 일관성 유지가 어려움
- 해결: k8s에서는 YAML 파일에 "이 시스템은 이래야 한다"고 선언하면 클러스터가 이를 자동으로 유지
    ```yaml
    # 선언 예시
    apiVersion: apps/v1
    kind: Deployment
    spec:
      replicas: 3
      template:
        spec:
          containers:
          - name: my-app
            image: my-app:latest
    ```

### Docker Compose vs Kubernetes 비교

|항목|Docker Compose|Kubernetes|
|---|---|---|
|스케일링|수동 조정 (`--scale`)|HPA 기반 자동 확장|
|복구|`--restart`로 기본 재시작|상태 기반 자가 복구|
|디스커버리|내부 DNS 미지원 (v2 기준)|서비스명 기반 자동 디스커버리|
|학습 곡선|낮음|높음|
|운영 복잡도|낮음 (로컬)|높지만 강력함|

### 오케스트레이터 선택 기준

| 오케스트레이터           | 특징                 | 적합한 상황         |
| ----------------- | ------------------ | -------------- |
| Kubernetes        | CNCF 주도, 생태계 광범위   | MSA 기반 대규모 서비스 |
| Docker Swarm      | Docker와 연동 용이, 간결함 | 중소 규모 단일 클러스터  |
| AWS ECS / Fargate | 서버리스, 비용 최적화       | AWS 중심의 배포 전략  |

## 🎯결론

> 컨테이너 오케스트레이션은 현대적인 서비스 운영을 위한 기본이자 필수 인프라 기술이다.

학습과 실험엔 Docker만으로 충분하지만 실전에서는 운영 자동화, 복구, 확장성, 일관된 인프라 구성이 가능한 오케스트레이터가 반드시 필요하다.

특히 Kubernetes는 클라우드 네이티브 환경의 표준으로 자리 잡았다.

## ⚙️EndNote

### 사전 지식

- Docker의 기본 사용법
- 컨테이너 개념 (이미지, 레지스트리, 실행 등)
- YAML 파일의 구조 이해

### 더 알아보기

- [Kubernetes 공식 문서](https://kubernetes.io/ko/docs/home/)
- [Kubernetes Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)
- [CNCF Landscape](https://landscape.cncf.io/)