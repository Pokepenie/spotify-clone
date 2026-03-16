import { useEffect, useState } from "react"
import axios from "axios"
import Home from "./pages/home"
import Login from "./pages/login"

function App(){

  const [token,setToken] = useState(null)

  useEffect(()=>{

    const params = new URLSearchParams(window.location.search)
    const code = params.get("code")

    if(code){

      axios.get(`http://localhost:3000/login?code=${code}`)
      .then(res => {

        const access_token = res.data.access_token

        window.localStorage.setItem("token", access_token)

        setToken(access_token)

        window.history.pushState({}, null, "/")

      })

    } else {

      const savedToken = window.localStorage.getItem("token")

      if(savedToken){
        setToken(savedToken)
      }

    }

  },[])

  return token ? <Home/> : <Login/>

}

export default App