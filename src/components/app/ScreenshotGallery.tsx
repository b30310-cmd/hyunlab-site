import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { ICON } from '@/components/ui'
import type { Screenshot } from '@/data/apps'

// ============================================================
// 스크린샷 슬라이드
//  · 좌우로 넘겨서 볼 수 있습니다
//  · 클릭하면 크게 볼 수 있습니다 (ESC / 화살표 키 지원)
// ============================================================

export function ScreenshotGallery({ shots }: { shots: Screenshot[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState<number | null>(null)

  /** 한 칸씩 좌우로 스크롤 */
  const slide = (dir: -1 | 1) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  // 크게 보기 상태에서 키보드 조작
  useEffect(() => {
    if (zoom === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoom(null)
      if (e.key === 'ArrowRight') setZoom((i) => (i === null ? null : (i + 1) % shots.length))
      if (e.key === 'ArrowLeft') setZoom((i) => (i === null ? null : (i - 1 + shots.length) % shots.length))
    }
    document.addEventListener('keydown', onKey)
    // 뒤 배경이 스크롤되지 않게
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [zoom, shots.length])

  if (!shots.length) return null

  return (
    <>
      <div className="relative">
        {/* 슬라이드 */}
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
          style={{ scrollbarWidth: 'thin' }}
        >
          {shots.map((s, i) => (
            <figure
              key={i}
              className="w-[85%] shrink-0 snap-start sm:w-[62%] lg:w-[48%]"
            >
              <button
                onClick={() => setZoom(i)}
                className="block w-full overflow-hidden rounded-xl border border-line bg-surface transition-all duration-200 hover:border-line-strong hover:shadow-[var(--shadow-md)]"
                aria-label={`${s.caption} — 크게 보기`}
              >
                <img
                  src={s.src}
                  alt={s.caption}
                  loading="lazy"
                  className="block w-full"
                />
              </button>
              <figcaption className="mt-3 px-1 text-[13px] leading-relaxed text-muted">
                {s.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* 좌우 버튼 (화면이 넓을 때만) */}
        <button
          onClick={() => slide(-1)}
          aria-label="이전 스크린샷"
          className="absolute -left-4 top-[38%] hidden h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-[var(--shadow-md)] transition-colors hover:text-body lg:flex"
        >
          <ChevronLeft size={ICON.lg} />
        </button>
        <button
          onClick={() => slide(1)}
          aria-label="다음 스크린샷"
          className="absolute -right-4 top-[38%] hidden h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-[var(--shadow-md)] transition-colors hover:text-body lg:flex"
        >
          <ChevronRight size={ICON.lg} />
        </button>
      </div>

      {/* 크게 보기 */}
      {zoom !== null && (
        <div
          className="animate-fade-in fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setZoom(null)}
        >
          <button
            onClick={() => setZoom(null)}
            aria-label="닫기"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X size={ICON.lg} />
          </button>

          <img
            src={shots[zoom].src}
            alt={shots[zoom].caption}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl"
          />
          <p className="mt-4 text-center text-[14px] text-white/80">{shots[zoom].caption}</p>
          <p className="mt-1 text-[12px] text-white/45">
            {zoom + 1} / {shots.length} · 화살표 키로 이동, ESC로 닫기
          </p>
        </div>
      )}
    </>
  )
}
