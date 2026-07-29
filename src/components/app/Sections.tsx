import { useState } from 'react'
import { ChevronDown, AlertTriangle, MessageSquare, Bug, Lightbulb, Check } from 'lucide-react'
import { LinkButton, ICON } from '@/components/ui'
import type { ChangelogEntry, FaqItem, Feature } from '@/data/apps'

// ============================================================
// 앱 상세 페이지를 이루는 조각들
//   주요 기능 / 설치 방법 / FAQ / 업데이트 내역 / 사용자 의견
// ============================================================

// ------------------------------------------------------------
// 주요 기능
// ------------------------------------------------------------
export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((f) => (
        <div key={f.title} className="card p-5">
          <div className="mb-3 text-[24px] leading-none">{f.icon}</div>
          <h3 className="text-[15px] font-semibold">{f.title}</h3>
          {f.desc && <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{f.desc}</p>}
        </div>
      ))}
    </div>
  )
}

// ------------------------------------------------------------
// 설치 / 시작 방법 (단계별)
// ------------------------------------------------------------
export interface Step {
  title: string
  desc: string
  /** 주의해서 봐야 하는 단계 (노란 강조) */
  highlight?: boolean
}

export function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative space-y-3">
      {steps.map((s, i) => (
        <li key={i} className="relative">
          <div
            className={`card flex gap-4 p-5 ${
              s.highlight
                ? '!border-amber-300 bg-amber-50 dark:!border-amber-500/30 dark:bg-amber-500/[0.07]'
                : ''
            }`}
          >
            {/* 번호 */}
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold ${
                s.highlight
                  ? 'bg-amber-400 text-amber-950'
                  : 'bg-accent-soft text-accent'
              }`}
            >
              {i + 1}
            </span>

            <div className="min-w-0 flex-1">
              <h3 className="flex items-center gap-1.5 text-[15px] font-semibold">
                {s.highlight && <AlertTriangle size={ICON.sm} className="text-amber-500" />}
                {s.title}
              </h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{s.desc}</p>
            </div>
          </div>

          {/* 단계 사이 화살표 */}
          {i < steps.length - 1 && (
            <div className="flex justify-center py-1" aria-hidden>
              <ChevronDown size={ICON.md} className="text-faint" />
            </div>
          )}
        </li>
      ))}
    </ol>
  )
}

// ------------------------------------------------------------
// FAQ (펼침/접힘)
// ------------------------------------------------------------
export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="mx-auto max-w-3xl space-y-2">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={i} className="card overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--hover)]"
            >
              <span className="text-[15px] font-medium">{item.q}</span>
              <ChevronDown
                size={ICON.md}
                className={`shrink-0 text-faint transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isOpen && (
              <p className="animate-fade-in border-t border-line px-5 py-4 text-[14px] leading-relaxed text-muted">
                {item.a}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ------------------------------------------------------------
// 업데이트 내역
// ------------------------------------------------------------
export function Changelog({ entries }: { entries: ChangelogEntry[] }) {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {entries.map((e, idx) => (
        <div key={e.version} className="relative pl-8">
          {/* 세로 선 */}
          {idx < entries.length - 1 && (
            <span className="absolute left-[7px] top-6 h-full w-px bg-line" aria-hidden />
          )}
          {/* 점 */}
          <span
            className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-[3px] border-[var(--bg)]"
            style={{ background: idx === 0 ? 'var(--accent)' : 'var(--border-strong)' }}
            aria-hidden
          />

          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[17px] font-semibold tabular-nums">v{e.version}</h3>
            {idx === 0 && (
              <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
                최신
              </span>
            )}
            <span className="text-[13px] text-faint">{e.date}</span>
          </div>

          <ul className="mt-3 space-y-1.5">
            {e.changes.map((c, i) => (
              <li key={i} className="flex gap-2 text-[14px] leading-relaxed text-muted">
                <Check size={ICON.sm} className="mt-1 shrink-0 text-accent" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// ------------------------------------------------------------
// 사용자 의견
// ------------------------------------------------------------
export function FeedbackBox({ appName, repo }: { appName: string; repo?: string }) {
  // 저장소가 있으면 GitHub Issues로, 없으면 메일로 연결합니다.
  const mail = (subject: string) =>
    `mailto:b30310@gmail.com?subject=${encodeURIComponent(`[${appName}] ${subject}`)}`

  const links = [
    {
      icon: <MessageSquare size={ICON.md} />,
      title: '의견 보내기',
      desc: '사용하면서 느낀 점을 알려주세요',
      to: repo ? `${repo}/issues/new?labels=feedback` : mail('의견'),
    },
    {
      icon: <Bug size={ICON.md} />,
      title: '버그 신고',
      desc: '동작이 이상한 부분을 알려주세요',
      to: repo ? `${repo}/issues/new?labels=bug` : mail('버그 신고'),
    },
    {
      icon: <Lightbulb size={ICON.md} />,
      title: '기능 제안',
      desc: '있으면 좋겠다 싶은 기능을 알려주세요',
      to: repo ? `${repo}/issues/new?labels=enhancement` : mail('기능 제안'),
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {links.map((l) => (
        <LinkButton
          key={l.title}
          to={l.to}
          variant="secondary"
          className="card card-hover !h-auto flex-col items-start gap-2 !rounded-[18px] !px-5 !py-5 text-left"
        >
          <span className="text-accent">{l.icon}</span>
          <span className="text-[15px] font-semibold text-body">{l.title}</span>
          <span className="text-[13px] font-normal leading-relaxed text-muted">{l.desc}</span>
        </LinkButton>
      ))}
    </div>
  )
}
