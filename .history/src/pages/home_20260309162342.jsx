import { useEffect,useState } from "react"
import { getPlaylists } from "../api/spotify"

import Sidebar from "../components/Sidebar"
import PlaylistCard from "../components/PlaylistCard"
import Player from "../components/Player"
const [selectedPlaylist,setSelectedPlaylist] = useState(null)
export default function Home(){

  const [playlists,setPlaylists] = useState([])

  useEffect(()=>{

    const token = localStorage.getItem("token")

    async function load(){
      const data = await getPlaylists(token)
      setPlaylists(data.items)
    }

    load()

  },[])

  return(

    <div className="app">

      <Sidebar/>

      <div className="main">

        <h1>Good Afternoon</h1>

        <div className="albums">

         {playlists.map(p=>(
  <PlaylistCard
    key={p.id}
    playlist={p}
    onSelect={setSelectedPlaylist}
  />
))}

        </div>

      </div>

      <Player/>

    </div>

  )

}