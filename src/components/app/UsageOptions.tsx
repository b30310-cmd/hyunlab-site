import { Globe, Download, MonitorDown } from 'lucide-react'
import { LinkButton, ICON } from '@/components/ui'
import { STORE_LABEL, type AppEntry, type DownloadTarget } from '@/data/apps'

// ============================================================
// 웹 / Windows / PWA 3가지 사용법 안내
//
// HYUNLAB Memo처럼 웹 서비스가 PWA(앱으로 설치)까지 지원하는 경우,
// "어떻게 쓰면 되는지"를 한 화면에서 고를 수 있게 보여줍니다.
//
// ⚠️ PWA 설치는 그 서비스 자신의 주소(오리진)에서만 트리거할 수 있습니다.
//    이 포털(hyunlab.com)에서 다른 도메인의 설치 창을 대신 띄울 방법이
//    없으므로, "앱으로 설치" 카드는 webUrl로 이동시키고 그 안에서
//    설치하도록 안내하는 것이 정직한 구현입니다.
// ============================================================

export function UsageOptions({ app }: { app: AppEntry }) {
  const winTarget = app.downloads?.find((d) => d.platform === 'Windows' && d.url)

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* 🌐 웹에서 바로 사용 */}
      {app.webUrl && (
        <UsageCard
          icon={<Globe size={ICON.lg} />}
          title="웹에서 바로 사용"
          desc="설치 없이 브라우저에서 바로 사용"
        >
          <LinkButton to={app.webUrl} variant="primary" className="w-full">
            웹으로 시작하기
          </LinkButton>
        </UsageCard>
      )}

      {/* 💻 Windows 앱 */}
      {winTarget && (
        <UsageCard
          icon={<Download size={ICON.lg} />}
          title="Windows 앱"
          desc="Windows 프로그램으로 설치하여 사용"
        >
          <DownloadButton target={winTarget} />
        </UsageCard>
      )}

      {/* 📌 앱으로 설치 (PWA) */}
      {app.pwa && app.webUrl && (
        <UsageCard
          icon={<MonitorDown size={ICON.lg} />}
          title="앱으로 설치"
          desc="Edge 또는 Chrome에서 작업표시줄에 고정해 일반 프로그램처럼 사용"
        >
          <LinkButton to={app.webUrl} variant="secondary" className="w-full">
            앱으로 설치
          </LinkButton>
          <p className="mt-2 text-[12px] leading-relaxed text-faint">
            이동한 페이지 상단의 <b>“앱으로 설치”</b> 버튼을 누르면 설치됩니다.
          </p>
        </UsageCard>
      )}
    </div>
  )
}

function UsageCard({
  icon,
  title,
  desc,
  children,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  children: React.ReactNode
}) {
  return (
    <div className="card flex flex-col p-6">
      <span className="mb-3 text-accent">{icon}</span>
      <h3 className="text-[16px] font-semibold">{title}</h3>
      <p className="mt-1 min-h-[40px] text-[13px] leading-relaxed text-muted">{desc}</p>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function DownloadButton({ target }: { target: DownloadTarget }) {
  return (
    <LinkButton to={target.url} variant="primary" download className="w-full">
      <Download size={ICON.sm} />
      {target.label ?? STORE_LABEL[target.store]}
    </LinkButton>
  )
}
