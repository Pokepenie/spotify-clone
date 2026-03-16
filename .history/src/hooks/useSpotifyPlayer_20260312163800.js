import { useEffect, useState } from "react"

export default function useSpotifyPlayer(token){

  const [deviceId,setDeviceId] = useState(null)

  useEffect(()=>{

    if(!token) return

    window.onSpotifyWebPlaybackSDKReady = () => {

      const player = new Spotify.Player({
        name: "Spotify Clone Player",
        getOAuthToken: cb => { cb(token) },
        volume: 0.5
      })

      player.addListener("ready", ({ device_id }) => {
        console.log("Device Ready", device_id)
        setDeviceId(device_id)
      })

      player.connect()
    }

  },[token])

  return deviceId

}