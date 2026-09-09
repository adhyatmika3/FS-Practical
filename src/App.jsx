import { useState } from "react"
import Navbar from "./components/Navbar"
import HackathonCard from "./components/HackathonCard"
import Login from "./components/Login"

function App() {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar onLogin={() => setShowLogin(true)} />

      {!showLogin ? (
        <>
          {/* Hero Section */}
          <section className="text-center py-16 px-4">
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

          {/* Hackathons */}
          <section className="max-w-6xl mx-auto px-6 pb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Upcoming Hackathons
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              <HackathonCard
                title="Web Development Hackathon"
                date="20 September 2026"
                description="Create innovative web applications."
              />

              <HackathonCard
                title="AI Innovation Hackathon"
                date="25 September 2026"
                description="Build solutions using artificial intelligence."
              />

              <HackathonCard
                title="Mobile App Hackathon"
                date="30 September 2026"
                description="Develop a creative mobile application."
              />

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