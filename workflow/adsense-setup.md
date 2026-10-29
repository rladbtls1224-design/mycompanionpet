# AdSense 연결 및 게시 전 확인

## 현재 구현

- 실제 문의 이메일은 `src/lib/site-settings.js`에서 관리한다. `PUBLIC_CONTACT_EMAIL`로 변경 가능하다.
- 문의는 `mailto:` 링크다. 서버 문의 양식이나 자동 메일 전송, 별도 개인정보 DB를 사용하지 않는다.
- `PUBLIC_ADSENSE_CLIENT`가 비어 있으면 광고 코드·소유권 확인 메타 태그·`ads.txt`를 생성하지 않는다.
- 실제 계정의 `ca-pub-` + 16자리 ID를 설정하면 `<meta name="google-adsense-account">`를 생성한다.
- `npm run build`의 후처리가 같은 ID로 `dist/ads.txt`를 만든다. 가짜 ID는 사용하지 않는다.
- 광고 승인 요청, 자동 광고 활성화, 계정 설정, 프로덕션 배포는 자동 실행하지 않는다.

## 계정 생성 후 소유권 확인

1. 본인 AdSense 계정에서 사이트 추가와 실제 게시자 ID를 확인한다.
2. Cloudflare Pages 빌드 환경의 `PUBLIC_ADSENSE_CLIENT`에 실제 ID를 설정한다. 비밀번호나 API 키를 넣지 않는다.
3. 빌드 후 HTML의 `google-adsense-account` 값과 `/ads.txt`의 게시자 ID가 동일한지 확인한다.
4. 승인된 배포 절차로 반영한 후 AdSense 계정에서 메타 태그 방식으로 소유권 확인 및 검토 요청을 진행한다. 계정 화면에서 제공하는 검증 방식을 따른다.

## 광고 게재 전 CSP와 동의 처리

현재는 외부 광고 스크립트를 삽입하지 않는다. 사이트 소유권 확인 메타 태그와 ads.txt에는 광고 실행 권한이 필요하지 않으므로 기존 CSP를 유지한다.

Google은 변동 가능한 광고 도메인의 단순 허용 목록 대신 strict CSP를 지원한다고 안내한다. 광고 스크립트를 추가하기 전에 실제 응답별 nonce를 생성하고 모든 실행 스크립트에 연결하는 서버/엣지 구현 또는 검증된 strict CSP 구조를 준비해야 한다. 정적 빌드에서 고정 nonce를 사용하는 방법, CSP 삭제, 모든 외부 스크립트를 허용하는 방법으로 우회하지 않는다. 현재 `public/_headers`에 스크립트 주소 하나를 더하는 것만으로 광고가 정상 동작한다고 가정하지 않는다.

EEA·영국·스위스 이용자에게 광고를 제공할 경우 Google의 지역별 동의 요건과 인증 CMP를 확인한다. AdSense의 개인정보 보호 및 메시지에서 실제 메시지를 설정하고 외부 요청·동의 전후 동작을 검증한 후 광고를 활성화한다. 단순 자체 체크박스를 인증 CMP의 대체 수단으로 취급하지 않는다.

광고 활성화 시 개인정보처리방침의 현재 상태, 실제 공급업체와 선택권 안내를 함께 갱신한다. 실제 게재 단계에서 CSP와 광고 요청을 브라우저에서 확인해야 한다.

## 공식 자료

- [AdSense 사이트 연결](https://support.google.com/adsense/answer/7584263?hl=ko)
- [ads.txt 안내: 필수는 아니나 권장](https://support.google.com/adsense/answer/12171612?hl=ko)
- [AdSense와 CSP 통합](https://support.google.com/adsense/answer/16283098?hl=ko)
- [EEA·영국·스위스 CMP 요건](https://support.google.com/adsense/answer/13554116?hl=ko)
- [광고 쿠키 관련 필수 안내](https://support.google.com/adsense/answer/1348695?hl=ko)
