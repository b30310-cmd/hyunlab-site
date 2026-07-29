import { BRAND } from '@/data/brand'

// ============================================================
// HYUNLAB 로고 (심볼 + 워드마크)
//
//   심볼   → SVG 파일
//   워드마크 → HTML 글자
//
// 워드마크를 글자로 그리는 이유
//   · 사이트와 같은 폰트(Pretendard)가 정확히 적용됩니다
//   · 다크 모드에서 'HYUN' 부분 색만 바꿔 대비를 맞출 수 있습니다
//     (SVG 이미지 안의 글자는 색을 바꿀 수 없습니다)
// ============================================================

export function Logo({ size, showWordmark = true }: { size?: number; showWordmark?: boolean }) {
  const s = size ?? BRAND.symbolSize

  return (
    <span className="inline-flex items-center gap-2">
      <img
        src={BRAND.symbol}
        alt=""
        width={s}
        height={s}
        style={{ width: s, height: s }}
        className="shrink-0"
      />

      {showWordmark && (
        <span
          className="font-extrabold tracking-tight"
          style={{ fontSize: s * 0.62, lineHeight: 1 }}
        >
          {/* HYUN — 라이트에서는 진한 회색, 다크에서는 밝게 */}
          <span className="text-[#2B2F38] dark:text-[#E9EBEE]">{BRAND.nameDark}</span>
          {/* LAB — 브랜드 코랄 (다크에서는 살짝 밝게 보정) */}
          <span className="text-[#F5765C] dark:text-[#FF8E76]">{BRAND.nameAccent}</span>
        </span>
      )}
    </span>
  )
}
