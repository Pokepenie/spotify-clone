import { useEffect, useState } from "react"
import Home from "./pages/home"
import Login from "./pages/login"

function App(){

  const [token,setToken] = useState(null)

  useEffect(()=>{

    const params = new URLSearchParams(window.location.search)
    const code = params.get("code")

    if(code){
      console.log("Spotify code received:", code)
    }

  },[])

  return token ? <Home/> : <Login/>

}

export default App