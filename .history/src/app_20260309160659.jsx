import { useEffect,useState } from "react"

import Login from "./pages/Login"
import Home from "./pages/Home"

export default function App(){

  const [token,setToken] = useState(null)

  useEffect(()=>{

    const code = new URLSearchParams(
      window.location.search
    ).get("code")

    if(code){
      localStorage.setItem("token",code)
      setToken(code)
    }

  },[])

  return token ? <Home/> : <Login/>

}