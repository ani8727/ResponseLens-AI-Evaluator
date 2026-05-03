import { useEffect, useState } from 'react'
import ErrorAlert from '../components/common/ErrorAlert.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import { fetchPromptHistory } from '../services/promptService.js'
import { useAsyncAction } from '../hooks/useAsyncAction.js'
import { useToast } from '../hooks/useToast.jsx' // Changed to .jsx

function PromptHistoryPage() {
  const [prompts, setPrompts] = useState([])
  const [page, setPage] = useState(0)
  const [size] = useState(6)
  const [totalPages, setTotalPages] = useState(1)
  const [localError, setLocalError] = useState('');

  const { execute: executeFetchHistory, isLoading, error: fetchError } = useAsyncAction(
    fetchPromptHistory,
    null
  );

  useEffect(() => {
    const loadHistory = async () => {
      setLocalError('');
      try {
        const response = await executeFetchHistory(page, size);
        setPrompts(response.content ?? response.items ?? []);
        setTotalPages(response.totalPages ?? 1);
      } catch (err) {
        setLocalError(err.message || 'Could not fetch prompt history.');
      }
    }

    loadHistory()
  }, [page, size, executeFetchHistory])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-200">🟡 PENDING</span>
      case 'COMPLETED':
        return <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-200">🟢 COMPLETED</span>
      case 'FAILED':
        return <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-200">🔴 FAILED</span>
      default:
        return null
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
        <h3 className="text-xl font-semibold text-white">Prompt History</h3>
        <p className="mt-2 text-sm text-slate-400">View previous prompts and Gemini outputs.</p>
      </section>

      {isLoading ? (
        <LoadingSpinner label="Loading prompt history..." />
      ) : (
        <>
          <ErrorAlert message={localError || fetchError} />
          <div className="grid gap-4 lg:grid-cols-2">
            {prompts.map((item, index) => (
              <article
                key={item.id ?? item.promptId ?? `${item.createdAt}-${index}`}
                className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-cyan-600/20 px-3 py-1 text-xs font-medium text-cyan-200">
                    {item.category}
                  </span>
                  {getStatusBadge(item.status)}
                  <span className="text-xs text-slate-500">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : 'No date available'}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-200">{item.promptText}</p>
                <p className="mt-3 rounded-lg bg-slate-950 p-3 text-sm text-slate-300">
                  {item.aiResponse}
                </p>
                {item.status === 'FAILED' && item.errorMessage && (
                  <ErrorAlert message={item.errorMessage} />
                )}
              </article>
            ))}
          </div>

          {!prompts.length && !localError && !fetchError && (
            <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-400">
              No prompts found yet.
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <button
              type="button"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium disabled:opacity-40 hover:bg-slate-800"
              disabled={page === 0}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <span className="text-sm text-slate-400">
              Page {page + 1} of {totalPages}
            </span>
            <button
              type="button"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium disabled:opacity-40 hover:bg-slate-800"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default PromptHistoryPage
