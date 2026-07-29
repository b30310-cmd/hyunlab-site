// ============================================================
// 앱 목록 — 이 파일 하나만 고치면 됩니다
//
// 【새 앱을 추가하려면】
//   맨 아래 APPS 배열에 객체를 하나 추가하세요.
//   Apps 목록 카드와 상세 페이지가 자동으로 만들어집니다.
//
// 【웹 서비스 / 모바일 앱 구분】
//   type: 'web'    → 웹 서비스   (웹에서 사용하기 버튼)
//   type: 'mobile' → 모바일 앱   (다운로드 버튼)
//   type: 'desktop'→ PC 프로그램 (설치 파일 다운로드)
//
//   화면의 묶음(섹션)은 아래 APP_GROUPS 가 정합니다.
//   새로운 종류가 생기면 APP_GROUPS 에 한 줄만 추가하면 됩니다.
// ============================================================

export type AppType = 'web' | 'mobile' | 'desktop'

export type AppStatus =
  | 'released' // 정식 배포
  | 'beta' // 베타 / 개발 중
  | 'coming-soon' // 준비 중 (버튼 비활성화)

export type Platform = 'Web' | 'Android' | 'iOS' | 'Windows' | 'macOS'

export interface Feature {
  icon: string
  title: string
  desc?: string
}

export interface Screenshot {
  src: string
  caption: string
}

export interface FaqItem {
  q: string
  a: string
}

export interface ChangelogEntry {
  version: string
  /** YYYY-MM-DD */
  date: string
  changes: string[]
}

/**
 * 어디서 받는지
 *   appstore   → App Store (iOS)
 *   playstore  → Google Play (Android)
 *   direct     → 파일을 직접 내려받음 (.exe, .apk 등)
 */
export type StoreKind = 'appstore' | 'playstore' | 'direct'

/**
 * 내려받거나 실행할 대상.
 *
 * 【플랫폼 확장】
 *   나중에 Android 버전이 나오면 downloads 배열에 항목을 하나 더 넣고
 *   platforms 에 'Android' 를 추가하면 됩니다. 코드는 고칠 필요 없습니다.
 *
 *   downloads: [
 *     { platform: 'iOS',     store: 'appstore',  url: '...' },
 *     { platform: 'Android', store: 'playstore', url: '...' },   ← 이 줄만 추가
 *   ]
 */
export interface DownloadTarget {
  platform: Platform
  store: StoreKind
  /** 주소. 비어 있으면 버튼이 잠깁니다 */
  url: string
  /** 예: '45MB' */
  size?: string
  /** 예: 'iOS 15.0 이상' */
  requirement?: string
  /** 버튼 문구를 직접 정하고 싶을 때 (없으면 store에 맞춰 자동) */
  label?: string
}

/** 스토어별 기본 버튼 문구 */
export const STORE_LABEL: Record<StoreKind, string> = {
  appstore: 'App Store에서 다운로드',
  playstore: 'Google Play에서 다운로드',
  direct: '다운로드',
}

export interface AppEntry {
  id: string
  name: string
  /** 한 줄 소개 */
  tagline: string
  description?: string
  /** 이모지 또는 이미지 경로 */
  icon: string
  iconBg?: string

  type: AppType
  status: AppStatus
  category: string
  platforms: Platform[]

  /** 새 서비스 강조 (NEW 배지) */
  isNew?: boolean
  /** 메인 화면 최상단에 크게 소개 */
  featured?: boolean

  version?: string
  /** YYYY-MM-DD */
  updatedAt?: string

  /** 웹 서비스 주소 (type: 'web' 이면 이게 주 버튼이 됩니다) */
  webUrl?: string
  /**
   * 웹 버전이 PWA(앱으로 설치 가능)를 지원하는지.
   * true면 상세 페이지에 "웹 / Windows / 앱으로 설치" 3가지 사용법이 나란히 나옵니다.
   * PWA 설치는 그 서비스 자신의 오리진에서만 가능하므로(다른 도메인에서 대신
   * 설치를 트리거할 수 없음), 버튼을 누르면 webUrl로 이동한 뒤 그 안에서
   * 설치하도록 안내합니다.
   */
  pwa?: boolean
  /** 내려받기 대상들 */
  downloads?: DownloadTarget[]

  features?: Feature[]
  screenshots?: Screenshot[]
  faq?: FaqItem[]
  changelog?: ChangelogEntry[]
  repo?: string
}

// ------------------------------------------------------------
// 화면에 표시할 묶음 (섹션)
//   순서대로 Apps 페이지에 나타납니다.
//   새 종류가 생기면 여기에 한 줄 추가하세요.
// ------------------------------------------------------------
export interface AppGroup {
  /** 이 묶음에 들어갈 앱의 type */
  type: AppType
  icon: string
  title: string
  sub: string
}

export const APP_GROUPS: AppGroup[] = [
  {
    type: 'web',
    icon: '🌟',
    title: 'Web Services',
    sub: '설치 없이 브라우저에서 바로 사용하는 서비스입니다.',
  },
  {
    type: 'mobile',
    icon: '📱',
    title: 'Mobile Apps',
    sub: '휴대폰에 설치해서 사용하는 앱입니다.',
  },
  // 예) PC 프로그램이 생기면 아래 주석을 풀어 쓰세요.
  // { type: 'desktop', icon: '💻', title: 'Desktop Apps', sub: 'Windows에 설치해서 사용합니다.' },
]

// ------------------------------------------------------------
// 공통 안내
// ------------------------------------------------------------

/** 모바일 앱 공통 FAQ (App Store 배포 기준) */
export const MOBILE_FAQ: FaqItem[] = [
  {
    q: '어떤 기기에서 쓸 수 있나요?',
    a: 'iPhone과 iPad에서 사용할 수 있습니다. App Store에서 내려받아 설치하시면 됩니다.',
  },
  {
    q: '유료인가요?',
    a: '무료입니다. 광고도 없고 계정을 만들 필요도 없습니다.',
  },
  {
    q: '업데이트는 어떻게 하나요?',
    a:
      'App Store에서 자동으로 업데이트됩니다. ' +
      '바로 받고 싶다면 App Store → 계정 → 업데이트에서 직접 내려받을 수 있습니다.',
  },
  {
    q: 'Android 버전도 있나요?',
    a: '현재는 iOS만 지원합니다. Android 버전은 준비되는 대로 이 페이지에 함께 올리겠습니다.',
  },
]

/** 웹 서비스 공통 FAQ */
export const WEB_FAQ: FaqItem[] = [
  {
    q: '설치가 필요한가요?',
    a: '아닙니다. 브라우저에서 주소만 열면 바로 사용할 수 있습니다. 회원가입도 필요 없습니다.',
  },
  {
    q: '작성한 내용은 어디에 저장되나요?',
    a:
      '서버가 아니라 사용자의 브라우저에 저장됩니다. 외부로 전송되지 않습니다. ' +
      '다른 기기로 옮기려면 설정에서 내보내기/가져오기를 사용하세요.',
  },
  {
    q: '인터넷이 끊겨도 쓸 수 있나요?',
    a: '한 번 접속한 뒤에는 오프라인에서도 사용할 수 있습니다. 브라우저 메뉴에서 앱으로 설치할 수도 있습니다.',
  },
]

/** 모바일 앱 설치 단계 (App Store) */
export const MOBILE_INSTALL_STEPS = [
  {
    title: 'App Store 열기',
    desc: '다운로드 버튼을 누르면 App Store의 앱 화면으로 이동합니다.',
  },
  {
    title: '받기 누르기',
    desc: '‘받기’ 버튼(또는 구름 모양 아이콘)을 누릅니다.',
  },
  {
    title: '본인 확인',
    desc: 'Face ID · Touch ID 또는 Apple 계정 암호로 확인하면 설치가 시작됩니다.',
  },
  {
    title: '설치 완료',
    desc: '홈 화면에 아이콘이 생기면 바로 사용할 수 있습니다.',
  },
]

/** 웹 서비스 이용 단계 */
export const WEB_START_STEPS = [
  { title: '웹에서 열기', desc: '“웹에서 사용하기” 버튼을 누르면 바로 실행됩니다. 설치도 가입도 필요 없습니다.' },
  { title: '바로 작성', desc: '실행하면 곧바로 입력할 수 있습니다. 저장 버튼은 없고 자동으로 저장됩니다.' },
  {
    title: '앱처럼 설치 (선택)',
    desc: '브라우저 주소창의 설치 아이콘을 누르면 독립된 창으로 띄워 앱처럼 쓸 수 있습니다.',
  },
]

// ============================================================
// 앱 목록
// ============================================================

export const APPS: AppEntry[] = [
  // ----------------------------------------------------------
  // 🌟 Web Services
  // ----------------------------------------------------------
  {
    id: 'hyunlab-memo',
    name: 'HYUNLAB Memo',
    tagline: 'AI 메모 및 업무 메모',
    description:
      'HYUNLAB에서 새롭게 선보이는 웹 메모 서비스입니다. ' +
      '설치도 가입도 없이 브라우저에서 바로 열어 쓸 수 있고, 저장 버튼 없이 자동으로 저장됩니다. ' +
      '포스트잇처럼 띄워 두는 팝업 메모부터 체크리스트, 손그림, 알림까지 업무에 필요한 기능을 담았습니다.',
    icon: '/icons/app-512.png',

    type: 'web',
    status: 'beta',
    category: '생산성',
    platforms: ['Web'],

    isNew: true,
    featured: true,

    version: '1.0.0',
    updatedAt: '2026-07-29',
    webUrl: 'https://b30310-cmd.github.io/hyunlab-memo/app/',
    pwa: true,
    repo: 'https://github.com/b30310-cmd/hyunlab-memo',

    // 웹이 기본이지만 Windows 설치 버전도 함께 제공합니다.
    downloads: [
      {
        platform: 'Windows',
        store: 'direct',
        url: 'https://github.com/b30310-cmd/hyunlab-memo/releases/download/v1.0.0/HYUNLAB-Memo-Setup-1.0.0.exe',
        size: '80.2MB',
        requirement: 'Windows 10 이상 (64bit)',
        label: 'Windows 설치 버전',
      },
    ],

    features: [
      { icon: '📌', title: '팝업 메모', desc: '바탕화면에 붙여 두고 항상 위에 고정' },
      { icon: '✅', title: '체크리스트', desc: '체크하면 취소선과 진행률 자동 표시' },
      { icon: '🔔', title: '일정 알림', desc: '매일·매주·매월 반복 알림' },
      { icon: '🎨', title: '다양한 배경색', desc: '8가지 기본색 + 직접 추가' },
      { icon: '🔤', title: '다양한 글꼴', desc: 'Pretendard·SUIT 등 8종' },
      { icon: '✨', title: '특수문자', desc: '카테고리별로 골라 넣기' },
      { icon: '😊', title: '이모지', desc: '검색·최근 사용·즐겨찾기' },
      { icon: '💾', title: '자동 저장', desc: '저장 버튼 없이 입력 즉시 보관' },
    ],

    screenshots: [
      { src: '/screenshots/hyunlab-memo/01-main.png', caption: '메인 화면 — 프로젝트별로 메모를 정리합니다' },
      { src: '/screenshots/hyunlab-memo/02-checklist.png', caption: '체크리스트 — 완료하면 취소선과 진행률이 표시됩니다' },
      { src: '/screenshots/hyunlab-memo/04-drawing.png', caption: '손그림 메모 — 글 위에 펜·형광펜·화살표로 표시' },
      { src: '/screenshots/hyunlab-memo/03-design.png', caption: '꾸미기 — 배경색·스킨·폰트·테두리 변경' },
      { src: '/screenshots/hyunlab-memo/05-skins.png', caption: '다양한 스킨 — 줄노트·모눈·점선·포스트잇' },
      { src: '/screenshots/hyunlab-memo/06-popup.png', caption: '팝업 메모 — 작은 창으로 띄워 두고 사용' },
    ],

    changelog: [
      {
        version: '1.0.0',
        date: '2026-07-29',
        changes: [
          '최초 공개',
          '팝업 메모 (항상 위 · 투명도 · 위치 기억 · 작게 보기)',
          '체크리스트 및 진행률 표시 추가',
          '일정 알림 기능 추가 (매일·매주·매월 반복)',
          '손그림 메모 추가 (펜·연필·형광펜·도형)',
          '프로젝트 분류, 태그, 컬러 라벨 추가',
          '배경색 8종 · 스킨 6종 · 폰트 8종 지원',
          '다크 모드 지원',
        ],
      },
    ],
  },

  // ----------------------------------------------------------
  // 📱 Mobile Apps — App Store 출시 완료
  //
  // ⚠️ 지금은 App Store '검색' 주소가 들어가 있습니다.
  //    앱의 정확한 주소를 아래 방법으로 확인해 url 을 바꿔 주세요.
  //
  //    App Store에서 앱 화면 → 공유 버튼 → 링크 복사
  //    형태: https://apps.apple.com/kr/app/이름/id1234567890
  //
  //    직접 주소로 바꾸면 사용자가 검색 없이 바로 앱 화면으로 갑니다.
  // ----------------------------------------------------------
  {
    id: 'hanmadi',
    name: '한마디',
    // 아래 tagline·description·features는 App Store 등록 정보를 그대로 옮긴 것입니다.
    // 앱을 업데이트해 스토어 설명이 바뀌면 이 부분도 함께 갱신해 주세요.
    tagline: 'AI 문구 도우미',
    description:
      '하고 싶은 말이 떠오르지 않을 때, 한마디. AI가 함께 표현해 주는 앱이라 ' +
      '복잡한 사용법도 프롬프트 고민도 필요 없습니다. 앱을 열고 몇 번만 탭하면 ' +
      '딱 맞는 문장이 완성됩니다.',
    features: [
      { icon: '🤖', title: 'AI에게 맡기기', desc: '누구에게, 어떤 상황인지 몇 가지만 답하면 자연스러운 문장 완성' },
      { icon: '💬', title: '받은 문자에 답장하기', desc: '받은 카톡·문자를 사진으로 넣으면 마음까지 읽고 답장 작성' },
      { icon: '⭐', title: '자주 쓰는 문장', desc: '회사 사과, 감사 인사, 생일 축하를 탭 한 번으로' },
      { icon: '☀️', title: '오늘의 한마디', desc: '앱을 열 때마다 하루를 시작하는 한 문장, 저장·공유 가능' },
    ],
    icon: '/icons/hanmadi.png',
    type: 'mobile',
    status: 'released',
    category: '글쓰기',
    platforms: ['iOS'],
    version: '1.2',
    updatedAt: '2026-07-13',
    downloads: [
      {
        platform: 'iOS',
        store: 'appstore',
        url: 'https://apps.apple.com/kr/app/id6786655941',
        size: '1.1MB',
        requirement: 'iOS 17.0 이상 · iPhone · iPad',
      },
    ],
  },
  {
    id: 'pickit',
    name: '픽잇',
    tagline: '사진에 감성을 더하는 앱',
    description:
      '요소를 하나하나 붙이는 앱이 아니라, 사진의 분위기를 한 번에 바꿔주는 앱입니다. ' +
      '마음에 드는 꾸미기 팩을 고르면 손글씨·ASCII 아트·장식 라인·손그림·반짝임이 ' +
      '이미 예쁘게 조합된 상태로 사진 위에 올라갑니다.',
    features: [
      { icon: '🎞️', title: '분위기별 꾸미기 팩', desc: '여름 바다·카페 감성·새벽·Y2K·러브·크리스마스 등 완성형 템플릿' },
      { icon: '🏷️', title: '라벨 & 다꾸', desc: '날짜·체크·헤더·태그' },
      { icon: '📌', title: '사꾸 스티커', desc: '메모지·마스킹테이프·리본·폴라로이드' },
      { icon: '✏️', title: '손그림 · 텍스트', desc: '크레용 질감 손그림, 손글씨 스타일, 모두 무료 · 색상·크기 자유' },
    ],
    icon: '/icons/pickit.png',
    type: 'mobile',
    status: 'released',
    category: '디자인',
    platforms: ['iOS'],
    version: '2.0',
    updatedAt: '2026-07-15',
    downloads: [
      {
        platform: 'iOS',
        store: 'appstore',
        url: 'https://apps.apple.com/kr/app/id6787081115',
        size: '1.3MB',
        requirement: 'iOS 17.0 이상 · iPhone · iPad',
      },
    ],
  },
  {
    id: 'special-char-lab',
    name: '특수문자 연구소',
    tagline: '예쁜 특수문자와 감성 문구를 발견하고 저장하는 앱',
    description:
      '수백 개의 표현을 그냥 나열하지 않습니다. 오늘의 발견, Editor\'s Pick, 이번 주 인기처럼 ' +
      '매일 새로운 표현을 골라서 보여드립니다. 마음에 드는 걸 발견하면 한 번의 탭으로 복사하고 ' +
      '나만의 컬렉션에 저장할 수 있습니다.',
    features: [
      { icon: '✨', title: '오늘의 발견', desc: 'Editor\'s Pick, 이번 주 인기 등 매일 새로운 표현' },
      { icon: '📋', title: '한 번의 탭으로 복사', desc: '마음에 드는 표현을 바로 복사해 사용' },
      { icon: '🎨', title: '스타일 추천', desc: '문장 하나를 여러 스타일로 꾸며주는 추천' },
      { icon: '🔒', title: '개인정보 미수집', desc: '인터넷 연결 없이 기기 안에서 바로 동작' },
    ],
    icon: '/icons/special-char-lab.png',
    type: 'mobile',
    status: 'released',
    category: '유틸리티',
    platforms: ['iOS'],
    version: '2.0.1',
    updatedAt: '2026-07-15',
    downloads: [
      {
        platform: 'iOS',
        store: 'appstore',
        url: 'https://apps.apple.com/kr/app/id6786607665',
        size: '1.2MB',
        requirement: 'iOS 16.0 이상 · iPhone · iPad',
      },
    ],
  },
  {
    id: 'story-forest',
    name: '이야기숲',
    tagline: '마음을 쉬게 하는 이야기',
    description:
      '하루 3분, 지친 어른을 위한 짧은 공감 이야기 앱입니다. 가르치거나 바꾸려는 이야기가 아니라 ' +
      '"나만 그런 게 아니었구나" 하고 마음을 살며시 내려놓게 하는 이야기입니다.',
    features: [
      { icon: '📖', title: '오늘의 이야기', desc: '매일, 오늘 하루에 어울리는 짧은 이야기 한 편 (2~3분)' },
      { icon: '💌', title: '마음에 남은 문장', desc: '이야기 속 마음에 닿은 한 줄을 조용히 담아 두기' },
      { icon: '🌙', title: '오늘의 따뜻한 한마디', desc: '다 읽고 나면 하루를 마무리하는 담담한 한 줄' },
      { icon: '🌳', title: '내가 키운 숲', desc: '읽어온 이야기들이 쌓여 나만의 작은 숲이 되어감' },
    ],
    icon: '/icons/story-forest.png',
    type: 'mobile',
    status: 'released',
    category: '글쓰기',
    platforms: ['iOS'],
    version: '2.0',
    updatedAt: '2026-07-14',
    downloads: [
      {
        platform: 'iOS',
        store: 'appstore',
        url: 'https://apps.apple.com/kr/app/id6787655363',
        size: '0.7MB',
        requirement: 'iOS 16.0 이상 · iPhone · iPad',
      },
    ],
  },
]

// ------------------------------------------------------------
// 조회 도우미
// ------------------------------------------------------------

export const getApp = (id: string) => APPS.find((a) => a.id === id)

/** 특정 종류(web/mobile/desktop)의 앱만 */
export const getAppsByType = (type: AppType) => APPS.filter((a) => a.type === type)

/** 메인에 크게 소개할 앱 */
export const getFeatured = () => APPS.find((a) => a.featured)

/** 카테고리 목록 (앱이 많아지면 필터로 사용) */
export const getCategories = () => Array.from(new Set(APPS.map((a) => a.category)))

/** 실제로 눌러서 쓸 수 있는 상태인지 */
export function isAvailable(app: AppEntry): boolean {
  if (app.status === 'coming-soon') return false
  if (app.type === 'web') return !!app.webUrl
  return !!app.downloads?.some((d) => d.url)
}

/** 카드의 주 버튼에 쓸 대상 */
export const primaryDownload = (app: AppEntry) => app.downloads?.find((d) => d.url)
