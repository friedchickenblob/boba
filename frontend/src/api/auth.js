export async function getMe() {
  const res = await fetch("https://web-production-2a2a3.up.railway.app/auth/me", {
    credentials: "include",
  });
  console.log("auth/me response stuff", res.json());
  return res.json();
}