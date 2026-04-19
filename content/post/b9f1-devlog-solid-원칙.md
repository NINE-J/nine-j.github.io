---
publish: true
draft: false
title: SOLID 원칙
description: 단일 책임 원칙(SRP)과 개방-폐쇄 원칙(OCP)
author: Nine
date: 2025-04-07T00:00:00
categories:
  - 설계
  - 객체지향
tags:
  - devlog
  - SOLID
  - 설계
# image: 
Status: Done
id: 019ce76a-c205-716c-9420-805ed242a602
slug: b9f1-devlog-solid-원칙
---

## 📌개요

> \[!info] 한 언어에만 국한되는 내용이 아닌 객체지향 프로그래밍의 핵심 설계 방식이다.

SOLID 원칙은 2000년대 초반 로버트 C. 마틴(Robert C. Martin) - '엉클 밥(Uncle Bob)' 미국의 소프트웨어 공학자가 정리했지만, 그 기원은 1980년대 후반부터 시작된 객체 지향 설계 연구에 뿌리를 두고 있다.

* SOLID 원칙이 핵심 원칙이라 불리는 이유?
  * 변경 비용 감소: 기능 추가/수정 시 영향 범위 최소화
  * 시스템 수명 연장: 유지보수성 향상으로 기술 부채 감소
  * 팀 협업 효율화: 코드 가독성과 예측 가능성 증가

그 중 유지보수성과 확장성이 높은 소프트웨어를 설계하는 데 필수적인 SRP, OCP 두 가지 원칙을 알아본다.

## 📌내용

### SRP (Single Responsibility Principle) - 단일 책임 원칙

> \[!info] **정의**: 한 클래스는 하나의 책임만 가져야 한다.

> "한 우물만 파라!"

* 하나의 클래스는 오직 하나의 이유로만 변경되어야 한다.
* 책임 = 변경 이유
* **응집도 ↑, 유지보수성 ↑**

#### 잘못된 예

문제 상황: 뭐든 다 하는 만능 클래스

* `User` 클래스가 두 가지 책임(사용자 정보 관리 + 데이터베이스 작업)을 동시에 가진다.
* 만약 데이터베이스 로직이 변경되면 `User` 클래스도 수정해야 한다.
* 사용자 정보의 필드 변경 시에도 `User` 클래스를 수정해야 하므로 변경의 이유가 두 가지가 된다.

```java
class User {
	private String name;
	private String email;

	// 사용자 정보 관련 책임
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }

	// 데이터베이스 관련 책임 (SRP 위반)
	public void saveUserToDatabase(User user) { /* ... */ }
	public User getUserFromDatabase(String userId) { /* ... */ }
}
```

#### 올바른 예

해결책: 전문가를 따로 둡시다

* `User` 클래스는 사용자 정보 관리만 담당한다.
* `UserRepository` 클래스는 데이터베이스 작업만 담당한다.
* 데이터베이스 로직이 변경되어도 `User` 클래스는 영향을 받지 않으며 반대의 경우도 마찬가지다.

```java
class User {
	private String name;
	private String email;

	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
}

class UserRepository {
	public void saveUserToDatabase(User user) { /* ... */ }
	public User getUserFromDatabase(String userId) { /* ... */ }
}
```

### OCP (Open/Closed Principle) - 개방/폐쇄 원칙

> \[!info] **정의**: 소프트웨어 개체는 확장에는 열려 있어야 하고, 수정에는 닫혀 있어야 한다.

> "확장은 쉽게, 수정은 최소로!"

* 기존 코드를 변경하지 않고도 시스템의 기능을 확장할 수 있어야 한다.
* 이는 추상화와 다형성을 통해 구현된다.
* **확장성 ↑, 기존 코드 안정성 ↑**

#### 잘못된 예

문제 상황: 수정이 불가피한 코드

* 새 보고서 형식(예: Excel) 추가 시 기존 코드 수정 불가피
* 한 형식의 버그 수정이 다른 형식에 영향 줄 수 있음

```java
class ReportGenerator {
    public void generate(String type) {
        if ("PDF".equals(type)) {
            // PDF 생성 100줄 코드...
        } else if ("CSV".equals(type)) {
            // CSV 생성 80줄 코드...
        }
        // 새 형식 추가할 때마다 이 클래스를 수정해야 함
    }
}
```

#### 올바른 예

해결책: 확장 가능한 구조

* 새 보고서 형식(예: `ExcelReport`) 추가 시 기존 코드 변경 불필요
* 각 형식의 코드가 독립적, 유지보수 용이
* 실행 시점에 보고서 형식 결정 가능

```java
// 모든 보고서가 구현할 인터페이스
interface Reportable {
    byte[] generate();
}

// PDF 전문 생성기
class PdfReport implements Reportable {
    public byte[] generate() { /* PDF 전용 로직 */ }
}

// CSV 전문 생성기
class CsvReport implements Reportable {
    public byte[] generate() { /* CSV 전용 로직 */ }
}

// 확장 가능한 보고서 생성기
class ReportGenerator {
    public byte[] createReport(Reportable reporter) {
        return reporter.generate();  // 어떤 형식이든 동일한 방식으로 처리
    }
}
```

## 🎯결론

* SRP로 잘 분리된 코드는 OCP 적용이 자연스럽다.

* OCP를 구현하려면 SRP가 먼저 지켜져야 한다.

* SRP 적용 팁:
  * 클래스 설명 시 "\~와 \~를 한다"고 말하게 된다면 경고 신호
  * 하나의 기능 변경이 다른 기능의 테스트를 깨트린다면 리팩토링 필요

* OCP 적용 팁:
  * `if-else`/`switch-case`가 자주 등장하면 OCP 위반 의심
  * 새로운 기능을 추가할 때 기존 코드를 건드리지 않아야 한다.

> "처음부터 완벽하게 만들려고 하지 마세요. 하지만 변경이 필요할 때마다 조금씩 개선해나가세요" - 마틴 파울러

## ⚙️EndNote

### 단일 책임 원칙

> 원문: \[The Single Responsibility Principle - by Robert C. Martin (Uncle Bob)]\([https://8thlight.com/blog/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html](https://8thlight.com/blog/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html)]\([https://8thlight.com/blog/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html](https://8thlight.com/blog/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html))

1972년에 데이비드 파나스가 내놓은 고전적인 논문 “Criteria To Be used in decomposing systems into modules”. 이 논문은 Communications of the ACM Vol 15 No 12에 게제되었습니다.

이 논문에서 파나스는 간단한 알고리즘을 분해(Decompose)하고 분리(Seprate)하는 두가지 전략을 비교하고 있습니다. 이 논문은 매우 흥미롭게 읽을수 있기 때문에 읽어 보는 것을 강력 추천합니다.

출처: [narusas's blog](https://narusas.github.io/2017/08/04/Singple-Responsibility-Principle-translate-ko.html)

### 개방/폐쇄 원칙

[이 승(Seung Lee)의 Ocp PPT](https://www.slideshare.net/slideshow/ocp-5714964/5714964#8)
