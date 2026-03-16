import express from "express"
import axios from "axios"
import cors from "cors"

const app = express()
app.use(cors())

const CLIENT_ID = "YOUR_CLIENT_ID"
const CLIENT_SECRET = "YOUR_CLIENT_SECRET"
const REDIRECT_URI = "http://127.0.0.1:5173"

app.get("/login", async (req,res)=>{

  const code = req.query.code

  const params = new URLSearchParams()
  params.append("grant_type","authorization_code")
  params.append("code",code)
  params.append("redirect_uri",REDIRECT_URI)

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    params,
    {
      headers:{
        "Content-Type":"application/x-www-form-urlencoded",
        Authorization:
        "Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64")
      }
    }
  )

  res.json(response.data)

})

app.listen(3000,()=>{
  console.log("Server running on port 3000")
})