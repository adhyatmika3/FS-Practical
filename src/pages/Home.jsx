
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Home({ setPage }) {
  // useContext HOOK: Access shared user role directly from context
  const { loggedInRole } = useContext(AuthContext);
  return (
    <div>
      {/* HERO SECTION */}
      <section className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Next-Gen Hackathon Management
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-950 mb-3 tracking-tight">
              HackHub
            </h1>
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              Hackathon Management Platform
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              One unified platform connecting organizers, participants, mentors, and judges for seamless hackathon experiences, team coordination, and project evaluations.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setPage('hackathons')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition shadow-sm"
              >
                Explore Hackathons
              </button>
              {!loggedInRole ? (
                <button
                  onClick={() => setPage('login')}
                  className="bg-white hover:bg-blue-50 border border-blue-600 text-blue-600 font-semibold px-5 py-2.5 rounded-lg text-sm transition"
                >
                  Get Started / Login
                </button>
              ) : (
                <button
                  onClick={() => setPage('dashboard')}
                  className="bg-white hover:bg-blue-50 border border-blue-600 text-blue-600 font-semibold px-5 py-2.5 rounded-lg text-sm transition"
                >
                  Open {loggedInRole} Dashboard
                </button>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm flex flex-col justify-center">
            <h3 className="text-base font-bold text-gray-800 mb-2">Platform Capabilities</h3>
            <p className="text-xs text-gray-500 mb-4">Everything needed to orchestrate successful hackathons.</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-blue-50/50 border border-blue-100">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="font-medium text-gray-700">Live Hackathon Management & Registration</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-blue-50/50 border border-blue-100">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="font-medium text-gray-700">Team Formation & Collaboration</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-blue-50/50 border border-blue-100">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="font-medium text-gray-700">Expert Mentorship & Project Evaluation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">500+</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">Participants</p>
          </div>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">12</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">Hackathons Hosted</p>
          </div>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">95</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">Teams Formed</p>
          </div>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">30+</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">Mentors & Judges</p>
          </div>
        </div>
      </section>

      {/* WHO USES HACKHUB */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Who Uses HackHub?</h2>
          <p className="text-gray-500 text-sm mt-1">Four core stakeholders power the HackHub ecosystem.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            onClick={() => setPage(loggedInRole ? 'dashboard' : 'login')}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition cursor-pointer"
          >
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">01</span>
            <h3 className="font-bold text-gray-800 text-base mt-3 mb-1">Organizer</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Creates hackathons, sets timelines, manages announcements, registrations and project submissions.
            </p>
          </div>

          <div
            onClick={() => setPage(loggedInRole ? 'dashboard' : 'login')}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition cursor-pointer"
          >
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">02</span>
            <h3 className="font-bold text-gray-800 text-base mt-3 mb-1">Participant</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Discovers exciting events, registers, builds teams, and submits live projects before the deadline.
            </p>
          </div>

          <div
            onClick={() => setPage(loggedInRole ? 'dashboard' : 'login')}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition cursor-pointer"
          >
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">03</span>
            <h3 className="font-bold text-gray-800 text-base mt-3 mb-1">Mentor</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Guides assigned teams, provides technical mentorship sessions, and helps resolve blockers.
            </p>
          </div>

          <div
            onClick={() => setPage(loggedInRole ? 'dashboard' : 'login')}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition cursor-pointer"
          >
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">04</span>
            <h3 className="font-bold text-gray-800 text-base mt-3 mb-1">Judge</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Reviews project deliverables and assigns evaluation scores based on innovation and implementation.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How HackHub Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-3">1</div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">Register</h4>
              <p className="text-xs text-gray-500">Choose your role and join the HackHub community.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-3">2</div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">Join a Team</h4>
              <p className="text-xs text-gray-500">Collaborate with peers or organize your dream squad.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-3">3</div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">Build & Submit</h4>
              <p className="text-xs text-gray-500">Create your innovative solution and submit live links.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-3">4</div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">Get Evaluated</h4>
              <p className="text-xs text-gray-500">Receive expert feedback and project scores from judges.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-10 text-center text-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-2">Ready to participate in a hackathon?</h2>
          <p className="text-blue-100 text-sm mb-5">Browse our upcoming competitions and submit your ideas today.</p>
          <button
            onClick={() => setPage('hackathons')}
            className="bg-white text-blue-600 font-bold px-6 py-2.5 rounded-lg hover:bg-blue-50 text-sm shadow-sm transition"
          >
            Explore Hackathons Now
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
