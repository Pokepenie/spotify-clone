export default function SongRow({track,index}){

  return(

    <div className="song-row">

      <p>{index+1}</p>

      <img
        src={track.album.images[0]?.url}
      />

      <div>
        <p>{track.name}</p>
        <small>{track.artists[0].name}</small>
      </div>

    </div>

  )

}