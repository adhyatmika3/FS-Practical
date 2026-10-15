import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const { onLogin } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Organizer');
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    setMessage(`Login successful as ${role}! Redirecting to Dashboard...`);

    setTimeout(() => {
      onLogin(role);
    }, 600);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to HackHub
            </h1>

            <p className="text-gray-600 text-sm leading-relaxed">
              Login to access your personalized hackathon dashboard, manage
              events, join teams, and track evaluations.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                1
              </span>

              <div>
                <h4 className="font-semibold text-gray-800 text-sm">
                  For Organizers
                </h4>
                <p className="text-gray-500 text-xs">
                  Create events, manage registrations, review submissions and
                  assign judges.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                2
              </span>

              <div>
                <h4 className="font-semibold text-gray-800 text-sm">
                  For Participants
                </h4>
                <p className="text-gray-500 text-xs">
                  Find hackathons, build teams, and submit project links before
                  deadlines.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                3
              </span>

              <div>
                <h4 className="font-semibold text-gray-800 text-sm">
                  For Mentors
                </h4>
                <p className="text-gray-500 text-xs">
                  Connect with assigned teams and provide expert guidance.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                4
              </span>

              <div>
                <h4 className="font-semibold text-gray-800 text-sm">
                  For Judges
                </h4>
                <p className="text-gray-500 text-xs">
                  Evaluate project submissions and submit official scoring
                  sheets.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Login to HackHub
          </h2>

          <p className="text-xs text-gray-500 mb-6">
            Select your role to access your dashboard
          </p>

          {message && (
            <div className="mb-5 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm font-medium">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Select Role
              </label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition"
              >
                <option value="Organizer">Organizer</option>
                <option value="Participant">Participant</option>
                <option value="Mentor">Mentor</option>
                <option value="Judge">Judge</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition shadow-sm mt-2"
            >
              Login
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;