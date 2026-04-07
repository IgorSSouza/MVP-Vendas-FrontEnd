type FeedbackBannerProps = {
  type: 'success' | 'error'
  message: string
}

export function FeedbackBanner({ type, message }: FeedbackBannerProps) {
  return (
    <div
      className={[
        'rounded-2xl border px-4 py-3 text-sm font-medium shadow-sm',
        type === 'success'
          ? 'border-emerald-200 bg-emerald-50/90 text-emerald-800'
          : 'border-rose-200 bg-rose-50/90 text-rose-800',
      ].join(' ')}
    >
      {message}
    </div>
  )
}
