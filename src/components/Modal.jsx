function Modal({
  title,
  description,
  date,
  status,
  hackathon,
  isRegistered,
  canRegister = true,
  onRegister,
  onClose,
}) {
  const eventTitle = title || hackathon?.title || hackathon?.name || "Hackathon Details"
  const eventDate = date || hackathon?.date
  const eventDescription = description || hackathon?.description
  const eventStatus = status || hackathon?.status

  const location = hackathon?.location
  const organizer = hackathon?.organizer
  const deadline = hackathon?.registrationDeadline

  const isUpcoming = eventStatus?.toLowerCase() === "upcoming"
  const allowRegistration = canRegister && isUpcoming

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 max-w-lg w-full animate-fade-in shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {eventTitle}
            </h2>
            {eventStatus && (
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  isUpcoming
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {eventStatus}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none font-bold p-1"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="space-y-3 mb-6 text-sm">
          {eventDate && (
            <div className="flex items-center text-gray-700">
              <span className="font-semibold w-24 text-gray-500">Date:</span>
              <span className="font-medium text-blue-600">{eventDate}</span>
            </div>
          )}

          {location && (
            <div className="flex items-center text-gray-700">
              <span className="font-semibold w-24 text-gray-500">Location:</span>
              <span>{location}</span>
            </div>
          )}

          {organizer && (
            <div className="flex items-center text-gray-700">
              <span className="font-semibold w-24 text-gray-500">Organizer:</span>
              <span>{organizer}</span>
            </div>
          )}

          {deadline && (
            <div className="flex items-center text-gray-700">
              <span className="font-semibold w-24 text-gray-500">Deadline:</span>
              <span>{deadline}</span>
            </div>
          )}

          {eventDescription && (
            <div>
              <span className="font-semibold block text-gray-500 mb-1">
                Description:
              </span>
              <p className="text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                {eventDescription}
              </p>
            </div>
          )}
        </div>

        {allowRegistration && isRegistered && (
          <p className="text-green-600 font-medium text-sm mb-4">
            ✓ You are registered for this hackathon!
          </p>
        )}

        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium"
          >
            Close
          </button>

          {allowRegistration && onRegister && (
            <button
              onClick={onRegister}
              disabled={isRegistered}
              className={`px-5 py-2 rounded-lg text-white font-medium ${
                isRegistered
                  ? "bg-green-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isRegistered ? "Registered" : "Register"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Modal