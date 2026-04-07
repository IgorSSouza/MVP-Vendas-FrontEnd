import { InlineSpinner } from '@presentation/components/shared/InlineSpinner'

type LoadingNoticeProps = {
  message: string
}

export function LoadingNotice({ message }: LoadingNoticeProps) {
  return (
    <div className="rounded-2xl border border-cyan-200/80 bg-cyan-50/80 px-4 py-3 text-sm font-medium text-cyan-900 shadow-sm transition-all duration-200">
      <div className="flex items-center gap-3">
        <InlineSpinner className="h-4 w-4 text-cyan-700" />
        <span>{message}</span>
      </div>
    </div>
  )
}
