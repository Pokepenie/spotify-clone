import { useEffect,useState } from "react"

import Login from "./pages/Login"
import Home from "./pages/Home"

export default function App(){

  const [token,setToken] = useState(null)

  useEffect(()=>{

    const hash = window.location.hash

if(hash){
  const token = hash
    .substring(1)
    .split("&")
    .find(elem => elem.startsWith("access_token"))
    .split("=")[1]

  window.location.hash = ""

  localStorage.setItem("token", token)
  setToken(token)
}
  },[])

  return token ? <Home/> : <Login/>

}