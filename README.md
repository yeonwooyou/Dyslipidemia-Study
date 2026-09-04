# Rosuzet PM Learning Pack

작성일: 2026-08-31<br>
최근 사이트 업데이트: 2026-09-04

이 폴더는 로수젯 PM 관점에서 이상지질혈증, 로수젯, ATC 분류, 임상근거, 시장 구조를 빠르게 학습하기 위한 작업 문서다. 의학적 처방 지침이 아니라 제품/시장/근거 이해를 위한 내부 학습 구조다.

## 문서 구성

- [index.html](index.html): 로수젯/이상지질혈증 학습용 정적 웹사이트. `Home`, `Foundation`, `Strategy`, `Evidence`, `Execution`, `Library`, `Sources` 7개 페이지 탭으로 나눠 클릭한 영역만 보이도록 구성
- [metadata-data.js](metadata-data.js): 콘텐츠 검증일, archive 확인일, 가격 확인일, 사이트 버전, 페이지 수를 한 곳에서 관리
- [source-data.js](source-data.js): Source Hub의 found/follow-up 원문, 카테고리 필터, 로컬 아카이브 상태, 다음 추출 항목의 단일 데이터 소스
- [experience-data.js](experience-data.js): 전역 검색 인덱스, 환자군별 지침 diff, 경쟁 매트릭스, detail script, progress, glossary 데이터
- [experience-tools.js](experience-tools.js): 전역 검색, Source Hub, compact view, glossary drawer, 학습 진행판 렌더링
- [library-data.js](library-data.js): 지질 기초, 위험도, 지침 workflow, 치료 전략, 안전성, 특수 환자, 시장/분류, field execution, 논문 독해, 용어 사전까지 10개 카테고리와 53개 심화 학습 모듈
- [definition-data.js](definition-data.js): 이상지질혈증 정의, 지질 항목, 표현형, 원발성/이차성, 위험도 기반 치료 구조
- [mechanism-data.js](mechanism-data.js): statin HMG-CoA reductase 억제, LDL receptor upregulation, rule of six, ezetimibe 보완 기전
- [statin-profile-data.js](statin-profile-data.js): statin 개발 흐름, 성분별 특성, 오리지널 브랜드, 대표 급여가격 snapshot
- [fact-sheet-data.js](fact-sheet-data.js): KSoLA Dyslipidemia Fact Sheet in Korea 2024 핵심 수치와 PM 해석
- [landmark-trials-data.js](landmark-trials-data.js): RACING, PROVE-IT, IDEAL, CARE, LIPID, 4S, TNT, HPS, ASCOT, AFCAPS/TexCAPS, WOSCOPS, HOPE-3, EWTOPIA 75, IMPROVE-IT 전용 카테고리
- [page-router.js](page-router.js): hash 기반 페이지 전환, 반응형 상단 메뉴, 라이브러리 카테고리/검색 렌더링
- [pages.css](pages.css): 간결한 상단바, 모바일 메뉴, 페이지 표시/숨김, 라이브러리 카드 레이아웃
- [evidence_archive](evidence_archive): 현재 사이트에 쓰는 가이드라인/논문/가격 출처의 링크, 확인 상태, claim guardrail 아카이브
- [rosuzet_pm_learning_map.md](rosuzet_pm_learning_map.md): PM이 알아야 할 전체 학습 로드맵
- [atc_c10_reference.md](atc_c10_reference.md): WHO ATC와 EPHMRA/Intellus `C10C` 분류 차이
- [source_evidence_matrix.md](source_evidence_matrix.md): 출처별 핵심 사실, 신뢰도, PM 활용 포인트

## 먼저 잡아야 할 핵심

로수젯은 에제티미브 10 mg과 로수바스타틴 2.5/5/10/20 mg 조합의 fixed-dose combination이다. WHO ATC 기준으로는 `C10BA06`이고, PM/시장 데이터에서 자주 말하는 `C10C`는 WHO ATC가 아니라 EPHMRA/Intellus Anatomical Classification에서 "lipid regulators in combination with other lipid regulators"를 뜻한다.

따라서 학습 순서는 `이상지질혈증 정의/분류 -> statin 작용기전 -> statin 성분/오리지널/가격 -> KSoLA 2024 Fact Sheet -> 지침/치료목표 -> 제품/허가사항 -> ATC 분류 -> 임상근거 -> 경쟁/시장 -> PM 실행 질문 -> claim 검증 -> 월간 brief` 순서로 잡는다.

디자인은 외부 font 의존 없이 `theme-refresh.css`에서 local/system sans stack으로 바꿨다. 기존 serif-heavy headline 대신 `Avenir Next`, `Pretendard`, `Apple SD Gothic Neo`, `Noto Sans KR` 순서로 읽히게 했다.

가시성 개선은 `layout-refresh.css`, `pages.css`, `experience.css`에서 관리한다. 상단 navigation은 7개 페이지 탭으로 구성했고, 모바일에서는 메뉴 버튼으로 접힌다. 각 섹션은 `data-page`로 배정되어 선택한 페이지의 내용만 표시된다.

## 로그인 게이트

접속 시 [auth.js](auth.js)와 [auth.css](auth.css)가 `CVD1 / CVD1` 로그인 화면을 먼저 보여준다. 이 기능은 정적 프론트엔드에서 구현한 접근 화면이므로 실제 보안 인증이 아니다. 외부 공개를 엄격히 막아야 하면 Netlify password protection, Netlify Identity, 서버 인증 중 하나를 별도로 적용한다.

## 근거 아카이브

[evidence_archive](evidence_archive)는 PDF 원문을 복제하지 않고 공식/JLA/PubMed/PMC/HIRA 기반 링크와 확인 상태만 보관한다. 2026-09-04 기준 원문 확인 목록과 못 찾은 항목은 [source_inventory.md](evidence_archive/source_inventory.md)에 정리했다. 급여가격은 HIRA 최신 약제급여목록 및 급여상한금액표의 적용일이 바뀔 수 있으므로 외부 자료로 쓰기 전 최신 고시 원문 재확인이 필요하다.

논문 원문을 직접 찾을 때는 [paper_search_list.csv](evidence_archive/paper_search_list.csv)를 먼저 쓴다. 약어를 전체 논문 제목, PMID/DOI/NCT, 우선순위, 찾아야 할 원문 형태로 풀어둬서 Excel에서 바로 필터링할 수 있다.

## Source Intake

새 원문을 넣을 때는 [source-data.js](source-data.js)에 `archiveState`, `priority`, `localArchivePath`, `extractionFocus`를 먼저 추가한다. 그 다음 [evidence_archive/source_inventory.md](evidence_archive/source_inventory.md)에 원문 보유 여부와 다음 액션을 맞춰 적고, 실제 수치나 claim guardrail을 추출한 뒤 관련 데이터 파일에 반영한다.

## Netlify 배포

Netlify는 [netlify.toml](netlify.toml)의 설정을 사용한다.

- Build command: `npm test && npm run build`
- Publish directory: `dist`
- `dist`에는 사이트 실행에 필요한 HTML/CSS/JS/SVG만 복사한다.
- 보안 헤더는 `netlify.toml`의 `[[headers]]`에서 CSP, HSTS, `nosniff`, frame deny, referrer policy, permissions policy로 지정한다.
