import { createContext, useState } from "react"

export const UserContext = createContext()

function UserProvider({ children }) {
  const [user, setUser] = useState(
    localStorage.getItem("user") || null
  )

  const [registeredHackathons, setRegisteredHackathons] = useState([])

  const login = (name) => {
    localStorage.setItem("user", name)
    setUser(name)
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
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