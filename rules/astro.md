# Astro Markdown 규칙

## 기본 콘텐츠 파일 위치

프로젝트 구조를 확인한 뒤 기존 구조를 따른다.
일반적으로 다음 위치를 사용한다.

- `src/content/blog/{slug}.md`
- 또는 `src/pages/blog/{slug}.md`
- 또는 `content/blog/{slug}.md`

기존 프로젝트가 Content Collections를 사용하면 `src/content/blog`를 우선한다.

## Frontmatter 기본 형식

```yaml
---
title: ""
description: ""
pubDate: "YYYY-MM-DD"
category: ""
tags: []
thumbnail: ""
slug: ""
draft: false
---
```

프로젝트 스키마가 다른 경우 기존 스키마를 우선한다.

## Category 값

- 강아지 글: `강아지 영양`
- 고양이 글: `고양이 영양`

## Tags 규칙

태그는 6~8개 사용한다.

강아지 예시:

```yaml
tags: ["강아지", "강아지 영양", "강아지 과일", "참외", "강아지 간식", "급여 주의사항"]
```

고양이 예시:

```yaml
tags: ["고양이", "고양이 영양", "고양이 과일", "복숭아", "고양이 간식", "급여 주의사항"]
```

## Markdown 구조

```md
# 제목

## 한눈에 보기

## 도입부

## 핵심 개념 설명

## 영양 성분 한눈에 보기

## 급여해도 될까?

## 급여량 예시

## 급여 시 주의할 점

## 보호자가 자주 하는 오해

## 실제 상황별 예시

## 보호자 체크리스트

## 수의사 상담이 필요한 경우

## 결론

## 참고 자료

## FAQ

## 함께 읽으면 좋은 글

## 다음에 쓰면 좋은 글

```

## 빌드 확인

글 파일 작성 후 가능하면 아래 명령을 실행한다.

```bash
npm run build
```

오류가 있으면 파일 경로, frontmatter, 이미지 경로, markdown 문법을 점검한다.

## GitHub/Cloudflare Pages 배포

배포는 GitHub push 후 Cloudflare Pages가 자동으로 진행한다.
Codex는 사용자가 명시적으로 요청하지 않는 한 push를 실행하지 않는다.

권장 수동 명령:

```bash
git status
git add .
git commit -m "Add pet nutrition article"
git push origin main
```
