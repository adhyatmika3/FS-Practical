
import { createContext, useState } from "react"

export const UserContext = createContext()

function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  )

  const [registeredHackathons, setRegisteredHackathons] = useState([])

  const login = async (email, password) => {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Login failed")
    }

    localStorage.setItem("user", JSON.stringify(data.user))
    localStorage.setItem("token", data.token)

    setUser(data.user)
    setToken(data.token)

    return data.user
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    setToken(null)
    setRegisteredHackathons([])
  }

  const registerForHackathon = (hackathon) => {
    setRegisteredHackathons((previous) => {
      if (previous.some((item) => item.id === hackathon.id)) {
        return previous
      }

      return [...previous, hackathon]
    })
  }

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        registeredHackathons,
        registerForHackathon,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
