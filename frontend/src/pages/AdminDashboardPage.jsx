import { useEffect, useState } from 'react'
import ErrorAlert from '../components/common/ErrorAlert.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import { fetchDashboardSummary } from '../services/analyticsService.js'
import { useAsyncAction } from '../hooks/useAsyncAction.js'
import { useToast } from '../hooks/useToast.jsx' // Changed to .jsx

function AdminDashboardPage() {
  const [summary, setSummary] = useState(null)
  const [localError, setLocalError] = useState('');
  const { error: toastError } = useToast();

  const { execute: executeFetchSummary, isLoading, error: fetchError } = useAsyncAction(
    fetchDashboardSummary,
    null
  );

  useEffect(() => {
    const getSummary = async () => {
      setLocalError('');
      try {
        const data = await executeFetchSummary();
        setSummary(data);
      } catch (err) {
        setLocalError(err.message || 'Failed to fetch dashboard summary.');
      }
    }
    getSummary()
  }, [executeFetchSummary])

  if (isLoading) {
    return <LoadingSpinner label="Loading admin dashboard..." />
  }

  if (localError || fetchError) {
    return <ErrorAlert message={localError || fetchError} />
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
        <h3 className="text-xl font-semibold text-white">Admin Dashboard Overview</h3>
        <p className="mt-2 text-sm text-slate-400">Key metrics for the ResponseLens platform.</p>
      </section>

      {summary && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Users" value={summary.totalUsers} />
          <StatCard title="Total Prompts" value={summary.totalPrompts} />
          <StatCard title="Total Evaluations" value={summary.totalEvaluations} />
          <StatCard title="Avg. Accuracy" value={summary.avgAccuracy?.toFixed(2)} />
          <StatCard title="Avg. Relevance" value={summary.avgRelevance?.toFixed(2)} />
          <StatCard title="Avg. Clarity" value={summary.avgClarity?.toFixed(2)} />
          <StatCard title="Avg. Safety" value={summary.avgSafety?.toFixed(2)} />
        </div>
      )}
    </div>
  )
}

export default AdminDashboardPage
