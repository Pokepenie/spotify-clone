import { useEffect, useState } from "react"
import { getLikedSongs } from "../api/spotify"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import SongRow from "../components/SongRow"

export default function LikedSongs() {

  const [songs, setSongs] = useState([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    async function load() {
      const data = await getLikedSongs(token)
      setSongs(data.items || [])
    }
    load()
  }, [])

  return (

    <div className="app">

      <Sidebar />

      <div className="main liked-main">

        <Topbar />

        <div className="playlist-header">

          <div className="liked-cover">♥</div>

          <div>
            <p className="playlist-type">Playlist</p>
            <h1>Liked Songs</h1>
            <p className="playlist-meta">{songs.length} songs</p>
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
            const track = item.track
            if (!track?.uri) return null
            return (
              <SongRow
                key={track.id || i}
                track={track}
                index={i}
              />
            )
          })}

        </div>

      </div>

    </div>

  )

}
