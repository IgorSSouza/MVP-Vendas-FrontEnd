import { InlineSpinner } from '@presentation/components/shared/InlineSpinner'

type FeedbackBannerProps = {
  type: 'success' | 'error'
  message: string
}

function SuccessIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M5.75 10.25L8.5 13L14.25 7.25"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M10 6.75V10.25M10 13.25H10.01M17 10A7 7 0 1 1 3 10A7 7 0 0 1 17 10Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
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
            'mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full',
            isSuccess
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200'
              : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200',
          ].join(' ')}
        >
          {isSuccess ? <SuccessIcon /> : <ErrorIcon />}
        </span>
        <span className="flex-1 leading-6">{message}</span>
        <InlineSpinner className="h-3.5 w-3.5 animate-none opacity-0" />
      </div>
    </div>
  )
}
