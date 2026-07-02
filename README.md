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
SITE_URL=https://petnutritionguide.com
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

## 배포 메모

- Cloudflare Pages 또는 Vercel에서 빌드 명령은 `npm run build`로 설정합니다.
- 출력 폴더는 Astro 기본값인 `dist`입니다.
- Google Search Console에는 `https://petnutritionguide.com/sitemap-index.xml`을 제출하면 됩니다.
- RSS 주소는 `/rss.xml`입니다.

## 보안 메모

WordPress HTML 본문은 `src/lib/wordpress.js`의 `sanitizeHtml()`을 거쳐 렌더링합니다. 기본적으로 `script`, `iframe`, 이벤트 핸들러, `javascript:` 링크를 제거하지만, 운영 환경에서는 신뢰할 수 있는 관리자만 글을 작성하도록 권한을 제한하는 것이 중요합니다.
