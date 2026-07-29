import { Link } from '@/lib/router'
import { APPS } from '@/data/apps'
import { Logo } from './Logo'

// ============================================================
// 하단 영역 — 앱 목록도 data/apps.ts 에서 자동으로 채워집니다.
// ============================================================

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* 브랜드 */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-muted">
            직접 만든 앱을 소개하고 무료로 배포합니다.
            <br />
            광고 없이, 계정 없이, 필요한 기능만 담았습니다.
          </p>
        </div>

        {/* 앱 목록 */}
        <div>
          <h3 className="mb-4 text-[13px] font-semibold text-body">앱</h3>
          <ul className="space-y-2.5">
            {APPS.map((app) => (
              <li key={app.id}>
                <Link
                  to={`/apps/${app.id}`}
                  className="text-[14px] text-muted transition-colors hover:text-accent"
                >
                  {app.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 링크 */}
        <div>
          <h3 className="mb-4 text-[13px] font-semibold text-body">바로가기</h3>
          <ul className="space-y-2.5">
            {[
              { label: '전체 앱', to: '/apps' },
              { label: 'Blog', to: '/blog' },
              { label: 'About', to: '/about' },
              { label: 'Contact', to: '/contact' },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-[14px] text-muted transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="wrap flex flex-col gap-2 py-5 text-[13px] text-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} HYUNLAB. All rights reserved.</span>
          <span>모든 앱은 무료이며 광고가 없습니다.</span>
        </div>
      </div>
    </footer>
  )
}
