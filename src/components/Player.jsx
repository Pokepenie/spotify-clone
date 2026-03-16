import { FaStepBackward, FaPlay, FaStepForward, FaVolumeUp } from "react-icons/fa"

export default function Player(){

  return(

    <div className="player">

      <div className="player-left">
        <p>Nothing Playing</p>
      </div>

      <div className="player-center">

        <div className="controls">
          <FaStepBackward/>
          <FaPlay className="play-main"/>
          <FaStepForward/>
        </div>

        <div className="progress-container">

          <span className="time">0:00</span>

          <div className="progress">
            <div className="progress-bar"/>
          </div>

          <span className="time">3:30</span>

        </div>

      </div>

      <div className="player-right">
        <FaVolumeUp/>
        <div className="volume-bar">
          <div className="volume-level"/>
        </div>
      </div>

    </div>

  )

}