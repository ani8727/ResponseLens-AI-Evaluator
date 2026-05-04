import React, { useState } from "react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import useAsyncAction from "../hooks/useAsyncAction";
import axios from "../api/axiosClient";

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [responseText, setResponseText] = useState(null);
  const { execute, loading, error } = useAsyncAction();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setResponseText(null);

    if (!prompt || !prompt.trim()) return;

    const payload = {
      promptText: prompt,
      category: "GENERAL",
    };

    console.log("POST /prompts payload:", payload);

    const result = await execute(() => axios.post("/prompts", payload), {
      successMessage: "Prompt sent",
    });

    if (result.success) {
      const data = result.data?.data || result.data;

      console.log("API RESPONSE:", data);

      // ✅ Handle your backend structure
      if (data?.status === "FAILED") {
        setResponseText(data?.errorMessage || "AI failed");
      } else {
        setResponseText(
          data?.aiResponse ||
          data?.response ||
          data?.result ||
          "No response returned"
        );
      }
    }
  };

  return (
    <div className="p-6 container-centered">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Prompt
              </label>
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt for the AI"
                className="min-h-[48px]"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    Sending... <Loader className="!w-4 !h-4" />
                  </span>
                ) : (
                  "Send"
                )}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setPrompt("");
                  setResponseText(null);
                }}
              >
                Clear
              </Button>
            </div>

            {error && (
              <div className="text-sm text-red-600">
                {error.message || error}
              </div>
            )}
          </form>
        </Card>

        <div className="mt-6">
          {loading && !responseText ? (
            <Card className="flex items-center justify-center">
              <Loader size={4} />
            </Card>
          ) : responseText ? (
            <Card>
              <h2 className="text-lg font-semibold mb-2">
                AI Response
              </h2>
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-100">
                {responseText}
              </pre>
            </Card>
          ) : (
            <EmptyState
              title="No response yet"
              description="Send a prompt to receive an AI-generated response."
            />
          )}
        </div>
      </div>
    </div>
  );
}