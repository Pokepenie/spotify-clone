import axios from "axios"

const CLIENT_ID = "65ab0a32e29848beaff67950ccad6448"
const CLIENT_SECRET = "b0f8d97527584c5b85d061b6ddc318e0" 
const REDIRECT_URI = "http://127.0.0.1:5173"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "code"

const SCOPES = [
  "user-read-private",
  "playlist-read-private"
]

export const loginUrl =
`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}
&redirect_uri=${encodeURIComponent(REDIRECT_URI)}
&response_type=${RESPONSE_TYPE}
&scope=${SCOPES.join("%20")}`

export async function getPlaylists(token){
  const res = await axios.get(
    "https://api.spotify.com/v1/me/playlists",
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  )
  return res.data
}

export async function getPlaylist(token,id){
  const res = await axios.get(
    `https://api.spotify.com/v1/playlists/${id}`,
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  )
  return res.data
}