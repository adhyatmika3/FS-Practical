import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"

function Login() {
  const { login } = useContext(UserContext)
  const [name, setName] = useState("")

  const handleLogin = () => {
    if (name.trim() !== "") {
      login(name)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md">

        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Login
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Login to Hackathon Hub
        </p>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Login
        </button>

      </div>
    </div>
  )
}

export default Login