# Astro + GitHub + Cloudflare Pages 배포 흐름

## 기본 구조

1. 로컬 또는 Codex에서 Astro 프로젝트 수정
2. Markdown 글 추가
3. 이미지 파일 추가
4. `npm run build`로 빌드 확인
5. Git commit
6. GitHub push
7. Cloudflare Pages 자동 배포
8. 배포 URL 확인

## 권장 명령어

```bash
npm run build

git status
git add .
git commit -m "Add new pet nutrition article"
git push origin main
```

## Cloudflare Pages 설정 참고

- Build command: `npm run build`
- Build output directory: `dist`
- Framework preset: Astro
- Production branch: `main`

프로젝트가 다르게 설정되어 있으면 Cloudflare Pages의 기존 설정을 우선한다.

## 배포 전 체크

- [ ] build 성공
- [ ] 이미지 경로 깨짐 없음
- [ ] frontmatter 스키마 오류 없음
- [ ] slug 중복 없음
- [ ] category 값 일관성 있음
- [ ] draft가 false인지 확인

## 주의

Codex는 사용자가 명시적으로 요청하기 전에는 `git push`를 실행하지 않는다.
