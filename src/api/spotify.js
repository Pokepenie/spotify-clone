const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const redirectUri = import.meta.env.VITE_REDIRECT_URI

const scopes = [
"user-read-private",
"user-read-email",
"streaming",
"user-read-playback-state",
"user-modify-playback-state"
]

export const loginUrl =
`https://accounts.spotify.com/authorize
?client_id=${clientId}
&redirect_uri=${redirectUri}
&scope=${scopes.join("%20")}
&response_type=token
&show_dialog=true`