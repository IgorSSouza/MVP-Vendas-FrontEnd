type LoadingNoticeProps = {
  message: string
}

export function LoadingNotice({ message }: LoadingNoticeProps) {
  return (
    <div className="rounded-2xl border border-cyan-200/80 bg-cyan-50/80 px-4 py-3 text-sm font-medium text-cyan-900 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full bg-cyan-600 animate-pulse" />
        <span>{message}</span>
      </div>
    </div>
  )
}
