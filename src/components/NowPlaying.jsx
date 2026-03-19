import { useState, useEffect } from "react"
import { FaHeart, FaRegHeart, FaTimes } from "react-icons/fa"
import { usePlayer } from "../context/PlayerContext"
import { useToast } from "../context/ToastContext"
import { getQueue, checkLiked, likeTrack, unlikeTrack } from "../api/spotify"

export default function NowPlaying() {
  const { currentTrack, showNowPlaying, setShowNowPlaying } = usePlayer()
  const { showToast } = useToast()
  const [tab, setTab] = useState("lyrics")
  const [lyrics, setLyrics] = useState("")
  const [lyricsLoading, setLyricsLoading] = useState(false)
  const [queue, setQueue] = useState([])
  const [queueLoading, setQueueLoading] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  // Shift main content when panel opens/closes
  useEffect(() => {
    document.body.classList.toggle("np-open", showNowPlaying)
    return () => document.body.classList.remove("np-open")
  }, [showNowPlaying])

  // Check liked status when track changes
  useEffect(() => {
    if (!currentTrack?.id) return
    const token = localStorage.getItem("token")
    checkLiked(token, currentTrack.id).then(liked => setIsLiked(liked)).catch(() => {})
  }, [currentTrack?.id])

  // Fetch lyrics
  useEffect(() => {
    if (!showNowPlaying || tab !== "lyrics" || !currentTrack) return
    setLyrics("")
    setLyricsLoading(true)
    const artist = encodeURIComponent(currentTrack.artists?.[0]?.name || "")
    const title = encodeURIComponent(currentTrack.name || "")
    fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
      .then(r => r.json())
      .then(data => setLyrics(data.lyrics || "Lyrics not found."))
      .catch(() => setLyrics("Lyrics not found."))
      .finally(() => setLyricsLoading(false))
  }, [showNowPlaying, tab, currentTrack?.id])

  // Fetch queue
  useEffect(() => {
    if (!showNowPlaying || tab !== "queue") return
    setQueueLoading(true)
    const token = localStorage.getItem("token")
    getQueue(token)
      .then(data => setQueue(data.queue || []))
      .catch(() => setQueue([]))
      .finally(() => setQueueLoading(false))
  }, [showNowPlaying, tab])

  async function toggleLike() {
    const token = localStorage.getItem("token")
    if (isLiked) {
      await unlikeTrack(token, currentTrack.id)
      showToast("Removed from Liked Songs")
    } else {
      await likeTrack(token, currentTrack.id)
      showToast("Added to Liked Songs")
    }
    setIsLiked(!isLiked)
  }

  const imgUrl = currentTrack?.album?.images?.[0]?.url || ""

  if (!showNowPlaying) return null

  return (
    <div className="np-panel">

      <button className="np-close" onClick={() => setShowNowPlaying(false)}>
        <FaTimes />
      </button>

      {currentTrack ? (
        <>
          <div className="np-art-wrap">
            <img src={imgUrl} className="np-art" />
          </div>

          <div className="np-track-info">
            <div className="np-track-text">
              <p className="np-track-name">{currentTrack.name}</p>
              <p className="np-track-artist">
                {currentTrack.artists?.map(a => a.name).join(", ")}
              </p>
            </div>
            <span className={`np-like${isLiked ? " liked" : ""}`} onClick={toggleLike}>
              {isLiked ? <FaHeart /> : <FaRegHeart />}
            </span>
          </div>

          <div className="np-tabs">
            <span
              className={`np-tab${tab === "lyrics" ? " np-tab--active" : ""}`}
              onClick={() => setTab("lyrics")}
            >
              Lyrics
            </span>
            <span
              className={`np-tab${tab === "queue" ? " np-tab--active" : ""}`}
              onClick={() => setTab("queue")}
            >
              Queue
            </span>
          </div>

          <div className="np-content">
            {tab === "lyrics" && (
              lyricsLoading
                ? <p className="np-empty">Loading lyrics...</p>
                : <pre className="np-lyrics">{lyrics}</pre>
            )}
            {tab === "queue" && (
              queueLoading
                ? <p className="np-empty">Loading...</p>
                : queue.length === 0
                  ? <p className="np-empty">Queue is empty</p>
                  : queue.map((t, i) => (
                    <div key={t.id + i} className="np-queue-item">
                      <img
                        src={t.album?.images?.[2]?.url || t.album?.images?.[0]?.url || ""}
                        className="np-queue-thumb"
                      />
                      <div className="np-queue-text">
                        <p className="np-queue-name">{t.name}</p>
                        <p className="np-queue-artist">{t.artists?.map(a => a.name).join(", ")}</p>
                      </div>
                    </div>
                  ))
            )}
          </div>
        </>
      ) : (
        <p className="np-empty" style={{ marginTop: 40 }}>Nothing playing</p>
      )}

    </div>
  )
}
