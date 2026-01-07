---
publish: true
 draft: false
title: AWS ElastiCache Redis 배포
description: Spring Boot 분산 환경 Redis AWS 운영 구성
author: Nine
date: 2025-10-16 17:17:14
categories:
  - Infra
tags:
  - devlog
  - Redis
  - AWS
  - ECS
  - Fargate
  - SpringBoot
  - Infra
  - ElastiCache

Status: Done
---
## 📌개요

현재 프로젝트에서는 PostgreSQL(RDS), Kafka(Confluent Cloud)와 함께 Redis를 세션/캐시용으로 운영해야 하는 상황이다.

Redis를 로컬에서 `docker-compose`로 테스트는 했지만 운영 환경에서의 연결 구조와 설정 원리를 명확히 이해하고자 한다.

현재 계획은 ECS Fargate 기반 분산 환경이며 Redis를 어떻게 배포하고 연결하는지 간단히 정리해본다.

## 📌내용

### Redis는 기본 구성만으로 동작한다

Redis는 HTTP 기반이 아닌 TCP 기반의 Key-Value 서버다.
HTTP처럼 경로 개념이 없고 단순히 정의된 포트(기본 6379)로 열려 있는 소켓을 통해 명령을 주고 받는다.

즉, Redis는 복잡한 인증이나 핸드셰이크 없이도 클라이언트가 IP와 포트를 알고 있으면 바로 접근 가능한 구조다.

- Redis는 `host:port` 기반의 TCP 프로토콜만 있으면 동작한다.
- 별도의 서비스 레이어가 없으므로 설정의 핵심은 어디로 붙을 것인가.

### Spring Boot에서 Redis 연결 구조

Spring Boot는 `spring-boot-starter-data-redis` 의존성만 추가하면 간단하게 `LettuceConnectionFactory`, `RedisTemplate`, `CacheManager` 등을 등록한다.

```yaml
spring:
  data:
    redis:
      host: redis-cluster.xxxxxx.apn2.cache.amazonaws.com
      port: 6379
```

별도의 Bean을 등록하지 않아도 Spring Boot는 이를 감지해 자동 연결한다.
설정을 생략하면 기본값(`localhost:6379`)으로 시도한다.

### Elastic Redis 배포 개요

AWS에서는 ElastiCache Redis OSS를 사용하면 서버 설치 없이 관리형 Redis 클러스터를 사용할 수 있다.

| 구성 요소            | 설명                              |
| ---------------- | ------------------------------- |
| **Primary Node** | 쓰기 담당 Redis 노드                  |
| **Replica Node** | 읽기 전용 복제본 (선택사항)                |
| **Cluster**      | 여러 샤드로 데이터를 분산 저장               |
| **Endpoint**     | 연결용 주소 (`.cache.amazonaws.com`) |

#### ECS Fargate 연결 구조

- **보안 그룹 규칙**
    - Inbound: 6379 허용 (ECS -> Redis)
    - Outbound: ECS에서 Redis SG(Security Group)로 접근 허용
- **VPC**: 같은 VPC 또는 피어링된 네트워크에 존재해야 함

### 로컬 Docker와 운영 Redis의 관계

|구분|로컬 환경|운영 환경|
|---|---|---|
|**호스트**|`localhost:6379`|Elasticache Endpoint|
|**목적**|개발 및 단위 테스트|실제 서비스 운영|
|**공유 여부**|완전히 분리|완전히 분리|
|**차이점**|단일 인스턴스|멀티 AZ, 클러스터링, 모니터링 제공|

즉, 코드상으로는 동일한 RedisTemplate을 사용하지만 환경 변수(`SPRING_DATA_REDIS_HOST`, `SPRING_DATA_REDIS_PORT`)만 달라진다.

**호스트와 포트를 맞추어** TCP 레벨에서 연결만 되면 Redis는 별도 복잡한 설정 없이 바로 동작한다.

### 운영 시 고려사항

운영 환경에서는 다음 항목들을 통해 **보안과 안정성을 강화**할 수 있다.

| 구분 | 설명 |
|------|------|
| **보안 그룹 제한** | Redis 포트(6379)는 오직 ECS 서비스의 보안 그룹에서만 접근 가능하도록 설정한다. |
| **VPC 내부 통신** | 퍼블릭 액세스를 비활성화하고, VPC 내부 트래픽으로만 접근을 제한한다. |
| **암호화 옵션** | Elasticache 생성 시 ‘전송 중 암호화(Encryption in-transit)’ 및 ‘저장 시 암호화(Encryption at-rest)’를 활성화한다. |
| **Redis AUTH (선택)** | OSS 기본은 인증 미지원이지만, 필요 시 Redis Enterprise 또는 프록시 계층을 통해 비밀번호 인증을 구성할 수 있다. |
| **세션 공유 설정** | Spring Boot 세션 스토어를 Redis로 변경 (`spring.session.store-type=redis`). |
| **TTL 관리** | 캐시 만료시간을 반드시 설정 (`Duration.ofMinutes(...)` 등). |
| **모니터링** | CloudWatch, Redis SlowLog, CloudWatch Metrics 등을 활용해 지표와 성능을 추적한다. |

## 🎯결론

Redis는 기본적으로 포트만 맞으면 동작하지만,  
운영 환경에서는 **보안 그룹, VPC, 암호화 옵션**을 통해 최소한의 방어선을 만들 수 있다.

Spring Boot에서는 host와 port만 지정하면 자동으로 연결되고 Elasticache Redis는 이를 VPC 내부에서 안전하게 관리해준다.

## ⚙️EndNote

### 사전 지식

- AWS ECS / VPC / Security Group 개념
- Redis Key-Value 구조 및 기본 명령
- Spring Boot 자동 설정 (`spring-boot-starter-data-redis`)

### 더 알아보기

- [Redis OSS 호환 Amazon ElastiCache](https://aws.amazon.com/ko/elasticache/redis/)
- [Spring Data Redis Reference](https://docs.spring.io/spring-data/redis/reference/)
- [Redis serialization protocol specification](https://redis.io/docs/latest/develop/reference/protocol-spec/)
- [VPC 피어링을 사용하여 VPC 연결](https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/vpc-peering.html)
- [Kafka 와 Redis 의 Pub/Sub 비교](https://devoong2.tistory.com/entry/Kafka-%EC%99%80-Redis-%EC%9D%98-PubSub-%EB%B9%84%EA%B5%90)