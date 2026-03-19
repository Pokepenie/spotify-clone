const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = "http://127.0.0.1:5173"

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"

const SCOPES = [
  "user-read-private",
  "user-read-email",
  "streaming",
  "user-read-playback-state",
  "user-modify-playback-state",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-library-read",
  "user-library-modify",
  "user-read-recently-played"
]

export const loginUrl =
`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPES.join("%20")}&response_type=code`

const API_BASE = "https://api.spotify.com/v1"

const headers = (token) => ({ Authorization: `Bearer ${token}` })

async function safeJson(res) {
  const text = await res.text()
  try { return JSON.parse(text) } catch { return {} }
}

export async function getUser(token) {
  const res = await fetch(`${API_BASE}/me`, { headers: headers(token) })
  return safeJson(res)
}

export async function getPlaylists(token) {
  const res = await fetch(`${API_BASE}/me/playlists`, { headers: headers(token) })
  const data = await res.json()
  return data.items
}

export async function getPlaylist(token, id) {
  const res = await fetch(`${API_BASE}/playlists/${id}`, { headers: headers(token) })
  return safeJson(res)
}

export async function getLikedSongs(token) {
  const res = await fetch(`${API_BASE}/me/tracks?limit=50`, { headers: headers(token) })
  return safeJson(res)
}

export async function getRecentlyPlayed(token) {
  const res = await fetch(`${API_BASE}/me/player/recently-played?limit=8`, { headers: headers(token) })
  return safeJson(res)
}

export async function searchSpotify(token, query) {
  const res = await fetch(
    `${API_BASE}/search?q=${encodeURIComponent(query)}&type=track,artist,album&limit=10`,
    { headers: headers(token) }
  )
  return safeJson(res)
}

export async function getArtist(token, id) {
  const res = await fetch(`${API_BASE}/artists/${id}`, { headers: headers(token) })
  return safeJson(res)
}

export async function getArtistTopTracks(token, id) {
  const res = await fetch(`${API_BASE}/artists/${id}/top-tracks?market=US`, { headers: headers(token) })
  return safeJson(res)
}

export async function getAlbum(token, id) {
  const res = await fetch(`${API_BASE}/albums/${id}`, { headers: headers(token) })
  return safeJson(res)
}

export async function checkLiked(token, id) {
  const res = await fetch(`${API_BASE}/me/tracks/contains?ids=${id}`, { headers: headers(token) })
  const data = await res.json()
  return data[0]
}

export async function likeTrack(token, id) {
  await fetch(`${API_BASE}/me/tracks`, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({ ids: [id] })
  })
}

export async function unlikeTrack(token, id) {
  await fetch(`${API_BASE}/me/tracks`, {
    method: "DELETE",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({ ids: [id] })
  })
}

export async function getQueue(token) {
  const res = await fetch(`${API_BASE}/me/player/queue`, { headers: headers(token) })
  return safeJson(res)
}

export async function createPlaylist(token, userId, name) {
  const res = await fetch(`${API_BASE}/users/${userId}/playlists`, {
    method: "POST",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({ name, public: false })
  })
  return safeJson(res)
}

export async function addToPlaylist(token, playlistId, trackUri) {
  await fetch(`${API_BASE}/playlists/${playlistId}/tracks`, {
    method: "POST",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({ uris: [trackUri] })
  })
}
