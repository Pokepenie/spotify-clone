import { BrowserRouter,Routes,Route } from "react-router-dom"
import { useEffect,useState } from "react"
import axios from "axios"
import useSpotifyPlayer from "./hooks/useSpotifyPlayer"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Playlist from "./pages/Playlist"

export default function App(){


const token = localStorage.getItem("token")

const deviceId = useSpotifyPlayer(token)

  const [token,setToken] = useState(null)

  useEffect(()=>{

    const code = new URLSearchParams(window.location.search).get("code")

    if(code){

      axios.post("http://localhost:3000/login",{code})
      .then(res=>{

        const access_token = res.data.access_token

        localStorage.setItem("token",access_token)
        setToken(access_token)

        window.history.pushState({},null,"/")

      })

    }

    const saved = localStorage.getItem("token")
    if(saved) setToken(saved)

  },[])

  if(!token) return <Login/>

  return(

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home/>}/>
        <Route path="/playlist/:id" element={<Playlist/>}/>

      </Routes>

    </BrowserRouter>

  )

}