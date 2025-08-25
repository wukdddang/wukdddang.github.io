---
title: "[AWS] Route53"
source: "https://from-basic-to-end.tistory.com/42"
author:
  - "[[기초부터 차곡차곡]]"
published: 2025-02-03
created: 2025-05-07
description: "정의(작성중)참고 용어Apex Domain (Zone Apex)도메인의 루트/최상위 수준 (ex. example.com)서브도메인이 없는 \"naked domain\"을 의미한다.CNAME 레코드를 직접 사용할 수 없다.A레코드나 ALIAS 레코드를 사용해야 한다.Zone도메인의 DNS 정보를 포함하는 관리 단위를 의미한다.하나의 도메인에 대한 모든 DNS 레코드 모음이다.ex. example.com Zone은 blog.example.com, mail.example.com 등 모든 서브도메인을 포함한다.구성요소SOA (Start of Authority) 레코드NS (Name Server) 레코드A/AAAA 레코드CNAME 레코드MX 레코드 타입Public Zone: 인터넷에 접근 가능한 공개 DNS 정보Pr.."
tags:
  - "clippings"
---
Project/AWS

### 정의

(작성중)

### 참고 용어

#### Apex Domain (Zone Apex)

- **도메인의 루트/최상위 수준 (ex. example.com)**
- 서브도메인이 없는 **"naked domain"** 을 의미한다.
- **CNAME** 레코드를 직접 사용할 수 없다.
	- A레코드나 ALIAS 레코드를 사용해야 한다.

#### Zone

- **도메인의 DNS 정보를 포함하는 관리 단위** 를 의미한다.
- 하나의 도메인에 대한 모든 DNS 레코드 모음이다.
- ex. **example.com Zone** 은 **blog.example.com**, **mail.example.com** 등 모든 서브도메인을 포함한다.
- 구성요소
	- SOA (Start of Authority) 레코드
	- NS (Name Server) 레코드
	- A/AAAA 레코드
	- CNAME 레코드
	- MX 레코드
- 타입  
	- Public Zone: 인터넷에 접근 가능한 공개 DNS 정보
	- Private Zone: **VPC 내부** 에서만 사용되는 비공개 DNS 정

#### SLA (Service Level Agreement)

서비스 제공자가 **고객에게 보장** 하는 **서비스 수준에 대한 계약** 을 의미한다.

- ex) Route53의 100% SLA는
	- AWS가 Route53 서비스가 99.999...%의 가용성을 보장하는 것이다.
	- 서비스 중단이 발생하면 AWS가 고객에게 보상(크레딧)을 제공한다.
- SLA에 일반적으로 포함되는 내용
	- 서비스 가용성 보장 수준(ex. 99.9%)
	- 응답 / 처리 시간 보장
	- 문제 해결 시간
	- 보상 정책
	- 측정 방식과 리포팅
