import { useNavigate } from "react-router-dom"
import { FaPlay } from "react-icons/fa"

export default function PlaylistCard({playlist}){

  const navigate = useNavigate()

  return(

    <div
      className="playlist-card"
      onClick={()=>navigate(`/playlist/${playlist.id}`)}
    >

      <div className="image-container">

        <img
          src={playlist.images?.[0]?.url}
          alt={playlist.name}
        />

        <button className="play-button">
          <FaPlay style={{ marginLeft: 2 }} />
        </button>

      </div>

      <h3>{playlist.name}</h3>

      <p>{playlist.tracks?.total ?? "Playlist"}</p>

    </div>

  )

}