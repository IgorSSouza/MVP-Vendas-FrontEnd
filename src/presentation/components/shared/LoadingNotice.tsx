type LoadingNoticeProps = {
  message: string
}

export function LoadingNotice({ message }: LoadingNoticeProps) {
  return (
    <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-800">
      {message}
    </div>
  )
}
