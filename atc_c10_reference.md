# ATC C10 Reference for Rosuzet

작성일: 2026-08-31

## 결론

로수젯을 분류할 때 반드시 두 체계를 분리한다.

| 구분 | 로수젯 위치 | 의미 | PM 활용 |
|---|---:|---|---|
| WHO ATC/DDD | `C10BA06` | rosuvastatin and ezetimibe | 국제 약물분류, 연구/사용량/약물역학 기준 |
| EPHMRA/Intellus | `C10C` | lipid regulators in combination with other lipid regulators | 제약시장/처방시장 basket, 경쟁품 묶음 |

`C10C`는 WHO ATC에는 없다. WHO의 `C10` 하위는 `C10A`와 `C10B`이고, 로수젯은 `C10B -> C10BA -> C10BA06`에 위치한다.

## WHO ATC/DDD C10 구조

출처: WHO Collaborating Centre for Drug Statistics Methodology, ATC/DDD Index. 최종 업데이트 표기는 2026-01-20.

### Level 2-4

| Code | Name | 로수젯과의 관계 |
|---|---|---|
| `C10` | Lipid modifying agents | 이상지질혈증 치료제 전체 |
| `C10A` | Lipid modifying agents, plain | 단일 또는 plain lipid-lowering products |
| `C10AA` | HMG CoA reductase inhibitors | 로수바스타틴 단일제는 여기 |
| `C10AB` | Fibrates | TG 중심, fenofibrate 등 |
| `C10AC` | Bile acid sequestrants | colestyramine 등 |
| `C10AD` | Nicotinic acid and derivatives | niacin 계열 |
| `C10AX` | Other lipid modifying agents | 에제티미브, PCSK9, bempedoic acid 등 |
| `C10B` | Lipid modifying agents, combinations | 복합제 |
| `C10BA` | Combinations of various lipid modifying agents | statin+ezetimibe, statin+fibrate 등 |
| `C10BX` | Lipid modifying agents in combination with other drugs | statin+antihypertensive, statin+ASA 등 |

### WHO C10AA: Statins

| Code | Ingredient |
|---|---|
| `C10AA01` | simvastatin |
| `C10AA02` | lovastatin |
| `C10AA03` | pravastatin |
| `C10AA04` | fluvastatin |
| `C10AA05` | atorvastatin |
| `C10AA06` | cerivastatin |
| `C10AA07` | rosuvastatin |
| `C10AA08` | pitavastatin |

### WHO C10AX: Other Lipid Modifying Agents

| Code | Ingredient |
|---|---|
| `C10AX01` | dextrothyroxine |
| `C10AX02` | probucol |
| `C10AX03` | tiadenol |
| `C10AX05` | meglutol |
| `C10AX06` | omega-3-triglycerides incl. other esters and acids |
| `C10AX07` | magnesium pyridoxal 5-phosphate glutamate |
| `C10AX08` | policosanol |
| `C10AX09` | ezetimibe |
| `C10AX10` | alipogene tiparvovec |
| `C10AX11` | mipomersen |
| `C10AX12` | lomitapide |
| `C10AX13` | evolocumab |
| `C10AX14` | alirocumab |
| `C10AX15` | bempedoic acid |
| `C10AX16` | inclisiran |
| `C10AX17` | evinacumab |
| `C10AX18` | volanesorsen |
| `C10AX19` | lerodalcibep |

### WHO C10BA: Combinations of Various Lipid Modifying Agents

| Code | Combination |
|---|---|
| `C10BA01` | lovastatin and nicotinic acid |
| `C10BA02` | simvastatin and ezetimibe |
| `C10BA03` | pravastatin and fenofibrate |
| `C10BA04` | simvastatin and fenofibrate |
| `C10BA05` | atorvastatin and ezetimibe |
| `C10BA06` | rosuvastatin and ezetimibe |
| `C10BA07` | rosuvastatin and omega-3 fatty acids |
| `C10BA08` | atorvastatin and omega-3 fatty acids |
| `C10BA09` | rosuvastatin and fenofibrate |
| `C10BA10` | bempedoic acid and ezetimibe |
| `C10BA11` | pravastatin and ezetimibe |
| `C10BA12` | pravastatin, ezetimibe and fenofibrate |
| `C10BA13` | pitavastatin and ezetimibe |
| `C10BA14` | pitavastatin and fenofibrate |
| `C10BA15` | rosuvastatin, ezetimibe and fenofibrate |
| `C10BA16` | atorvastatin and fenofibrate |

### WHO C10BX: Lipid Modifying Agents with Other Drugs

| Code | Combination |
|---|---|
| `C10BX01` | simvastatin and acetylsalicylic acid |
| `C10BX02` | pravastatin and acetylsalicylic acid |
| `C10BX03` | atorvastatin and amlodipine |
| `C10BX04` | simvastatin, acetylsalicylic acid and ramipril |
| `C10BX05` | rosuvastatin and acetylsalicylic acid |
| `C10BX06` | atorvastatin, acetylsalicylic acid and ramipril |
| `C10BX07` | rosuvastatin, amlodipine and lisinopril |
| `C10BX08` | atorvastatin and acetylsalicylic acid |
| `C10BX09` | rosuvastatin and amlodipine |
| `C10BX10` | rosuvastatin and valsartan |
| `C10BX11` | atorvastatin, amlodipine and perindopril |
| `C10BX12` | atorvastatin, acetylsalicylic acid and perindopril |
| `C10BX13` | rosuvastatin, perindopril and indapamide |
| `C10BX14` | rosuvastatin, amlodipine and perindopril |
| `C10BX15` | atorvastatin and perindopril |
| `C10BX16` | rosuvastatin and fimasartan |
| `C10BX17` | rosuvastatin and ramipril |
| `C10BX18` | atorvastatin, amlodipine and ramipril |
| `C10BX19` | atorvastatin, amlodipine and candesartan |
| `C10BX20` | rosuvastatin and telmisartan |
| `C10BX21` | rosuvastatin and perindopril |
| `C10BX22` | rosuvastatin and nebivolol |
| `C10BX23` | rosuvastatin, amlodipine and ramipril |
| `C10BX24` | rosuvastatin, amlodipine and telmisartan |

## EPHMRA/Intellus C10 구조

EPHMRA/Intellus는 시장분석용 분류다. WHO와 비슷한 이름을 쓰지만 하위 구조가 다르다.

| Code | Name | PM 해석 |
|---|---|---|
| `C10` | Lipid-regulating/anti-atheroma products | 이상지질혈증/동맥경화 관련 시장 전체 |
| `C10A` | Lipid-regulating products | cholesterol/TG 조절제 |
| `C10A1` | Statins | atorvastatin, rosuvastatin 등 |
| `C10A2` | Fibrates | fenofibrate 등 |
| `C10A3` | Ion-exchange resins | bile acid sequestrants |
| `C10A4` | PCSK9 inhibitors | evolocumab, alirocumab 등 |
| `C10A9` | Lipid-regulating products, other | ezetimibe, bempedoic acid, evinacumab 등 |
| `C10B` | Anti-atheroma preparations of natural origin | omega-3, garlic, lecithin 등 natural origin |
| `C10C` | Lipid regulators in combination with other lipid regulators | 로수젯이 속하는 시장 basket |
| `C11A` | Lipid-regulating cardiovascular multitherapy combination products | 이상지질혈증+고혈압 등 CV multitherapy |

### EPHMRA `C10C` 판정 규칙

`C10C`에 들어가는 제품:

- 서로 다른 lipid regulator 조합: statin+ezetimibe, statin+nicotinic acid, ezetimibe+bempedoic acid 등
- `C10A` lipid regulator와 `C10B` natural-origin anti-atheroma 조합
- 로수젯 같은 `rosuvastatin + ezetimibe` fixed-dose combination

`C10C`가 아닌 제품:

- statin+statin: `C10A1`
- fibrate+fibrate: `C10A2`
- natural-origin lipid regulator끼리의 조합: `C10B`
- 당뇨약+심혈관계 약물 조합: 목적에 따라 `A10X1`
- 이상지질혈증+고혈압 등 복합 치료 목적의 CV multitherapy: `C11A`

## PM 실무에서의 사용법

1. 논문/약물역학/국제 사용량을 볼 때는 WHO `C10BA06`을 쓴다.
2. 처방시장, competitor basket, UBIST/시장조사 자료를 볼 때 `C10C`가 보이면 EPHMRA 기준인지 확인한다.
3. 로수젯의 직접 경쟁군은 좁게는 `rosuvastatin+ezetimibe`, 넓게는 `statin+ezetimibe`, 더 넓게는 LDL-C goal attainment를 해결하는 `C10A9/C10BA/C10AX` 옵션까지 확장한다.

## 주요 출처

- WHO ATC/DDD Index: https://atcddd.fhi.no/atc_ddd_index/?code=C10&showdescription=no
- WHO `C10BA06`: https://atcddd.fhi.no/atc_ddd_index/?code=C10BA06&showdescription=no
- EPHMRA Anatomical Classification: https://www.ephmra.org/anatomical-classification
- EPHMRA 2026 ATC Guidelines PDF: https://www.ephmra.org/sites/default/files/2026-01/2026%20ATC%20Guidlines%20Final.pdf
