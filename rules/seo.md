# SEO 규칙

## 기본 원칙

이 사이트의 SEO 목표는 단기 클릭보다 장기적인 신뢰도와 검색 노출이다.

## 제목 규칙

사용자는 주제만 입력한다. Codex는 최종 SEO 제목 1개만 생성한다.

좋은 제목 패턴:

- 강아지 참외 먹어도 될까? 급여 방법과 주의사항 총정리
- 고양이 복숭아 먹어도 될까? 씨와 껍질 주의사항
- 강아지 수박 먹어도 될까? 여름철 급여량과 주의점

나쁜 제목:

- 강아지 참외 완벽정복
- 꼭 먹여야 하는 강아지 참외
- 강아지 참외 효능 100가지

## 메타 설명 규칙

- 80~150자 정도로 작성한다.
- 검색자의 질문에 답한다.
- 과장하지 않는다.
- 대상 동물을 명확히 포함한다.

## Slug 규칙

영문 소문자와 하이픈을 사용한다.

패턴:

- can-dogs-eat-{food}
- can-cats-eat-{food}
- is-{food}-safe-for-dogs
- is-{food}-safe-for-cats

한국 음식명은 자연스러운 영어로 번역한다.

예:

- 참외: korean-melon
- 단호박: sweet-pumpkin 또는 kabocha-squash
- 고구마: sweet-potato

## Heading 규칙

- H1은 문서 제목 1개만 사용한다.
- H2는 검색 의도에 맞게 구성한다.
- H3는 세부 설명에 사용한다.
- 제목에 키워드를 억지로 반복하지 않는다.

## Featured Snippet 대응

본문 초반에 직접 답변을 제공한다.

예:

건강한 성견이라면 씨와 껍질을 제거한 참외 과육을 아주 소량 먹을 수 있습니다. 다만 당분과 식이섬유가 있어 많이 먹이면 설사나 복부 불편을 일으킬 수 있습니다.

## 내부 링크 SEO

- 같은 동물 글끼리 연결한다.
- 같은 음식군 글을 우선 연결한다.
- 허브 페이지를 함께 연결한다.
- 앵커 텍스트는 자연스럽게 쓴다.

좋은 앵커:

- 강아지 수박 급여법
- 고양이 복숭아 주의사항

나쁜 앵커:

- 여기를 클릭
- 관련 글 보기

## FAQ 규칙

FAQ는 5개 작성한다.
실제 보호자가 검색할 질문처럼 작성한다.

## 구조화 데이터

프로젝트가 JSON-LD 컴포넌트를 사용한다면 Article, FAQPage, BreadcrumbList를 고려한다.
글 본문에는 FAQ 내용을 명확히 작성하고, 필요하면 별도 schema 데이터를 생성할 수 있게 질문/답변을 분리한다.

## 이미지 SEO

- 파일명은 영문 소문자와 하이픈
- alt는 구체적으로 작성
- 장식 이미지보다 정보 전달 이미지 우선
- `.webp` 권장

## SEO 자가점검 출력

글 마지막에 다음을 출력한다.

- SEO Score: /100
- Helpful Content: /100
- E-E-A-T: /100
- Readability: /100
- Internal Link: PASS/NEEDS WORK
- Image ALT: PASS/NEEDS WORK
- Duplicate Risk: LOW/MEDIUM/HIGH
- AdSense Readiness: PASS/NEEDS WORK
