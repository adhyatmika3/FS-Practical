import { useContext, useState } from "react"
import Modal from "./Modal"
import { UserContext } from "../context/UserContext"

function HackathonCard({ id, title, date, description }) {
  const [showModal, setShowModal] = useState(false)

  const {
    registeredHackathons,
    registerForHackathon,
  } = useContext(UserContext)

  const hackathon = {
    id,
    title,
    date,
    description,
  }

  const isRegistered = registeredHackathons.some(
    (item) => item.id === id
  )

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">

        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {title}
        </h2>

        <p className="text-blue-600 font-medium mb-3">
          {date}
        </p>

        <p className="text-gray-600 mb-5">
          {description}
        </p>

        <div className="flex gap-3">

          <button
            onClick={() => setShowModal(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            View Details
          </button>

          <button
            onClick={() => registerForHackathon(hackathon)}
            disabled={isRegistered}
            className={`px-4 py-2 rounded-lg text-white ${
              isRegistered
                ? "bg-green-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isRegistered ? "Registered" : "Register"}
          </button>

        </div>

        {isRegistered && (
          <p className="text-green-600 font-medium mt-4">
            ✓ You are registered for this hackathon!
          </p>
        )}

      </div>

      {showModal && (
        <Modal
          title={title}
          description={description}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

export default HackathonCard