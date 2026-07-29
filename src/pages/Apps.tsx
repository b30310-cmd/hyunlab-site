import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Container, Section, ICON } from '@/components/ui'
import { AppCard } from '@/components/app/AppCard'
import { APPS, APP_GROUPS, getCategories } from '@/data/apps'

// ============================================================
// Apps 목록 페이지
//
// data/apps.ts 의 APP_GROUPS 순서대로 묶어서 보여줍니다.
//   🌟 Web Services   (설치 없이 바로 사용)
//   📱 Mobile Apps    (내려받아 설치)
//
// 앱이 많아질 때를 대비해 검색과 카테고리 필터를 넣어 두었습니다.
// (앱이 6개 이하이면 자동으로 숨겨집니다)
// ============================================================

export function AppsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  const categories = useMemo(() => getCategories(), [])
  // 앱이 적을 때는 검색·필터가 오히려 번잡해서 숨깁니다.
  const showFilters = APPS.length > 6

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return APPS.filter((app) => {
      if (category && app.category !== category) return false
      if (!q) return true
      return (
        app.name.toLowerCase().includes(q) ||
        app.tagline.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q)
      )
    })
  }, [query, category])

  return (
    <>
      {/* 머리말 */}
      <Section className="!pb-8">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-[32px] font-bold tracking-tight sm:text-[40px]">Apps</h1>
            <p className="mt-4 text-[16px] leading-relaxed text-muted">
              HYUNLAB에서 직접 만든 앱과 서비스입니다.{' '}
              {/* 좁은 화면에서는 줄바꿈이 숨겨지므로 위에 공백을 넣어 문장이 붙지 않게 합니다 */}
              <br className="hidden sm:block" />
              모두 무료이며 광고가 없습니다.
            </p>
          </div>

          {showFilters && (
            <div className="mx-auto mt-10 max-w-2xl">
              <div className="relative">
                <Search
                  size={ICON.md}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="앱 이름이나 기능으로 검색"
                  className="h-12 w-full rounded-lg border border-line bg-surface-2 pl-11 pr-11 text-[15px] outline-none transition-colors focus:border-accent focus:bg-surface"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    aria-label="검색어 지우기"
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-faint transition-colors hover:bg-[var(--hover)] hover:text-body"
                  >
                    <X size={ICON.sm} />
                  </button>
                )}
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <FilterChip active={category === null} onClick={() => setCategory(null)}>
                  전체
                </FilterChip>
                {categories.map((c) => (
                  <FilterChip
                    key={c}
                    active={category === c}
                    onClick={() => setCategory(category === c ? null : c)}
                  >
                    {c}
                  </FilterChip>
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* 묶음별 목록 */}
      <Container>
        {APP_GROUPS.map((group) => {
          const apps = filtered.filter((a) => a.type === group.type)
          if (apps.length === 0) return null

          return (
            <section key={group.type} className="mb-16">
              <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="flex items-center gap-2 text-[22px] font-bold tracking-tight">
                  <span aria-hidden>{group.icon}</span>
                  {group.title}
                </h2>
                <span className="text-[13px] text-faint">{apps.length}개</span>
                <p className="w-full text-[14px] text-muted">{group.sub}</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {apps.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            </section>
          )
        })}

        {filtered.length === 0 && (
          <p className="py-20 text-center text-[15px] text-faint">
            조건에 맞는 앱이 없습니다.
          </p>
        )}
      </Container>

      <div className="h-10" />
    </>
  )
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`h-8 rounded-full px-4 text-[13px] transition-colors ${
        active
          ? 'text-white'
          : 'bg-surface-2 text-muted hover:text-body'
      }`}
      style={active ? { background: 'var(--accent)' } : undefined}
    >
      {children}
    </button>
  )
}
