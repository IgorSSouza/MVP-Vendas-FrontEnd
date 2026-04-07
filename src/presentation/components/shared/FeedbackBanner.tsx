type FeedbackBannerProps = {
  type: 'success' | 'error'
  message: string
}

export function FeedbackBanner({ type, message }: FeedbackBannerProps) {
  return (
    <div
      className={[
        'rounded-2xl px-4 py-3 text-sm font-medium',
        type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
      ].join(' ')}
    >
      {message}
    </div>
  )
}
