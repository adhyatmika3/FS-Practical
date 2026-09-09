function Modal({ title, description, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">

      <div className="bg-white rounded-xl p-6 max-w-md w-full animate-fade-in">

        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {title}
        </h2>

        <p className="text-gray-600 mb-6">
          {description}
        </p>

        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Close
        </button>

      </div>

    </div>
  )
}

export default Modal