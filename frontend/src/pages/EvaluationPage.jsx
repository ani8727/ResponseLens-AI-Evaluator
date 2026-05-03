import { useState } from 'react'
import ErrorAlert from '../components/common/ErrorAlert.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import { createEvaluation } from '../services/evaluationService.js'
import { useToast } from '../hooks/useToast.jsx' // Changed to .jsx
import { useAsyncAction } from '../hooks/useAsyncAction.js'

const defaultForm = {
  promptId: '',
  accuracyScore: '',
  relevanceScore: '',
  safetyScore: '',
  clarityScore: '',
  status: 'COMPLETED',
  feedback: '',
}

function EvaluationPage() {
  const [formState, setFormState] = useState(defaultForm)
  const [localError, setLocalError] = useState('')

  const { execute: executeCreateEvaluation, isLoading: isSubmitting, error: submitError } = useAsyncAction(
    createEvaluation,
    'Evaluation submitted successfully!'
  );

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLocalError('');
    try {
      await executeCreateEvaluation({
        ...formState,
        promptId: Number(formState.promptId),
        accuracyScore: Number(formState.accuracyScore),
        relevanceScore: Number(formState.relevanceScore),
        safetyScore: Number(formState.safetyScore),
        clarityScore: Number(formState.clarityScore),
      });
      setFormState(defaultForm)
    } catch (err) {
      setLocalError(err.message || 'Unable to submit evaluation.');
    }
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
      <h3 className="text-xl font-semibold text-white">Create Evaluation</h3>
      <p className="mt-2 text-sm text-slate-400">Submit manual evaluation scores for a prompt.</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <Field
          label="Prompt ID"
          name="promptId"
          value={formState.promptId}
          onChange={handleChange}
          placeholder="Enter prompt ID"
        />
        <Field
          label="Accuracy Score"
          name="accuracyScore"
          type="number"
          min="1"
          max="5"
          value={formState.accuracyScore}
          onChange={handleChange}
          placeholder="1-5"
        />
        <Field
          label="Relevance Score"
          name="relevanceScore"
          type="number"
          min="1"
          max="5"
          value={formState.relevanceScore}
          onChange={handleChange}
          placeholder="1-5"
        />
        <Field
          label="Safety Score"
          name="safetyScore"
          type="number"
          min="1"
          max="5"
          value={formState.safetyScore}
          onChange={handleChange}
          placeholder="1-5"
        />
        <Field
          label="Clarity Score"
          name="clarityScore"
          type="number"
          min="1"
          max="5"
          value={formState.clarityScore}
          onChange={handleChange}
          placeholder="1-5"
        />
        <div>
          <label className="mb-2 block text-sm text-slate-300" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formState.status}
            onChange={handleChange}
            className="w-full"
          >
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="FLAGGED">Flagged</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-slate-300" htmlFor="feedback">
            Feedback
          </label>
          <textarea
            id="feedback"
            name="feedback"
            value={formState.feedback}
            onChange={handleChange}
            rows={5}
            required
            placeholder="Write evaluator feedback..."
            className="w-full"
          />
        </div>
        <div className="space-y-3 md:col-span-2">
          <ErrorAlert message={localError || submitError} />
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-cyan-600 px-5 py-2.5 font-medium text-white transition hover:bg-cyan-700 disabled:opacity-60"
          >
            {isSubmitting ? <LoadingSpinner label="Submitting..." /> : 'Submit Evaluation'}
          </button>
        </div>
      </form>
    </section>
  )
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  min,
  max,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  )
}

export default EvaluationPage
