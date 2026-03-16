import express from "express"
import cors from "cors"
import axios from "axios"

const app = express()

app.use(cors())
app.use(express.json())

const CLIENT_ID = "65ab0a32e29848beaff67950ccad6448"
const CLIENT_SECRET = "YOUR_CLIENT_SECRET"
const REDIRECT_URI = "http://127.0.0.1:5173"

app.post("/login", async (req,res)=>{

  const code = req.body.code

  try{

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",

      new URLSearchParams({
        grant_type:"authorization_code",
        code:code,
        redirect_uri:REDIRECT_URI,
        client_id:CLIENT_ID,
        client_secret:CLIENT_SECRET
      }),

      {
        headers:{
          "Content-Type":"application/x-www-form-urlencoded"
        }
      }
    )

    res.json(response.data)

  }catch(err){

    console.log(err.response?.data || err)

    res.status(400).json({
      error:"Token exchange failed"
    })

  }

})

app.listen(3000,()=>{
  console.log("Spotify auth server running on port 3000")
})