# Cloudflare Pages 배포 방법

이 프로젝트는 Astro 정적 사이트입니다. Cloudflare에서는 **Workers 업로드**가 아니라 **Pages + GitHub 연결**로 배포하는 것이 맞습니다.

## Cloudflare Pages 설정값

Cloudflare Pages에서 GitHub 저장소를 연결할 때 아래 값으로 설정하세요.

```text
Repository: rladbtls1224-design/mycompanionpet
Production branch: main
Framework preset: Astro
Build command: npm run build
Build output directory: dist
Root directory: /
Node.js version: 20
```

## 환경 변수

Cloudflare Pages의 `Settings > Environment variables`에서 필요하면 아래 값을 추가하세요.

```text
WORDPRESS_API_URL=https://cms.petnutritionguide.com/wp-json/wp/v2
SITE_URL=https://mycompanionpet.com
NODE_VERSION=20
```

아직 실제 WordPress CMS가 없다면 `WORDPRESS_API_URL`은 예시 주소 그대로 두거나 나중에 바꿔도 됩니다. API 연결이 실패해도 블로그 목록은 빈 상태 안내 문구를 보여주고, 정적 페이지는 정상 배포됩니다.

## Cloudflare 화면에서 누르는 순서

1. Cloudflare Dashboard에 로그인합니다.
2. 왼쪽 메뉴에서 `Workers & Pages`로 이동합니다.
3. `Create application` 또는 `Create`를 누릅니다.
4. `Pages` 탭을 선택합니다.
5. `Connect to Git`을 선택합니다.
6. GitHub 계정을 연결하고 `rladbtls1224-design/mycompanionpet` 저장소를 선택합니다.
7. 위 설정값을 입력합니다.
8. `Save and Deploy`를 누릅니다.

## 주의

스크린샷에 보이는 `Create a Worker > Upload and deploy` 화면은 이 프로젝트에 맞는 방식이 아닙니다. 그 화면에는 `dist` 폴더를 업로드할 수 있지만, GitHub 자동 배포를 쓰려면 반드시 `Pages`의 `Connect to Git` 흐름으로 진행해야 합니다.
