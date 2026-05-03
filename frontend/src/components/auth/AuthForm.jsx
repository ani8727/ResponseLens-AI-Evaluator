import ErrorAlert from '../common/ErrorAlert.jsx'
import LoadingSpinner from '../common/LoadingSpinner.jsx'

function AuthForm({
  title,
  subtitle,
  fields,
  formState,
  setFormState,
  onSubmit,
  error,
  isSubmitting,
  footer,
}) {
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="mt-1 text-sm text-slate-400">{subtitle}</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="mb-2 block text-sm text-slate-300">
              {field.label}
            </label>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formState[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              required
              className="w-full"
            />
          </div>
        ))}

        <ErrorAlert message={error} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white transition hover:bg-cyan-700 disabled:opacity-60"
        >
          {isSubmitting ? <LoadingSpinner label="Processing..." /> : 'Submit'}
        </button>
      </form>

      {footer && (
        <p className="mt-6 text-center text-sm text-slate-400">{footer}</p>
      )}
    </div>
  )
}

export default AuthForm
