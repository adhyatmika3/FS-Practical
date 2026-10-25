
import { createContext, useState, useEffect } from "react"

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

  const fetchMyRegistrations = async (authToken = token) => {
    if (!authToken) {
      setRegisteredHackathons([])
      return
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || ""}/api/registrations/my`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      const data = await response.json()
      if (response.ok && data.success && Array.isArray(data.data)) {
        const mapped = data.data
          .filter((item) => item.hackathon)
          .map((item) => ({
            ...item.hackathon,
            id: item.hackathon._id || item.hackathon.id,
            title: item.hackathon.name || item.hackathon.title,
            registrationId: item._id,
            registrationDate: item.createdAt,
          }))
        setRegisteredHackathons(mapped)
      }
    } catch (error) {
      console.error("Error loading user registrations:", error)
    }
  }

  // Load registrations on mount if logged in
  useEffect(() => {
    if (token) {
      fetchMyRegistrations(token)
    }
  }, [token])

  const login = async (email, password) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || ""}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Login failed")
    }

    localStorage.setItem("user", JSON.stringify(data.user))
    localStorage.setItem("token", data.token)

    setUser(data.user)
    setToken(data.token)

    // Load persisted registrations for the logged in user
    await fetchMyRegistrations(data.token)

    return data.user
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    setToken(null)
    setRegisteredHackathons([])
  }

  const registerForHackathon = async (hackathon) => {
    if (!token) {
      throw new Error("Please log in to register for this hackathon.")
    }

    const hackathonId = hackathon.id || hackathon._id

    const response = await fetch(
      `${import.meta.env.VITE_API_URL || ""}/api/registrations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hackathonId }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to register for hackathon")
    }

    await fetchMyRegistrations(token)
    return data
  }

  const removeRegistration = (hackathonId) => {
    setRegisteredHackathons((previous) =>
      previous.filter((item) => item.id !== hackathonId && item._id !== hackathonId)
    )
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
        fetchMyRegistrations,
        removeRegistration,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
