import { useEffect, useState } from "react"
import { getPlaylists } from "../api/spotify"
import Sidebar from "../components/sidebar"
import Player from "../components/player"

export default function Home(){

  const [playlists, setPlaylists] = useState([])

  useEffect(()=>{

    const token = window.localStorage.getItem("token")

    async function loadPlaylists(){
      const data = await getPlaylists(token)
      setPlaylists(data.items)
    }

    loadPlaylists()

  },[])

  return(

    <div className="app">

      <Sidebar/>

      <div className="main">

        <h1>Good Afternoon</h1>

        <div className="albums">

  {playlists.map((playlist)=>(
    <div key={playlist.id} className="album">

      <img
        src={playlist.images[0]?.url}
        alt={playlist.name}
      />

      <h3>{playlist.name}</h3>

      <p>
        {playlist.tracks.total} songs
      </p>

    </div>
  ))}

</div>