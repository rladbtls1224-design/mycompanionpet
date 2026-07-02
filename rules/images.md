# 이미지 규칙

## 기본 원칙

각 글에는 3~4개의 이미지를 사용한다. 단순 장식보다 정보 전달에 도움이 되는 이미지를 우선한다.

## 기본 이미지 구성

1. 대표 이미지
2. 영양/급여 가능 여부 설명 이미지
3. 주의사항 인포그래픽 이미지
4. 체크리스트 또는 상황별 예시 이미지

## 파일명 규칙

경로 예시:

`public/images/blog/{slug}/{image-file}.webp`

파일명 예시:

- dog-korean-melon-thumbnail.webp
- dog-korean-melon-serving.webp
- dog-korean-melon-warning.webp
- dog-korean-melon-checklist.webp

고양이 예시:

- cat-peach-thumbnail.webp
- cat-peach-safe-parts.webp
- cat-peach-pit-warning.webp
- cat-peach-checklist.webp

## 본문 삽입 형식

```md
![씨와 껍질을 제거한 참외 과육을 강아지에게 소량 급여하는 모습](/images/blog/can-dogs-eat-korean-melon/dog-korean-melon-serving.webp)
```

프로젝트의 이미지 경로 규칙이 다르면 기존 규칙을 따른다.

## alt 텍스트 규칙

나쁜 예:

- 강아지 참외
- 고양이 복숭아

좋은 예:

- 씨와 껍질을 제거한 참외 과육을 보호자가 강아지에게 소량 급여하는 모습
- 복숭아 씨를 피해야 한다는 점을 보여주는 고양이 급여 주의사항 이미지

## 이미지 생성 프롬프트 조건

이미지 생성 프롬프트는 영어로 작성한다.

공통 조건:

- 16:9 aspect ratio
- realistic photography
- natural light
- clean background
- no text in image
- safe pet feeding situation
- no dangerous ingestion scene
- no exaggerated cartoon style
- web editorial style
- high detail

## 배경 중복 방지

매 글마다 이미지 배경을 다르게 한다.

가능한 배경:

- clean kitchen counter
- bright dining table
- veterinary clinic consultation room
- outdoor picnic mat
- summer home setting
- calm living room
- pet feeding station
- wooden table with prepared ingredients

## 이미지 프롬프트 출력 형식

각 이미지마다 아래를 작성한다.

```md
### 이미지 1

- 삽입 위치:
- 이미지 용도:
- 이미지 설명:
- alt 텍스트:
- 파일명:
- 생성 프롬프트:
```

## 위험 장면 금지

반려동물이 씨, 껍질, 초콜릿, 포도, 양파 등 위험 음식을 직접 먹는 장면은 생성하지 않는다. 위험 식품은 분리된 접시, 금지 표시 느낌의 구성, 보호자가 치우는 장면 등 안전한 방식으로 표현한다.
