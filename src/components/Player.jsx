import { useEffect, useState, useRef } from "react"
import { FaRandom, FaStepBackward, FaPlay, FaPause, FaStepForward, FaRedo, FaVolumeUp, FaVolumeMute, FaMusic } from "react-icons/fa"
import { usePlayer } from "../context/PlayerContext"


function formatTime(ms) {
  const min = Math.floor(ms / 60000)
  const sec = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0")
  return `${min}:${sec}`
}

export default function Player({ onReady, onTrackChange }) {
  const { showNowPlaying, setShowNowPlaying } = usePlayer()

  const [, setPlayer] = useState(null)
  const [isPaused, setPaused] = useState(true)
  const [track, setTrack] = useState(null)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState(0)

  const playerRef = useRef(null)
  const stateRef = useRef({ isPaused: true, position: 0, duration: 0, volume: 0.5, prevVolume: 0.5 })
  const lastTrackIdRef = useRef(null)

  useEffect(() => { stateRef.current.isPaused = isPaused }, [isPaused])
  useEffect(() => { stateRef.current.position = position }, [position])
  useEffect(() => { stateRef.current.duration = duration }, [duration])
  useEffect(() => { stateRef.current.volume = volume }, [volume])

  useEffect(() => {

    const token = localStorage.getItem("token")

    window.onSpotifyWebPlaybackSDKReady = () => {

      const spotifyPlayer = new window.Spotify.Player({
        name: "Theos Spotify Clone",
        getOAuthToken: cb => { cb(token) },
        volume: 0.5
      })

      setPlayer(spotifyPlayer)
      playerRef.current = spotifyPlayer

      spotifyPlayer.addListener("ready", ({ device_id }) => {
        if (onReady) onReady(device_id)
      })

      spotifyPlayer.addListener("player_state_changed", (state) => {
        if (!state) return
        const current = state.track_window.current_track
        setTrack(current)
        setPaused(state.paused)
        setPosition(state.position)
        setDuration(state.duration)
        setIsShuffle(state.shuffle)
        setRepeatMode(state.repeat_mode)
        if (onTrackChange) onTrackChange(current)
        if (current.id !== lastTrackIdRef.current) {
          lastTrackIdRef.current = current.id
          setShowNowPlaying(true)
        }
      })

      spotifyPlayer.connect()

    }

    const script = document.createElement("script")
    script.src = "https://sdk.scdn.co/spotify-player.js"
    script.async = true
    document.body.appendChild(script)

  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return
      const token = localStorage.getItem("token")
      const { isPaused, position, duration, volume, prevVolume } = stateRef.current
      const p = playerRef.current

      if (e.code === "Space") {
        e.preventDefault()
        const endpoint = isPaused
          ? "https://api.spotify.com/v1/me/player/play"
          : "https://api.spotify.com/v1/me/player/pause"
        fetch(endpoint, { method: "PUT", headers: { Authorization: `Bearer ${token}` } })
      } else if (e.code === "ArrowLeft") {
        e.preventDefault()
        const newPos = Math.max(0, position - 10000)
        setPosition(newPos)
        if (p) p.seek(newPos)
      } else if (e.code === "ArrowRight") {
        e.preventDefault()
        const newPos = Math.min(duration, position + 10000)
        setPosition(newPos)
        if (p) p.seek(newPos)
      } else if (e.code === "KeyM") {
        if (volume > 0) {
          stateRef.current.prevVolume = volume
          setVolume(0)
          if (p) p.setVolume(0)
        } else {
          const restore = prevVolume || 0.5
          setVolume(restore)
          if (p) p.setVolume(restore)
        }
      }
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [])

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setPosition(prev => Math.min(prev + 1000, duration))
    }, 1000)
    return () => clearInterval(interval)
  }, [isPaused, duration])

  const togglePlay = async () => {
    const token = localStorage.getItem("token")
    const endpoint = isPaused
      ? "https://api.spotify.com/v1/me/player/play"
      : "https://api.spotify.com/v1/me/player/pause"
    await fetch(endpoint, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  const skipNext = async () => {
    const token = localStorage.getItem("token")
    await fetch("https://api.spotify.com/v1/me/player/next", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  const skipPrev = async () => {
    const token = localStorage.getItem("token")
    await fetch("https://api.spotify.com/v1/me/player/previous", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  const toggleShuffle = async () => {
    const token = localStorage.getItem("token")
    await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${!isShuffle}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    })
    setIsShuffle(!isShuffle)
  }

  const toggleRepeat = async () => {
    const token = localStorage.getItem("token")
    const modes = ["off", "context", "track"]
    const next = (repeatMode + 1) % 3
    await fetch(`https://api.spotify.com/v1/me/player/repeat?state=${modes[next]}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    })
    setRepeatMode(next)
  }

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    const seekPos = Math.floor(ratio * duration)
    setPosition(seekPos)
    if (playerRef.current) playerRef.current.seek(seekPos)
  }

  const changeVolume = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)
    setVolume(ratio)
    if (playerRef.current) playerRef.current.setVolume(ratio)
  }

  const progressPercent = duration ? (position / duration) * 100 : 0

  return (

    <div className="player">

      <div className="player-left">
        {track ? (
          <div className="track-info">
            <img src={track.album.images[0].url} className="player-thumb" />
            <div className="track-text">
              <p className="track-name">{track.name}</p>
              <p className="track-artist">{track.artists.map(a => a.name).join(", ")}</p>
            </div>
          </div>
        ) : (
          <p className="track-artist">Nothing Playing</p>
        )}
      </div>

      <div className="player-center">

        <div className="controls">
          <FaRandom
            className={`ctrl-icon${isShuffle ? " ctrl-active" : ""}`}
            onClick={toggleShuffle}
          />
          <FaStepBackward className="ctrl-icon" onClick={skipPrev} />
          <div className="play-btn" onClick={togglePlay}>
            {isPaused
              ? <FaPlay style={{ marginLeft: 2 }} />
              : <FaPause />
            }
          </div>
          <FaStepForward className="ctrl-icon" onClick={skipNext} />
          <div className="repeat-wrap" onClick={toggleRepeat}>
            <FaRedo className={`ctrl-icon${repeatMode > 0 ? " ctrl-active" : ""}`} />
            {repeatMode === 2 && <span className="repeat-badge">1</span>}
          </div>
        </div>

        <div className="progress-container">
          <span className="time">{formatTime(position)}</span>
          <div className="progress" onClick={seek}>
            <div className="progress-bar" style={{ width: `${progressPercent}%` }}>
              <div className="progress-dot" />
            </div>
          </div>
          <span className="time">{formatTime(duration)}</span>
        </div>

      </div>

      <div className="player-right">
        <button
          className={`np-toggle-btn${showNowPlaying ? " np-toggle-btn--active" : ""}`}
          onClick={() => setShowNowPlaying(!showNowPlaying)}
          title="Now Playing"
        >
          <FaMusic />
        </button>
        {volume === 0 ? <FaVolumeMute className="ctrl-icon" /> : <FaVolumeUp className="ctrl-icon" />}
        <div className="volume-bar" onClick={changeVolume}>
          <div className="volume-level" style={{ width: `${volume * 100}%` }} />
        </div>
      </div>

    </div>

  )

}
