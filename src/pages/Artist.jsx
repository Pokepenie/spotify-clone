import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getArtist, getArtistTopTracks } from "../api/spotify"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import SongRow from "../components/SongRow"

export default function Artist() {

  const { id } = useParams()
  const [artist, setArtist] = useState(null)
  const [topTracks, setTopTracks] = useState([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    async function load() {
      const [artistData, tracksData] = await Promise.all([
        getArtist(token, id),
        getArtistTopTracks(token, id)
      ])
      setArtist(artistData)
      setTopTracks(tracksData.tracks || [])
    }
    load()
  }, [id])

  if (!artist) return <p>Loading...</p>

  return (

    <div className="app">

      <Sidebar />

      <div className="main" style={{
        background: `linear-gradient(to bottom, #333 0%, #121212 450px)`
      }}>

        <Topbar />

        <div className="artist-header">
          <img src={artist.images?.[0]?.url} className="artist-image" />
          <div className="artist-info">
            <p className="playlist-type">Artist</p>
            <h1>{artist.name}</h1>
            <p className="playlist-meta">
              {artist.followers?.total?.toLocaleString()} followers
            </p>
          </div>
        </div>

        <h2 style={{ margin: "24px 0 16px" }}>Popular</h2>

        <div className="song-table">
          <div className="song-table-header">
            <span>#</span>
            <span></span>
            <span>Title</span>
            <span>Album</span>
            <span>⏱</span>
          </div>
          {topTracks.map((track, i) => (
            <SongRow key={track.id} track={track} index={i} />
          ))}
        </div>

      </div>

    </div>

  )

}
