const CLIENT_ID = "65ab0a32e29848beaff67950ccad6448"
const REDIRECT_URI = "http://127.0.0.1:5173"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "code"
const SCOPES = [
  "user-read-private",
  "playlist-read-private"
]

export const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=user-read-private playlist-read-private user-read-email user-modify-playback-state user-read-playback-state`
import axios from "axios"

export const getPlaylists = async(token)=>{

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