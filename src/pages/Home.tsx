import { ArrowRight, ExternalLink, Sparkles } from 'lucide-react'
import { Link } from '@/lib/router'
import { AppIcon, Badge, Container, LinkButton, Section, SectionTitle, ICON } from '@/components/ui'
import { AppCard } from '@/components/app/AppCard'
import { APPS, APP_GROUPS, getFeatured } from '@/data/apps'

// ============================================================
// 첫 화면
//
//   1. 간단한 소개
//   2. 새 서비스(HYUNLAB Memo) 크게 강조  ← featured: true 인 앱
//   3. 나머지 앱 목록
// ============================================================

export function HomePage() {
  const featured = getFeatured()
  const others = APPS.filter((a) => a.id !== featured?.id)

  return (
    <>
      {/* ── 소개 ── */}
      <Section className="!pb-10 !pt-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-[38px] font-bold leading-[1.25] tracking-tight sm:text-[52px]">
              직접 만든 앱을
              <br />
              무료로 나눕니다
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-muted">
              HYUNLAB은 일상과 업무에 필요한 도구를 직접 만들어 공개합니다.{' '}
              <br className="hidden sm:block" />
              광고 없이, 계정 없이, 필요한 기능만 담았습니다.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <LinkButton to="/apps" variant="primary" size="lg">
                앱 둘러보기
                <ArrowRight size={ICON.md} />
              </LinkButton>
              <LinkButton to="/about" variant="secondary" size="lg">
                HYUNLAB 소개
              </LinkButton>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 새 서비스 강조 ── */}
      {featured && (
        <Section className="!pt-6">
          <Container>
            <div className="card relative overflow-hidden p-8 sm:p-12">
              {/* 은은한 배경 */}
              <div
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-[0.07] blur-3xl"
                style={{ background: 'var(--accent)' }}
                aria-hidden
              />

              <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.15fr]">
                {/* 설명 */}
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-[12px] font-semibold text-accent">
                    <Sparkles size={ICON.xs} />
                    새로 나온 서비스
                  </span>

                  <div className="mt-5 flex items-center gap-4">
                    <AppIcon icon={featured.icon} bg={featured.iconBg} size={64} />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-[26px] font-bold tracking-tight sm:text-[30px]">
                          {featured.name}
                        </h2>
                        {featured.isNew && <Badge tone="accent">NEW</Badge>}
                      </div>
                      <p className="mt-1 text-[15px] text-muted">{featured.tagline}</p>
                    </div>
                  </div>

                  <p className="mt-6 text-[15px] leading-[1.85] text-muted">
                    {featured.description}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {featured.webUrl && (
                      <LinkButton to={featured.webUrl} variant="primary" size="lg">
                        <ExternalLink size={ICON.md} />
                        웹에서 사용하기
                      </LinkButton>
                    )}
                    <LinkButton to={`/apps/${featured.id}`} variant="secondary" size="lg">
                      자세히 보기
                      <ArrowRight size={ICON.md} />
                    </LinkButton>
                  </div>

                  <p className="mt-5 text-[13px] text-faint">
                    설치 불필요 · 회원가입 없음 · 무료
                  </p>
                </div>

                {/* 대표 화면 */}
                {featured.screenshots?.[0] && (
                  <div className="overflow-hidden rounded-xl border border-line shadow-[var(--shadow-lg)]">
                    <img
                      src={featured.screenshots[0].src}
                      alt={featured.screenshots[0].caption}
                      loading="eager"
                      className="block w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* ── 나머지 앱 ── */}
      {APP_GROUPS.map((group) => {
        const apps = others.filter((a) => a.type === group.type)
        if (apps.length === 0) return null

        return (
          <Section key={group.type} className="!py-12">
            <Container>
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <h2 className="flex items-center gap-2 text-[22px] font-bold tracking-tight">
                    <span aria-hidden>{group.icon}</span>
                    {group.title}
                  </h2>
                  <p className="mt-1.5 text-[14px] text-muted">{group.sub}</p>
                </div>
                <Link
                  to="/apps"
                  className="hidden shrink-0 items-center gap-1 text-[14px] text-muted transition-colors hover:text-accent sm:inline-flex"
                >
                  전체 보기
                  <ArrowRight size={ICON.sm} />
                </Link>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {apps.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            </Container>
          </Section>
        )
      })}

      {/* ── 마무리 ── */}
      <Section className="!pt-4">
        <Container>
          <div className="card p-10 text-center">
            <SectionTitle
              title="새 앱을 계속 만들고 있습니다"
              sub="필요한 기능이나 아이디어가 있다면 알려주세요."
            />
            <LinkButton to="/contact" variant="secondary" size="lg">
              의견 보내기
            </LinkButton>
          </div>
        </Container>
      </Section>
    </>
  )
}
