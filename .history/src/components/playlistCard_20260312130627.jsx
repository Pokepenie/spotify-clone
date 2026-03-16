import { useNavigate } from "react-router-dom"

export default function PlaylistCard({playlist}){

  const navigate = useNavigate()

  return(

    <div
      className="playlist-card"
      onClick={()=>navigate(`/playlist/${playlist.id}`)}
    >

      <img
        src={playlist.images?.[0]?.url}
      />

      <h3>{playlist.name}</h3>

      <p>{playlist.tracks?.total || 0} songs</p>

    </div>

  )

}