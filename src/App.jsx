import { useEffect, useState } from "react"
import Navbar from "./components/Navbar"
import HackathonCard from "./components/HackathonCard"
import Login from "./components/Login"
import hackathons from "./components/Hackathon"
import useHackathons from "./hooks/useHackathons"

function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const hackathonList = useHackathons(hackathons)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar
        onLogin={() => setShowLogin(true)}
        onHome={() => setShowLogin(false)}
      />

      {!showLogin ? (
        <>
          <section className="text-center py-16 px-4">

            {loaded && (
              <p className="text-green-600 font-medium mb-4">
                Hackathons loaded successfully!
              </p>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Join the Next Hackathon
            </h1>

            <p className="text-gray-600 text-lg mb-6">
              Build. Innovate. Compete.
            </p>

            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              Explore Hackathons
            </button>
          </section>

          <section className="max-w-6xl mx-auto px-6 pb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Upcoming Hackathons
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hackathonList.map((hackathon) => (
                <HackathonCard
                  key={hackathon.id}
                  title={hackathon.title}
                  date={hackathon.date}
                  description={hackathon.description}
                />
              ))}
            </div>
          </section>
        </>
      ) : (
        <Login />
      )}

    </div>
  )
}

export default App