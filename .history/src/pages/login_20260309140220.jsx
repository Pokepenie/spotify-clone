import { loginUrl } from "../api/spotify"

export default function Login() {
  return (
    <div className="login">

      <h1>Spotify Clone</h1>

      <a href={loginUrl}>
        <button>Login with Spotify</button>
      </a>

    </div>
  )
}