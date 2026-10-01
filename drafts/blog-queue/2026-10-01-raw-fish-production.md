# 4번 고양이 생선회 글 제작 기록

- 작성일: 2026-10-01 (Asia/Seoul)
- 게시 파일: src/content/blog/can-cats-eat-raw-fish.md
- 상태: 배포용 글 준비. 실제 원격 배포는 별도 확인.
- pubDate는 작성일에 고정하고 updatedDate는 실제 배포일에 다시 확인.

## 내부 검수 결과

- 고양이 전용 본문 8,112자, 메타 설명 105자, FAQ 5개, 실제 상황 5개.
- 4개 WebP(1200×675)와 내부 링크 경로 존재 확인. 최종 이미지 시각 확인 완료.
- CDC, FDA, Merck, Cornell, WSAVA의 공개 원문 확인 후 위생·의료 표현 검수.
- 2026-10-01 Astro 빌드 127페이지 성공; 생성 HTML의 메타 제목·설명·canonical·JSON-LD 날짜 확인.
- 기존 UI·라우팅 변경은 이 글 커밋에서 제외.
- 원격 main의 최신 커밋은 554bf16으로 1~3번이 아직 게시되지 않았음. 4번 역시 실제 원격 push 및 운영 배포는 별도 확인 필요.

## 기존 콘텐츠와 차별점 5개

1. 연어 단일 식품 글과 달리 식탁의 연어회·참치회·광어회에 공통으로 적용되는 네 가지 판단 조건 제시.
2. 사람용 횟감과 고양이용 안전 식품이 같지 않음을 설명.
3. 가시와 간장·와사비·초밥의 동반 재료를 날것 위험과 별도로 구분.
4. 티아미나아제는 날생선의 장기·반복 급여 문제로 한정하고 한 점 노출의 즉각 결핍으로 과장하지 않음.
5. 이미 핥은 경우의 증상 관찰과 정기적으로 토핑한 경우의 식단 점검을 분리.

## 이미지 프롬프트

### 이미지 1

- 삽입 위치: 도입부 다음
- 이미지 용도: 대표 썸네일
- 이미지 설명: 창가의 고양이와 떨어진 식탁 위 생선회 접시를 덮는 보호자
- alt 텍스트: 고양이에게 닿지 않게 생선회 접시를 덮는 보호자
- 파일명: can-cats-eat-raw-fish-thumbnail.webp
- 생성 프롬프트: Use case: photorealistic-natural. Asset type: 16:9 editorial thumbnail for a Korean cat nutrition article about raw fish. In a calm contemporary home dining room, an adult cat sits safely on a distant window perch, while an owner closes a transparent food cover over a small sashimi plate on a table well out of reach. A separate closed container of complete cat food is visible nearby. Natural late afternoon light, realistic textures, candid editorial photograph. Cat must not eat or touch raw fish. No logos, no readable text, no watermark.

### 이미지 2

- 삽입 위치: 회 식품 형태 비교 앞
- 이미지 용도: 생식과 익힘 구분
- 이미지 설명: 덮은 생선회와 익힌 무양념 살코기의 별도 접시
- alt 텍스트: 덮어 둔 연어·참치회와 완전히 익힌 무양념 생선을 다른 접시에 분리한 모습
- 파일명: raw-fish-cooked-comparison.webp
- 생성 프롬프트: Use case: photorealistic-natural. Asset type: 16:9 editorial article photograph comparing fish preparation. Top-down on a clean cool-toned kitchen worktop: a covered plate of raw salmon and tuna sashimi kept separate from a small dish of fully cooked plain flaky fish, with a clean dedicated utensil beside each. No animal in frame. Clear physical separation, natural daylight, realistic food textures. No labels, logos, typography or watermark.

### 이미지 3

- 삽입 위치: 익힌 생선 대안 다음
- 이미지 용도: 잔가시 확인
- 이미지 설명: 익힌 생선 살을 결대로 나누고 핀셋으로 잔가시를 제거
- alt 텍스트: 완전히 익힌 생선 살을 결대로 나누며 잔가시를 핀셋으로 확인하는 손
- 파일명: cooked-fish-bone-check.webp
- 생성 프롬프트: Use case: photorealistic-natural. Asset type: 16:9 editorial article photo about checking fish bones before feeding a cat. Close-up of an owner's hands using clean tweezers to remove tiny pin bones from a fully cooked plain fish fillet on a white plate, with a small ceramic bowl holding discarded pin bones far aside. No cat and no raw fish in this frame. Natural daylight, detailed realistic texture, safe food preparation. No text, logos, watermark.

### 이미지 4

- 삽입 위치: 체크리스트 다음
- 이미지 용도: 사람용 회 식탁 정리
- 이미지 설명: 분리한 도구와 닫히는 음식물 쓰레기통, 고양이 접근 차단
- alt 텍스트: 회가 담겼던 도구를 분리해 치우고 고양이가 음식물 쓰레기에 닿지 못하게 관리하는 주방
- 파일명: raw-fish-kitchen-cleanup.webp
- 생성 프롬프트: Use case: photorealistic-natural. Asset type: 16:9 editorial article photo about safe cleanup after a family sashimi meal. A kitchen counter with a lidded food-waste bin being closed by an owner's hands, separate used cutting board and utensils by the sink ready for washing, and a calm adult cat behind a closed pet gate in the distant background. No fish accessible to the cat. Soft morning light, realistic tidy home, no logos, no text, no watermark.

## 작성자용 후속 후보

다음 순번은 5번 ‘강아지 덴탈껌 하루 몇 개가 적당할까?’입니다. 게시 본문에는 후속 글 추천을 넣지 않았습니다.
