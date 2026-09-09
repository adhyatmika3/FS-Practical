import { useState } from "react"

function Navbar({ onLogin }) {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-blue-600 text-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-2xl font-bold">
          Hackathon Hub
        </h1>

        {/* Navigation */}
        <div className="flex gap-6 items-center">

          <button
  onClick={() => window.location.reload()}
  className="hover:text-blue-200"
>
  Home
</button>

          {/* Hackathons Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="hover:text-blue-200"
            >
              Hackathons ▼
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg z-10">

                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Upcoming
                </button>

                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Completed
                </button>

              </div>
            )}
          </div>

          {/* Login */}
          <button
            onClick={onLogin}
            className="hover:text-blue-200"
          >
            Login
          </button>

        </div>
      </div>
    </nav>
  )
}

export default Navbar