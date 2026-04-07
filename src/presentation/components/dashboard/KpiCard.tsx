type KpiCardProps = {
  label: string
  value: string
  helper: string
}

export function KpiCard({ label, value, helper }: KpiCardProps) {
  return (
    <article className="app-surface p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
        {label}
      </p>
      <p className="mt-4 break-words text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{helper}</p>
    </article>
  )
}
