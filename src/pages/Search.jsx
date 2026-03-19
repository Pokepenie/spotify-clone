import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { searchSpotify } from "../api/spotify"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import SongRow from "../components/SongRow"

export default function Search() {

  const [query, setQuery] = useState("")
  const [tracks, setTracks] = useState([])
  const [artists, setArtists] = useState([])
  const [albums, setAlbums] = useState([])
  const navigate = useNavigate()

  useEffect(() => {

    if (!query.trim()) {
      setTracks([])
      setArtists([])
      setAlbums([])
      return
    }

    const timeout = setTimeout(async () => {
      const token = localStorage.getItem("token")
      const data = await searchSpotify(token, query)
      setTracks(data.tracks?.items || [])
      setArtists(data.artists?.items || [])
      setAlbums(data.albums?.items || [])
    }, 400)

    return () => clearTimeout(timeout)

  }, [query])

  const hasResults = tracks.length > 0 || artists.length > 0 || albums.length > 0

  return (

    <div className="app">

      <Sidebar />

      <div className="main">

        <Topbar />

        <div className="search-bar">
          <input
            className="search-input"
            type="text"
            placeholder="What do you want to listen to?"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {artists.length > 0 && (
          <>
            <h2 className="section-title">Artists</h2>
            <div className="search-cards">
              {artists.map(artist => (
                <div
                  key={artist.id}
                  className="search-card"
                  onClick={() => navigate(`/artist/${artist.id}`)}
                >
                  <img
                    src={artist.images?.[0]?.url || ""}
                    className="search-card-img search-card-img--round"
                  />
                  <p className="search-card-name">{artist.name}</p>
                  <p className="search-card-sub">Artist</p>
                </div>
              ))}
            </div>
          </>
        )}

        {albums.length > 0 && (
          <>
            <h2 className="section-title">Albums</h2>
            <div className="search-cards">
              {albums.map(album => (
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

        {tracks.length > 0 && (
          <>
            <h2 className="section-title">Songs</h2>
            <div className="song-table">
              <div className="song-table-header">
                <span>#</span>
                <span></span>
                <span>Title</span>
                <span>Album</span>
                <span>⏱</span>
              </div>
              {tracks.map((track, i) => (
                <SongRow key={track.id} track={track} index={i} />
              ))}
            </div>
          </>
        )}

        {query && !hasResults && (
          <p className="no-results">No results for "{query}"</p>
        )}

      </div>

    </div>

  )

}
