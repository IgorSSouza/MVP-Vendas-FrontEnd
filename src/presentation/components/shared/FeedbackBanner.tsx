import { InlineSpinner } from '@presentation/components/shared/InlineSpinner'

type FeedbackBannerProps = {
  type: 'success' | 'error'
  message: string
}

export function FeedbackBanner({ type, message }: FeedbackBannerProps) {
  const isSuccess = type === 'success'

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={[
        'rounded-2xl border px-4 py-3 text-sm font-medium shadow-sm',
        isSuccess
          ? 'border-emerald-200 bg-emerald-50/90 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200'
          : 'border-rose-200 bg-rose-50/90 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <span
          className={[
            'mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold',
            isSuccess
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200'
              : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200',
          ].join(' ')}
        >
          {isSuccess ? '✓' : '!'}
        </span>
        <span className="flex-1 leading-6">{message}</span>
        <InlineSpinner className="h-3.5 w-3.5 animate-none opacity-0" />
      </div>
    </div>
  )
}
