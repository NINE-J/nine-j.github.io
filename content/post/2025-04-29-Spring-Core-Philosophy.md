---
publish: true
draft: false
title: Spring 핵심 철학
description: feat.POJO, DRY, SRP, SoC, TDD
author: Nine
date: 2025-04-29 00:00:00
categories:
  - Spring
tags:
  - devlog
  - Spring
  - 철학
  - POJO
  - DRY
  - SoC
  - TDD
  - 객체지향
  - Framework
  - 프레임워크

Status: Done
---
## 📌개요

Spring Framework는 지금껏 사용해야 하니 필요한 만큼만 알아보고 사용할 수 있다면 그만이었다.
그게 프레임워크의 장점이기도 하지만 자세히 알고 다루는 게 당연히 좋을 것이다.

Spring의 기본 철학과 그게 왜 중요한지 실제 코드에선 어떻게 드러나는지 정리해보고 싶어졌다.

- Spring Framework는 **POJO 기반 개발 철학**을 중심으로 복잡한 엔터프라이즈 애플리케이션을 단순화 한다.
- **객체지향 설계 원칙(SRP, SoC, DRY 등)** 을 자연스럽게 실현할 수 있도록 설계되어 클린 아키텍처의 이상을 구현한다.
- **테스트 주도 개발(TDD)** 을 내재화하여 단위 테스트 및 통합 테스트가 손쉬운 구조를 지향한다.
- 전통적인 Java EE와의 차별점은 단순한 기술적 비교를 넘어 **철학적 차별화**로 설명할 수 있다.

## 📌내용

### POJO 기반 개발 - 순수 자바의 진정한 의미

Spring은 POJO(Plain Old Java Object)라는 개념을 강조한다.

그냥 평범한 자바 객체가 왜 중요한가.

알고 보니 그 핵심은 프레임워크에 종속되지 않은 코드 작성이었다.
즉, Spring 없이도 돌아가는 순수 자바 객체를 만들어야 유지보수나 테스트가 더 쉬워진다는 것이다.

- POJO의 핵심 특징
	- 특별한 인터페이스/상속이 필요 없다.
	- 어노테이션 없이도 돌아가는 단순한 구조
	- getter/setter만 있는 평범한 자바 객체

자주 강조되는 부분은 비침투성(Non-Invasiveness)인데, 이건 "내 비즈니스 로직에 프레임워크 종속적인 코드를 심지 않아도 된다"는 뜻이다.

정말 중요한 개념 같아서 메모해놨던 문장이다.

>[!info] Spring Framework의 핵심 원칙 중 하나는 '비침투성'입니다.
>비즈니스 로직이나 도메인 모델에 프레임워크 종속 클래스를 억지로 넣지 않아도 실행되어야 한다는 의미입니다.

직접 작성한 간단한 예제도 다시 떠올려 봤다.

```java
public class OrderService {
	private final PaymentProcessor paymentProcessor;

	public OrderService(PaymentProcessor paymentProcessor) {
		this.paymentProcessor = paymentProcessor;
	}

	public void processOrder(Order order) {
		paymentProcessor.charge(order);
	}
}
```

Spring 없이도 동작하는 순수 자바코드. 이게 바로 Spring이 지향하는 방식이라는 걸 확실히 알게 됐다.

#### POJO의 재밌는 일화

[마틴 파울러 형님의 POJO 소개](https://martinfowler.com/bliki/POJO.html)

>**POJO (Plain Old Java Object)**는 "평범한 자바 객체"라는 의미의 약어입니다.
> 
> 이 용어는 2000년 9월, 저(마틴 파울러), 레베카 파슨스, 조쉬 매켄지가 한 컨퍼런스에서 발표를 준비하던 중에 만들어졌습니다.
> 그 발표에서는 **비즈니스 로직을 Entity Bean 같은 복잡한 구조 대신, 일반 자바 객체에 담을 때 얻는 여러 이점**에 대해 이야기하려고 했습니다.
> 그런데 우리는 사람들이 왜 그렇게까지 **일반 자바 객체 사용을 꺼려하는지** 의문이 들었고, 결론적으로 "그 객체들이 단지 이름이 멋지지 않기 때문"이라는 데 생각이 모였습니다.
> 그래서 우리가 이름을 하나 붙여줬고, 그 이름이 아주 잘 퍼져 나가게 된 것이죠.

### 객체지향 설게 원칙

Spring의 또 다른 포인트는 객체지향 설계 원칙이었다.
사실 SOLID 원칙 같은 건 교과서적으로만 알고 있었는데 Spring 구조 안에서 그게 자연스럽게 드러난다는 걸 배웠다.

#### DRY(Don't Repeat Yourself)

중복 방지를 위해 AOP(관점지향 프로그래밍)를 활용하는 방식이 인상적이었다.

단순히 기능적으로 쓸 수 있다는 게 아니라 반복되는 패턴을 추상화하고 코드의 관심사를 깔끔히 분리하려는 시도구나.

예를 들어 트랜잭션 처리, 로깅 같은 건 매번 코드에 쓰지 않고 `@Transactional`, `@Aspect`로 공통화 하는 방식의 AOP를 도입하면 횡단 관심사를 코드 밖으로 꺼낼 수 있다.

#### SRP(Single Responsibility Principle)

서비스, 컨트롤러, 레포지토리로 책임을 나누는 계층 구조 덕분에 코드가 깔끔하게 분리될 수 있다.
"변화의 이유가 하나여야 한다"는 SRP 원칙을 확실히 이해하고 넘어간다.

#### SoC(Separation of Concerns)

DI(의존성 주입), AOP 같은 개념이 결국 각자의 역할에 집중할 수 있게 돕는 도구라는 점도 정리해볼 수 있었다.
예를 들어 `@Aspect`로 로깅은 별도로 떼어내고 서비스 로직은 비즈니스에만 집중할 수 있게 한다.

예전에 소켓 통신 오류가 계속 발생하는 상황에 트러블 슈팅을 위해 어떤 방법이 있을까 고민해보고 찾아보다가 Aspect 클래스를 생성해서 메서드 실행은 건드리지 않고 내가 원하는 측정만 추가하는 방식이 필요했는데 그냥 쓰고 이게 되네 했던 순간보다 다시 알아보는 지금 "코드의 순수성"과 "변화 대응력"을 동시에 높이는 설계적인 해법이라서 신기하고 진짜 큰 가치구나 싶다.

### Spring은 테스트를 위한 구조다

![](/assets/images/Drawing%202025-05-06%2000.35.36.excalidraw.png)

이건 체감이 정말 컸던 부분이다.
TDD는 테스트 환경 세팅이 어려운데 Spring은 POJO와 DI 덕분에 이게 정말 단순해진다.

- Spring에서 TDD 특징
	- 컨테이너 없어도 단위 테스트 가능 (POJO 덕분!)
	- 의존성 주입 덕분에 Mocking이 간단
	- `@SpringBootTest`로 통합 테스트도 손쉽게 가능

테스트했던 가장 단순 코드 `@DisplayName` 달아놨던.. 그래서 일관성 없이 어딘 달고 어딘 안 달고...
메서드명을 한글로 사용해보자! 😊

```java
@Test
@DisplayName("기본 정보로 사용자 생성시 필수 필드가 올바르게 설정되어야 한다")
void createWithBasicInfo() {
  User user = UserFixture.createValidUser();  
  
  assertAll(  
      () -> assertThat(user.getId()).isNotNull(),  
      () -> assertThat(user.getEmail()).isNotNull(),  
      () -> assertThat(user.getName()).isNotNull(),  
      () -> assertThat(user.getPassword()).isNotNull(),  
      () -> assertThat(user.getCreatedAt()).isNotNull(),  
      () -> assertThat(user.getUpdatedAt()).isNotNull(),  
      () -> assertThat(user.getUpdatedAt()).isEqualTo(user.getCreatedAt()),  
      () -> assertThat(user.getChannels()).isEmpty(),
      () -> assertThat(user.getProfileImageId()).isNull()  
  );  
}
```

```java
@Test  
@DisplayName("유효한 credentials로 로그인 시 UserResponse 반환")  
void loginSuccess() {  
  // given  
  when(userRepository.findByNameWithPassword(user.getName(), user.getPassword())).thenReturn(  
      Optional.ofNullable(user));  
  
  // when  
  UserResponse response = authService.login(loginRequest);  
  
  // Then  
  assertThat(response).isNotNull();  
  assertThat(response)  
      .usingRecursiveComparison()  
      .isEqualTo(toUserResponse(user));  
  
  verify(userRepository).findByNameWithPassword(loginRequest.userName(), loginRequest.password());
}
```

1. **RED:** 구현이 필요해?
	- 테스트 작성하고 오류를 만나
	- 빨간줄이 내가 뭘 만들어야 하는지 알려주는 게 돼
2. **GREEN:** 코드 작성 했어?
	- 테스트를 돌려
	- 로직을 수정하고 필요한 걸 또 만들어
3. **REFACTOR:** 개선할 수 있겠는데?
	- 클린 코드로 개선해보자
	- 변경하면서 다시 **RED**를 만나

TestContext Framework도 정말 유용하다.
트랜잭션 처리나 컨텍스트 초기화 같은 걸 알아서 해주니까 훨씬 간편하게 통합 테스트를 구성할 수 있다.

- TestContext Framework의 주요 기능
	- **컨텍스트 캐싱**: 테스트마다 매번 새 컨텍스트를 띄우면 느리니까, 같은 설정이면 재사용해서 속도를 최적화함.
	- **DI 지원**:  테스트 클래스에 `@Autowired` 같은 걸 쓸 수 있게 해줌.
	- **트랜잭션 관리**:  테스트가 끝난 후 자동으로 DB 롤백 → 깨끗한 상태 유지.
	- **이벤트 리스너/후크**:  테스트 실행 전후에 더 복잡한 작업(예: 컨텍스트 초기화)도 가능.

#### 테스트 중심 개발을 유도하는 설계 철학

Spring은 처음부터 테스트 가능한 코드(testable code)를 중심에 두고 설계됐다.
다음과 같은 구조적 특징이 TDD를 촉진시킨다.

- POJO 기반 클래스 → 별도의 컨테이너 없이도 테스트 가능
- DI를 통한 구성 → 객체간 결합도 감소 → 단위 테스트 용이
- 설정과 환경 분리 → 테스트 대상 코드의 독립성 확보
- 모듈화된 아키텍처 → 책임과 기능 분리 → 테스트 대상을 명확히 구분 가능

단순히 테스트가 가능한 수준을 넘어서 테스트 주도 개발을 실질적으로 적용하고 유지할 수 있는 환경을 제공한다는 점에서 의미가 크다.

## ⚙️EndNote

### 사전 지식

- 객체지향 기본 개념
- JUnit 기본 사용법
- Mockito 사용 경험

### 더 알아보기

- POJO란 무엇인가?
- 테스트 주도 개발 개념
- [Spring 공식 문서](https://spring.io/projects/spring-framework)