export async function getMe() {
  const res = await fetch("http://localhost:8000/auth/me", {
    credentials: "include",
  });
  return res.json();
}