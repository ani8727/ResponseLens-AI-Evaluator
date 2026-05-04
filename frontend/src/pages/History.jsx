import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import axios from "../api/axiosClient";
import useAsyncAction from "../hooks/useAsyncAction";

export default function History() {
  const [prompts, setPrompts] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(null);

  const { execute, loading, error } = useAsyncAction();

  const normalizeListPayload = (payload) => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.content)) return payload.content;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.data)) return payload.data;
    return [];
  };

  const fetchPrompts = async (p = page, s = size) => {
    const res = await execute(() =>
      axios.get("/prompts", { params: { page: p, size: s } }),
    );
    if (res.success) {
      const payload =
        res.data && res.data.data ? res.data.data : res.data || res;
      const list = normalizeListPayload(payload);
      setPrompts(list);

      const tp =
        (payload &&
          (payload.totalPages ??
            payload.total_pages ??
            Math.ceil(
              (payload.total ?? payload.totalElements ?? list.length) / s,
            ))) ??
        null;
      setTotalPages(Number.isFinite(tp) ? tp : null);
    }
  };

  useEffect(() => {
    fetchPrompts(0, size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  const goPrev = () => {
    if (page <= 0) return;
    const next = page - 1;
    setPage(next);
    fetchPrompts(next, size);
  };

  const goNext = () => {
    const canNext =
      totalPages == null ? prompts.length === size : page + 1 < totalPages;
    if (!canNext) return;
    const next = page + 1;
    setPage(next);
    fetchPrompts(next, size);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">History</h1>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">Showing prompts</div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">Page size</label>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
        {error && <div className="text-sm text-red-600 mb-4">{error}</div>}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader />
          </div>
        ) : prompts.length === 0 ? (
          <div className="py-8">
            <EmptyState
              title="No prompts yet"
              description="You haven't created any prompts. Use the Dashboard to send one."
              action={
                <Button onClick={() => (window.location.href = "/dashboard")}>
                  Go to Dashboard
                </Button>
              }
            />
          </div>
        ) : (
          <div className="space-y-3">
            {prompts.map((p, idx) => {
              const promptText = p.prompt || p.input || p.query || p.text || "";
              const responseText =
                p.response ||
                p.result ||
                p.output ||
                p.answer ||
                p.output_text ||
                "";
              const created =
                p.createdAt || p.created_at || p.created || p.timestamp || null;

              return (
                <Card key={p.id ?? idx} className="p-4">
                  <div className="text-sm text-gray-500">
                    {created ? new Date(created).toLocaleString() : ""}
                  </div>
                  <div className="mt-2 font-medium">Prompt</div>
                  <div className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap">
                    {promptText}
                  </div>

                  <div className="mt-3 font-medium">AI Response</div>
                  <div className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap">
                    {responseText || "—"}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Page {page + 1}
            {totalPages ? ` of ${totalPages}` : ""}
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={goPrev} disabled={page <= 0 || loading}>
              Previous
            </Button>
            <Button
              onClick={goNext}
              disabled={
                loading ||
                (totalPages != null && page + 1 >= totalPages) ||
                (totalPages == null && prompts.length < size)
              }
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
