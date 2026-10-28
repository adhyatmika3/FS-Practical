import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"

function Signup({ onSwitchToLogin, onSuccess }) {
  const userContext = useContext(UserContext)
  const signup = userContext?.signup

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const validate = () => {
    if (!name.trim()) {
      return "Full name is required"
    }
    if (!email.trim()) {
      return "Email address is required"
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email address"
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }
    if (password !== confirmPassword) {
      return "Passwords do not match"
    }
    return null
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const cleanName = name.trim()
      const cleanEmail = email.trim().toLowerCase()

      if (signup) {
        await signup(cleanName, cleanEmail, password)
      } else {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || ""}/api/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: cleanName,
              email: cleanEmail,
              password,
            }),
          }
        )

        const data = await response.json()

        if (!response.ok) {
          const message =
            data.message ||
            (Array.isArray(data.errors) && data.errors[0]?.msg) ||
            "Registration failed"
          throw new Error(message)
        }
      }

      setSuccess("Account created successfully! Redirecting to login...")

      setTimeout(() => {
        if (onSuccess) {
          onSuccess(cleanEmail)
        } else if (onSwitchToLogin) {
          onSwitchToLogin()
        }
      }, 1200)
    } catch (err) {
      setError(err.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Create Account
        </h1>

        <p className="text-gray-500 text-center mb-6 text-sm">
          Join HackHub to participate in hackathons
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1.5 text-sm">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1.5 text-sm">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1.5 text-sm">
              Password
            </label>
            <input
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
              minLength={8}
            />
            <p className="text-xs text-gray-400 mt-1">Must be at least 8 characters</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1.5 text-sm">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {error && (
            <div
              className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium text-center"
              role="alert"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium text-center"
              role="status"
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer shadow-sm mt-2"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {onSwitchToLogin && (
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline cursor-pointer"
              >
                Log In
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default Signup
