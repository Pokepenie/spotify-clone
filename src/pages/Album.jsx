import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getAlbum } from "../api/spotify"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import SongRow from "../components/SongRow"

export default function Album() {

  const { id } = useParams()
  const [album, setAlbum] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    async function load() {
      const data = await getAlbum(token, id)
      setAlbum(data)
    }
    load()
  }, [id])

  if (!album) return <p>Loading...</p>

  const tracks = album.tracks?.items || []

  return (

    <div className="app">

      <Sidebar />

      <div className="main">

        <Topbar />

        <div className="playlist-header">
          <img src={album.images?.[0]?.url || ""} className="playlist-cover" />
          <div>
            <p className="playlist-type">Album</p>
            <h1>{album.name}</h1>
            <p className="playlist-meta">
              {album.artists?.map(a => a.name).join(", ")} • {album.release_date?.slice(0, 4)} • {tracks.length} songs
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
          {tracks.map((track, i) => (
            <SongRow
              key={track.id}
              track={{ ...track, album: { name: album.name, images: album.images, id: album.id } }}
              index={i}
              contextUri={album.uri}
            />
          ))}
        </div>

      </div>

    </div>

  )

}
