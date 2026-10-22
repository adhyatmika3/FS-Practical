
import { useContext, useEffect, useState } from "react"
import { io } from "socket.io-client"
import Navbar from "./components/Navbar"
import HackathonCard from "./components/HackathonCard"
import Login from "./components/Login"
import hackathons from "./components/Hackathon"
import useHackathons from "./hooks/useHackathons"
import { UserContext } from "./context/UserContext"

const API_URL = import.meta.env.VITE_API_URL || ""
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"

function App() {
  const { user, token, registeredHackathons } = useContext(UserContext)

  const [showLogin, setShowLogin] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [announcements, setAnnouncements] = useState([])
  const [connectionStatus, setConnectionStatus] = useState("Connecting...")
  const [announcementMessage, setAnnouncementMessage] = useState("")
  const [publishing, setPublishing] = useState(false)
  const [publishStatus, setPublishStatus] = useState("")

  const hackathonList = useHackathons(hackathons)

  const role = user?.role || user?.user?.role
  const isAdmin = role?.toLowerCase() === "admin"

  useEffect(() => {
    const socketConnection = io(SOCKET_URL)

    socketConnection.on("connect", () => {
      setConnectionStatus("Connected")
      socketConnection.emit("join-announcements")
    })

    socketConnection.on("disconnect", () => {
      setConnectionStatus("Disconnected")
    })

    socketConnection.on("connect_error", () => {
      setConnectionStatus("Connection failed")
    })

    socketConnection.on("new-announcement", (announcement) => {
      setAnnouncements((previous) => [...previous, announcement])
    })

    setLoaded(true)

    return () => {
      socketConnection.disconnect()
    }
  }, [])

  const publishAnnouncement = async (event) => {
    event.preventDefault()

    if (!announcementMessage.trim() || !token) {
      setPublishStatus("Please log in and enter an announcement.")
      return
    }

    try {
      setPublishing(true)
      setPublishStatus("")

      const response = await fetch(`${API_URL}/api/announcements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: announcementMessage.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Could not publish announcement")
      }

      setAnnouncementMessage("")
      setPublishStatus("Announcement published successfully!")
    } catch (error) {
      setPublishStatus(error.message || "Failed to publish announcement.")
    } finally {
      setPublishing(false)
    }
  }

  const handleLogoutHome = () => {
    setShowLogin(false)
  }

  if (!user && showLogin) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar
          onLogin={() => setShowLogin(true)}
          onHome={() => setShowLogin(false)}
        />
        <Login />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar
          onLogin={() => setShowLogin(true)}
          onHome={() => setShowLogin(false)}
        />

        <section className="text-center py-20 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome to Hackathon Hub
          </h1>

          <p className="text-gray-600 text-lg mb-6">
            Find a hackathon, register, and start building.
          </p>

          <button
            onClick={() => setShowLogin(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Login to Register
          </button>
        </section>

        <section className="max-w-4xl mx-auto px-6 pb-12">
          <Announcements
            status={connectionStatus}
            announcements={announcements}
          />
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        onLogin={() => setShowLogin(true)}
        onHome={handleLogoutHome}
      />

      <section className="text-center py-12 px-4">
        {loaded && (
          <p className="text-green-600 font-medium mb-4">
            Hackathons loaded successfully!
          </p>
        )}

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Welcome to Hackathon Hub
        </h1>

        <p className="text-gray-600 text-lg">
          Find a hackathon, register, and start building.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-8">
        {isAdmin && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Admin: Publish Announcement
            </h2>

            <form onSubmit={publishAnnouncement}>
              <textarea
                value={announcementMessage}
                onChange={(event) =>
                  setAnnouncementMessage(event.target.value)
                }
                placeholder="Enter a hackathon announcement..."
                maxLength={1000}
                required
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-3 mb-3"
              />

              <button
                type="submit"
                disabled={publishing || !announcementMessage.trim()}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {publishing ? "Publishing..." : "Publish Announcement"}
              </button>

              {publishStatus && (
                <p className="mt-3 text-sm text-gray-700">
                  {publishStatus}
                </p>
              )}
            </form>
          </div>
        )}

        <Announcements
          status={connectionStatus}
          announcements={announcements}
        />
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Upcoming Hackathons
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathonList.map((hackathon) => (
            <HackathonCard
              key={hackathon.id}
              id={hackathon.id}
              title={hackathon.title}
              date={hackathon.date}
              description={hackathon.description}
            />
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            My Registrations
          </h2>

          {registeredHackathons.length === 0 ? (
            <p className="text-gray-500">
              You have not registered for any hackathon yet.
            </p>
          ) : (
            <div className="space-y-3">
              {registeredHackathons.map((hackathon) => (
                <div
                  key={hackathon.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="font-bold text-gray-800">
                    {hackathon.title}
                  </h3>

                  <p className="text-blue-600">{hackathon.date}</p>

                  <p className="text-green-600 font-medium mt-1">
                    ✓ Registered
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function Announcements({ status, announcements }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Live Hackathon Announcements
        </h2>

        <span className="text-sm text-gray-500">{status}</span>
      </div>

      {announcements.length === 0 ? (
        <p className="text-gray-500">
          No new announcements yet. Updates will appear here in real time.
        </p>
      ) : (
        <div className="space-y-3">
          {announcements.map((item, index) => (
            <div
              key={`${item.timestamp}-${index}`}
              className="border border-blue-200 bg-blue-50 rounded-lg p-4"
            >
              <p className="text-gray-800">{item.message}</p>

              <p className="text-xs text-gray-500 mt-2">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
