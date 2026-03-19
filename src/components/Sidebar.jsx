import { FaSpotify, FaHome, FaSearch, FaBook, FaHeart, FaPlus } from "react-icons/fa"
import { useEffect, useState } from "react"
import { getPlaylists, getUser, createPlaylist } from "../api/spotify"
import { useNavigate } from "react-router-dom"
import { useToast } from "../context/ToastContext"

export default function Sidebar() {

  const [playlists, setPlaylists] = useState([])
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState("")
  const navigate = useNavigate()
  const { showToast } = useToast()

  useEffect(() => {
    const token = localStorage.getItem("token")
    async function load() {
      const data = await getPlaylists(token)
      setPlaylists(data || [])
    }
    load()
  }, [])

  async function handleCreate(e) {
    if (e.key === "Enter" && newName.trim()) {
      const token = localStorage.getItem("token")
      const user = await getUser(token)
      await createPlaylist(token, user.id, newName.trim())
      showToast("Playlist created!")
      setNewName("")
      setCreating(false)
      const data = await getPlaylists(token)
      setPlaylists(data || [])
    } else if (e.key === "Escape") {
      setCreating(false)
      setNewName("")
    }
  }

  return (

    <div className="sidebar">

      <h2 className="logo">
        <FaSpotify className="spotify-icon" /> Spotify
      </h2>

      <div className="menu">

        <p onClick={() => navigate("/")}>
          <FaHome /> Home
        </p>

        <p onClick={() => navigate("/search")}>
          <FaSearch /> Search
        </p>

        <p>
          <FaBook /> Your Library
        </p>

        <p onClick={() => navigate("/liked")}>
          <FaHeart /> Liked Songs
        </p>

      </div>

      <hr />

      <div className="sidebar-section-header">
        <span>Playlists</span>
        <span className="sidebar-add-btn" onClick={() => setCreating(true)} title="Create playlist">
          <FaPlus />
        </span>
      </div>

      {creating && (
        <input
          className="create-playlist-input"
          autoFocus
          placeholder="Playlist name..."
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={handleCreate}
        />
      )}

      <div className="playlist-list">
        {playlists.map(p => (
          <p
            key={p.id}
            onClick={() => navigate(`/playlist/${p.id}`)}
          >
            {p.name}
          </p>
        ))}
      </div>

    </div>

  )

}
