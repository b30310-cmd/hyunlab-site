import type { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

// ============================================================
// 공용 UI 조각들
// 사이트 전체가 이 컴포넌트만 사용해 모양이 어긋나지 않습니다.
// ============================================================

/** 아이콘 크기 (이 4단계만 사용) */
export const ICON = { xs: 13, sm: 15, md: 17, lg: 20 } as const

// ------------------------------------------------------------
// 버튼
// ------------------------------------------------------------

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const VARIANT: Record<Variant, string> = {
  primary: 'text-white shadow-sm hover:brightness-110 active:brightness-95',
  secondary: 'border border-line bg-surface text-body hover:bg-[var(--hover)]',
  ghost: 'text-muted hover:bg-[var(--hover)] hover:text-body',
}

const SIZE: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-4 text-[14px]',
  lg: 'h-12 px-6 text-[15px]',
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap ' +
  'transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none select-none'

export function Button({
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      {...rest}
      className={`${BASE} ${SIZE[size]} ${VARIANT[variant]} ${className}`}
      style={variant === 'primary' ? { background: 'var(--accent)', ...rest.style } : rest.style}
    >
      {children}
    </button>
  )
}

/** 링크 모양의 버튼 (내부 이동 + 외부 링크 모두 지원) */
export function LinkButton({
  to,
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
  download,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string
  variant?: Variant
  size?: Size
  download?: boolean
}) {
  const cls = `${BASE} ${SIZE[size]} ${VARIANT[variant]} ${className}`
  const style = variant === 'primary' ? { background: 'var(--accent)' } : undefined
  const external = /^https?:\/\//.test(to)

  // 외부 주소는 새 탭으로, 다운로드 링크는 download 속성을 붙입니다.
  // 내부 이동은 해시(#) 주소를 씁니다.
  const href = external ? to : `#${to}`
  const extraProps = external
    ? download
      ? { download: '' }
      : { target: '_blank', rel: 'noreferrer noopener' }
    : {}

  return (
    <a {...rest} {...extraProps} href={href} className={cls} style={style}>
      {children}
    </a>
  )
}

// ------------------------------------------------------------
// 배지
// ------------------------------------------------------------

export function Badge({
  children,
  tone = 'default',
}: {
  children: ReactNode
  tone?: 'default' | 'accent' | 'muted' | 'warn'
}) {
  const tones = {
    default: 'bg-surface-2 text-muted',
    accent: 'bg-accent-soft text-accent',
    muted: 'bg-surface-2 text-faint',
    warn: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  }
  return (
    <span
      className={`inline-flex h-6 items-center rounded-full px-2.5 text-[12px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

// ------------------------------------------------------------
// 레이아웃 조각
// ------------------------------------------------------------

/** 가운데 정렬 컨테이너 */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`wrap ${className}`}>{children}</div>
}

/** 섹션 — 위아래 여백을 통일합니다 */
export function Section({
  children,
  className = '',
  id,
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={`py-16 sm:py-20 ${className}`}>
      {children}
    </section>
  )
}

/** 섹션 제목 */
export function SectionTitle({
  title,
  sub,
  align = 'center',
}: {
  title: string
  sub?: string
  align?: 'center' | 'left'
}) {
  return (
    <div className={`mb-10 ${align === 'center' ? 'text-center' : ''}`}>
      <h2 className="text-[26px] font-bold tracking-tight sm:text-[30px]">{title}</h2>
      {sub && <p className="mt-3 text-[15px] leading-relaxed text-muted">{sub}</p>}
    </div>
  )
}

/**
 * 앱 아이콘
 *
 * 모든 앱이 같은 크기 · 같은 둥글기로 보이도록 여기서 한 번에 정합니다.
 * iOS 아이콘과 같은 비율(약 22%)의 둥근 모서리를 씁니다.
 *
 * icon 값이
 *   './icons/xxx.png' 처럼 경로면 → 이미지
 *   '📝' 처럼 글자면              → 이모지 (아이콘 파일이 없을 때만)
 */
export function AppIcon({
  icon,
  bg,
  size = 64,
  className = '',
}: {
  icon: string
  bg?: string
  size?: number
  className?: string
}) {
  const isImage = /^(\.\/|https?:\/\/|\/)/.test(icon)

  const shell = `flex shrink-0 items-center justify-center overflow-hidden ${className}`
  const style = {
    width: size,
    height: size,
    // iOS 아이콘 곡률에 맞춘 값
    borderRadius: Math.round(size * 0.2237),
  }

  if (isImage) {
    return (
      <div className={`${shell} border border-black/[0.06] dark:border-white/[0.08]`} style={style}>
        <img
          src={icon}
          alt=""
          // 원본이 512px이라 2배 화면에서도 선명합니다.
          width={size * 2}
          height={size * 2}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={shell}
      style={{ ...style, background: bg ?? 'var(--surface-2)', fontSize: size * 0.5, lineHeight: 1 }}
    >
      <span>{icon}</span>
    </div>
  )
}
