# Rosuzet PM Learning Pack

작성일: 2026-08-31

이 폴더는 로수젯 PM 관점에서 이상지질혈증, 로수젯, ATC 분류, 임상근거, 시장 구조를 빠르게 학습하기 위한 작업 문서다. 의학적 처방 지침이 아니라 제품/시장/근거 이해를 위한 내부 학습 구조다.

## 문서 구성

- [index.html](index.html): 로수젯/이상지질혈증 학습용 정적 웹사이트. `Home`, `Foundation`, `Strategy`, `Evidence`, `Execution`, `Library` 페이지 탭으로 나눠 클릭한 영역만 보이도록 구성
- [library-data.js](library-data.js): 지질 기초, 위험도, 지침 workflow, 치료 전략, 안전성, 특수 환자, 시장/분류, field execution, 논문 독해, 용어 사전까지 10개 카테고리와 53개 심화 학습 모듈
- [page-router.js](page-router.js): hash 기반 페이지 전환, 반응형 상단 메뉴, 라이브러리 카테고리/검색 렌더링
- [pages.css](pages.css): 간결한 상단바, 모바일 메뉴, 페이지 표시/숨김, 라이브러리 카드 레이아웃
- [rosuzet_pm_learning_map.md](rosuzet_pm_learning_map.md): PM이 알아야 할 전체 학습 로드맵
- [atc_c10_reference.md](atc_c10_reference.md): WHO ATC와 EPHMRA/Intellus `C10C` 분류 차이
- [source_evidence_matrix.md](source_evidence_matrix.md): 출처별 핵심 사실, 신뢰도, PM 활용 포인트

## 먼저 잡아야 할 핵심

로수젯은 에제티미브 10 mg과 로수바스타틴 2.5/5/10/20 mg 조합의 fixed-dose combination이다. WHO ATC 기준으로는 `C10BA06`이고, PM/시장 데이터에서 자주 말하는 `C10C`는 WHO ATC가 아니라 EPHMRA/Intellus Anatomical Classification에서 "lipid regulators in combination with other lipid regulators"를 뜻한다.

따라서 학습 순서는 `질환/치료목표 -> 제품/허가사항 -> ATC 분류 -> 임상근거 -> 경쟁/시장 -> PM 실행 질문 -> claim 검증 -> 월간 brief` 순서로 잡는다.

디자인은 외부 font 의존 없이 `theme-refresh.css`에서 local/system sans stack으로 바꿨다. 기존 serif-heavy headline 대신 `Avenir Next`, `Pretendard`, `Apple SD Gothic Neo`, `Noto Sans KR` 순서로 읽히게 했다.

가시성 개선은 `layout-refresh.css`와 `pages.css`에서 관리한다. 상단 navigation은 6개 페이지 탭으로 줄였고, 모바일에서는 메뉴 버튼으로 접힌다. 각 섹션은 `data-page`로 배정되어 선택한 페이지의 내용만 표시된다.

## 로그인 게이트

접속 시 [auth.js](auth.js)와 [auth.css](auth.css)가 `CVD1 / CVD1` 로그인 화면을 먼저 보여준다. 이 기능은 정적 프론트엔드에서 구현한 접근 화면이므로 실제 보안 인증이 아니다. 외부 공개를 엄격히 막아야 하면 Netlify password protection, Netlify Identity, 서버 인증 중 하나를 별도로 적용한다.

## Netlify 배포

Netlify는 [netlify.toml](netlify.toml)의 설정을 사용한다.

- Build command: `npm test && npm run build`
- Publish directory: `dist`
- `dist`에는 사이트 실행에 필요한 HTML/CSS/JS/SVG만 복사한다.
- 보안 헤더는 `netlify.toml`의 `[[headers]]`에서 CSP, HSTS, `nosniff`, frame deny, referrer policy, permissions policy로 지정한다.
