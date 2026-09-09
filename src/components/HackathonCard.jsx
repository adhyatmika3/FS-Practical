import { useState } from "react"
import Modal from "./Modal"

function HackathonCard({ title, date, description }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300">

        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {title}
        </h2>

        <p className="text-blue-600 font-medium mb-3">
          {date}
        </p>

        <p className="text-gray-600 mb-5">
          {description}
        </p>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          View Details
        </button>

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