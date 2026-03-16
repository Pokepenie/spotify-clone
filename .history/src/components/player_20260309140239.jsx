export default function Player() {
  return (
    <div className="player">

      <div className="song-info">
        <img src="https://picsum.photos/50"/>
        <div>
          <p>Song Title</p>
          <span>Artist</span>
        </div>
      </div>

      <div className="controls">

        <button>⏮</button>
        <button className="play">▶</button>
        <button>⏭</button>

        <div className="progress">
          <div className="progress-bar"></div>
        </div>

      </div>

      <div>🔊</div>

    </div>
  );
}