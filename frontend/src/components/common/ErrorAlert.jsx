function ErrorAlert({ message }) {
  if (!message) return null

  return (
    <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">
      {message}
    </div>
  )
}

export default ErrorAlert
