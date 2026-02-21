export async function getMe() {
  const res = await fetch("https://boba-production-751f.up.railway.app:8000/auth/me", {
    credentials: "include",
  });
  return res.json();
}