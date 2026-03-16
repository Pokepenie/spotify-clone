import { useContext } from "react"
import { PlayerContext } from "../context/PlayerContext"

export default function SongRow({ track, index }){

  const { playTrack } = useContext(PlayerContext)

  return(

    <div
      className="song-row"
      onClick={()=>playTrack(track)}
    >

      <p>{index + 1}</p>

      <img
        src={track.album.images[0]?.url}
      />

      <div>

        <p>{track.name}</p>

        <small>
          {track.artists.map(a=>a.name).join(", ")}
        </small>

      </div>

    </div>

  )

}