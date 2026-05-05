import axios from "../api/axiosClient";

export async function loginUser({ email, password }) {
  const res = await axios.post("/auth/login", { email, password });
  return res.data;
}

export async function signupUser(payload) {
  const res = await axios.post("/auth/signup", payload);
  return res.data;
}