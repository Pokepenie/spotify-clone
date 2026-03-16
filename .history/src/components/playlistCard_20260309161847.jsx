export default function PlaylistCard({playlist,onSelect}){

  return(

    <div
      className="playlist-card"
      onClick={()=>onSelect(playlist.id)}
    >

      <div className="image-container">

        <img src={playlist.images?.[0]?.url} />

        <button className="play-button">
          ▶
        </button>

      </div>

      <h3>{playlist.name}</h3>

      <p>{playlist.tracks?.total || 0} songs</p>

    </div>

  )

}