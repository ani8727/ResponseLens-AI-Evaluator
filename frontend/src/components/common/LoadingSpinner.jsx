function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3 text-slate-400">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></span>
      <span className="text-sm">{label}</span>
    </div>
  )
}

export default LoadingSpinner
