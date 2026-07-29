import { useEffect, useState, createContext, useContext, type ReactNode } from 'react'

// ============================================================
// 실제 주소 라우터 (History API)
//
// 주소 예) https://hyunlab.com/apps/hyunlab-memo
//
// 이전에는 해시(#) 방식을 썼습니다.
//   GitHub Pages 같은 정적 호스팅은 서버 설정을 손댈 수 없어서
//   /apps/xxx 로 새로고침하면 404가 나기 때문입니다.
//
// 이제 Vercel/Netlify로 정식 운영하므로 진짜 주소를 씁니다.
//   · 링크를 공유했을 때 주소가 자연스럽습니다
//   · 검색 엔진이 페이지별로 인식합니다 (SEO)
//   · vercel.json / netlify.toml 에 새로고침 시 index.html로
//     돌려보내는 규칙(SPA rewrite)을 넣어 404를 방지합니다.
// ============================================================

interface RouterValue {
  /** 현재 경로 (예: '/apps/hyunlab-memo') */
  path: string
  /** 페이지 이동 */
  navigate: (to: string) => void
}

const RouterContext = createContext<RouterValue>({ path: '/', navigate: () => {} })

function readPath(): string {
  return window.location.pathname || '/'
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(readPath)

  useEffect(() => {
    const onChange = () => {
      setPath(readPath())
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
    // 브라우저 뒤로/앞으로 가기
    window.addEventListener('popstate', onChange)
    return () => window.removeEventListener('popstate', onChange)
  }, [])

  const navigate = (to: string) => {
    if (to === window.location.pathname) return
    window.history.pushState({}, '', to)
    setPath(to)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>
}

export const useRouter = () => useContext(RouterContext)

/**
 * 내부 링크.
 * 외부 주소(http로 시작)면 새 탭으로 엽니다.
 * 내부 주소는 새로고침 없이 이동합니다 (History API).
 */
export function Link({
  to,
  children,
  className = '',
  onClick,
}: {
  to: string
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  const { navigate } = useRouter()
  const external = /^https?:\/\//.test(to)

  if (external) {
    return (
      <a href={to} target="_blank" rel="noreferrer noopener" className={className} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        // 새 탭으로 열기(Ctrl/Cmd+클릭, 가운데 클릭)는 그대로 두고
        // 일반 클릭만 History API로 가로챕니다.
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        navigate(to)
        onClick?.()
      }}
    >
      {children}
    </a>
  )
}

/** 현재 경로가 주어진 경로로 시작하는지 (메뉴 활성 표시용) */
export function useIsActive(prefix: string) {
  const { path } = useRouter()
  if (prefix === '/') return path === '/'
  return path === prefix || path.startsWith(prefix + '/')
}
