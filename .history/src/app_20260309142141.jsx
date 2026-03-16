import { useEffect, useState } from "react"
import Home from "./pages/home"
import Login from "./pages/login"

function App(){
  const [token,setToken] = useState(null)

  useEffect(()=>{
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if(!token && hash){
      token = hash
        .substring(1)
        .split("&")
        .find(elem => elem.startsWith("access_token"))
        .split("=")[1]

      window.location.hash = ""
      window.localStorage.setItem("token",token)
    }

    setToken(token)

  },[])

  return token ? <Home/> : <Login/>
}

export default App