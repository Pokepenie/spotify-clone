import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getUser } from "../api/spotify"

export default function Topbar() {

  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    async function load() {
      const data = await getUser(token)
      setUser(data)
    }
    load()
  }, [])

  return (

    <div className="topbar">

      <div className="topbar-nav">
        <button className="nav-btn" onClick={() => navigate(-1)}>&#8249;</button>
        <button className="nav-btn" onClick={() => navigate(1)}>&#8250;</button>
      </div>

      {user && (
        <div className="topbar-user">
          {user.images?.[0]?.url
            ? <img src={user.images[0].url} className="user-avatar" />
            : <div className="user-avatar-placeholder">{user.display_name?.[0]}</div>
          }
          <span className="user-name">{user.display_name}</span>
        </div>
      )}

    </div>

  )

}
