import { useContext, useEffect, useState } from "react"
import Navbar from "./components/Navbar"
import HackathonCard from "./components/HackathonCard"
import Login from "./components/Login"
import hackathons from "./components/Hackathon"
import useHackathons from "./hooks/useHackathons"
import { UserContext } from "./context/UserContext"

function App() {
  const { user, registeredHackathons } = useContext(UserContext)

  const [showLogin, setShowLogin] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const hackathonList = useHackathons(hackathons)

  useEffect(() => {
    setLoaded(true)
  }, [])

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

                  <p className="text-blue-600">
                    {hackathon.date}
                  </p>

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

export default App