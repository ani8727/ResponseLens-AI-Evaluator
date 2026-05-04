import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import ToastProvider from "./components/ToastProvider";

// Moved the environment variable check here
const apiBase = import.meta.env.VITE_API_BASE_URL;

function showError(message) {
  const root = document.getElementById('root');
  root.innerHTML = '';
  const container = document.createElement('div');
  container.style.fontFamily = 'Inter, system-ui, Arial, sans-serif';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.minHeight = '100vh';
  container.style.padding = '1rem';
  container.innerHTML = `
    <div style="max-width:720px;text-align:center;">
      <h1 style="color:#b91c1c;">Configuration error</h1>
      <p style="color:#333;">${message}</p>
      <p style="color:#666;font-size:0.9rem;">Please set <strong>VITE_API_BASE_URL</strong> in your <code>.env</code> or environment.</p>
    </div>
  `;
  root.appendChild(container);
}

if (!apiBase) {
  showError('Missing required environment variable: VITE_API_BASE_URL');
  // Do not render the React app if the API base URL is missing
} else {
  createRoot(document.getElementById("root")).render(
    <ToastProvider>
      <App />
    </ToastProvider>,
  );
}