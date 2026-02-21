export default function Login() {
  const login = () => {
    window.location.href = "http://localhost:8000/auth/discord/login";
  };

  return <button onClick={login}>Login with Discord</button>;
}
