import { createContext, useContext, useState } from "react"

export const PlayerContext = createContext({})
export const usePlayer = () => useContext(PlayerContext)

export function PlayerProvider({ children, currentTrack, deviceId }) {
  const [showNowPlaying, setShowNowPlaying] = useState(false)
  return (
    <PlayerContext.Provider value={{ currentTrack, deviceId, showNowPlaying, setShowNowPlaying }}>
      {children}
    </PlayerContext.Provider>
  )
}
