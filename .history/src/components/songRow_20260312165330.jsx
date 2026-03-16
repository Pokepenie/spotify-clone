export default function SongRow({track,index,deviceId}){

  async function playTrack(){

    const token = localStorage.getItem("token")

    await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        method:"PUT",
        headers:{
          Authorization:`Bearer ${token}`,
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          uris:[track.uri]
        })
      }
    )

  }

  return(

    <div className="song-row" onClick={playTrack}>

      <p>{index+1}</p>

      <img src={track.album.images[0]?.url}/>

      <div>

        <p>{track.name}</p>

        <small>
          {track.artists.map(a=>a.name).join(", ")}
        </small>

      </div>

    </div>

  )

}