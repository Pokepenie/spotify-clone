import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getPlaylist } from "../api/spotify"

import Sidebar from "../components/Sidebar"
import Player from "../components/Player"
import SongRow from "../components/SongRow"

export default function Playlist({ deviceId }){

  const { id } = useParams()
  const [playlist,setPlaylist] = useState(null)

  useEffect(()=>{

    async function load(){
      try{

        const token = localStorage.getItem("token")

        const data = await getPlaylist(token,id)

        console.log("PLAYLIST:", data)

        setPlaylist(data)

      }catch(err){
        console.error("PLAYLIST ERROR:", err)
      }
    }

    load()

  },[id])

  if(!playlist || !playlist.items || !playlist.items.items){
    return <p>Loading...</p>
  }

  const songs = playlist.items.items

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
              {songs.length} songs
            </p>

          </div>

        </div>

        <div className="song-table">

          {songs.map((item,i)=>{

            const track = item.track

            if(!track) return null

            return(
              <SongRow
                key={track.id}
                track={track}
                index={i}
                deviceId={deviceId}
              />
            )

          })}

        </div>

      </div>

      <Player/>

    </div>

  )

}