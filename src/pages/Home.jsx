import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getPlaylists, getRecentlyPlayed } from "../api/spotify.js"
import Sidebar from "../components/Sidebar.jsx"
import PlaylistCard from "../components/PlaylistCard.jsx"
import Topbar from "../components/Topbar.jsx"

function SkeletonCard() {
  return (
    <div className="playlist-card">
      <div className="skeleton" style={{ width: "100%", paddingBottom: "100%", borderRadius: 6 }} />
      <div className="skeleton" style={{ height: 16, marginTop: 12, borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 12, marginTop: 8, width: "60%", borderRadius: 4 }} />
    </div>
  )
}

export default function Home() {

  const [playlists, setPlaylists] = useState([])
  const [recentAlbums, setRecentAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {

    const token = localStorage.getItem("token")

    async function load() {
      try {
        const [playlistData, recentData] = await Promise.all([
          getPlaylists(token),
          getRecentlyPlayed(token)
        ])
        setPlaylists(playlistData || [])

        // Deduplicate albums from recently played
        const seen = new Set()
        const albums = []
        for (const item of recentData?.items || []) {
          const album = item.track?.album
          if (album && !seen.has(album.id)) {
            seen.add(album.id)
            albums.push(album)
          }
        }
        setRecentAlbums(albums.slice(0, 6))
      } catch (err) {
        console.error("Home load error:", err)
      } finally {
        setLoading(false)
      }
    }

    load()

  }, [])

  return (

    <div className="app">

      <Sidebar />

      <div className="main">

        <Topbar />

        {recentAlbums.length > 0 && (
          <>
            <h2 className="section-title">Recently Played</h2>
            <div className="search-cards" style={{ marginBottom: 40 }}>
              {recentAlbums.map(album => (
                <div
                  key={album.id}
                  className="search-card"
                  onClick={() => navigate(`/album/${album.id}`)}
                >
                  <img src={album.images?.[0]?.url || ""} className="search-card-img" />
                  <p className="search-card-name">{album.name}</p>
                  <p className="search-card-sub">{album.artists?.[0]?.name}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <h2 className="section-title">Your Playlists</h2>

        <div className="albums">
          {loading
            ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : playlists.map(p => <PlaylistCard key={p.id} playlist={p} />)
          }
        </div>

      </div>

    </div>

  )

}
