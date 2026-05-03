import { useState } from 'react'
import ErrorAlert from '../components/common/ErrorAlert.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import { submitPrompt } from '../services/promptService.js'
import { useToast } from '../hooks/useToast.jsx' // Changed to .jsx
import { useAsyncAction } from '../hooks/useAsyncAction.js'

const defaultForm = {
  promptText: '',
  category: 'GENERAL',
}

function DashboardPage() {
  const [formState, setFormState] = useState(defaultForm)
  const [result, setResult] = useState(null)
  const [localError, setLocalError] = useState('')
  const { success } = useToast();

  const { execute: executeSubmitPrompt, isLoading: isSubmitting, error: submitError } = useAsyncAction(
    submitPrompt,
    'Prompt submitted successfully!'
  );

  const handleSubmit = async (event, isRetry = false) => {
    event?.preventDefault()
    setLocalError('')
    if (!isRetry) {
      setResult(null)
    }

    try {
      const response = await executeSubmitPrompt(formState);
      setResult(response);
      if (response.status === 'FAILED') {
        setLocalError(response.errorMessage || 'AI generation failed due to an unknown error.');
      } else if (response.status === 'COMPLETED') {
        success('Prompt submitted and AI response received!');
      }
    } catch (err) {
      setLocalError(err.message || 'Unable to evaluate prompt. Please check your input.');
    }
  }

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
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
        <h3 className="text-xl font-semibold text-white">Prompt Evaluation</h3>
        <p className="mt-2 text-sm text-slate-400">
          Submit a prompt to Gemini through your Spring Boot API.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="promptText" className="mb-2 block text-sm text-slate-300">
              Prompt
            </label>
            <textarea
              id="promptText"
              rows={5}
              value={formState.promptText}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, promptText: event.target.value }))
              }
              required
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="category" className="mb-2 block text-sm text-slate-300">
              Category
            </label>
            <select
              id="category"
              value={formState.category}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, category: event.target.value }))
              }
              className="w-full"
            >
              <option value="GENERAL">General</option>
              <option value="CODING">Coding</option>
              <option value="REASONING">Reasoning</option>
              <option value="SAFETY">Safety</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <ErrorAlert message={localError || submitError} />
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-cyan-600 px-5 py-2.5 font-medium text-white transition hover:bg-cyan-700 disabled:opacity-60"
          >
            {isSubmitting ? <LoadingSpinner label="Submitting..." /> : 'Submit Prompt'}
          </button>
        </form>
      </section>

      {result && (
        <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
          <h4 className="text-xl font-semibold text-white flex items-center gap-2">
            Gemini Response {getStatusBadge(result.status)}
          </h4>
          <div className="mt-3">
            {result.status === 'PENDING' && (
              <LoadingSpinner label="AI is thinking..." />
            )}
            {result.status === 'COMPLETED' && (
              <p className="whitespace-pre-wrap text-sm text-slate-200">
                {result.aiResponse ?? 'No response found in payload.'}
              </p>
            )}
            {result.status === 'FAILED' && (
              <div className="flex flex-col items-start gap-3">
                <ErrorAlert message={result.errorMessage || 'AI generation failed.'} />
                <button
                  onClick={() => handleSubmit(null, true)}
                  disabled={isSubmitting}
                  className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  {isSubmitting ? <LoadingSpinner label="Retrying..." /> : 'Retry AI Generation'}
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

export default DashboardPage
