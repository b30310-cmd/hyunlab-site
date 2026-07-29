// ============================================================
// 아이콘 만들기 (SVG → PNG · ICO)
//
//   npm run build:icons
//
// SVG 원본 하나만 고치면 아래 결과물이 전부 다시 만들어집니다.
//   · 앱 아이콘 512 / 192
//   · PWA maskable 512
//   · Apple 터치 아이콘 180
//   · 파비콘 favicon.ico (16 · 32 · 48 한 파일에)
//   · 소셜 공유 이미지 1200×630
//
// 크기별로 다른 그림을 씁니다.
//   64px 이상 → 마스터 (줄 3개까지 보임)
//   32px 이하 → 단순화 (줄을 빼고 체크만)
// ============================================================

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const SRC = path.join(ROOT, 'public', 'icons')
const OUT = path.join(ROOT, 'public')

const MASTER = path.join(SRC, 'hyunlab-memo.svg')
const SMALL = path.join(SRC, 'hyunlab-memo-small.svg')
const MASKABLE = path.join(SRC, 'hyunlab-memo-maskable.svg')
const OG = path.join(SRC, 'hyunlab-memo-og.svg')

const ok = (m) => console.log(`  ✅ ${m}`)

/** SVG를 지정한 크기의 PNG로 만듭니다 */
async function png(svgPath, size, outPath) {
  const buf = await sharp(svgPath, { density: 384 })
    .resize(size, size, { fit: 'contain' })
    .png({ compressionLevel: 9 })
    .toBuffer()
  fs.writeFileSync(outPath, buf)
  return buf
}

/**
 * ICO 파일 만들기
 *
 * ICO는 구조가 단순합니다.
 *   [헤더 6바이트] + [이미지별 정보 16바이트씩] + [PNG 데이터들]
 * 256px 이하는 PNG를 그대로 넣을 수 있어서 직접 만들 수 있습니다.
 */
function buildIco(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // 예약
  header.writeUInt16LE(1, 2) // 1 = 아이콘
  header.writeUInt16LE(images.length, 4)

  const entries = []
  let offset = 6 + images.length * 16

  for (const { size, data } of images) {
    const e = Buffer.alloc(16)
    e.writeUInt8(size >= 256 ? 0 : size, 0) // 너비
    e.writeUInt8(size >= 256 ? 0 : size, 1) // 높이
    e.writeUInt8(0, 2) // 색상 수 (0 = 256색 이상)
    e.writeUInt8(0, 3) // 예약
    e.writeUInt16LE(1, 4) // 색 평면
    e.writeUInt16LE(32, 6) // 비트 수
    e.writeUInt32LE(data.length, 8)
    e.writeUInt32LE(offset, 12)
    entries.push(e)
    offset += data.length
  }

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)])
}

console.log('\n🎨 HYUNLAB Memo 아이콘 만들기\n')

for (const f of [MASTER, SMALL, MASKABLE, OG]) {
  if (!fs.existsSync(f)) {
    console.error(`  ❌ 원본이 없습니다: ${path.relative(ROOT, f)}\n`)
    process.exit(1)
  }
}

// ── 큰 크기: 마스터 사용 ──
await png(MASTER, 512, path.join(SRC, 'app-512.png'))
ok('icons/app-512.png       앱 아이콘 · PWA')

await png(MASTER, 192, path.join(SRC, 'app-192.png'))
ok('icons/app-192.png       PWA')

await png(MASTER, 180, path.join(SRC, 'apple-touch-icon.png'))
ok('icons/apple-touch-icon.png   iOS 홈화면')

await png(MASKABLE, 512, path.join(SRC, 'maskable-512.png'))
ok('icons/maskable-512.png  안드로이드 (모양 잘림 대응)')

// ── 작은 크기: 단순화 버전 사용 ──
const ico = []
for (const s of [16, 32, 48]) {
  const buf = await png(SMALL, s, path.join(SRC, `favicon-${s}.png`))
  ico.push({ size: s, data: buf })
}
ok('icons/favicon-16/32/48.png   탭 아이콘')

fs.writeFileSync(path.join(OUT, 'favicon.ico'), buildIco(ico))
ok(`favicon.ico             16·32·48 한 파일 (${(fs.statSync(path.join(OUT, 'favicon.ico')).size / 1024).toFixed(1)}KB)`)

// ── 소셜 공유 이미지 ──
// 글자는 sharp가 시스템 폰트로 그립니다.
// (Pretendard는 설치되어 있지 않을 수 있어 맑은 고딕을 함께 지정합니다)
const FONT = "Pretendard, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif"
const ogText = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <text x="470" y="268" font-family="${FONT}" font-size="76" font-weight="800" fill="#22262E">HYUNLAB Memo</text>
  <text x="474" y="336" font-family="${FONT}" font-size="34" font-weight="500" fill="#7A6862">기록하고 정리하는 웹 메모</text>
  <text x="474" y="416" font-family="${FONT}" font-size="27" font-weight="500" fill="#EE5B3C">설치 없이 브라우저에서 바로</text>
</svg>`

const ogBuf = await sharp(OG, { density: 300 })
  .resize(1200, 630)
  .composite([{ input: Buffer.from(ogText), top: 0, left: 0 }])
  .png({ compressionLevel: 9 })
  .toBuffer()
fs.writeFileSync(path.join(SRC, 'og.png'), ogBuf)
ok(`icons/og.png            공유 이미지 1200×630 (${(ogBuf.length / 1024).toFixed(0)}KB)`)

console.log('\n완료. SVG 원본을 고친 뒤 이 명령을 다시 실행하면 전부 갱신됩니다.\n')
