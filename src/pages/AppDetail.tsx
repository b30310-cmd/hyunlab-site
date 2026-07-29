import { Download, ExternalLink, ArrowLeft, Github, Calendar, Package } from 'lucide-react'
import { Link } from '@/lib/router'
import { AppIcon, Badge, Container, LinkButton, Button, Section, SectionTitle, ICON } from '@/components/ui'
import { ScreenshotGallery } from '@/components/app/ScreenshotGallery'
import { FeatureGrid, StepList, Faq, Changelog, FeedbackBox } from '@/components/app/Sections'
import { UsageOptions } from '@/components/app/UsageOptions'
import { storeIcon } from '@/components/app/AppCard'
import {
  getApp,
  isAvailable,
  primaryDownload,
  STORE_LABEL,
  MOBILE_FAQ,
  WEB_FAQ,
  MOBILE_INSTALL_STEPS,
  WEB_START_STEPS,
} from '@/data/apps'

// ============================================================
// 앱 상세 페이지
//
// 1 Hero · 2 주요 기능 · 3 스크린샷 · 4 다운로드
// 5 설치 방법 · 6 FAQ · 7 업데이트 내역 · 8 사용자 의견
//
// 데이터가 없는 섹션은 자동으로 빠집니다.
// ============================================================

export function AppDetailPage({ id }: { id: string }) {
  const app = getApp(id)

  if (!app) {
    return (
      <Section>
        <Container>
          <div className="py-20 text-center">
            <p className="text-[18px] font-medium">앱을 찾을 수 없습니다</p>
            <p className="mt-2 text-[14px] text-muted">주소를 다시 확인해 주세요.</p>
            <LinkButton to="/apps" variant="secondary" className="mt-6">
              <ArrowLeft size={ICON.sm} />
              앱 목록으로
            </LinkButton>
          </div>
        </Container>
      </Section>
    )
  }

  const isWeb = app.type === 'web'
  const dl = primaryDownload(app)
  const available = isAvailable(app)

  // FAQ와 설치 안내는 앱 종류에 맞는 공통 내용을 기본으로 씁니다.
  const faq = app.faq ?? (isWeb ? WEB_FAQ : MOBILE_FAQ)
  const steps = isWeb ? WEB_START_STEPS : MOBILE_INSTALL_STEPS

  return (
    <>
      {/* ── 1. Hero ── */}
      <Section className="!pb-10">
        <Container>
          <Link
            to="/apps"
            className="mb-8 inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft size={ICON.sm} />앱 목록
          </Link>

          <div className="flex flex-col items-start gap-7 sm:flex-row sm:items-center">
            <AppIcon icon={app.icon} bg={app.iconBg} size={88} className="shadow-[var(--shadow-md)]" />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[30px] font-bold tracking-tight sm:text-[36px]">{app.name}</h1>
                {app.isNew && <Badge tone="accent">NEW</Badge>}
                {app.status === 'beta' && <Badge tone="muted">베타</Badge>}
                {app.status === 'coming-soon' && <Badge tone="warn">준비 중</Badge>}
              </div>

              <p className="mt-2 text-[17px] text-muted">{app.tagline}</p>

              {/* 버전 · 업데이트 · 플랫폼 */}
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-faint">
                {app.version && (
                  <span className="inline-flex items-center gap-1.5">
                    <Package size={ICON.xs} />
                    Version {app.version}
                  </span>
                )}
                {app.updatedAt && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={ICON.xs} />
                    {app.updatedAt} 업데이트
                  </span>
                )}
                <span className="flex flex-wrap gap-1">
                  {isWeb ? (
                    <Badge tone="accent">Web Service</Badge>
                  ) : (
                    app.platforms.map((p) => <Badge key={p}>{p}</Badge>)
                  )}
                </span>
              </div>

              {/* 주 버튼 */}
              <div className="mt-6 flex flex-wrap gap-3">
                {available ? (
                  isWeb ? (
                    <LinkButton to={app.webUrl!} variant="primary" size="lg">
                      <ExternalLink size={ICON.md} />
                      웹에서 사용하기
                    </LinkButton>
                  ) : (
                    // 플랫폼이 여러 개면(예: iOS + Android) 버튼도 여러 개 나옵니다.
                    app.downloads
                      ?.filter((d) => d.url)
                      .map((d, i) => (
                        <LinkButton
                          key={d.platform}
                          to={d.url}
                          variant={i === 0 ? 'primary' : 'secondary'}
                          size="lg"
                        >
                          {storeIcon(d.store, ICON.md)}
                          {d.label ?? STORE_LABEL[d.store]}
                        </LinkButton>
                      ))
                  )
                ) : (
                  <Button variant="secondary" size="lg" disabled>
                    준비 중입니다
                  </Button>
                )}

                {/* 웹 서비스인데 설치 버전도 함께 제공하는 경우 */}
                {isWeb && dl && (
                  <LinkButton to={dl.url} variant="secondary" size="lg" download>
                    <Download size={ICON.md} />
                    {dl.label ?? STORE_LABEL[dl.store]}
                  </LinkButton>
                )}

                {app.repo && (
                  <LinkButton to={app.repo} variant="ghost" size="lg">
                    <Github size={ICON.md} />
                    GitHub
                  </LinkButton>
                )}
              </div>
            </div>
          </div>

          {app.description && (
            <p className="mt-10 max-w-3xl text-[16px] leading-[1.85] text-muted">{app.description}</p>
          )}
        </Container>
      </Section>

      {/* ── 2. 주요 기능 ── */}
      {app.features && app.features.length > 0 && (
        <Section className="!py-14">
          <Container>
            <SectionTitle title="주요 기능" align="left" />
            <FeatureGrid features={app.features} />
          </Container>
        </Section>
      )}

      {/* ── 3. 스크린샷 ── */}
      {app.screenshots && app.screenshots.length > 0 && (
        <Section className="!py-14">
          <Container>
            <SectionTitle
              title="스크린샷"
              sub="이미지를 클릭하면 크게 볼 수 있습니다."
              align="left"
            />
            <ScreenshotGallery shots={app.screenshots} />
          </Container>
        </Section>
      )}

      {/* ── 4. 다운로드 / 시작하기 ──
          PWA를 지원하는 웹 서비스는 "웹 / Windows / 앱으로 설치" 3가지
          사용법을 나란히 보여주고, 그 외에는 기존 방식대로 보여줍니다. */}
      {app.pwa ? (
        <Section className="!py-14">
          <Container>
            <SectionTitle
              title="사용 방법"
              sub="사용 환경에 맞는 방식을 골라 시작하세요."
              align="left"
            />
            <UsageOptions app={app} />
          </Container>
        </Section>
      ) : (
      <Section className="!py-14">
        <Container>
          <div className="card mx-auto max-w-2xl p-8 text-center sm:p-10">
            <h2 className="text-[22px] font-bold tracking-tight">
              {isWeb ? '지금 바로 사용해 보세요' : '다운로드'}
            </h2>

            <dl className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[14px]">
              {!isWeb && dl?.requirement && (
                <div>
                  <dt className="text-faint">지원 환경</dt>
                  <dd className="mt-0.5 font-medium">{dl.requirement}</dd>
                </div>
              )}
              {isWeb && (
                <div>
                  <dt className="text-faint">지원 환경</dt>
                  <dd className="mt-0.5 font-medium">모든 최신 브라우저</dd>
                </div>
              )}
              {app.version && (
                <div>
                  <dt className="text-faint">버전</dt>
                  <dd className="mt-0.5 font-medium tabular-nums">{app.version}</dd>
                </div>
              )}
              {!isWeb && dl?.size && (
                <div>
                  <dt className="text-faint">파일 크기</dt>
                  <dd className="mt-0.5 font-medium tabular-nums">{dl.size}</dd>
                </div>
              )}
              {isWeb && (
                <div>
                  <dt className="text-faint">설치</dt>
                  <dd className="mt-0.5 font-medium">불필요</dd>
                </div>
              )}
            </dl>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              {available ? (
                isWeb ? (
                  <LinkButton to={app.webUrl!} variant="primary" size="lg" className="w-full sm:w-auto sm:px-10">
                    <ExternalLink size={ICON.md} />
                    웹에서 사용하기
                  </LinkButton>
                ) : (
                  app.downloads
                    ?.filter((d) => d.url)
                    .map((d, i) => (
                      <LinkButton
                        key={d.platform}
                        to={d.url}
                        variant={i === 0 ? 'primary' : 'secondary'}
                        size="lg"
                        className="w-full sm:w-auto sm:px-10"
                      >
                        {storeIcon(d.store, ICON.md)}
                        {d.label ?? STORE_LABEL[d.store]}
                      </LinkButton>
                    ))
                )
              ) : (
                <>
                  <Button variant="secondary" size="lg" disabled className="w-full sm:w-auto sm:px-10">
                    준비 중입니다
                  </Button>
                  <p className="mt-4 text-[13px] text-faint">
                    다운로드 링크가 준비되는 대로 이곳에 올라갑니다.
                  </p>
                </>
              )}
            </div>

            <p className="mt-5 text-[13px] text-faint">무료 · 광고 없음 · 계정 불필요</p>
          </div>
        </Container>
      </Section>
      )}

      {/* ── 5. 설치 방법 ── */}
      <Section className="!py-14">
        <Container>
          <SectionTitle
            title={isWeb ? '사용 방법' : '설치 방법'}
            sub={isWeb ? '설치 과정 없이 바로 시작할 수 있습니다.' : '순서대로 따라 하시면 됩니다.'}
            align="left"
          />
          <div className="mx-auto max-w-3xl">
            <StepList steps={steps} />
          </div>
        </Container>
      </Section>

      {/* ── 6. FAQ ── */}
      <Section className="!py-14">
        <Container>
          <SectionTitle title="자주 묻는 질문" align="left" />
          <Faq items={faq} />
        </Container>
      </Section>

      {/* ── 7. 업데이트 내역 ── */}
      {app.changelog && app.changelog.length > 0 && (
        <Section className="!py-14">
          <Container>
            <SectionTitle title="업데이트 내역" align="left" />
            <Changelog entries={app.changelog} />
          </Container>
        </Section>
      )}

      {/* ── 8. 사용자 의견 ── */}
      <Section className="!py-14">
        <Container>
          <SectionTitle
            title="의견을 들려주세요"
            sub="보내주신 의견은 다음 업데이트에 반영됩니다."
            align="left"
          />
          <FeedbackBox appName={app.name} repo={app.repo} />
        </Container>
      </Section>
    </>
  )
}
