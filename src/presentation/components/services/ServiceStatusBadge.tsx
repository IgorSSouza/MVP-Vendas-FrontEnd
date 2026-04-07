type ServiceStatusBadgeProps = {
  isActive: boolean
}

export function ServiceStatusBadge({ isActive }: ServiceStatusBadgeProps) {
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
