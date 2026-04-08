import type { ReactNode } from 'react'

import { appBrand } from '@shared/constants/app-brand'

type AuthShellProps = {
  eyebrow: string
  title: string
  description: string
  highlights: string[]
  showcase?: ReactNode
  children: ReactNode
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M5.5 10.5L8.25 13.25L14.5 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AuthShell({
  eyebrow,
  title,
  description,
  highlights,
  showcase,
  children,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="grid min-h-screen xl:grid-cols-[minmax(0,1fr)_minmax(350px,400px)]">
        <section className="relative hidden overflow-hidden bg-slate-950 xl:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(56,189,248,0.16),transparent_24%),radial-gradient(circle_at_62%_38%,rgba(37,99,235,0.14),transparent_30%),radial-gradient(circle_at_78%_72%,rgba(15,23,42,0.18),transparent_30%),linear-gradient(180deg,rgba(8,15,35,0.98),rgba(2,6,23,1))]" />
          <div className="absolute inset-y-0 right-0 w-px bg-white/10" />
          <div className="absolute inset-x-0 top-[28%] h-px bg-gradient-to-r from-transparent via-cyan-300/12 to-transparent" />

          <div className="relative flex w-full flex-col px-9 py-8 xl:px-11">
            <div className="max-w-[760px]">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 backdrop-blur-sm">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-sm font-semibold tracking-[0.14em] text-cyan-200">
                  {appBrand.shortName}
                </span>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300/90">
                    {appBrand.clientName}
                  </p>
                  <p className="truncate text-sm text-slate-300">{appBrand.categoryLabel}</p>
                </div>
              </div>

              <p className="mt-10 text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-300/90">
                {eyebrow}
              </p>
              <h1 className="mt-4 max-w-[680px] text-[clamp(2.6rem,4vw,3.45rem)] font-semibold leading-[1.05] tracking-tight text-white">
                {title}
              </h1>

              <div className="mt-6 h-px w-full max-w-[680px] bg-gradient-to-r from-white/12 via-cyan-300/18 to-transparent" />

              <p className="mt-6 max-w-[620px] text-[0.94rem] leading-7 text-slate-200 xl:text-[1rem]">
                {description}
              </p>

              <div className="mt-6 space-y-2.5">
                {highlights.map((highlight) => (
                  <div key={highlight} className="flex items-center gap-4 text-slate-200">
                    <span className="text-cyan-300">
                      <CheckIcon />
                    </span>
                    <span className="text-[0.9rem] leading-6 xl:text-[0.96rem]">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 max-w-[760px]">{showcase}</div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-8 sm:px-6 xl:px-7">
          <div className="app-enter-soft w-full max-w-[380px]">{children}</div>
        </section>
      </div>
    </div>
  )
}
