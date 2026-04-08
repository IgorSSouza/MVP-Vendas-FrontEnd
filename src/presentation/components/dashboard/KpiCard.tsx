type KpiCardProps = {
  label: string
  value: string
  helper: string
  accent?: 'cyan' | 'emerald' | 'violet' | 'amber' | 'slate'
  size?: 'default' | 'featured'
}

const accentStyles = {
  cyan: 'from-cyan-500/20 to-transparent dark:from-cyan-400/20',
  emerald: 'from-emerald-500/20 to-transparent dark:from-emerald-400/20',
  violet: 'from-violet-500/20 to-transparent dark:from-violet-400/20',
  amber: 'from-amber-500/20 to-transparent dark:from-amber-400/20',
  slate: 'from-slate-500/15 to-transparent dark:from-slate-300/10',
} as const

export function KpiCard({
  label,
  value,
  helper,
  accent = 'slate',
  size = 'default',
}: KpiCardProps) {
  return (
    <article
      className={[
        'app-surface relative overflow-hidden',
        size === 'featured' ? 'p-7 sm:p-8' : 'p-6',
      ].join(' ')}
    >
      <div
        aria-hidden="true"
        className={[
          'pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b',
          accentStyles[accent],
        ].join(' ')}
      />
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <span
            aria-hidden="true"
            className={[
              'mt-0.5 inline-flex h-2.5 w-2.5 rounded-full shadow-sm',
              accent === 'cyan' && 'bg-cyan-400 shadow-cyan-400/40',
              accent === 'emerald' && 'bg-emerald-400 shadow-emerald-400/40',
              accent === 'violet' && 'bg-violet-400 shadow-violet-400/40',
              accent === 'amber' && 'bg-amber-400 shadow-amber-400/40',
              accent === 'slate' && 'bg-slate-300 shadow-slate-300/40 dark:bg-slate-500',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        </div>

        <p
          className={[
            'relative break-words font-semibold tracking-tight text-slate-950 dark:text-slate-50',
            size === 'featured'
              ? 'mt-6 text-3xl sm:text-[2.5rem]'
              : 'mt-4 text-2xl sm:text-3xl',
          ].join(' ')}
        >
          {value}
        </p>

        <p
          className={[
            'relative text-sm leading-6 text-slate-600 dark:text-slate-400',
            size === 'featured' ? 'mt-4 max-w-md' : 'mt-3',
          ].join(' ')}
        >
          {helper}
        </p>
      </div>
    </article>
  )
}
