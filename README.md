# Pet Nutrition Guide

Astro와 Headless WordPress REST API를 사용하는 반려동물 영양 정보 사이트입니다.

## 프로젝트 구조

```text
.
├── public/
│   ├── favicon.svg
│   └── pet-nutrition-hero.png
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── BlogCard.astro
│   │   └── Seo.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── BlogLayout.astro
│   ├── lib/
│   │   └── wordpress.js
│   ├── pages/
│   │   ├── index.astro
│   │   ├── dog-nutrition.astro
│   │   ├── cat-nutrition.astro
│   │   ├── food-label.astro
│   │   ├── calorie-calculator.astro
│   │   ├── about.astro
│   │   ├── privacy.astro
│   │   ├── contact.astro
│   │   ├── disclaimer.astro
│   │   ├── robots.txt.js
│   │   ├── rss.xml.js
│   │   └── blog/
│   │       ├── index.astro
│   │       └── [slug].astro
│   └── styles/
│       └── global.css
├── .env.example
├── astro.config.mjs
└── package.json
```

## 설치와 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:4321`을 열면 됩니다.

## 환경 변수

`.env.example`을 복사해 `.env`를 만들고 실제 주소로 바꾸세요.

```bash
WORDPRESS_API_URL=https://cms.petnutritionguide.com/wp-json/wp/v2
SITE_URL=https://mycompanionpet.com
```

## WordPress 글 반영 흐름

1. WordPress 관리자에서 글을 작성하고 공개합니다.
2. Astro가 `WORDPRESS_API_URL`의 REST API에서 글 목록과 상세 데이터를 가져옵니다.
3. `/blog`는 글 목록을 보여줍니다.
4. `/blog/[slug]`는 WordPress 글의 slug를 기준으로 정적 상세 페이지를 생성합니다.
5. 새 글을 배포 사이트에 반영하려면 다시 빌드합니다.

## 빌드

```bash
npm run build
npm run preview
```

## 블로그 글 자동 생성 워크플로우

아래 명령어로 제목 분석, Markdown 글 생성, 빌드 확인, Git commit/push 흐름을 실행할 수 있습니다.

```bash
npm run post "강아지 참외 먹어도 될까?"
```

기본값은 안전하게 글을 생성한 뒤 commit/push 진행 여부를 확인합니다. 확인 없이 빌드, 커밋, push까지 진행하려면 아래처럼 실행합니다.

```bash
$env:AUTO_PUBLISH="true"; npm run post "강아지 참외 먹어도 될까?"
```

글 생성만 하려면 아래 명령어를 사용합니다.

```bash
npm run new:post "강아지 참외 먹어도 될까?"
```

이미 생성된 글을 빌드 확인 후 GitHub로 반영하려면 아래 명령어를 사용합니다.

```bash
npm run publish:post "강아지 참외 먹어도 될까?"
```

생성된 Markdown 파일은 `src/content/blog/` 폴더에 저장됩니다. 제목을 기준으로 slug를 만들고, 한국어 제목을 영어 slug로 정확히 만들기 어려운 경우 날짜 기반 slug를 사용합니다. 같은 파일명이 이미 있으면 덮어쓰지 않고 숫자를 붙여 새 파일을 만듭니다.

`OPENAI_API_KEY` 환경변수가 있으면 OpenAI API로 본문을 생성합니다. 환경변수가 없으면 글 작성용 프롬프트가 포함된 초안 템플릿 파일을 생성합니다.

```bash
$env:OPENAI_API_KEY="sk-..."
npm run new:post "고양이 습식사료 매일 먹어도 될까?"
```

자동화 안전장치는 다음과 같습니다.

- 제목이 비어 있으면 실행하지 않습니다.
- 같은 slug 파일이 있으면 덮어쓰지 않습니다.
- 생성된 글 파일 경로를 콘솔에 출력합니다.
- `npm run build`가 실패하면 Git commit과 push를 중단합니다.
- Git remote가 없으면 push를 건너뛰고 안내 메시지를 출력합니다.
- 기본 `npm run post`는 자동 push 전에 확인을 받습니다.

## Cloudflare Pages 자동 배포 조건

- GitHub 저장소와 Cloudflare Pages가 연결되어 있어야 합니다.
- Build command는 `npm run build`로 설정합니다.
- Build output directory는 `dist`로 설정합니다.
- 로컬에서 `git push`가 성공하면 Cloudflare Pages가 자동 배포합니다.

## 배포 메모

- Cloudflare Pages 또는 Vercel에서 빌드 명령은 `npm run build`로 설정합니다.
- 출력 폴더는 Astro 기본값인 `dist`입니다.
- Google Search Console에는 `https://mycompanionpet.com/sitemap-index.xml`을 제출하면 됩니다.
- RSS 주소는 `/rss.xml`입니다.

## 보안 메모

WordPress HTML 본문은 `src/lib/wordpress.js`의 `sanitizeHtml()`을 거쳐 렌더링합니다. 기본적으로 `script`, `iframe`, 이벤트 핸들러, `javascript:` 링크를 제거하지만, 운영 환경에서는 신뢰할 수 있는 관리자만 글을 작성하도록 권한을 제한하는 것이 중요합니다.
