export default function SongRow({ song, index }) {

  return (
    <div className="song-row">

      <p>{index}</p>

      <img src={song.image} />

      <div className="song-info">
        <h4>{song.title}</h4>
        <p>{song.artist}</p>
      </div>

      <p>{song.duration}</p>

    </div>
  );
}