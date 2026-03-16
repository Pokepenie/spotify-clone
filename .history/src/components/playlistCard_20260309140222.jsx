export default function PlaylistCard({ playlist }) {
  return (
    <div className="playlist-card">

      <img src={playlist.image} />

      <h3>{playlist.name}</h3>

      <p>{playlist.description}</p>

    </div>
  );
}