---
publish: false
draft: true
title: ChatDev 구축
description: Multi-Agent System
author: Nine
date: 2026-03-13 12:34:08
categories:
tags:
  - draft

Status: ToDo
---
## 1. Context & Decision (왜 이 결정을 했는가?)

> 기술적 의사결정의 배경과 트레이드오프를 기록합니다.

- **날짜:** 202X-XX-XX
    
- **환경:** Windows 11 + WSL2 (Ubuntu 22.04)
    
- **결정:** 왜 맥미니 대신 윈도우 환경을 선택했는가? (예: 빠른 검증 및 비용 절감)
    
- **대안:** 클라우드 인스턴스 vs 로컬 맥 환경
    

## 2. Infrastructure & Setup (환경 구성)

> 나중에 '그대로 복사'해서 쓸 수 있을 정도로 구체적으로 적습니다.

- **Python Version:** (예: 3.10.x)
    
- **Virtual Env:** `conda create -n chatdev python=3.10`
    
- **Dependency:** `pip install -r requirements.txt`
    
- **Key Configuration:** `.env` 파일 설정 및 API 할당 방식
    

## 3. Workflow & Architecture (시스템 구조)

> ChatDev가 어떻게 동작하는지 멘티님이 이해한 대로 '추상화'해서 적습니다.

- **Agent Roles:** CEO, CTO, Programmer 등의 상호작용 방식
    
- **Customization:** 내가 수정한 `PhaseConfig.json`이나 `ChatChainConfig.json`의 핵심 포인트
    
- **Data Flow:** 입력 프롬프트가 어떤 단계를 거쳐 최종 코드로 완성되는가?
    

## 4. Troubleshooting & Debugging (삽질의 기록)

> **가장 중요한 부분입니다.** 오늘 겪은 에러는 반드시 나중에 또 만납니다.

- **Issue:** (예: WSL2에서 OpenAI API 연결 시간 초과 발생)
    
- **Cause:** (예: WSL2 네트워크 프록시 설정 문제)
    
- **Solution:** (예: `.bashrc`에 환경 변수 추가 및 재시작)
    

## 5. Insight & Next Action (회고 및 다음 단계)

- **Insight:** "멀티 에이전트가 코드 생성은 빠르지만, 결과물의 일관성은 부족함."
    
- **Technical Debt:** "현재 인증/인가 없이 로컬에서만 동작함. 추후 수익화 시 API Gateway 필요."
    
- **Action Item:** 다음 프로젝트에서는 '보안 전문가' 에이전트를 추가해 볼 것.

---

### Ian의 팁: 지식 관리의 '트레이드오프'

기록하는 데 너무 많은 에너지를 쏟느라 개발 속도가 늦어지면 그것 또한 낭비입니다.

1. **시각화 활용:** 옵시디언의 **Canvas** 기능을 활용해 에이전트 간의 관계도를 간단히 그려두세요. 백 마디 말보다 그림 한 장이 구조를 이해하는 데 빠릅니다.
    
2. **연결성(Linking):** 나중에 다른 에이전트(예: CrewAI)를 다룰 때, 이 기록을 링크해서 **"ChatDev와 CrewAI의 오케스트레이션 방식 차이점"**을 비교해 보세요. 이 비교 분석이 멘티님을 '미드 레벨'에서 '시니어'로 끌어올려 줄 겁니다.