# 3번 닭뼈 글 제작 기록

- 작성일: 2026-09-30 (Asia/Seoul)
- 게시 파일: src/content/blog/dog-ate-chicken-bone-what-to-do.md
- 상태: 게시용 작성. 실제 배포 여부는 추천 큐와 원격에서 별도 확인.
- pubDate는 작성일에 고정하고 updatedDate는 실제 배포일에 다시 확인.

## 내부 검수 결과

- 강아지 전용 본문 8,466자, 메타 설명 101자, FAQ 5개, 실제 상황 5개.
- 4개 WebP(1200×675)와 내부 링크 경로 존재 확인. 최종 이미지 시각 확인 완료.
- FDA, VCA, Merck, AVMA, Pet Poison Helpline 원문 확인 후 의료 표현 검수.
- 즉시 진료가 필요한 호흡·반복 구토·출혈 등 신호와 무증상 시 병원 연락 기준 분리.
- 2026-09-30 Astro 빌드 126페이지 성공; 생성 HTML의 메타 제목·설명·JSON-LD 날짜 확인.
- 기존 UI·라우팅 변경은 이 글 커밋에서 제외.
- 기존 1·2번과 동일하게 실제 원격 push 및 운영 배포는 별도 확인 필요.

## 기존 콘텐츠와 차별점 5개

1. 닭가슴살 급여법의 단순 뼈 제거 경고와 달리 실제 섭취 후 행동을 독립적으로 다룸.
2. 독성 음식 글의 성분·독성량 틀 대신 기도·식도·위장관 물리적 위험을 구분.
3. 익힌 뼈와 생뼈의 서로 다른 위험을 설명하면서 어느 쪽도 안전하다고 단정하지 않음.
4. 빵·밥·기름으로 밀어 넣거나 집에서 토하게 하는 오해를 위험과 대안으로 묶음.
5. 양념, 호일, 비닐, 꼬치 등 동반 섭취와 남은 뼈 사진을 병원 정보에 포함.

## 이미지 프롬프트

### 이미지 1

- 삽입 위치: 도입부 다음
- 이미지 용도: 대표 썸네일
- 이미지 설명: 펫 게이트로 분리된 강아지, 닫힌 뼈 접시, 시각 메모
- alt 텍스트: 강아지를 닭뼈에서 분리하고 섭취 시각을 적으며 병원 연락을 준비하는 보호자
- 파일명: dog-ate-chicken-bone-what-to-do-thumbnail.webp
- 생성 프롬프트: Use case: photorealistic-natural. Asset type: 16:9 editorial thumbnail for a Korean dog safety article. Scene: calm home dining area with a small adult dog safely behind a closed pet gate in the background, owner at the table in the foreground setting a covered plate containing leftover cooked chicken bones well out of reach while noting the time on a blank paper notepad beside a phone. The dog is not eating or touching bones. Realistic natural daylight, documentary photography, anatomically correct dog and hands. No readable text, no logos, no watermark, no distress, no dangerous ingestion.

### 이미지 2

- 삽입 위치: 뼈 형태 비교 전
- 이미지 용도: 익힌 뼈와 생뼈 형태 구분
- 이미지 설명: 서로 다른 덮개 접시에 분리한 닭뼈
- alt 텍스트: 익힌 닭뼈와 생닭뼈를 각각 분리해 놓고 형태를 확인하는 식탁
- 파일명: chicken-bone-types.webp
- 생성 프롬프트: Use case: photorealistic-natural. Asset type: 16:9 editorial article photo about identifying what a dog may have swallowed. Scene: top-down view of a kitchen table with two separate small covered dishes, one containing a leftover cooked chicken bone and another a raw chicken wing bone, physically separated from pets, alongside a blank notepad and pen. Clean hygienic realistic photo, neutral natural light. No animals in frame, no exposed food offered to a pet, no readable text, no logos, no watermark.

### 이미지 3

- 삽입 위치: 위험 신호 다음
- 이미지 용도: 병원 상담 정보 준비
- 이미지 설명: 메모와 휴대전화, 강아지와 닫힌 음식 용기 분리
- alt 텍스트: 섭취 정보를 메모하며 동물병원에 전화하는 보호자와 안전하게 분리된 강아지
- 파일명: chicken-bone-vet-call.webp
- 생성 프롬프트: Use case: photorealistic-natural. Asset type: 16:9 editorial article photo for dog owner emergency preparation. Scene: owner sitting in a quiet living room with a mobile phone to their ear, writing notes about an incident in an empty notebook; closed food container and chicken packaging on a high counter out of the dog's reach, pet gate separates a calm small dog. No visible suffering or treatment. Realistic natural light, candid documentary style, anatomically correct dog and hands. No legible words, logos or watermark.

### 이미지 4

- 삽입 위치: 예방 설명 다음
- 이미지 용도: 재발 방지
- 이미지 설명: 뚜껑 있는 쓰레기통과 강아지 접근 차단
- alt 텍스트: 뚜껑 있는 쓰레기통에 치킨 뼈를 치우고 강아지 접근을 막는 주방
- 파일명: chicken-bone-prevention.webp
- 생성 프롬프트: Use case: photorealistic-natural. Asset type: 16:9 editorial article photo for preventing dog access to chicken bones. Scene: clean kitchen after a meal, an adult owner's hands closing a lidded trash bin containing sealed food waste while a calm medium dog remains behind a pet gate; counter clear and safe. Natural afternoon light, realistic home textures, quiet informative mood. No dangerous ingestion, no readable text, no logos, no watermark.

## 작성자용 후속 후보

다음 순번은 4번 ‘고양이 생선회 먹어도 될까?’입니다. 게시 본문에는 후속 글 추천을 넣지 않았습니다.
