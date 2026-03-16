import { loginUrl } from "../api/spotify"

export default function Login() {

  console.log("LOGIN URL:", loginUrl)

  return (
    <div>
      <h1>Spotify Clone</h1>

      <a href={loginUrl}>
        <button>Login with Spotify</button>
      </a>

    </div>
  )
}