type ProductStatusBadgeProps = {
  isActive: boolean
}

export function ProductStatusBadge({ isActive }: ProductStatusBadgeProps) {
  return (
    <span
      className={[
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
        isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600',
      ].join(' ')}
    >
      {isActive ? 'Ativo' : 'Inativo'}
    </span>
  )
}
