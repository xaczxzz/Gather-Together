# 모여라

## 📌 프로젝트 소개

"**모여라**" 는 동아리 운영 경험에서 얻은 인사이트를 바탕으로 개발된 모바일 애플리케이션입니다. 이 앱은 학교 중앙동아리를 운영하며 겪은 경험을 통해 꼭 필요한 기능을 간결하고 직관적으로 제공합니다.

현재 많은 동아리 관리 앱은 지나치게 복잡한 기능들로 가득 차 있어, 정작 보편적이고 실용적인 사용성을 놓치고 있습니다. 또한 깔끔하고 예쁜 UI/UX를 갖춘 앱이 부족하다는 점에 주목했습니다. "모여라"는 이러한 문제를 해결하고자, 심플하면서도 아름다운 디자인과 실제 운영에 꼭 맞는 기능을 핵심으로 설계되었습니다.

</br>

</br>

## ✨ 주요 특징

> - 출석 관리: 부원들의 출석 정보를 한눈에 확인할 수 있는 간편한 시스템.
> - 동아리 챗봇: 궁금한 내용을 빠르게 검색하고 답변받을 수 있는 스마트 도우미.
> - 직관적 UI/UX: 복잡함을 덜어내고, 누구나 쉽게 사용할 수 있는 깔끔한 인터페이스

### FE

> - camera 라이브러리를 이용한 QR 출석
> - 응답 성능 개선을 위한 컴포넌트 중첩 렌더링 최적화
> - 에러 타입 획일화를 통해 예외처리 구현
> - 중복 API 호출을 줄이기 위해 비동기 액션 구현

### BE

> - DDD 아키텍처 구조를 통해 도메인 로직, 상태 변이 로직 분리하여 작업
> - TDD 방식을 도입 주요 비즈니스 로직의 테스트
> - jwt 토큰을 통해 api 요청 단일화
> - WebSokcet의 SessionId를 이용하여 개별 사용자 채팅 유지
> - 처리율 제한 알고리즘을 도입하여 사용자별 요청 제한

### RAG

> - 앱 내 게시판 데이터를 기반으로 RAG 시스템을 구축해 FAQ 형태의 실시간 질의응답 챗봇을 개발 동아리원들이 자주 묻는 질문(예: "MT 언제야?", "회비 납부했나요?")에 빠르고 정확하게 응답
> - Redis를 활용한 Context 캐싱 시스템을 도입해 검색된 문맥 정보를 Key-Value 형태로 저장하여 중복 질의 시 캐시에서 데이터를 즉시 가져와 응답 속도를 약 80% 향상시켰으며, 시스템 효율성 상승
> - LoRA 기법을 활용해 QA 데이터에 대한 미세 조정을(polyglot-ko-1.3b) 수행하였고, 프롬프트 최적화를 통해 주어진 context 기반의 정답률과 응답 품질을 향상시켰습니다.

</br>

## 트러블 슈팅

- **[TypeError: Cannot read property 'getConstants' of null 해결 과정](https://www.notion.so/typeError-Cannot-read-property-getConstants-of-null-Component-Stack-1a2b7e7082ee80fabb29d3df90490a1d?pvs=4)**

- **[deprecation builder() in Bucket4j has been deprecatedreturn Bucket4j.builder().addLimit(limit).build();](https://www.notion.so/1cdb7e7082ee80eeb31ee8d1ed8d2e95)**

</br>

## 작업일지 25.02~25.04
- **[개발 작업 일지](https://fringe-girdle-ad7.notion.site/16fb7e7082ee8028a3b9eaf39852ed03)**


## 챗봇 과정

<div align="center">
    <img src="https://github.com/user-attachments/assets/9466fac8-7bc2-4b59-96ef-ec3959fed119" alt="동아리 챗봇" width="300" />
</div>

## 📱 프로젝트 화면 구성

### 🔐 회원 관련 화면

| 회원 가입                                                                                     | 메인 화면                                                                                         |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| <img src="https://github.com/user-attachments/assets/c2ac8598-e6ef-497a-9e17-9aac417c0008" width="300"/> | <img src="https://github.com/user-attachments/assets/d5bed1a7-8313-4a44-b40c-d6398c50314c" width="300"/> |

---

### 📋 출석 관련 화면

| 관리자 출석 명단                                                                              | 관리자 출석 변경                                                                              | 개인 출석 현황                                                                                     | 관리자 출석                                                                                           |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| <img src="https://github.com/user-attachments/assets/9af2f4fa-90a0-4b1d-afaa-7f880c9a3a42" width="300"/> | <img src="https://github.com/user-attachments/assets/e9ba9e2c-38fe-4b4a-b4fc-ee92da3be430" width="300"/> | <img src="https://github.com/user-attachments/assets/d3a9a473-84c5-4539-b699-53c2a609afc2" width="300"/> | <img src="https://github.com/user-attachments/assets/83f88a67-4e16-4d9d-9683-ab374225c6e7" width="300"/> |

---

### 🧑‍🤝‍🧑 멤버 및 신청 화면

| 신청 멤버                                                                                     | 멤버 명단                                                                                     |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| <img src="https://github.com/user-attachments/assets/448ee816-33ac-493f-899b-2e755a6a5811" width="300"/> | <img src="https://github.com/user-attachments/assets/9b2a1208-467f-4f91-9a6f-8d984686d74b" width="300"/> |

---

### 🗒️ 게시판 및 기타 화면

| 게시판 작성                                                                                | 챗봇                                                                                      | 메인페이지                                                                                    |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| <img src="https://github.com/user-attachments/assets/3fc73286-1a79-4e25-93cc-1913f0585f30" width="300"/> | <img src="https://github.com/user-attachments/assets/dc186583-7467-4201-ae66-e96be8d3fc20" width="300"/> | <img src="https://github.com/user-attachments/assets/4258adf9-09a4-4bdd-8a69-5fe9b38bbf20" width="300"/> |

## Architecture
![시스템 아키텍처](https://github.com/user-attachments/assets/e55acc97-615f-4dde-8fe9-763500653afb)


## 🛠️ 기술 스택

### ⚡️Language & Framework

![springboot](https://img.shields.io/badge/springboot-%236DB33F.svg?style=for-the-badge&logo=springboot&logoColor=white)  
![reactnative](https://img.shields.io/badge/reactnative-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

### Database

![postgresql](https://img.shields.io/badge/postgresql-4479A1.svg?style=for-the-badge&logo=postgresql&logoColor=white)

### AI

![ollama](https://img.shields.io/badge/ollama-0078D4?style=for-the-badge&logo=meta&logoColor=white)

![HuggingFace](https://img.shields.io/badge/HuggingFace-FFD21E?style=for-the-badge&logo=HuggingFace&logoColor=white)

### Tools

![github](https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white)
![Figma](https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)

---

</br>

<div align="center">

| 류명재 |
| :----: |
| [xaczxzz](https://github.com/xaczxzz) |
<img src="https://avatars.githubusercontent.com/u/101166893?v=4" width="300"/>

</div>
