import { useEffect,useState } from "react"
import { getPlaylist } from "../api/spotify"

import Sidebar from "../components/Sidebar"
import SongRow from "../components/SongRow"
import Player from "../components/Player"

export default function Playlist({playlistId}){

  const [playlist,setPlaylist] = useState(null)

  useEffect(()=>{

    const token = localStorage.getItem("token")

    async function load(){
      const data = await getPlaylist(token,playlistId)
      setPlaylist(data)
    }

    load()

  },[playlistId])

  if(!playlist) return <p>Loading...</p>

  return(

    <div className="app">

      <Sidebar/>

      <div className="main">

        <div className="playlist-header">

          <img src={playlist.images?.[0]?.url} />

          <div>
            <p>Playlist</p>
            <h1>{playlist.name}</h1>
          </div>

        </div>

        <div className="song-table">

          {playlist.tracks.items.map((item,index)=>(
            <SongRow
              key={item.track.id}
              track={item.track}
              index={index}
            />
          ))}

        </div>

      </div>

      <Player/>

    </div>

  )

}