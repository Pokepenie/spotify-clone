import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getPlaylist } from "../api/spotify"

import Sidebar from "../components/Sidebar"
import SongRow from "../components/SongRow"
import Topbar from "../components/Topbar"

async function getDominantColor(imgUrl) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = 50
      canvas.height = 50
      const ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0, 50, 50)
      const data = ctx.getImageData(0, 0, 50, 50).data
      let r = 0, g = 0, b = 0
      const total = data.length / 4
      for (let i = 0; i < data.length; i += 4) {
        r += data[i]
        g += data[i + 1]
        b += data[i + 2]
      }
      resolve(`rgb(${Math.floor(r / total)},${Math.floor(g / total)},${Math.floor(b / total)})`)
    }
    img.onerror = () => resolve("#333")
    img.src = imgUrl
  })
}

export default function Playlist() {

  const { id } = useParams()
  const [playlist, setPlaylist] = useState(null)
  const [bgColor, setBgColor] = useState("#333")

  useEffect(() => {

    async function load() {
      try {
        const token = localStorage.getItem("token")
        const data = await getPlaylist(token, id)
        setPlaylist(data)
        const imgUrl = data.images?.[0]?.url
        if (imgUrl) {
          const color = await getDominantColor(imgUrl)
          setBgColor(color)
        }
      } catch (err) {
        console.error("PLAYLIST ERROR:", err)
      }
    }

    load()

  }, [id])

  if (!playlist) return <p>Loading...</p>

  const songs = playlist.tracks?.items || playlist.items?.items || []

  return (

    <div className="app">

      <Sidebar />

      <div className="main" style={{
        background: `linear-gradient(to bottom, ${bgColor} 0%, #121212 450px)`
      }}>

        <Topbar />

        <div className="playlist-header">

          <img
            src={playlist.images?.[0]?.url || ""}
            className="playlist-cover"
          />

          <div>
            <h1>{playlist.name}</h1>
            <p className="playlist-meta">
              {playlist.tracks?.total || playlist.items?.total || songs.length} songs
            </p>
          </div>

        </div>

        <div className="song-table">

          <div className="song-table-header">
            <span>#</span>
            <span></span>
            <span>Title</span>
            <span>Album</span>
            <span>⏱</span>
          </div>

          {songs.map((item, i) => {
            const track = item?.track || item?.item || item
            if (!track?.uri) return null
            return (
              <SongRow
                key={track.id || i}
                track={track}
                index={i}
                contextUri={playlist.uri}
              />
            )
          })}

        </div>

      </div>

    </div>

  )

}
