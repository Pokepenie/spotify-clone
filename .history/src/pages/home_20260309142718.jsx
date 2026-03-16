import { useEffect, useState } from "react"
import { getPlaylists } from "../api/spotify"

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
    <div>

      <h1>Your Spotify Playlists</h1>

      {playlists.map((playlist)=>(
        <div key={playlist.id}>
          <img
            src={playlist.images[0]?.url}
            width="100"
          />
          <p>{playlist.name}</p>
        </div>
      ))}

    </div>
  )
}