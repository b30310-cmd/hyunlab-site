# HYUNLAB 공식 홈페이지

HYUNLAB에서 만든 앱(HYUNLAB Memo, 한마디, 픽잇, 특수문자 연구소, 이야기숲)을
소개하고 배포하는 **공식 운영 사이트**입니다. 개인 앱 스토어 형태로 만들었습니다.

> 이전 HYUNLAB 홈페이지를 이 프로젝트로 대체합니다. 데모나 GitHub Pages용
> 예제가 아니라 실제 운영을 전제로 합니다.

```bash
npm install     # 처음 한 번만
npm run dev     # 개발 (http://localhost:5174)
npm run build   # 배포용 파일 만들기 → dist/
```

## 배포

Vercel 또는 Netlify에 Git 저장소를 연결하면 push할 때마다 자동 배포됩니다.
필요한 설정 파일(`vercel.json`, `netlify.toml`)이 이미 준비되어 있습니다.

1. 이 저장소를 GitHub 등 Git 호스팅에 올립니다
2. [Vercel](https://vercel.com/new) 또는 [Netlify](https://app.netlify.com/start) 에서
   "Import Project" → 이 저장소 선택
3. 빌드 명령 `npm run build`, 배포 폴더 `dist` (자동 감지됨)
4. 도메인 연결은 각 서비스의 Domains 설정에서 진행

> **라우팅 방식**: 실제 경로(`/apps/hanmadi` 등)를 씁니다. 새로고침해도 깨지지
> 않도록 `vercel.json`/`netlify.toml`에 SPA 리라이트 규칙이 들어 있습니다.
> `base: '/'`(vite.config.ts)를 전제로 하므로 **서브폴더가 아닌 도메인 루트에
> 배포해야 합니다.**

---

## 🔑 앱을 추가하려면 — 파일 하나만 고치면 됩니다

**`src/data/apps.ts`** 의 `APPS` 배열에 객체를 하나 추가하세요.
Apps 목록 카드, 상세 페이지, 상단 메뉴, 하단 목록이 **전부 자동으로** 만들어집니다.
페이지를 새로 만들 필요가 없습니다.

```ts
{
  id: 'my-new-app',              // 주소가 됩니다 → /apps/my-new-app
  name: '새 앱',
  tagline: '한 줄 소개',
  icon: '🚀',                    // 이모지 또는 '/icons/app.png' (절대경로)
  type: 'mobile',                // 'web' | 'mobile' | 'desktop'
  status: 'released',            // 'released' | 'beta' | 'coming-soon'
  category: '유틸리티',
  platforms: ['iOS'],
  downloads: [
    { platform: 'iOS', store: 'appstore', url: 'https://apps.apple.com/kr/app/.../id123', requirement: 'iPhone · iPad' },
  ],
}
```

### 나중에 Android 버전이 나오면

**코드는 고칠 필요 없습니다.** 데이터에 두 줄만 더하면 버튼이 자동으로 두 개가 됩니다.

```ts
platforms: ['iOS', 'Android'],                                    // ← Android 추가
downloads: [
  { platform: 'iOS',     store: 'appstore',  url: '...' },
  { platform: 'Android', store: 'playstore', url: '...' },        // ← 이 줄 추가
],
```

버튼 문구는 `store` 값에 따라 자동으로 정해집니다.

| store | 버튼 문구 |
|---|---|
| `appstore` | App Store에서 다운로드 |
| `playstore` | Google Play에서 다운로드 |
| `direct` | 다운로드 (파일 직접 내려받기) |

`label` 을 넣으면 원하는 문구로 바꿀 수 있습니다.

### 꼭 필요한 것 vs 선택

| 항목 | 필수 | 없으면 |
|---|:--:|---|
| `id` `name` `tagline` `icon` `type` `status` `category` `platforms` | ✅ | — |
| `version` `updatedAt` | | 카드에 "준비 중"으로 표시 |
| `downloads[].url` | | 다운로드 버튼이 **비활성화**됩니다 |
| `features` | | 상세 페이지에서 "주요 기능" 섹션이 사라집니다 |
| `screenshots` | | "스크린샷" 섹션이 사라집니다 |
| `changelog` | | "업데이트 내역" 섹션이 사라집니다 |
| `faq` | | 종류에 맞는 **공통 FAQ**가 자동으로 들어갑니다 |

> 데이터가 없는 섹션은 알아서 빠지므로, **아는 만큼만 채워도 화면이 깨지지 않습니다.**

---

## 웹 서비스 / 모바일 앱 구분

`type` 값에 따라 버튼과 안내 문구가 달라집니다.

| type | 주 버튼 | 안내 |
|---|---|---|
| `web` | **웹에서 사용하기** (`webUrl` 필요) | 설치 없이 쓰는 방법 |
| `mobile` | **다운로드** (`downloads` 필요) | 휴대폰 설치 방법 |
| `desktop` | **다운로드** | PC 설치 방법 |

화면의 묶음(섹션)은 `src/data/apps.ts` 의 **`APP_GROUPS`** 가 정합니다.
새로운 종류를 만들고 싶으면 여기에 한 줄만 추가하세요.

```ts
export const APP_GROUPS: AppGroup[] = [
  { type: 'web',    icon: '🌟', title: 'Web Services', sub: '설치 없이...' },
  { type: 'mobile', icon: '📱', title: 'Mobile Apps',  sub: '휴대폰에...' },
  // { type: 'desktop', icon: '💻', title: 'Desktop Apps', sub: 'Windows에...' },
]
```

### 웹 + Windows + PWA를 함께 제공하는 앱 (예: HYUNLAB Memo)

`pwa: true` 를 넣으면 상세 페이지에 **"웹 / Windows / 앱으로 설치"** 3가지
사용법이 나란히 나옵니다.

```ts
{
  type: 'web',
  webUrl: 'https://...',        // 웹 버전 주소
  pwa: true,                    // ← 이 한 줄이 3-카드 안내를 켭니다
  downloads: [
    { platform: 'Windows', store: 'direct', url: '...' },  // 있으면 Windows 카드도 함께
  ],
}
```

> ⚠️ **"앱으로 설치" 버튼은 이 포털이 아니라 그 서비스 자신의 주소에서만
> 동작합니다.** PWA 설치(`beforeinstallprompt`)는 브라우저 보안 정책상
> 다른 오리진에서 대신 트리거할 수 없기 때문입니다. 그래서 이 버튼은
> `webUrl`로 이동시킨 뒤, 그 안에 있는 진짜 설치 버튼을 누르도록 안내합니다.
> (`hyunlab-memo` 프로젝트의 `src/hooks/useInstallPrompt.ts` 참고)

---

## 앱 아이콘

### App Store 앱 — 자동으로 가져옵니다

```bash
npm run fetch:appstore
```

Apple의 공개 조회 API에서 **실제 앱 아이콘(512×512 PNG)** 을 받아
`public/icons/{앱id}.png` 로 저장하고, 최신 **버전·크기·최소 iOS·스토어 주소**를 화면에 출력합니다.
출력된 값을 `apps.ts` 에 옮겨 적으면 됩니다.

새 앱을 넣으려면 `scripts/fetch-appstore.mjs` 의 `TARGETS` 에 한 줄만 추가하세요.

```js
const TARGETS = [
  { id: 'hanmadi', appStoreId: '6786655941' },   // ← apps.ts의 id ↔ App Store ID
]
```

> App Store ID는 스토어 주소 끝의 숫자입니다. `https://apps.apple.com/kr/app/id6786655941`

**앱을 업데이트한 뒤 이 명령을 다시 돌리면** 새 아이콘과 새 버전 정보를 그대로 가져옵니다.

### 직접 만든 아이콘을 쓰려면

`public/icons/` 에 **같은 이름의 PNG로 덮어쓰면** 끝입니다. 코드는 고치지 않아도 됩니다.

```
public/icons/hanmadi.png          ← 이 파일만 바꾸면 됩니다
public/icons/hyunlab-memo.svg     ← 웹 서비스용 (직접 만든 아이콘)
```

권장 규격: **512×512 정사각형**, 모서리는 둥글리지 않은 상태
(둥근 모서리는 화면에서 자동으로 적용됩니다)

---

## 스크린샷 넣기

1. 이미지를 `public/screenshots/{앱id}/` 에 넣습니다
2. `apps.ts` 에 경로를 적습니다

```ts
screenshots: [
  { src: '/screenshots/my-new-app/01.png', caption: '메인 화면 설명' },  // 절대경로
]
```

> ⚠️ **경로는 반드시 `/`로 시작해야 합니다.** `./icons/...` 처럼 상대경로로 쓰면
> `/apps/xxx` 페이지에서 `/apps/icons/...`로 잘못 해석되어 깨집니다.
> (해시 라우팅을 쓰던 이전 버전의 흔적이니 새로 추가할 때 주의하세요.)

상세 페이지에서 좌우로 넘겨 볼 수 있고, 클릭하면 크게 보입니다.

---

## 폴더 구조

```
src/
├─ data/apps.ts          ← ⭐ 앱 정보 (여기만 고치면 됩니다)
├─ data/brand.ts         HYUNLAB 로고·브랜드 색
├─ lib/router.tsx        실제 경로 라우터 (History API)
├─ components/
│  ├─ ui/index.tsx       버튼·배지·섹션 등 공용 조각
│  ├─ layout/            Header(메뉴) · Footer
│  └─ app/
│     ├─ AppCard.tsx     목록에 쓰는 카드
│     ├─ Sections.tsx    주요기능·설치방법·FAQ·업데이트내역·의견
│     └─ ScreenshotGallery.tsx
└─ pages/
   ├─ Home.tsx           첫 화면 (featured 앱 강조)
   ├─ Apps.tsx           앱 목록 (그룹별)
   ├─ AppDetail.tsx      앱 상세
   └─ Simple.tsx         Blog · About · Contact
```

---

## 나중에 붙이기 쉽도록 준비해 둔 것

지금은 화면에 없지만 **데이터 구조는 이미 지원**합니다. 필요할 때 화면만 만들면 됩니다.

| 기능 | 준비 상태 |
|---|---|
| 앱 검색 | ✅ 구현됨 (앱 6개 초과 시 자동 표시) |
| 카테고리 분류 | ✅ 구현됨 (`category`, 6개 초과 시 표시) |
| 인기 앱 / 추천 | ✅ `featured: true` |
| NEW 표시 | ✅ `isNew: true` |
| 릴리즈 노트 | ✅ `changelog` |
| 버전 관리 | ✅ `version`, `updatedAt` |
| 다운로드 수 표시 | 필드 추가만 하면 됨 |
| 즐겨찾기 | 별도 작업 필요 |
| GitHub Release 연동 | `repo` 필드 있음. API로 최신 버전 자동 조회 가능 |

---

## 블로그 글 추가

`src/pages/Simple.tsx` 의 `POSTS` 배열에 추가하면 됩니다.
비어 있으면 "아직 등록된 글이 없습니다"가 표시됩니다.

---

## 연락처 바꾸기

메일 주소는 `src/pages/Simple.tsx` 상단의 `EMAIL` 상수 한 곳에 있습니다.

---

## 실제 도메인이 정해지면 할 일

지금은 `index.html`의 공유 미리보기 이미지(`og:image`)가 `/icons/og.png`처럼
루트 기준 경로로 되어 있습니다. 카카오톡·페이스북 등에서 링크 미리보기가
제대로 뜨려면 **완전한 절대 주소**가 필요합니다.

```html
<!-- 지금 -->
<meta property="og:image" content="/icons/og.png" />

<!-- 도메인이 정해지면 -->
<meta property="og:image" content="https://hyunlab.com/icons/og.png" />
```

`index.html`의 `og:title`, `og:description`도 실제 서비스 소개에 맞게
다시 한번 검토해 주세요.
