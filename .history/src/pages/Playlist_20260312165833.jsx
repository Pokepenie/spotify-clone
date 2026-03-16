import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getPlaylist } from "../api/spotify"
import SongRow from "../components/SongRow"
import Sidebar from "../components/Sidebar"
import Player from "../components/Player"

export default function Playlist(){

  const { id } = useParams()
  const [playlist,setPlaylist] = useState(null)

  useEffect(()=>{

    const token = localStorage.getItem("token")

    async function load(){
      const data = await getPlaylist(token,id)
      setPlaylist(data)
    }

    load()

  },[id])

  if(!playlist) return <p>Loading...</p>

  return(

    <div className="app">

      <Sidebar/>

      <div className="main">

        <div className="playlist-header">

          <img
            src={playlist.images?.[0]?.url}
            className="playlist-cover"
          />

          <div>

            <p className="playlist-type">Playlist</p>

            <h1>{playlist.name}</h1>

            <p className="playlist-meta">
              {playlist.tracks.total} songs
            </p>

          </div>

        </div>

        <div className="song-table">

          {playlist.tracks.items.map((item,index)=>{

            const track = item.track

            return(

              <div className="song-row" key={track.id}>

                <p className="song-number">{index+1}</p>

                <img
                  src={track.album.images[0]?.url}
                />

                <div>

                  <p>{track.name}</p>

                  <p className="artist">
                    {track.artists[0].name}
                  </p>

                </div>

                <p className="album">
                  {track.album.name}
                </p>

                <p className="duration">
                  {Math.floor(track.duration_ms/60000)}:
                  {("0"+Math.floor((track.duration_ms%60000)/1000)).slice(-2)}
                </p>

              </div>

            )

          })}

        </div>

      </div>

      <Player/>

    </div>

  )

}