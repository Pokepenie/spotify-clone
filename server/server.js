import express from "express"
import cors from "cors"
import axios from "axios"

const app = express()

app.use(cors())
app.use(express.json())

const CLIENT_ID = process.env.CLIENT_ID || "65ab0a32e29848beaff67950ccad6448"
const CLIENT_SECRET = process.env.CLIENT_SECRET || "b0f8d97527584c5b85d061b6ddc318e0"
const REDIRECT_URI = process.env.REDIRECT_URI || "http://127.0.0.1:5173"

app.post("/login", async (req,res)=>{

  const code = req.body.code

  try{

   const response = await axios.post(
  "https://accounts.spotify.com/api/token",

  new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: REDIRECT_URI
  }),

  {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64")
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

app.post("/refresh", async (req, res) => {

  const { refresh_token } = req.body

  try {

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",

      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token
      }),

      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64")
        }
      }
    )

    res.json(response.data)

  } catch(err) {

    console.log(err.response?.data || err)

    res.status(400).json({ error: "Token refresh failed" })

  }

})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Spotify auth server running on port ${PORT}`)
})