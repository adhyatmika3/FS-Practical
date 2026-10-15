
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import HackathonCard from '../components/HackathonCard';

function Hackathons({ setPage }) {
  // 2. useContext HOOK: Access shared logged-in role directly without prop drilling
  const { loggedInRole } = useContext(AuthContext);

  // 3. CUSTOM HOOK (useFetch): Reusable data-fetching hook built with useEffect + useState
  const { data, loading, error } = useFetch('/hackathons.json');

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header Banner */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Explore Hackathons</h1>
        <p className="text-gray-500 text-sm mt-1">
          Discover competitions, build innovative projects, and win exciting prizes.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-3"></div>
          <p className="text-gray-600 font-medium text-sm">Loading hackathons...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
          <p className="font-semibold text-sm">{error}</p>
        </div>
      )}

      {/* Hackathon Cards List */}
      {data && (
        <div className="space-y-4">
          {data.map((hackathon) => (
            <HackathonCard key={hackathon.id} hackathon={hackathon} />
          ))}
        </div>
      )}

      {/* Dynamic Action Banner based on login state */}
      {!loggedInRole && data && (
        <div className="mt-10 bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-800 text-base">Want to participate or manage hackathons?</h3>
            <p className="text-gray-600 text-xs mt-1">Create an account or login to access your role-specific dashboard.</p>
          </div>
          <button
            onClick={() => setPage('login')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition shrink-0"
          >
            Login to Get Started
          </button>
        </div>
      )}

      {loggedInRole && data && (
        <div className="mt-10 bg-green-50 border border-green-200 rounded-xl p-5 flex items-center justify-between">
          <p className="text-sm text-green-800">
            You are logged in as <span className="font-bold">{loggedInRole}</span>.
          </p>
          <button
            onClick={() => setPage('dashboard')}
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            Open Dashboard &rarr;
          </button>
        </div>
      )}
    </div>
  );
}

export default Hackathons;
