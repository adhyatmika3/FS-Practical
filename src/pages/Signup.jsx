import Signup from "../components/Signup"

function SignupPage({ setPage, onSwitchToLogin, onSuccess }) {
  const handleSwitchToLogin = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin()
    } else if (setPage) {
      setPage("login")
    }
  }

  const handleSuccess = (email) => {
    if (onSuccess) {
      onSuccess(email)
    } else if (setPage) {
      setPage("login")
    }
  }

  return (
    <Signup
      onSwitchToLogin={handleSwitchToLogin}
      onSuccess={handleSuccess}
    />
  )
}

export default SignupPage
