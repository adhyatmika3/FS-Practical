import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"

function Navbar({ onLogin, onHome, onFilterChange, onSelectFilter }) {
  const [open, setOpen] = useState(false)

  const {
    user,
    logout,
    registeredHackathons,
  } = useContext(UserContext)

  const handleFilter = (filterType) => {
    if (onFilterChange) onFilterChange(filterType)
    if (onSelectFilter) onSelectFilter(filterType)
    setOpen(false)
  }

  const handleHomeClick = () => {
    if (onHome) onHome()
    setOpen(false)
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        <h1
          onClick={handleHomeClick}
          className="text-2xl font-bold cursor-pointer"
        >
          Hackathon Hub
        </h1>

        <div className="flex gap-6 items-center">

          {user && (
            <>
             <span className="text-blue-200">
  Welcome, {typeof user === "object" ? user.name : user}
</span>

              <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">
                Registrations: {registeredHackathons.length}
              </span>
            </>
          )}

          <button
            onClick={handleHomeClick}
            className="hover:text-blue-200"
          >
            Home
          </button>

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
                  onClick={() => handleFilter("upcoming")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Upcoming
                </button>

                <button
                  onClick={() => handleFilter("completed")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Completed
                </button>

              </div>
            )}
          </div>

          {user ? (
            <button
              onClick={logout}
              className="hover:text-blue-200"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={onLogin}
              className="hover:text-blue-200"
            >
              Login
            </button>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar