import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Menu, X, Moon, Sun } from 'lucide-react'
import { Link, useIsActive, useRouter } from '@/lib/router'
import { APPS } from '@/data/apps'
import { AppIcon, ICON } from '@/components/ui'
import { Logo } from './Logo'

// ============================================================
// 상단 메뉴
//
// Apps 메뉴는 data/apps.ts 를 그대로 읽어옵니다.
// → 앱을 추가하면 메뉴에도 자동으로 나타납니다.
// ============================================================

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Apps', to: '/apps', hasDropdown: true },
  { label: 'Blog', to: '/blog' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export function Header({
  theme,
  onToggleTheme,
}: {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}) {
  const [openApps, setOpenApps] = useState(false)
  const [openMobile, setOpenMobile] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const { path } = useRouter()

  // 메뉴 활성 여부.
  // 훅(useIsActive)은 map 콜백 안에서 부를 수 없으므로 일반 함수로 계산합니다.
  const isActive = (prefix: string) =>
    prefix === '/' ? path === '/' : path === prefix || path.startsWith(prefix + '/')

  // 경로가 바뀌면 열려 있던 메뉴를 닫습니다.
  useEffect(() => {
    setOpenApps(false)
    setOpenMobile(false)
  }, [path])

  // 바깥을 클릭하면 드롭다운 닫기
  useEffect(() => {
    if (!openApps) return
    const onDown = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpenApps(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenApps(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [openApps])

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[var(--bg)]/85 backdrop-blur-md">
      <div className="wrap flex h-16 items-center gap-2">
        {/* 로고 — data/brand.ts 에서 관리합니다 */}
        <Link to="/" className="flex shrink-0 items-center gap-2 pr-2" aria-label="HYUNLAB 홈">
          <Logo />
        </Link>

        {/* 데스크톱 메뉴 */}
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((item) =>
            item.hasDropdown ? (
              <div key={item.to} ref={dropRef} className="relative">
                <button
                  onClick={() => setOpenApps((v) => !v)}
                  className={`inline-flex h-9 items-center gap-1 rounded-md px-3 text-[14px] transition-colors ${
                    isActive(item.to) ? 'font-medium text-accent' : 'text-muted hover:text-body'
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    size={ICON.xs}
                    className={`transition-transform ${openApps ? 'rotate-180' : ''}`}
                  />
                </button>

                {openApps && (
                  <div className="animate-fade-up absolute left-0 top-full mt-1 w-[280px] rounded-xl border border-line bg-surface p-1.5 shadow-[var(--shadow-lg)]">
                    {APPS.map((app) => (
                      <Link
                        key={app.id}
                        to={`/apps/${app.id}`}
                        className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--hover)]"
                      >
                        <AppIcon icon={app.icon} bg={app.iconBg} size={34} />
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] font-medium">{app.name}</span>
                          <span className="block truncate text-[12px] text-faint">{app.tagline}</span>
                        </span>
                      </Link>
                    ))}
                    <div className="my-1 h-px bg-line" />
                    <Link
                      to="/apps"
                      className="block rounded-lg px-2 py-2 text-[13px] text-muted transition-colors hover:bg-[var(--hover)] hover:text-body"
                    >
                      전체 앱 보기 →
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <NavLink key={item.to} to={item.to} label={item.label} />
            ),
          )}
        </nav>

        <div className="flex-1" />

        {/* 테마 전환 */}
        <button
          onClick={onToggleTheme}
          title={theme === 'light' ? '다크 모드' : '라이트 모드'}
          aria-label={theme === 'light' ? '다크 모드' : '라이트 모드'}
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-[var(--hover)] hover:text-body"
        >
          {theme === 'light' ? <Moon size={ICON.md} /> : <Sun size={ICON.md} />}
        </button>

        {/* 모바일 메뉴 버튼 */}
        <button
          onClick={() => setOpenMobile((v) => !v)}
          aria-label="메뉴"
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-[var(--hover)] hover:text-body md:hidden"
        >
          {openMobile ? <X size={ICON.lg} /> : <Menu size={ICON.lg} />}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {openMobile && (
        <div className="animate-fade-in border-t border-line bg-surface md:hidden">
          <div className="wrap py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block rounded-lg px-3 py-2.5 text-[15px] text-muted transition-colors hover:bg-[var(--hover)] hover:text-body"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-line" />
            <p className="px-3 pb-1 text-[12px] font-medium text-faint">앱</p>
            {APPS.map((app) => (
              <Link
                key={app.id}
                to={`/apps/${app.id}`}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-[var(--hover)]"
              >
                <AppIcon icon={app.icon} bg={app.iconBg} size={30} />
                <span className="text-[14px]">{app.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

function NavLink({ to, label }: { to: string; label: string }) {
  const active = useIsActive(to)
  return (
    <Link
      to={to}
      className={`inline-flex h-9 items-center rounded-md px-3 text-[14px] transition-colors ${
        active ? 'font-medium text-accent' : 'text-muted hover:text-body'
      }`}
    >
      {label}
    </Link>
  )
}
