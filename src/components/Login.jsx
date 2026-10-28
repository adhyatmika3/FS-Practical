
import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"

function Login({ onSwitchToSignup, initialEmail = "", successBanner = "" }) {
  const { login } = useContext(UserContext)

  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState(successBanner)
  const [isError, setIsError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage("")
    setIsError(false)
    setLoading(true)

    try {
      await login(email, password)
      setMessage("Login successful!")
      setIsError(false)
    } catch (error) {
      setMessage(error.message || "Unable to log in.")
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Login
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Login to Hackathon Hub
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 text-sm">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2 text-sm">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm font-medium text-center ${
                isError
                  ? "bg-red-50 border border-red-200 text-red-700"
                  : "bg-green-50 border border-green-200 text-green-700"
              }`}
              role="status"
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {onSwitchToSignup && (
            <div className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default Login
