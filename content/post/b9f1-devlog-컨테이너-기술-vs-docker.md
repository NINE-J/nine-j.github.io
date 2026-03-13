---
publish: true
draft: false
title: 컨테이너 기술 vs Docker
description: 컨테이너 기술의 본질을 이해하자
author: Nine
date: 2025-06-24 14:04:36
categories:
  - Infra
tags:
  - devlog
  - Docker
  - 컨테이너기술
  - namespace
  - cgroups
  - OCI
  - Podman
# image: 
Status: Done
id: 019ce76a-c1b6-707f-b5e2-644122fb211c
slug: b9f1-devlog-컨테이너-기술-vs-docker
---

## 📌개요

> Docker와 컨테이너는 다르다.

많은 개발자가 처음 접하는 컨테이너 기술은 Docker로 이어지지만 사실 Docker는 컨테이너 기술을 기반으로 만들어진 하나의 구현체일 뿐이다.

Docker보다 훨씬 이전에 등장했던 컨테이너 기술의 뿌리를 짚고 Docker가 어떤 혁신을 만들어냈는지, 또 최근에는 어떤 대체 도구들이 등장했는지 알아보자.

## 📌내용

### 컨테이너 기술의 본질

컨테이너란 운영체제 수준에서 프로세스를 격리(isolation)하여 마치 독립된 시스템처럼 동작하게 하는 기술이다.

이 격리는 주로 아래 두 가지 리눅스 커널 기능을 조합해서 이루어진다.

* 네임스페이스(namespace)
  * 프로세스, 파일 시스템, 사용자 ID, 네트워크 등 다양한 시스템 리소스를 다른 컨테이너와 분리하는 기술
  * 첫 등장: 2002년 mount namespace (`Linux 2.4.19`), 본격적으로 컨테이너화 가능해진 시점은 `2008년 2.6.24` 이후
* cgroups(control groups)
  * CPU, 메모리, 디스크 등 리소스 사용량을 제한하고 분리할 수 있도록 해주는 기능
  * 구글이 2006년 내부적으로 개발, `2008년 리눅스 2.6.24`에 정식 포함

> \[!INFO]
> 리눅스 커널 2.6.24부터 namespace와 cgroups가 안정적으로 통합되며 현대적인 컨테이너 개념이 실현 가능해졌다.

### Docker 이전에도 컨테이너는 있었다

컨테이너 기술이 단지 Docker로부터 시작되었다고 생각하지 말자.
대표적인 두 가지 사례만 봐도 충분하다.

* Google Borg(2006\~)
  * 구글은 자체 클러스터 관리 시스템인 Borg에서 `process containers`라는 이름으로 컨테이너 기술을 도입해 사용하고 있었다. 이 경험은 나중에 `Kubernetes`(`k8s`)로 이어지게 된다.
* LXC(Linux Containers)
  * 2008년 등장한 LXC는 리눅스 네임스페이스와 cgroups를 조합해 독립된 사용자 공간을 제공하는 최초의 완전한 리눅스 컨테이너 런타임이었다.

즉, Docker 이전에도 컨테이너는 실제 운영 환경에서 사용되고 있었다.

> \[!TIP]
> `k8s`(kubernetes), `i18n`(internationalization), `a11y`(accessibility) 같은 축약어는 단어의 첫 글자 + 생략된 글자 수 + 마지막 글자 형태로 만들어진 축약어다.
>
> * 긴 단어를 짧게 줄여서 쓰기 편하게
> * 기술 문서나 코드에서 가독성과 공간 절약을 위해
> * 축약하면서도 고유성을 유지

### Docker는 무엇이 달랐나?

Docker는 2013년에 등장하여 기존 컨테이너 기술을 개발자 친화적으로 쉽게 쓸 수 있도록 UX를 패키징한 도구로서 주목받았다.

> Docker는 컨테이너 기술 자체를 발명한 게 아니라 그것을 '쉽게 쓸 수 있도록' 만들어 낸 데 혁신이 있다.

Docker의 핵심 혁신:

* `DockerFile`로 정의 가능한 이미지 기반 환경 구성
* `docker run` 같은 직관적인 CLI
* Docker Hub를 통한 이미지 공유 및 배포

### 또 다른 컨테이너 도구들

컨테이너 기술은 OCI(Open Container Initiative)라는 표준에 의해 정의된다.
이 표준을 기반으로 다양한 런타임이 Docker 외에도 등장하고 있다.

* Container Runtime: 컨테이너를 실행하는 역할
  * `runc`: Docker도 내부적으로 사용하는 기본 실행기
  * `conatinerd`: CNCF가 관리하는 Docker 독립형 런타임
  * `CRI-O`: Kubernetes 전용으로 설계된 경량 런타임임
* Docker 대체 도구:
  * Podman: rootless 컨테이너, systemd 통합 지원, Docker Daemon 없이 작동
  * Buildah: Dockerfile 없이 이미지 빌드 가능, Podman과 연동
  * Kubernetes: 직접 컨테이너를 실행하지 않지만 런타임 인터페이스(Container Runtime Interface - CRI)를 통해 위 런타임과 연동

### Docker는 이제 표준이 아니다?

2020년 이후 Kubernetes는 Docker를 기본 런타임에서 제외했고 대신 `containered`, `CRI-O`와 같은 런타임을 사용한다.

> Docker가 문제가 아니라 Docker의 구조가 Kubernetes와 궁합이 맞지 않아서다.

Kubernetes는 CRI라는 표준 API로 런타임을 호출한다.
하지만 Docker는 이 CRI를 직접 구현하지 않고 중간 계층(containerd + shim)을 사용해 간접적으로 연동된다.

오히려 containerd나 CRI-O처럼 CRI를 직접 구현한 런타임이 더 효율적이다.

## 🎯결론

> 컨테이너는 기술이고 Docker는 그 기술을 손쉽게 만든 하나의 도구다.

Docker는 훌륭한 UX 도구지만 그 자체가 컨테이너 기술의 전부는 아니다.
컨테이너 생태계는 이제 Docker를 넘어 다양화되고 있으며 오픈소스 커뮤니티와 표준화가 이를 이끌고 있다.

## ⚙️EndNote

### 사전 지식

* 이미지 빌드와 레이어 개념
* Kubernetes의 CRI(Container Runtime Interface)

### 더 알아보기

* [Linux namespaces - Wikipedia](https://en.wikipedia.org/wiki/Linux_namespaces)
* [Cgroups - Wikipedia](https://en.wikipedia.org/wiki/Cgroups)
* [리눅스 커널 2.6 - 네임스페이스 기반 컨테이너 기술](https://en.wikipedia.org/wiki/Linux_namespaces)
* [Google Borg (2006\~) – Docker 이전부터 컨테이너 활용](https://news.ycombinator.com/item?id=30327507)
* [LXC (Linux Containers) – Docker보다 선행한 사례](https://www.aquasec.com/blog/a-brief-history-of-containers-from-1970s-chroot-to-docker-2016)
* [Open Container Initiative (OCI)](https://opencontainers.org/)
* [Podman 공식 문서](https://podman.io/)
* [containerd 공식 사이트](https://containerd.io/)
