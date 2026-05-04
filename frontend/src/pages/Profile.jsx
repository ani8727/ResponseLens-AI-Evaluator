import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import useAsyncAction from "../hooks/useAsyncAction";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axiosClient";

export default function Profile() {
  const { user, logout, restoreSession, loading: authLoading } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const { execute, loading, error } = useAsyncAction();

  const handleUpdate = async (e) => {
    e?.preventDefault();
    if (!name || (!password && !confirm)) {
      // allow name-only update
    }
    if (password && password !== confirm) return;

    const payload = { name };
    if (password) payload.password = password;

    console.log("PUT /auth/profile payload:", payload);
    const res = await execute(() => axios.put("/auth/profile", payload), {
      successMessage: "Profile updated",
    });
    if (res.success) {
      // refresh session
      await restoreSession();
    }
  };

  const handleDeactivate = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate your account? This cannot be undone.",
    );
    if (!confirmed) return;

    console.log("DELETE /auth/deactivate");
    const res = await execute(() => axios.delete("/auth/deactivate"), {
      successMessage: "Account deactivated",
    });
    if (res.success) {
      logout();
      navigate("/login");
    }
  };

  if (authLoading) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center py-8">Loading profile...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <Card>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              New password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm password
            </label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
            <Button
              type="button"
              onClick={handleDeactivate}
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              Deactivate account
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
