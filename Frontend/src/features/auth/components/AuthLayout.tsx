import type { ReactNode } from 'react'

interface AuthLayoutProps {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}

const models = [
  { name: 'GROQ', tone: 'text-amber-200', glow: 'bg-amber-300' },
  { name: 'COHERE', tone: 'text-violet-200', glow: 'bg-violet-300' },
  { name: 'NEMOTRON', tone: 'text-emerald-200', glow: 'bg-emerald-300' },
]

function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#09090b] text-zinc-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(111,91,77,0.16),transparent_38%),radial-gradient(ellipse_at_85%_42%,rgba(91,73,112,0.1),transparent_35%)]"
      />

      <div className="relative mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[1.04fr_0.96fr]">
        <section className="relative flex flex-col overflow-hidden border-b border-white/[0.07] px-6 pb-9 pt-7 sm:px-10 sm:pt-9 lg:min-h-screen lg:border-b-0 lg:border-r lg:px-12 lg:py-10 xl:px-[5.5rem]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] shadow-[0_0_32px_rgba(255,255,255,0.04)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="size-5 text-zinc-100"
              >
                <path
                  d="M12 3.5 14.1 9.9 20.5 12l-6.4 2.1L12 20.5l-2.1-6.4L3.5 12l6.4-2.1L12 3.5Z"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinejoin="round"
                />
                <path
                  d="m18.5 3 .75 2.25L21.5 6l-2.25.75L18.5 9l-.75-2.25L15.5 6l2.25-.75L18.5 3Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-[0.08em] text-zinc-100">
              AI BATTLE ARENA
            </span>
          </div>

          <div className="mx-auto flex w-full max-w-[570px] flex-1 flex-col justify-center py-10 lg:py-14">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.17em] text-zinc-400">
              <span className="size-1.5 rounded-full bg-amber-200/80 shadow-[0_0_10px_rgba(253,230,138,0.55)]" />
              Intelligence, in competition
            </div>
            <h1 className="max-w-[540px] text-[2.45rem] font-medium leading-[1.08] tracking-[-0.055em] text-white sm:text-5xl lg:text-[3.45rem]">
              One question.
              <br />
              Many brilliant minds.
            </h1>
            <p className="mt-5 max-w-[440px] text-sm leading-7 text-zinc-400 sm:text-base">
              Put leading AI models to the test. Compare their thinking and see
              which answer rises above the rest.
            </p>

            <div
              aria-hidden="true"
              className="relative mt-9 rounded-2xl border border-white/[0.09] bg-[#0e0e11]/80 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:mt-12 sm:p-5"
            >
              <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                  The arena
                </span>
                <span className="rounded-md border border-white/[0.08] px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-zinc-500">
                  01 prompt · 03 perspectives
                </span>
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
                <div className="space-y-3">
                  {models.slice(0, 2).map((model) => (
                    <div
                      key={model.name}
                      className="flex min-w-0 items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-3"
                    >
                      <span className={`size-2 shrink-0 rounded-full ${model.glow} shadow-[0_0_12px_currentColor] ${model.tone}`} />
                      <span className="truncate text-[10px] font-medium tracking-[0.12em] text-zinc-300 sm:text-[11px]">
                        {model.name}
                      </span>
                      <span className="ml-auto h-px w-5 shrink-0 bg-white/10 sm:w-8" />
                    </div>
                  ))}
                </div>

                <div className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-[#17171b] text-[10px] font-semibold tracking-[0.14em] text-zinc-500 sm:size-12">
                  VS
                </div>

                <div className="relative rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.025] p-3 sm:p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-zinc-300" />
                    <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-400">
                      Model response
                    </span>
                  </div>
                  <div className="space-y-2">
                    <span className="block h-1.5 w-full rounded-full bg-white/15" />
                    <span className="block h-1.5 w-4/5 rounded-full bg-white/10" />
                    <span className="block h-1.5 w-3/5 rounded-full bg-white/[0.07]" />
                  </div>
                  <div className="mt-4 flex items-center gap-2 border-t border-white/[0.07] pt-3">
                    <span className="size-1.5 rounded-full bg-violet-200/80" />
                    <span className="text-[9px] tracking-[0.12em] text-zinc-400">
                      AI MODEL
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-zinc-600">
                <span className="h-px flex-1 bg-white/[0.07]" />
                compare · evaluate · discover
                <span className="h-px flex-1 bg-white/[0.07]" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-zinc-500">
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="size-4 text-zinc-400"
              >
                <path
                  d="m5 10.5 3.1 3.1L15.5 6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
              Better answers emerge from different perspectives.
            </div>
          </div>

          <p className="hidden text-[11px] tracking-wide text-zinc-600 lg:block">
            THINK DIFFERENTLY. FIND THE STRONGER ANSWER.
          </p>
        </section>

        <section className="flex min-h-[540px] items-center justify-center px-6 py-12 sm:px-10 lg:min-h-screen lg:px-12 xl:px-20">
          <div className="w-full max-w-[420px]">
            <div className="mb-8">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                Your arena awaits
              </p>
              <h2 className="text-3xl font-medium tracking-[-0.04em] text-white sm:text-[2.1rem]">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {description}
              </p>
            </div>

            {children}
            <div className="mt-8 border-t border-white/[0.07] pt-6 text-center text-sm text-zinc-500">
              {footer}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default AuthLayout
