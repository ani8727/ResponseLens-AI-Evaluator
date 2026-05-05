import { loginUser } from "../services/auth";

const login = async ({ email, password }) => {
  const data = await loginUser({ email, password });

  // ✅ store token
  localStorage.setItem("token", data.token);

  // ✅ store user
  localStorage.setItem("user", JSON.stringify(data.user));

  // ✅ update context state (if you have)
  setUser(data.user);

  return data; // IMPORTANT
};