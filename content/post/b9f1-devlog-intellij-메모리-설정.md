---
publish: true
draft: false
title: IntelliJ 메모리 설정
description: 전역 또는 애플리케이션 별 메모리 설정
author: Nine
date: 2025-04-06
categories:
  - IDE
  - IntelliJ
tags:
  - devlog
  - IDE
  - IntelliJ
  - VMoptions
# image: 
Status: Done
id: 019ce76a-c1b2-73db-9745-d56df6ca910c
slug: b9f1-devlog-intellij-메모리-설정
---

## 📌개요

IntelliJ IDEA에서 메모리 힙 사이즈에 대해 전역 설정과 애플리케이션 별로 설정하는 방법을 알아본다.

## 📌내용

### 전역 메모리 설정

#### Change Memory Settings

`Help > Change Memory Settings` 선택 → 팝업에서 힙 사이즈 변경

![](/assets/images/Pasted%20image%2020250406132822.png)

![](/assets/images/Pasted%20image%2020250406133006.png)

#### Edit Custom VM Options

IDE 메뉴에서 설정하는 방법도 있지만, 직접 설정 파일을 수정하는 방법도 있다.

`Help > Edit Custom VM Options` 선택,
또는 각 설정 파일 경로를 찾아가서 수정하는 방법이 있다.

* Windows: `%USERPROFILE%\AppData\Roaming\JetBrains\<IntelliJ 버전>\idea64.exe.vmoptions`
* macOS: `~/Library/Application Support/JetBrains/<IntelliJ 버전>/idea.vmoptions`
* Linux: `~/.config/JetBrains/<IntelliJ 버전>/idea64.vmoptions`

![](/assets/images/Pasted%20image%2020250406135244.png)

```text
# 초기 힙 사이즈(최소 메모리)
-Xms512m

# 최대 힙 사이즈 (권장: 시스템 메모리의 1/4 ~ 1/2)
-Xms2048m
```

파일 수정 후 IntelliJ를 재시작하여 변경 사항을 적용한다.

### 실행 프로필 별로 메모리 설정

`Run/Debug Configurations`에서 `VM Options` 설정으로 특정 프로젝트의 애플리케이션을 실행할 때 사용되는 JVM의 메모리를 설정할 수 있다.

상단 툴바에서 `Edit Configurations` 선택, 또는 `Shift + Alt + F10` → `Edit Configurations`

![](/assets/images/Pasted%20image%2020250406153727.png)

VM options에 메모리 설정 추가

```text
-Xms256m -Xmx1024m // 최소 256MB, 최대 1GB 할당
```

![](/assets/images/Pasted%20image%2020250406154105.png)

### 메모리 사용량 표시

`IDE 하단 우클릭 > Memory Indicator`

![](/assets/images/Pasted%20image%2020250406133250.png)
