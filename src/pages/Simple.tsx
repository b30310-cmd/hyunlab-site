import { Mail, Github, MessageSquare, Bug, Lightbulb } from 'lucide-react'
import { Container, LinkButton, Section, SectionTitle, ICON } from '@/components/ui'
import { APPS } from '@/data/apps'

// ============================================================
// Blog · About · Contact
// 내용이 단순한 페이지들을 한 파일에 모았습니다.
// ============================================================

const EMAIL = 'b30310@gmail.com'

// ------------------------------------------------------------
// Blog — 아직 글이 없으므로 준비 중 안내를 보여줍니다.
// 글을 올리려면 아래 POSTS 배열에 항목을 추가하세요.
// ------------------------------------------------------------
interface Post {
  title: string
  date: string
  summary: string
  url: string
}

const POSTS: Post[] = [
  // 예시)
  // { title: 'HYUNLAB Memo를 만들며', date: '2026-08-01', summary: '메모 앱을 만든 이유', url: 'https://...' },
]

export function BlogPage() {
  return (
    <Section className="!pt-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-[32px] font-bold tracking-tight sm:text-[40px]">Blog</h1>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            앱을 만들며 겪은 이야기와 기록을 남깁니다.
          </p>
        </div>

        {POSTS.length === 0 ? (
          <div className="card mx-auto mt-12 max-w-2xl p-12 text-center">
            <p className="text-[16px] font-medium">아직 등록된 글이 없습니다</p>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              첫 글을 준비하고 있습니다. 조금만 기다려 주세요.
            </p>
          </div>
        ) : (
          <div className="mx-auto mt-12 max-w-2xl space-y-4">
            {POSTS.map((p) => (
              <a
                key={p.url}
                href={p.url}
                target="_blank"
                rel="noreferrer noopener"
                className="card card-hover block p-6"
              >
                <p className="text-[13px] text-faint">{p.date}</p>
                <h2 className="mt-1 text-[17px] font-semibold">{p.title}</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{p.summary}</p>
              </a>
            ))}
          </div>
        )}
      </Container>
    </Section>
  )
}

// ------------------------------------------------------------
// About
// ------------------------------------------------------------
export function AboutPage() {
  const webCount = APPS.filter((a) => a.type === 'web').length
  const mobileCount = APPS.filter((a) => a.type === 'mobile').length

  return (
    <>
      <Section className="!pt-20 !pb-10">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-[32px] font-bold tracking-tight sm:text-[40px]">About</h1>
            <p className="mt-5 text-[17px] leading-[1.85] text-muted">
              HYUNLAB은 일상과 업무에 필요한 도구를 직접 만들어 공개하는 1인 개발 공간입니다.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="!py-10">
        <Container>
          <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-3">
            <Stat value={String(webCount)} label="웹 서비스" />
            <Stat value={String(mobileCount)} label="모바일 앱" />
            <Stat value="무료" label="모든 앱" />
          </div>
        </Container>
      </Section>

      <Section className="!py-10">
        <Container>
          <div className="mx-auto max-w-2xl space-y-8">
            <Block
              title="이런 것을 중요하게 생각합니다"
              items={[
                '실행하면 바로 쓸 수 있을 것 — 로딩과 설정으로 시간을 뺏지 않습니다.',
                '기능은 많아도 화면은 단순할 것 — 자주 쓰는 것만 앞에 둡니다.',
                '내 데이터는 내 기기에 — 서버로 보내지 않고, 계정도 만들지 않습니다.',
                '광고를 넣지 않을 것 — 쓰는 사람의 집중을 방해하지 않습니다.',
              ]}
            />
            <Block
              title="앞으로의 계획"
              items={[
                '웹에서 바로 쓰는 서비스를 늘려 갑니다.',
                '기존 앱은 사용자 의견을 받아 계속 다듬습니다.',
                '만드는 과정은 Blog에 기록으로 남깁니다.',
              ]}
            />
          </div>
        </Container>
      </Section>

      <Section className="!pt-6">
        <Container>
          <div className="card mx-auto max-w-2xl p-10 text-center">
            <h2 className="text-[20px] font-bold tracking-tight">궁금한 점이 있으신가요?</h2>
            <p className="mt-2 text-[14px] text-muted">언제든 편하게 연락 주세요.</p>
            <LinkButton to="/contact" variant="primary" size="lg" className="mt-6">
              문의하기
            </LinkButton>
          </div>
        </Container>
      </Section>
    </>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="card p-6 text-center">
      <p className="text-[28px] font-bold tracking-tight text-accent">{value}</p>
      <p className="mt-1 text-[14px] text-muted">{label}</p>
    </div>
  )
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="text-[19px] font-bold tracking-tight">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((t) => (
          <li key={t} className="flex gap-3 text-[15px] leading-relaxed text-muted">
            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ------------------------------------------------------------
// Contact
// ------------------------------------------------------------
export function ContactPage() {
  const mail = (subject: string) =>
    `mailto:${EMAIL}?subject=${encodeURIComponent(`[HYUNLAB] ${subject}`)}`

  const items = [
    {
      icon: <MessageSquare size={ICON.lg} />,
      title: '일반 문의',
      desc: '앱 사용법이나 궁금한 점을 알려주세요.',
      to: mail('문의'),
    },
    {
      icon: <Bug size={ICON.lg} />,
      title: '버그 신고',
      desc: '동작이 이상한 부분을 알려주시면 빠르게 확인하겠습니다.',
      to: mail('버그 신고'),
    },
    {
      icon: <Lightbulb size={ICON.lg} />,
      title: '기능 제안',
      desc: '있으면 좋겠다 싶은 기능을 제안해 주세요.',
      to: mail('기능 제안'),
    },
  ]

  return (
    <Section className="!pt-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-[32px] font-bold tracking-tight sm:text-[40px]">Contact</h1>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            의견은 언제나 환영합니다. 보내주신 내용은 다음 업데이트에 반영됩니다.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-3">
          {items.map((i) => (
            <a key={i.title} href={i.to} className="card card-hover block p-6">
              <span className="text-accent">{i.icon}</span>
              <h2 className="mt-3 text-[16px] font-semibold">{i.title}</h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{i.desc}</p>
            </a>
          ))}
        </div>

        <div className="card mx-auto mt-8 max-w-4xl p-8 text-center">
          <p className="text-[14px] text-muted">직접 연락하시려면</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <LinkButton to={`mailto:${EMAIL}`} variant="primary" size="lg">
              <Mail size={ICON.md} />
              {EMAIL}
            </LinkButton>
            <LinkButton to="https://github.com/b30310-cmd" variant="secondary" size="lg">
              <Github size={ICON.md} />
              GitHub
            </LinkButton>
          </div>
        </div>
      </Container>
    </Section>
  )
}
