export default function SongRow({ track, index, deviceId }) {

// Prevent rendering if track is missing
if (!track) return null;

async function playTrack() {
const token = localStorage.getItem("token");

```
if (!token || !deviceId || !track.uri) return;

try {
  await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        uris: [track.uri]
      })
    }
  );
} catch (err) {
  console.error("Playback error:", err);
}
```

}

const image =
track?.album?.images?.[0]?.url ||
"https://via.placeholder.com/40";

const artists =
track?.artists?.map(a => a.name).join(", ") || "Unknown Artist";

return ( <div className="song-row" onClick={playTrack}> <p>{index + 1}</p>

```
  <img src={image} alt="album cover" />

  <div>
    <p>{track?.name || "Unknown Track"}</p>
    <small>{artists}</small>
  </div>
</div>
```

);
}
