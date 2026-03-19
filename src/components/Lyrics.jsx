import { useEffect, useState } from "react"
import { usePlayer } from "../context/PlayerContext"

export default function Lyrics() {
  const { showLyrics, setShowLyrics, currentTrack } = usePlayer()
  const [lyrics, setLyrics] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!showLyrics || !currentTrack) return
    setLyrics("")
    setLoading(true)
    const artist = encodeURIComponent(currentTrack.artists?.[0]?.name || "")
    const title = encodeURIComponent(currentTrack.name || "")
    fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
      .then(r => r.json())
      .then(data => setLyrics(data.lyrics || "Lyrics not found."))
      .catch(() => setLyrics("Lyrics not found."))
      .finally(() => setLoading(false))
  }, [showLyrics, currentTrack?.id])

  if (!showLyrics) return null

  return (
    <div className="panel lyrics-panel">
      <div className="panel-header">
        <h3>Lyrics</h3>
        <span className="panel-close" onClick={() => setShowLyrics(false)}>✕</span>
      </div>
      <div className="panel-content lyrics-content">
        {loading
          ? <p className="panel-empty">Loading lyrics...</p>
          : <pre className="lyrics-text">{lyrics}</pre>
        }
      </div>
    </div>
  )
}
