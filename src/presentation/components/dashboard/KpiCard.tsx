type KpiCardProps = {
  label: string
  value: string
  helper: string
}

export function KpiCard({ label, value, helper }: KpiCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
        {label}
      </p>
      <p className="mt-4 break-words text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-500">{helper}</p>
    </article>
  )
}
