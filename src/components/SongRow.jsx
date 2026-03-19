import { useState, useEffect, useRef } from "react"
import { FaPlay, FaHeart, FaRegHeart, FaEllipsisH } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { usePlayer } from "../context/PlayerContext"
import { useToast } from "../context/ToastContext"
import { checkLiked, likeTrack, unlikeTrack, getPlaylists, addToPlaylist } from "../api/spotify"

export default function SongRow({ track, index, contextUri }) {

  const { currentTrack, deviceId } = usePlayer()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const isPlaying = currentTrack?.uri === track.uri
  const [isLiked, setIsLiked] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPlaylists, setMenuPlaylists] = useState([])
  const menuRef = useRef(null)

  // Episode/podcast support
  const isEpisode = track.type === "episode"
  const imgUrl = isEpisode
    ? (track.images?.[0]?.url || track.show?.images?.[0]?.url || "")
    : (track.album?.images?.[0]?.url || "")
  const albumName = isEpisode ? (track.show?.name || "") : (track.album?.name || "")
  const albumId = isEpisode ? null : track.album?.id

  useEffect(() => {
    if (!track.id) return
    const delay = Math.min(index, 40) * 60
    const t = setTimeout(() => {
      const token = localStorage.getItem("token")
      checkLiked(token, track.id).then(liked => setIsLiked(liked)).catch(() => {})
    }, delay)
    return () => clearTimeout(t)
  }, [track.id])

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [menuOpen])

  async function playTrack() {
    const token = localStorage.getItem("token")
    const body = contextUri
      ? { context_uri: contextUri, offset: { position: index } }
      : { uris: [track.uri] }
    await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    )
  }

  async function toggleLike(e) {
    e.stopPropagation()
    const token = localStorage.getItem("token")
    if (isLiked) {
      await unlikeTrack(token, track.id)
      showToast("Removed from Liked Songs")
    } else {
      await likeTrack(token, track.id)
      showToast("Added to Liked Songs")
    }
    setIsLiked(!isLiked)
  }

  async function openMenu(e) {
    e.stopPropagation()
    if (!menuOpen) {
      const token = localStorage.getItem("token")
      const pls = await getPlaylists(token)
      setMenuPlaylists(pls || [])
    }
    setMenuOpen(!menuOpen)
  }

  async function handleAddToPlaylist(e, playlistId) {
    e.stopPropagation()
    const token = localStorage.getItem("token")
    await addToPlaylist(token, playlistId, track.uri)
    showToast("Added to playlist")
    setMenuOpen(false)
  }

  const ms = track.duration_ms || 0
  const minutes = Math.floor((ms / 1000) / 60)
  const seconds = String(Math.floor((ms / 1000) % 60)).padStart(2, "0")

  return (

    <div className={`song-row${isPlaying ? " song-row--playing" : ""}`} onClick={playTrack}>

      <div className="song-index">
        {isPlaying
          ? <div className="eq-bars"><span /><span /><span /></div>
          : <span className="index-num">{index + 1}</span>
        }
        {!isPlaying && <FaPlay className="index-play" />}
      </div>

      <img src={imgUrl} />

      <div>
        <p className={isPlaying ? "playing-text" : ""}>{track.name}</p>
        <p className="artist">
          {track.artists?.map((a, i) => (
            <span key={a.id || i}>
              <span
                className="artist-link"
                onClick={e => { e.stopPropagation(); if (a.id) navigate(`/artist/${a.id}`) }}
              >
                {a.name}
              </span>
              {i < track.artists.length - 1 && ", "}
            </span>
          ))}
        </p>
      </div>

      <p className="album">
        {albumId ? (
          <span
            className="album-link"
            onClick={e => { e.stopPropagation(); navigate(`/album/${albumId}`) }}
          >
            {albumName}
          </span>
        ) : albumName}
      </p>

      <div className="song-row-right">
        <span className={`like-btn${isLiked ? " liked" : ""}`} onClick={toggleLike}>
          {isLiked ? <FaHeart /> : <FaRegHeart />}
        </span>
        <p className="duration">{minutes}:{seconds}</p>
        <div className="song-menu-wrap" ref={menuRef}>
          <span className="menu-dots" onClick={openMenu}>
            <FaEllipsisH />
          </span>
          {menuOpen && (
            <div className="context-menu">
              <p className="context-menu-label">Add to playlist</p>
              {menuPlaylists.map(p => (
                <div
                  key={p.id}
                  className="context-menu-item"
                  onClick={e => handleAddToPlaylist(e, p.id)}
                >
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>

  )

}
