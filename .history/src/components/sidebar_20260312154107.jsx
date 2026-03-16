import { FaSpotify, FaHome, FaSearch, FaBook } from "react-icons/fa"
import { useEffect, useState } from "react"
import { getPlaylists } from "../api/spotify"
import { useNavigate } from "react-router-dom"

export default function Sidebar(){

  const [playlists,setPlaylists] = useState([])
  const navigate = useNavigate()

  useEffect(()=>{

    const token = localStorage.getItem("token")

    async function load(){
      const data = await getPlaylists(token)
      setPlaylists(data?.items || [])
    }

    load()

  },[])

  return(

    <div className="sidebar">

      <h2 className="logo">
        <FaSpotify/> Spotify
      </h2>

      <p><FaHome/> Home</p>
      <p><FaSearch/> Search</p>
      <p><FaBook/> Your Library</p>

      <hr/>

      <div className="playlist-list">

        {playlists.map(p=>(
          <p
            key={p.id}
            onClick={()=>navigate(`/playlist/${p.id}`)}
          >
            {p.name}
          </p>
        ))}

      </div>

    </div>

  )

}