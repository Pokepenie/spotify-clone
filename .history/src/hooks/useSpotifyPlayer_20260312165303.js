import { useEffect, useState } from "react"

export default function useSpotifyPlayer(token){

  const [deviceId,setDeviceId] = useState(null)

  useEffect(()=>{

    if(!token) return

    window.onSpotifyWebPlaybackSDKReady = () => {

      const player = new window.Spotify.Player({
        name: "Spotify Clone Player",
        getOAuthToken: cb => { cb(token) },
        volume: 0.5
      })

      player.addListener("ready", async ({ device_id }) => {

        console.log("Spotify device ready:", device_id)

        setDeviceId(device_id)

        /* TRANSFER PLAYBACK TO THIS DEVICE */

        await fetch("https://api.spotify.com/v1/me/player",{
          method:"PUT",
          headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            device_ids:[device_id],
            play:false
          })
        })

      })

      player.connect()

    }

  },[token])

  return deviceId

}