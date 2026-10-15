// src/pages/Dashboard.jsx
// -------------------------------------------------------
// PAGE: Dashboard
// -------------------------------------------------------
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// 1. ORGANIZER DASHBOARD
function OrganizerDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Organizer Dashboard</h2>
        <p className="text-gray-500 text-sm">Manage hackathons, monitor registrations, and oversee operations.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
          <p className="text-3xl font-bold text-blue-600">3</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">Active Hackathons</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
          <p className="text-3xl font-bold text-blue-600">120</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">Participants</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
          <p className="text-3xl font-bold text-blue-600">10</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">Mentors Assigned</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
          <p className="text-3xl font-bold text-blue-600">5</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">Judges on Panel</p>
        </div>
      </div>

      {/* Active Hackathon Info */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-4">Upcoming Hackathon Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-500 block">Name</span>
            <span className="font-semibold text-gray-800">AI Innovation Hackathon</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-500 block">Date</span>
            <span className="font-semibold text-gray-800">15 September 2026</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-500 block">Mode</span>
            <span className="font-semibold text-green-700">Online</span>
          </div>
        </div>
      </div>

      {/* Two-column Lists: Registrations & Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-3">Recent Registrations</h3>
          <ul className="space-y-2.5 text-sm">
            <li className="p-2.5 bg-blue-50/50 rounded-lg border-l-4 border-blue-600 text-gray-700">
              Amit Sharma registered as <strong>Participant</strong>
            </li>
            <li className="p-2.5 bg-blue-50/50 rounded-lg border-l-4 border-blue-600 text-gray-700">
              Priya Nair registered as <strong>Participant</strong>
            </li>
            <li className="p-2.5 bg-blue-50/50 rounded-lg border-l-4 border-blue-600 text-gray-700">
              Dr. Ravi Kumar onboarded as <strong>Mentor</strong>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-3">Recent Announcements</h3>
          <ul className="space-y-2.5 text-sm">
            <li className="p-2.5 bg-gray-50 rounded-lg border-l-4 border-gray-400 text-gray-700">
              Submission deadline for AI Innovation Hackathon is set to 20 Sep.
            </li>
            <li className="p-2.5 bg-gray-50 rounded-lg border-l-4 border-gray-400 text-gray-700">
              Judging criteria rubrics released for Smart India Challenge.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// 2. PARTICIPANT DASHBOARD
function ParticipantDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Participant Dashboard</h2>
        <p className="text-gray-500 text-sm">Track your registered hackathons, team status, and project submissions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Registered Event</span>
          <h3 className="text-xl font-bold text-gray-900 mt-2 mb-1">AI Innovation Hackathon</h3>
          <p className="text-xs text-gray-500 mb-4">Category: Artificial Intelligence</p>
          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            Status: Active
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">My Team</span>
          <h3 className="text-xl font-bold text-gray-900 mt-2 mb-1">Team Alpha</h3>
          <p className="text-xs text-gray-500 mb-4">4 Members (Leader: You)</p>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            Team Complete
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Submission Status</span>
          <h3 className="text-xl font-bold text-gray-900 mt-2 mb-1">In Progress</h3>
          <p className="text-xs text-gray-500 mb-4">Deadline: 20 September 2026</p>
          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            Pending Upload
          </span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-3">Project Submission Checklist</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-green-600 font-bold">✓</span> GitHub Repository created and connected
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-green-600 font-bold">✓</span> Team members confirmed
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-yellow-600 font-bold">○</span> Demo video upload (Pending)
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. MENTOR DASHBOARD
function MentorDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h2>
        <p className="text-gray-500 text-sm">Support assigned teams, provide technical guidance, and review progress.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
          <p className="text-3xl font-bold text-blue-600">3</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">Assigned Teams</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
          <p className="text-3xl font-bold text-blue-600">2</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">Upcoming Sessions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-3">Assigned Teams</h3>
          <ul className="space-y-2 text-sm">
            <li className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
              <span className="font-semibold text-gray-800">Team Alpha</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">AI Hackathon</span>
            </li>
            <li className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
              <span className="font-semibold text-gray-800">Team Beta</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Web Dev</span>
            </li>
            <li className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
              <span className="font-semibold text-gray-800">Team Gamma</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Smart India</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-3">Recent Mentorship Feedback</h3>
          <ul className="space-y-2 text-sm">
            <li className="p-3 bg-blue-50/50 rounded-lg border-l-4 border-blue-600">
              <p className="font-semibold text-gray-800">Team Alpha</p>
              <p className="text-xs text-gray-500 mt-0.5">Recommended refining the machine learning model dataset.</p>
            </li>
            <li className="p-3 bg-blue-50/50 rounded-lg border-l-4 border-blue-600">
              <p className="font-semibold text-gray-800">Team Beta</p>
              <p className="text-xs text-gray-500 mt-0.5">Approved REST API architecture and database schema.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// 4. JUDGE DASHBOARD
function JudgeDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Judge Dashboard</h2>
        <p className="text-gray-500 text-sm">Review submitted projects and submit evaluation scores.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
          <p className="text-3xl font-bold text-blue-600">8</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">Assigned Submissions</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
          <p className="text-3xl font-bold text-orange-600">3</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">Pending Evaluations</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
          <p className="text-3xl font-bold text-green-600">5</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">Completed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-3">Pending Evaluations</h3>
          <ul className="space-y-2 text-sm">
            <li className="p-3 bg-orange-50/50 rounded-lg border border-orange-200 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">Smart Traffic System</p>
                <p className="text-xs text-gray-500">By Team Delta</p>
              </div>
              <button className="bg-orange-600 text-white text-xs font-semibold px-3 py-1 rounded">Evaluate</button>
            </li>
            <li className="p-3 bg-orange-50/50 rounded-lg border border-orange-200 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">AI Student Assistant</p>
                <p className="text-xs text-gray-500">By Team Sigma</p>
              </div>
              <button className="bg-orange-600 text-white text-xs font-semibold px-3 py-1 rounded">Evaluate</button>
            </li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-3">Completed Scores</h3>
          <ul className="space-y-2 text-sm">
            <li className="p-3 bg-green-50/50 rounded-lg border border-green-200 flex items-center justify-between">
              <span className="font-semibold text-gray-800">Team Alpha (AI Innovation)</span>
              <span className="text-xs font-bold text-green-800 bg-green-100 px-2 py-0.5 rounded">88 / 100</span>
            </li>
            <li className="p-3 bg-green-50/50 rounded-lg border border-green-200 flex items-center justify-between">
              <span className="font-semibold text-gray-800">Team Beta (Web Platform)</span>
              <span className="text-xs font-bold text-green-800 bg-green-100 px-2 py-0.5 rounded">92 / 100</span>
            </li>
            <li className="p-3 bg-green-50/50 rounded-lg border border-green-200 flex items-center justify-between">
              <span className="font-semibold text-gray-800">Team Gamma (Healthcare)</span>
              <span className="text-xs font-bold text-green-800 bg-green-100 px-2 py-0.5 rounded">85 / 100</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// 5. DEFAULT DASHBOARD (when not logged in)
function DefaultDashboard({ setPage }) {
  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Platform Overview Dashboard</h2>
          <p className="text-gray-600 text-xs mt-1">
            You are viewing the public platform metrics. Login to view your role-specific dashboard.
          </p>
        </div>
        <button
          onClick={() => setPage('login')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-xs transition"
        >
          Login for Role View
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
          <p className="text-3xl font-bold text-blue-600">3</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">Hackathons</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
          <p className="text-3xl font-bold text-blue-600">120</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">Participants</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
          <p className="text-3xl font-bold text-blue-600">25</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">Teams</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
          <p className="text-3xl font-bold text-blue-600">15</p>
          <p className="text-xs text-gray-500 mt-1 font-medium">Mentors & Judges</p>
        </div>
      </div>
    </div>
  );
}

// MAIN DASHBOARD EXPORT
function Dashboard({ setPage }) {
  // useContext HOOK: Access shared user role directly from context
  const { loggedInRole: role } = useContext(AuthContext);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {role === 'Organizer'   && <OrganizerDashboard />}
      {role === 'Participant' && <ParticipantDashboard />}
      {role === 'Mentor'      && <MentorDashboard />}
      {role === 'Judge'       && <JudgeDashboard />}
      {!role                  && <DefaultDashboard setPage={setPage} />}
    </div>
  );
}

export default Dashboard;
