export default function PlaylistCard({playlist}){

  return(

    <div className="playlist-card">

      <img
        src={playlist.images?.[0]?.url}
        alt={playlist.name}
      />

      <h3>{playlist.name}</h3>

      <p>
        {playlist.tracks?.total || 0} songs
      </p>

    </div>

  )

}