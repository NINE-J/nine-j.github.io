---
id: 019cf174-4be2-787c-a1c7-b0f6511988a3
slug: b9f1-devlog-chatdev-시작하기-구축부터-튜토리얼까지
publish: true
draft: false
title: ChatDev 시작하기 - 구축부터 튜토리얼까지
description: Multi-Agent System ChatDev 2.0 환경 구성, 실행, 워크플로우 설계 가이드
author: Nine
date: 2026-03-15 15:20:00
categories:
  - AI
  - Multi-Agent
tags:
  - devlog
  - ChatDev
  - multi-agent-system
  - tutorial
  - local-llm
# image: 
Status: Testing
---

## 📌개요

"AI가 코드를 대신 짜주는 것"에 머물지 않고, **여러 AI 에이전트가 팀을 이루어 서로의 결과물을 검토하고 협업하는 구조**를 직접 구축해보고 싶었다. 이른바 _가상 개발 스쿼드(Virtual Agile Squad)_ 를 운영하는 것이 목표다.

이 포스팅에서는 그 첫 번째 실험 대상인 **ChatDev 2.0 (DevAll)** 을 직접 설치하고 실행해보며, 노드/엣지 기반의 워크플로우 설계 방식을 이해하기까지의 과정을 정리한다.

## 📌내용

### 왜 ChatDev를 선택했나?

여러 멀티 에이전트 프레임워크 중 ChatDev를 첫 번째 실험 대상으로 선택한 이유는 세 가지다.

| 프레임워크       | 핵심 컨셉         | 특징                             |
| :---------- | :------------ | :----------------------------- |
| **ChatDev** | 가상 소프트웨어 회사   | CEO/CTO 등 역할극 기반, 낮은 진입 장벽     |
| **CrewAI**  | 전문화된 팀(Crew)  | 역할 기반, 비즈니스 프로세스 자동화에 적합       |
| **AutoGen** | 에이전트 간 대화     | Microsoft 개발, 코드 실행/디버깅 능력이 강력 |
| **MetaGPT** | 표준 운영 절차(SOP) | 한 줄 요구사항으로 설계 문서부터 코드까지 생성     |

1. **역할 기반 협업의 직관성**: CEO, CPO, CTO, Programmer, Reviewer 등 명확한 R\&R을 가진 에이전트 구조가 팀 운영 모델과 가장 유사하다.
2. **로컬 LLM 연동의 용이성**: Ollama와 연결하면 API 비용 없이 무제한 실험이 가능하다.
3. **Zero-Code 워크플로우**: 코드 없이 노드/엣지 UI만으로 워크플로우를 설계할 수 있어 빠른 시작이 가능하다.

### 환경 구성 및 설치

#### 사전 요구사항

> \[!IMPORTANT]
> 아래 항목이 모두 준비되지 않으면 실행 자체가 되지 않는다.

| 항목      | 필요 버전 | 확인 명령              |
| :------ | :---- | :----------------- |
| Python  | 3.12+ | `python --version` |
| Node.js | 18+   | `node --version`   |
| uv      | 최신    | `uv --version`     |

`uv`는 pip과 별개인 Python 패키지 매니저로, ChatDev 2.0의 공식 패키지 매니저다.

```bash
# Windows (PowerShell)
winget install astral-sh.uv
# 또는
pip install uv
```

#### 설치 순서

```bash
# 1. 저장소 클론
git clone https://github.com/OpenBMB/ChatDev.git
cd ChatDev

# 2. 백엔드 의존성 (가상 환경 생성 + 패키지 설치 한 번에)
uv sync

# 3. 프론트엔드 의존성
cd frontend && npm install && cd ..

# 4. 환경 변수 파일 생성
copy .env.example .env   # Windows CMD
```

### LLM 연동 설정

`.env` 파일을 열고 사용할 LLM 제공자 정보를 입력한다. ChatDev는 OpenAI 호환 API를 지원하므로 클라우드와 로컬 LLM 모두 동일한 방식으로 연동된다.

```dotenv
# 클라우드: OpenAI
BASE_URL=https://api.openai.com/v1
API_KEY=sk-your-openai-api-key

# 클라우드: Google Gemini
BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
API_KEY=your-gemini-api-key

# 로컬: Ollama (무료, 오프라인)
BASE_URL=http://localhost:11434/v1
API_KEY=ollama

# 로컬: LM Studio
BASE_URL=http://localhost:1234/v1
API_KEY=lm-studio
```

> \[!TIP]
> UI의 **Graph > Variables** 창에서 그래프마다 `BASE_URL`/`API_KEY`를 개별 재정의할 수 있다. UI 설정이 `.env`보다 우선 적용된다.

### 실행

```bash
# 권장: 백엔드 + 프론트엔드 동시 실행
make dev
```

실행 후 **[http://localhost:5173](http://localhost:5173)** 에서 Web Console에 접속한다.

> \[!NOTE]
> **Windows에서 `make`가 없는 경우**, Chocolatey로 설치하거나 수동으로 실행한다.
>
> ```powershell
> choco install make   # Chocolatey가 먼저 필요: https://chocolatey.org/install
> ```
>
> 수동 실행은 터미널 두 개를 열어 각각 실행:
>
> ```bash
> # 터미널 1 — 백엔드
> uv run python server_main.py --port 6400 --reload
>
> # 터미널 2 — 프론트엔드 (PowerShell)
> cd frontend
> $env:VITE_API_BASE_URL="http://localhost:6400"; npm run dev
> ```

포트 충돌 시: 백엔드는 `--port 6401`, 프론트엔드는 `VITE_API_BASE_URL=http://localhost:6401`로 함께 변경한다.

### 워크플로우 설계 개념: 노드와 엣지

ChatDev 2.0의 핵심은 **그래프(Graph)** 구조다. 노드(행위자)를 만들고 엣지(연결선)로 이어 붙이면 멀티 에이전트 워크플로우가 완성된다.

> \[!INFO]
> \[노드 생성] -> \[역할 부여] -> \[엣지로 연결] -> \[Human Node로 검토 루프 추가]

| 노드 타입            | 설명                                   |
| :--------------- | :----------------------------------- |
| **Agent Node**   | LLM 기반 에이전트. 역할(Role)과 프롬프트를 부여받아 동작 |
| **Python Node**  | 파이썬 스크립트 직접 실행                       |
| **Human Node**   | 사용자 입력/검토를 기다리는 대기 단계                |
| **Literal Node** | 고정 텍스트를 출력하는 단순 노드                   |

**실행 흐름:**

* `start` 노드에 연결된 노드가 진입점이 되며, 진입점 노드들은 **병렬 실행**된다.
* 상위 노드의 출력 결과가 하위 노드의 입력으로 전달되는 **파이프라인 구조**다.
* **조건부 엣지(Conditional Edge)**: "사용자가 `ACCEPT`를 입력하면 종료, 아니면 다시 에이전트에게 전달"처럼 조건에 따라 실행 경로를 분기할 수 있다.

### 바로 사용할 수 있는 기본 워크플로우

`yaml_instance/` 폴더에 즉시 실행 가능한 예제 파일들이 들어 있다.

| 파일명                             | 설명                |
| :------------------------------ | :---------------- |
| `ChatDev_v1.yaml`               | 가상 소프트웨어 회사 워크플로우 |
| `GameDev_v1.yaml`               | 게임 개발 전문 워크플로우    |
| `deep_research_v1.yaml`         | 심층 리서치 워크플로우      |
| `data_visualization_basic.yaml` | 데이터 시각화 워크플로우     |
| `demo_*.yaml`                   | 개별 기능/모듈 쇼케이스     |

YAML 파일을 추가하거나 수정했을 때는 `make sync`로 UI에 동기화한다.

***

### 주요 Troubleshooting

| 증상                        | 원인                            | 해결책                                     |
| :------------------------ | :---------------------------- | :-------------------------------------- |
| `make: command not found` | GNU Make 미설치 (Windows)        | `choco install make`                    |
| 프론트엔드가 백엔드에 연결 안 됨        | 포트 불일치                        | `VITE_API_BASE_URL` 포트와 백엔드 포트 일치 여부 확인 |
| 실행 중 작업이 갑자기 중단됨          | `--reload` 옵션이 파일 생성을 감지해 재시작 | `--reload` 옵션 제거                        |
| `uv sync` 실패              | Python 버전 불일치                 | Python 3.12+ 설치 확인                      |
| Ollama 연결 실패              | Ollama 서버 미실행                 | `ollama serve` 실행 후 재시도                 |

***

## 🎯결론

**설치는 `uv sync` + `npm install`, 실행은 `make dev` + `localhost:5173` 이 네 가지만 기억하면 ChatDev를 시작할 수 있다.**

ChatDev 2.0은 코드 한 줄 없이 노드와 엣지를 이어붙이는 것만으로 멀티 에이전트 워크플로우를 설계할 수 있는 플랫폼이다. 클라우드 LLM뿐 아니라 Ollama 같은 로컬 LLM과도 연결되어 비용 부담 없이 실험할 수 있다는 점이 개인 개발자에게 가장 큰 매력이다. 다음 단계는 기본 제공 YAML 워크플로우를 실행해보고, 직접 에이전트 역할과 프롬프트를 커스터마이징해보는 것이다.

***

## ⚙️EndNote

### 사전 지식

* **Multi-Agent System**: 여러 자율적 에이전트가 상호작용하며 문제를 해결하는 시스템
* **LLM (Large Language Model)**: ChatGPT, Gemini, Llama 등 대규모 언어 모델
* **OpenAI 호환 API**: OpenAI의 API 스펙을 따르는 인터페이스. 다양한 LLM 제공자가 채택하여 동일한 코드로 여러 모델을 사용 가능
* **Graph 구조 (노드/엣지)**: 노드(Node)는 에이전트, 엣지(Edge)는 에이전트 간의 정보 흐름을 나타내는 그래프 이론의 기본 개념
* **Human-in-the-Loop (HITL)**: 자동화 워크플로우 중간에 사람이 개입하여 결과를 검토·승인하는 방식

### 더 알아보기

* **ChatDev 공식 저장소**: [https://github.com/OpenBMB/ChatDev](https://github.com/OpenBMB/ChatDev)
* **uv 공식 문서**: [https://docs.astral.sh/uv/](https://docs.astral.sh/uv/)
* **Ollama 공식 사이트**: [https://ollama.com/](https://ollama.com/)
* **LM Studio**: [https://lmstudio.ai/](https://lmstudio.ai/)
* **ChatDev 논문**: [ChatDev: Communicative Agents for Software Development (arXiv:2307.07924)](https://arxiv.org/abs/2307.07924)
* **GNU Make 공식 문서**: [https://www.gnu.org/software/make/](https://www.gnu.org/software/make/)
* **Chocolatey (Windows 패키지 매니저)**: [https://chocolatey.org/install](https://chocolatey.org/install)
