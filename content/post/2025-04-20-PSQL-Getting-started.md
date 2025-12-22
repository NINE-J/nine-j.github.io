---
publish: true
draft: false
title: "psql: 시작하기"
description: feat.사용자의 password 인증을 실패했습니다
author: Nine
Created: 2025-04-20
categories:
  - DB
  - PostgreSQL
tags:
  - devlog
  - PostgreSQL
  - psql
  - DB
# image: Status: Done
---
## 📌개요

기본적으로 그냥 설치 후 환경 변수에 psql 등록돼서 버전 확인이 가능했다.
기본 옵션으로 설치해서 DBeaver 역시 어렵지 않게 연결할 수 있었다.

근데 PostgreSQL이 동작하고 있는 서버의 IP라던가 포트를 확인하려고 하는데 오류가 있었다.

- Windows11, PostgreSQL 17.4 설치
- SQL shell은 정상 동작
- PostgreSQL 설치 후 Bash, CMD에서 `psql` 명령어 찾을 수 없음 오류
- DBeaver 접속 정상

## 📌내용

### PostgreSQL 설치 확인

설치가 잘 됐는지 Bash, CMD 등에서 버전을 확인해본다.

```bash
psql --version

# 예상 출력
psql (PostgreSQL) 17.4
```

### PostgreSQL 접속하기

```
psql -U [username] -d [database_name] -h [hostname] -p [port_number]
```

- `username`: PostgreSQL 데이터베이스에 로그인할 사용자 이름이다. 기본적으로 'postgres'로 설정되어 있다.
- `database_name`: 접속할 데이터베이스의 이름이다. 기본값은 'postgres'이다.
- `hostname`: PostgreSQL 서버의 호스트 이름이다. 기본값은 'localhost'이다.
- `port_number`: PostgreSQL 서버의 포트 번호이다. 기본값은 '5432'이다.

기본 옵션으로 설치한 나의 경우 아래와 같다.

```bash
psql -U postgres -d postgres -h localhost -p 5432
postgres 사용자의 암호:

# 예시 출력
psql (17.4)
도움말을 보려면 "help"를 입력하십시오.

# 프롬프트가 변경된다.
postgres=#

# \q | Ctrl+C 등으로 빠져나올 수 있다.
```

### 사용자의 password 인증을 실패했습니다

명령창에서 psql 접속 후 시도하는 방법도 있지만 [PostgreSQL 입문서](https://wikidocs.net/215908)에 보면 `test` 데이터베이스에 연결하여 간단한 SQL 쿼리를 실행하는 명령어가 있다.

근데 시도하면 오류가 발생한다?

```bash
psql -d test -c "select inet_server_addr()"
<USER NAME> 사용자의 암호:

psql: 오류: "localhost" (::1), 5432 포트로 서버 접속 할 수 없음: 치명적오류:  사용자 "<USER NAME>"의 password 인증을 실패했습니다
```

비밀번호는 틀리지 않았고 Bash, CMD 등에서 테스트 명령만 실패한다.

`pg_hba.conf` 파일의 인증 메서드를 수정하라는 정보가 많았는데 이건 보안을 바꾸는 거니까 지금 필요한 근본적인 해결책이 아니다.

postgres 접속은 가능하니까 접속해서 USER 목록을 조회해본다.

```sql
postgres=# SELECT usename FROM pg_user;
 usename
----------
 postgres
(1개 행)


postgres=# SELECT usename, usesuper, usecreatedb FROM pg_user;
 usename  | usesuper | usecreatedb
----------+----------+-------------
 postgres | t        | t
(1개 행)
```

존재하는 유저는 postgres 뿐인데 테스트 명령에 왜 엉뚱한 사용자명이 나올까?

이 명령은 명시적으로 `-U` (user)를 지정하지 않았기 때문에 현재 로그인된 OS 사용자 이름을 PostgreSQL 클라이언트가 그대로 사용하려고 한다.

확실히 존재하는 postgres 유저로 테스트 명령을 실행하기 위해 `-U postgres`를 붙여주면 명확하게 `postgres` 유저로 접속 시도하게 된다.

```bash
psql -U postgres -d test -c "select inet_server_addr()"
postgres 사용자의 암호:

 inet_server_addr
------------------
 ::1
(1개 행)


psql -U postgres -d test -c "select inet_server_port()"
postgres 사용자의 암호:

 inet_server_port
------------------
             5432
(1개 행)
```

### PostgreSQL 설치

[PostgreSQL 공식 다운로드](https://www.postgresql.org/download/) Download 페이지에서 운영체제에 맞게 선택 후 다운로드

나는 지금 시점 끈따끈따한 17.4 선택.

#### 0.Welcome

설치 파일을 실행하면 환영해준다. Click Next

```
[Setup]

# 설정 - PostgreSQL
Setup - PostgreSQL

# PostgreSQL 설치 마법사에 오신 것을 환영합니다.
Welcome to the PostgreSQL Setup Wizard.
```

#### 1.Installation Directory

설치할 경로를 선택한다.
특별히 다른 경로 지정할 필요가 없는 관계로 기본 경로 그대로 설치한다. Click Next

```
[Setup]

# PostgreSQL이 설치될 디렉토리를 지정해 주세요.
Please specify the directory where PostgreSQL will be installed.

# 설치 디렉토리 [경로 인풋] [경로 선택 버튼]
Installation Directory [C:\Program Files\PostgreSQL\17] [choose path button]
```

#### 2.Select Components

설치 항목을 선택하라고 한다.

- PostgreSQL Server
	- PostgreSQL database server
	- PostgreSQL 데이터베이스 서버
- pgAdmin4
	- pgAdmin4는 PostgreSQL 데이터베이스와 서버를 관리하고 사용하기 위한 그래픽 인터페이스입니다.
	- pgAdmin4 is a graphical interface for managing and working with PostgreSQL databases and servers.
- Stack Builder
	- Stack Builder는 PostgreSQL 설치를 보완하기 위해 추가 도구, 드라이버 및 애플리케이션을 다운로드하고 설치하는 데 사용할 수 있습니다.
	- Stack Builder may be used to download and install additional tools, drivers and applications to complement your PostgreSQL installation
- Command Line tools
	- 이 옵션은 libpq, ecpg, pg_basebackup, pg_dump, pg_estore, pg_bench 등과 같은 명령줄 도구와 클라이언트 라이브러리를 설치합니다. 명령줄 도구는 PostgreSQL 데이터베이스 서버 또는 pgAdmin4를 설치할 때 필요한 옵션입니다.
	- This option installs command line tools and client libraries such as libpq, ecpg, pg_basebackup, pg_dump, pg_restore,pg_bench and more. The command line tools are a required option when installing the PostgreSQL Database Server or pgAdmin4.

간단히 필요한 것만 선택. 귀찮으면 다 선택된 상태로 Click Next

```
[Setup]

# 구성 요소 선택
Select Components

# 설치할 구성 요소를 선택합니다: 설치하지 않을 구성 요소를 지웁니다.
Select the components you want to install: clear the components you do not want to install.

# 계속할 준비가 되면 다음을 클릭합니다
Click Next when you are ready to continue

- [x] PostgreSQL Server
- [ ] pgAdmin4
- [ ] Stack Builder
- [x] Command Line Tools
```

#### 3.Data Directory

Data 경로를 설정한다.
특별히 다른 경로 지정할 필요가 없는 관계로 기본 경로 그대로 설치한다. Click Next

```
[Setup]

# 데이터 디렉토리
Data Directory

# 데이터를 저장할 디렉토리를 선택해 주세요.
Please select a directory under which to store your data.

# 데이터 디렉토리 [경로 인풋] [경로 선택 버튼]
Data Directory [C:\Program Files\PostgreSQL\17\data] [choose path button]
```

#### 4.Password

데이터베이스 슈퍼사용자(postgres)의 비밀번호를 설정한다. Click Next

```
[Setup]

# 비밀번호
Password

# 데이터베이스 슈퍼사용자(postgres)의 비밀번호를 입력해 주세요.
Please provide a password for the database superuser (postgres).

# 비밀번호 [비밀번호 입력 인풋]
Password [type your password]
# 비밀번호 재입력 [비밀번호 입력 인풋]
Retype password [type your password]
```

#### 5.Port

포트를 설정한다.
특별히 변경할 필요 없어서 기본 포트로 사용. Click Next

```
[Setup]

# 포트
Port

# 서버가 수신해야 할 포트 번호를 선택해 주세요.
Please select the port number the server should listen on.

# 포트 [포트 입력 인풋]
Port [5432]
```

#### 6.Advanced Options

Locale 설정 시 `DEFAULT` 값이 기본으로 설정되어 있을텐데 본인이 사용하고 있는 **운영체제의 시스템 로케일**을 그대로 사용하게 된다.

한국어 Windows 기준으로는 `Korean_Korea.949`로 설정되고 한국어 macOS 기준으로는 `ko_KR.UTF-8`로 설정된다.
이는 PostgreSQL에서 한글 정렬이나 `LIKE` 검색 시 예기치 않은 동작을 유발할 수 있다.

AWS와 같은 클라우드 플랫폼을 사용해 배포를 진행하는 경우 실제 서버 운영 환경 배제할 수는 없다.
Linux 기반의 서버, AWS RDS, Docker 컨테이너 등에서는 `en_US.UTF-8` Locale을 사용하는 점을 고려하자.

나중에 서버 배포 하고 맞출 때 인코딩 불상사를 보고 싶지 않으면 미리 맞추는 게 좋고,
이미 만들어진 데이터베이스의 로케일은 **변경할 수 없고**, **새 클러스터를 만들거나 데이터베이스를 새로 생성**해야 한다.

잘 선택한 후 Click Next

```
[Setup]

# 고급 옵션 설정
Advanced Options

# 새 데이터베이스 클러스터에서 사용할 지역을 선택합니다.
Select the locale to be used by the new database cluster.

# 지역 [지역 선택 드롭다운]
Locale [en-US]
```

#### 7.Pre Installation Summary

위 단계에서 선택한 설치 옵션의 요약 정보를 보여준다. Click Next

```
[Setup]

# 설치 전 요약
Pre Installation Summary

# 다음 설정이 설치에 사용됩니다
The following settings will be used for the installation

Installation Directory: C:\Program Files\PostgreSQL\17
Server Installation Directory: C:\Program Files\PostgreSQL\17
Data Directory: C:\Program Files\PostgreSQL\17\data
Database Port: 5432
Database Superuser: postgres
Operating System Account: NT AUTHORITY\NetworkService
Database Service: postgresql-x64-17
Command Line Tools Installation Directory: C:\Program Files\PostgreSQL\17
Installation Log: C:\Users\<UserName>\AppData\Local\Temp\install-postgresql.log
```

#### 8.Ready to Install

요약 정보를 확인하고 이상이 없는지 확인 한 번 더 해준다. Click Next

```
[Setup]

# 설치 준비 완료
Ready to Install

# 이제 컴퓨터에 PostgreSQL 설치를 시작할 준비가 되었습니다.
Setup is now ready to begin installing PostgreSQL on your computer.
```

#### 9.Installing

설치 진행 바를 확인하며 기다리면 완료된다. 약 10초 내외 (성능 따라 다를 듯)

```
[Setup]

# 설치
Installing

# 설치 프로그램이 컴퓨터에 PostgreSQL을 설치하는 동안 잠시 기다려 주세요
Please wait while Setup installs PostgreSQL on your computer

# 설치 중...
installing...
[설치 진행 상태바]
```

#### 10.Completing

10단계에서 완료 화면을 볼 수 있다.
만약 구성 요소 선택에서 다른 옵션을 더 체크했다면 별도의 추가 작업이 있다.
근데 이건 설치 이후에도 추가할 수 있는 부분이니까 별도로 추가하면 된다.

```
[Setup]

# PostgreSQL 설치 마법사 완료
Completing the PostgreSQL Setup Wizard

# 컴퓨터에 PostgreSQL 설치가 완료되었습니다.
Setup has finished installing PostgreSQL on your computer.
```

### PostgreSQL 삭제

`제어판 > 프로그램 및 기능`에서 설치한 PostgreSQL 버전 삭제를 누르면 Setup 팝업이 뜬다.
`Entire application` 또는 `individual components` 중 선택하고 Click Next

```
[Uninstallation mode]

# 전체 애플리케이션 또는 개별 구성 요소를 제거하시겠습니까?
Do you want to uninstall entire application or individual components?

# 전체 애플리케이션
- [ ] Entire application
# 전체 애플리케이션과 애플리케이션에 설치된 모든 파일을 제거합니다
Removes entire application and all files installed by the application

# 개별 구성 요소
- [ ] individual components
# 개별 구성 요소를 제거하고 나머지 애플리케이션은 설치된 상태로 유지합니다
Removes individual components while leaving the rest of application installed
```

삭제 진행 프로그레스를 지나고 경고가 있을 수 있다.
`data\log` 파일을 보고 있었고 등등 다른 프로그램에서 사용 중이라서 발생한 것 같다.

```
[Warning]

The data directory (C:\\Program Files\PostgreSQL\<version>\data) has not been removed
```

그래도 삭제 완료는 된다.

```
[Info]

Uninstallation completed
```

PostgreSQL 설치 경로 `C:\\Program Files\PostgreSQL`에서 폴더도 깔끔히 삭제해준다.
PostgreSQL 관련 시스템 환경 변수를 등록했었다면 찾아서 삭제한다.

재부팅 끗-⭐.

## ⚙️EndNote

### 참고 자료

- [PostgreSQL을 여행하는 입문자를 위한 안내서](https://wikidocs.net/book/8814)