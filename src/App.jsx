import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { PlayerProvider } from "./context/PlayerContext"
import { ToastProvider } from "./context/ToastContext"

import Login from "./pages/Login"
import Home from "./pages/Home"
import Playlist from "./pages/Playlist"
import Search from "./pages/Search"
import LikedSongs from "./pages/LikedSongs"
import Artist from "./pages/Artist"
import Album from "./pages/Album"
import Player from "./components/Player"
import NowPlaying from "./components/NowPlaying"

export default function App() {

  const [token, setToken] = useState(null)
  const [deviceId, setDeviceId] = useState(null)
  const [currentTrack, setCurrentTrack] = useState(null)

  useEffect(() => {

    const code = new URLSearchParams(window.location.search).get("code")

    if (code) {
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, { code })
        .then(res => {
          const { access_token, refresh_token } = res.data
          localStorage.setItem("token", access_token)
          if (refresh_token) localStorage.setItem("refresh_token", refresh_token)
          setToken(access_token)
          window.history.pushState({}, null, "/")
        })
        .catch(err => console.error("TOKEN ERROR:", err))
      return
    }

    const saved = localStorage.getItem("token")
    if (saved) setToken(saved)

  }, [])

  useEffect(() => {

    if (!token) return

    const interval = setInterval(async () => {
      const refresh_token = localStorage.getItem("refresh_token")
      if (!refresh_token) return
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/refresh`, { refresh_token })
        const { access_token } = res.data
        localStorage.setItem("token", access_token)
        setToken(access_token)
      } catch (err) {
        console.error("REFRESH ERROR:", err)
      }
    }, 50 * 60 * 1000)

    return () => clearInterval(interval)

  }, [token])

  if (!token) return <Login />

  return (
    <PlayerProvider currentTrack={currentTrack} deviceId={deviceId}>
      <ToastProvider>
        <BrowserRouter>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/liked" element={<LikedSongs />} />
            <Route path="/playlist/:id" element={<Playlist />} />
            <Route path="/artist/:id" element={<Artist />} />
            <Route path="/album/:id" element={<Album />} />
          </Routes>

          <Player onReady={setDeviceId} onTrackChange={setCurrentTrack} />
          <NowPlaying />

        </BrowserRouter>
      </ToastProvider>
    </PlayerProvider>
  )

}
