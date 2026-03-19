import { useEffect, useState } from "react"
import { usePlayer } from "../context/PlayerContext"
import { getQueue } from "../api/spotify"

export default function Queue() {
  const { showQueue, setShowQueue } = usePlayer()
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!showQueue) return
    setLoading(true)
    const token = localStorage.getItem("token")
    getQueue(token)
      .then(data => setQueue(data.queue || []))
      .catch(() => setQueue([]))
      .finally(() => setLoading(false))
  }, [showQueue])

  if (!showQueue) return null

  return (
    <div className="panel queue-panel">
      <div className="panel-header">
        <h3>Queue</h3>
        <span className="panel-close" onClick={() => setShowQueue(false)}>✕</span>
      </div>
      <div className="panel-content">
        {loading && <p className="panel-empty">Loading...</p>}
        {!loading && queue.length === 0 && <p className="panel-empty">Queue is empty</p>}
        {queue.map((track, i) => (
          <div key={track.id + i} className="queue-item">
            <img src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url || ""} className="queue-thumb" />
            <div className="queue-text">
              <p className="queue-name">{track.name}</p>
              <p className="queue-artist">{track.artists?.map(a => a.name).join(", ")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
