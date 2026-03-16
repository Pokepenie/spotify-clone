export default function Player(){
  return(
    <div className="player">
      <p>Now Playing</p>

      <div className="controls">
        <button>⏮</button>
        <button>▶</button>
        <button>⏭</button>

        <div className="progress">
          <div className="progress-bar"></div>
        </div>
      </div>
    </div>
  )
}