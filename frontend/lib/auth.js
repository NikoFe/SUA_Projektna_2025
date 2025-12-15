import axios from "axios";

export async function login(username, password) {
  const res = await axios.post(
    "https://ce6b9a7d2896.ngrok-free.app/login",
    { username, password }
  );

  const token = res.data.access_token;
  localStorage.setItem("access_token", token);

  return token;
}
