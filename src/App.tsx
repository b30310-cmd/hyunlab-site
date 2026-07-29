import { useEffect, useState } from 'react'
import { RouterProvider, useRouter } from '@/lib/router'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HomePage } from '@/pages/Home'
import { AppsPage } from '@/pages/Apps'
import { AppDetailPage } from '@/pages/AppDetail'
import { BlogPage, AboutPage, ContactPage } from '@/pages/Simple'
import { Container, LinkButton, Section } from '@/components/ui'

// ============================================================
// 앱 뼈대 — 주소에 따라 페이지를 골라 보여줍니다.
// ============================================================

const THEME_KEY = 'hyunlab-site:theme'

function Routes() {
  const { path } = useRouter()

  // /apps/{id} → 앱 상세
  const detail = path.match(/^\/apps\/(.+)$/)
  if (detail) return <AppDetailPage id={decodeURIComponent(detail[1])} />

  switch (path) {
    case '/':
      return <HomePage />
    case '/apps':
      return <AppsPage />
    case '/blog':
      return <BlogPage />
    case '/about':
      return <AboutPage />
    case '/contact':
      return <ContactPage />
    default:
      return <NotFound />
  }
}

function NotFound() {
  return (
    <Section className="!pt-24">
      <Container>
        <div className="py-20 text-center">
          <p className="text-[48px] font-bold tracking-tight text-faint">404</p>
          <p className="mt-3 text-[18px] font-medium">페이지를 찾을 수 없습니다</p>
          <p className="mt-2 text-[14px] text-muted">주소를 다시 확인해 주세요.</p>
          <LinkButton to="/" variant="primary" size="lg" className="mt-8">
            첫 화면으로
          </LinkButton>
        </div>
      </Container>
    </Section>
  )
}

export default function App() {
  // 테마: 저장된 값 → 없으면 시스템 설정을 따릅니다.
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  return (
    <RouterProvider>
      <div className="flex min-h-screen flex-col">
        <Header theme={theme} onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))} />
        <main className="flex-1">
          <Routes />
        </main>
        <Footer />
      </div>
    </RouterProvider>
  )
}
