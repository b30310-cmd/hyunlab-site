// ============================================================
// App Store 정보 가져오기
//
//   npm run fetch:appstore
//
// 하는 일
//   1. Apple의 공개 조회 API로 앱 정보를 읽어옵니다
//   2. 실제 앱 아이콘(512px)을 public/icons/ 에 저장합니다
//   3. 버전·크기·최소 iOS·스토어 주소를 화면에 보여줍니다
//      → 값이 바뀌었으면 src/data/apps.ts 에 옮겨 적으면 됩니다
//
// 【어떤 앱을 가져올지】
//   아래 TARGETS 의 App Store ID만 고치면 됩니다.
//   ID는 스토어 주소 끝의 숫자입니다. (.../id6786655941)
// ============================================================

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const ICON_DIR = path.join(ROOT, 'public', 'icons')

/** apps.ts 의 id ↔ App Store ID */
const TARGETS = [
  { id: 'hanmadi', appStoreId: '6786655941' },
  { id: 'pickit', appStoreId: '6787081115' },
  { id: 'special-char-lab', appStoreId: '6786607665' },
  { id: 'story-forest', appStoreId: '6787655363' },
]

const COUNTRY = 'kr'

const ok = (m) => console.log(`  ✅ ${m}`)
const info = (m) => console.log(`  ·  ${m}`)

console.log('\n🍎 App Store 정보 가져오기\n')

fs.mkdirSync(ICON_DIR, { recursive: true })

const ids = TARGETS.map((t) => t.appStoreId).join(',')
const res = await fetch(`https://itunes.apple.com/lookup?id=${ids}&country=${COUNTRY}`)
if (!res.ok) {
  console.error(`  ❌ 조회 실패 (HTTP ${res.status})\n`)
  process.exit(1)
}
const { results } = await res.json()

if (!results?.length) {
  console.error('  ❌ 앱을 찾지 못했습니다. TARGETS의 App Store ID를 확인해 주세요.\n')
  process.exit(1)
}

/** apps.ts 에 붙여 넣기 좋은 형태로 모아 둡니다 */
const summary = []

for (const t of TARGETS) {
  const app = results.find((r) => String(r.trackId) === t.appStoreId)
  if (!app) {
    console.log(`  ⚠️  ${t.id}: 정보를 찾지 못했습니다 (ID ${t.appStoreId})`)
    continue
  }

  // ---- 아이콘 저장 ----
  // Apple이 주는 주소는 '.../512x512bb.jpg' 처럼 끝이 jpg라서
  // 그대로 받으면 PNG가 아니라 JPEG가 옵니다.
  // 끝을 .png 로 바꿔 요청하면 투명 배경이 살아 있는 PNG를 줍니다.
  const raw = app.artworkUrl512 || app.artworkUrl100 || app.artworkUrl60
  const iconUrl = raw.replace(/\.(jpg|jpeg)$/i, '.png')
  const file = path.join(ICON_DIR, `${t.id}.png`)

  try {
    const img = await fetch(iconUrl)
    const buf = Buffer.from(await img.arrayBuffer())

    // 진짜 PNG인지 확인합니다 (앞 8바이트가 PNG 표식이어야 합니다)
    const isPng = buf.slice(0, 8).toString('hex') === '89504e470d0a1a0a'
    if (!isPng) {
      throw new Error('PNG가 아닌 파일을 받았습니다')
    }
    const w = buf.readUInt32BE(16)
    const h = buf.readUInt32BE(20)

    fs.writeFileSync(file, buf)
    ok(`${t.id}.png  (${w}×${h}, ${(buf.length / 1024).toFixed(0)}KB)`)
  } catch (e) {
    console.log(`  ⚠️  ${t.id} 아이콘 저장 실패: ${e.message}`)
  }

  summary.push({
    id: t.id,
    name: app.trackName,
    version: app.version,
    updatedAt: (app.currentVersionReleaseDate || '').slice(0, 10),
    size: app.fileSizeBytes ? `${(app.fileSizeBytes / 1024 / 1024).toFixed(1)}MB` : undefined,
    minOs: app.minimumOsVersion,
    url: (app.trackViewUrl || '').split('?')[0],
  })
}

// ---- 결과 출력 ----
console.log('\n─────────────────────────────────────────────')
console.log(' src/data/apps.ts 에 아래 값을 반영하세요')
console.log('─────────────────────────────────────────────\n')

for (const s of summary) {
  console.log(`■ ${s.id}   (${s.name})`)
  console.log(`    version: '${s.version}',`)
  console.log(`    updatedAt: '${s.updatedAt}',`)
  console.log(`    downloads: [{`)
  console.log(`      platform: 'iOS', store: 'appstore',`)
  console.log(`      url: '${s.url}',`)
  console.log(`      size: '${s.size}', requirement: 'iOS ${s.minOs} 이상 · iPhone · iPad',`)
  console.log(`    }],`)
  console.log('')
}

info(`아이콘 저장 위치: ${path.relative(ROOT, ICON_DIR)}`)
info('아이콘을 직접 만든 것으로 바꾸려면 같은 이름의 PNG로 덮어쓰면 됩니다.\n')
