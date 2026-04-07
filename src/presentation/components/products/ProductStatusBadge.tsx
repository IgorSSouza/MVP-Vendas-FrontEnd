type ProductStatusBadgeProps = {
  isActive: boolean
}

export function ProductStatusBadge({ isActive }: ProductStatusBadgeProps) {
  return (
    <span
      className={[
        'app-badge',
        isActive
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200'
          : 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
      ].join(' ')}
    >
      {isActive ? 'Ativo' : 'Inativo'}
    </span>
  )
}
