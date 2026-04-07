type ProductStatusBadgeProps = {
  isActive: boolean
}

export function ProductStatusBadge({ isActive }: ProductStatusBadgeProps) {
  return (
    <span
      className={[
        'app-badge',
        isActive
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-slate-200 bg-slate-100 text-slate-600',
      ].join(' ')}
    >
      {isActive ? 'Ativo' : 'Inativo'}
    </span>
  )
}
