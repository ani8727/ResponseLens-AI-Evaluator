import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useAsyncAction from "../hooks/useAsyncAction";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { execute, loading } = useAsyncAction();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!name || !email || !password) {
      setFormError("Name, email and password are required");
      return;
    }
    if (password !== confirm) {
      setFormError("Passwords do not match");
      return;
    }

    const res = await execute(() => signup({ name, email, password }), {
      successMessage: "Account created",
    });

    if (res.success) {
      navigate("/dashboard");
    } else {
      const msg = res.error?.message || res.error || "Signup failed";
      setFormError(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Create account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
              placeholder="••••••••"
            />
          </div>

          {formError && <div className="text-sm text-red-600">{formError}</div>}

          <div className="flex items-center justify-between">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </Button>
            <Link to="/login" className="text-sm text-blue-600">
              Already have an account?
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
