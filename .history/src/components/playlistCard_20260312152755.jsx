import { useNavigate } from "react-router-dom"

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
          ▶
        </button>

      </div>

      <h3>{playlist.name}</h3>
 <p>
  {playlist.tracks && playlist.tracks.total !== undefined
    ? `${playlist.tracks.total} songs`
    : "Playlist"}
</p>

    </div>

  )

}