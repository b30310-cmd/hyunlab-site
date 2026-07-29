import { Download, ArrowRight, ExternalLink, Apple } from 'lucide-react'
import { AppIcon, Badge, LinkButton, Button, ICON } from '@/components/ui'
import { isAvailable, primaryDownload, STORE_LABEL, type AppEntry, type StoreKind } from '@/data/apps'

// ============================================================
// Apps 목록에 쓰이는 앱 카드
//
// 웹 서비스면  → [웹에서 사용하기]
// iOS 앱이면   → [App Store에서 다운로드]
// 그 외        → [다운로드]
// 공통으로     → [자세히 보기]
// ============================================================

/** 스토어에 맞는 아이콘 */
export function storeIcon(store: StoreKind, size: number) {
  if (store === 'appstore') return <Apple size={size} />
  return <Download size={size} />
}

export function AppCard({ app }: { app: AppEntry }) {
  const isWeb = app.type === 'web'
  const dl = primaryDownload(app)
  const available = isAvailable(app)

  return (
    <article className="card card-hover flex flex-col p-6">
      {/* 아이콘 + 이름 */}
      <div className="flex items-start gap-4">
        <AppIcon icon={app.icon} bg={app.iconBg} size={64} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="text-[17px] font-semibold tracking-tight">{app.name}</h3>
            {app.isNew && <Badge tone="accent">NEW</Badge>}
            {app.status === 'beta' && <Badge tone="muted">베타</Badge>}
            {app.status === 'coming-soon' && <Badge tone="warn">준비 중</Badge>}
          </div>
          <p className="clamp-2 mt-1 text-[14px] leading-relaxed text-muted">{app.tagline}</p>
        </div>
      </div>

      {/* 정보 */}
      <dl className="mt-5 space-y-2 text-[13px]">
        <div className="flex items-center justify-between gap-3">
          <dt className="shrink-0 text-faint">{isWeb ? '이용 방식' : '플랫폼'}</dt>
          <dd className="flex flex-wrap justify-end gap-1">
            {isWeb ? (
              <Badge tone="accent">Web Service</Badge>
            ) : (
              app.platforms.map((p) => <Badge key={p}>{p}</Badge>)
            )}
          </dd>
        </div>

        {app.version && (
          <div className="flex items-center justify-between gap-3">
            <dt className="shrink-0 text-faint">버전</dt>
            <dd className="font-medium tabular-nums">v{app.version}</dd>
          </div>
        )}

        {isWeb ? (
          <div className="flex items-center justify-between gap-3">
            <dt className="shrink-0 text-faint">설치</dt>
            <dd className="text-muted">불필요</dd>
          </div>
        ) : (
          dl?.requirement && (
            <div className="flex items-center justify-between gap-3">
              <dt className="shrink-0 text-faint">지원 기기</dt>
              <dd className="text-muted">{dl.requirement}</dd>
            </div>
          )
        )}

        {!isWeb && dl?.size && (
          <div className="flex items-center justify-between gap-3">
            <dt className="shrink-0 text-faint">크기</dt>
            <dd className="tabular-nums text-muted">{dl.size}</dd>
          </div>
        )}
      </dl>

      {/* 버튼 */}
      <div className="mt-6 flex flex-col gap-2 border-t border-line pt-5">
        {available ? (
          isWeb ? (
            <LinkButton to={app.webUrl!} variant="primary" size="md">
              <ExternalLink size={ICON.sm} />
              웹에서 사용하기
            </LinkButton>
          ) : (
            <LinkButton to={dl!.url} variant="primary" size="md">
              {storeIcon(dl!.store, ICON.sm)}
              {dl!.label ?? STORE_LABEL[dl!.store]}
            </LinkButton>
          )
        ) : (
          <Button variant="secondary" size="md" disabled title="아직 준비 중입니다">
            준비 중
          </Button>
        )}

        <LinkButton to={`/apps/${app.id}`} variant="secondary" size="md">
          자세히 보기
          <ArrowRight size={ICON.sm} />
        </LinkButton>
      </div>
    </article>
  )
}
