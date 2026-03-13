---
publish: true
draft: false
title: VSCode에서 PR 보기
description: feat.GitHub Pull Requests
author: Nine
date: 2025-05-06
categories:
  - IDE
  - VSCode
tags:
  - devlog
  - VSCode
  - Github
  - PR
  - PullRequest
  - Extensoins
# image: 
Status: Done
id: 019ce76a-c1b4-76ab-b4a8-81f877b3300b
slug: b9f1-devlog-vscode에서-pr-보기
---

## 📌개요

VSCode에서 PR 보려는데 복잡시럽다 복잡시러.
IntelliJ Ultimate/Community에선 GitHub 플러그인으로 손쉽게 확인이 가능하다.

## 📌내용

### IDE에서 PR을 확인하면 좋은 점

코드 리뷰에 대한 코멘트를 **바로 파일의 라인에서 확인**할 수 있다.
의견이 있어서 Reply를 남기거나 수정 완료를 곧바로 처리할 수 있다.

![](/assets/images/Pasted%20image%2020250506022741.png)

### GitHub Pull Requests

![](/assets/images/Pasted%20image%2020250506021354.png)

현재 기준 GitHub Pull Requests를 설치한다. [VSCode marketplace - GitHub Pull Requests](https://marketplace.visualstudio.com/items/?itemName=GitHub.vscode-pull-request-github)
예전 이름은 GitHub Pull Requests and Issues였나 보다.
기능은 같아서 PR, Issues를 확인할 수 있다.

### 근데 이게 문제였다

확장 설치하면 열려 있는 PR만 확인이 됐다.
필요한 다른 항목은 쿼리를 수정해줘야 한다.

`Ctrl + Shift + P` 명령 팔레트

```bash
>GitHub Pull Requests: Configure
# 엔터 치면 두 개 나온다
# Configure Remotes...
# Configure Queries...
```

![](/assets/images/Pasted%20image%2020250506024023.png)

나는 닫힌 PR을 확인해야 해서 추가했다.

```json
// settings.json
{
  // ... others
  "githubPullRequests.queries": [
	// ... others
    {
	  "label": "My Closed PRs",
	  "query": "is:closed assignee:${user}"
    }
  ]
}
```

필요에 맞게 수정 후 새로고침하면 잘 확인된다.

![](/assets/images/Pasted%20image%2020250506023804.png)
