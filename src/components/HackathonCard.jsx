import { useContext, useState } from "react"
import Modal from "./Modal"
import { UserContext } from "../context/UserContext"
import { isUpcoming } from "../utils/dateUtils"

function HackathonCard({
  id,
  title,
  date,
  description,
  canRegister: propCanRegister,
  isAdmin = false,
  onEdit,
  onDelete,
  ...rest
}) {
  const [showModal, setShowModal] = useState(false)

  const {
    registeredHackathons,
    registerForHackathon,
  } = useContext(UserContext)

  const hackathonObj = rest.hackathon || { id, title, date, description, ...rest }
  const actualId = hackathonObj.id ?? hackathonObj._id ?? id
  const actualTitle = hackathonObj.title || hackathonObj.name || title
  const actualDate = hackathonObj.date || date
  const actualDescription = hackathonObj.description || description
  const actualStatus = isUpcoming(actualDate) ? "Upcoming" : "Completed"

  const hackathon = {
    ...hackathonObj,
    id: actualId,
    _id: actualId,
    title: actualTitle,
    name: actualTitle,
    date: actualDate,
    description: actualDescription,
    status: actualStatus,
  }

  const isRegistered = registeredHackathons.some(
    (item) => item.id === actualId || item._id === actualId
  )

  const [registering, setRegistering] = useState(false)
  const [regError, setRegError] = useState("")

  const handleRegister = async () => {
    try {
      setRegistering(true)
      setRegError("")
      await registerForHackathon(hackathon)
    } catch (err) {
      setRegError(err.message || "Registration failed")
    } finally {
      setRegistering(false)
    }
  }

  // Registration is available only for upcoming events and when canRegister is not explicitly false
  const isUpcomingEvent = actualStatus.toLowerCase() === "upcoming" || isUpcoming(actualDate)
  const allowRegistration = propCanRegister !== undefined ? propCanRegister : isUpcomingEvent

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2 mb-2">
            <h2 className="text-xl font-bold text-gray-800">
              {actualTitle}
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${
                actualStatus.toLowerCase() === "upcoming"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {actualStatus}
            </span>
          </div>

          <p className="text-blue-600 font-medium mb-3">
            {actualDate}
          </p>

          <p className="text-gray-600 mb-5">
            {actualDescription}
          </p>
        </div>

        <div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowModal(true)}
              className="bg-gray-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-gray-700 font-medium"
            >
              View Details
            </button>

            {allowRegistration && (
              <button
                onClick={handleRegister}
                disabled={isRegistered || registering}
                className={`px-3 py-1.5 text-sm rounded-lg text-white font-medium ${
                  isRegistered
                    ? "bg-green-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isRegistered ? "Registered" : registering ? "Registering..." : "Register"}
              </button>
            )}

            {isAdmin && onEdit && (
              <button
                onClick={() => onEdit(hackathon)}
                className="bg-amber-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-amber-700 font-medium"
              >
                Edit
              </button>
            )}

            {isAdmin && onDelete && (
              <button
                onClick={() => onDelete(hackathon)}
                className="bg-red-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-red-700 font-medium"
              >
                Delete
              </button>
            )}
          </div>

        {regError && (
          <p className="text-red-600 text-xs mt-2 font-medium">
            {regError}
          </p>
        )}

        {allowRegistration && isRegistered && (
          <p className="text-green-600 font-medium mt-4">
            ✓ You are registered for this hackathon!
          </p>
        )}
        </div>
      </div>

      {showModal && (
        <Modal
          hackathon={hackathon}
          title={actualTitle}
          date={actualDate}
          description={actualDescription}
          status={actualStatus}
          isRegistered={allowRegistration && isRegistered}
          canRegister={allowRegistration}
          onRegister={allowRegistration ? handleRegister : null}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

export default HackathonCard