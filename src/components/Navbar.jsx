import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"

function Navbar({
  onLogin,
  onHome,
  onFilterChange,
  onSelectFilter,
  onAnnouncements,
  announcements = [],
  readAnnouncementIds = [],
  onSelectAnnouncement,
  onMarkAllRead,
}) {
  const [open, setOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)

  const {
    user,
    logout,
    registeredHackathons,
  } = useContext(UserContext)

  const unreadCount = announcements.filter(
    (a) => !readAnnouncementIds.includes(String(a._id || a.id))
  ).length

  const handleFilter = (filterType) => {
    if (onFilterChange) onFilterChange(filterType)
    if (onSelectFilter) onSelectFilter(filterType)
    setOpen(false)
  }

  const handleHomeClick = () => {
    if (onHome) onHome()
    setOpen(false)
    setBellOpen(false)
  }

  const handleAnnouncementsClick = () => {
    if (onAnnouncements) onAnnouncements()
    setOpen(false)
    setBellOpen(false)
  }

  const handleNotificationClick = (item) => {
    if (onSelectAnnouncement) {
      onSelectAnnouncement(item)
    } else if (onAnnouncements) {
      onAnnouncements()
    }
    setBellOpen(false)
  }

  const getPriorityTag = (priority) => {
    const p = (priority || "Normal").toLowerCase()
    if (p === "urgent") {
      return (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">
          Urgent
        </span>
      )
    }
    if (p === "important") {
      return (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
          Important
        </span>
      )
    }
    return (
      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
        Normal
      </span>
    )
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        <h1
          onClick={handleHomeClick}
          className="text-2xl font-bold cursor-pointer"
        >
          Hackathon Hub
        </h1>

        <div className="flex gap-6 items-center">

          {user && (
            <>
              <span className="text-blue-200 text-sm">
                Welcome, {typeof user === "object" ? user.name : user}
              </span>

              <span className="bg-blue-500 px-3 py-1 rounded-full text-xs">
                Registrations: {registeredHackathons.length}
              </span>
            </>
          )}

          <button
            onClick={handleHomeClick}
            className="hover:text-blue-200 cursor-pointer"
          >
            Home
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setOpen(!open)
                setBellOpen(false)
              }}
              className="hover:text-blue-200 cursor-pointer"
            >
              Hackathons ▼
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg z-10">

                <button
                  onClick={() => handleFilter("upcoming")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Upcoming
                </button>

                <button
                  onClick={() => handleFilter("completed")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Completed
                </button>

              </div>
            )}
          </div>

          <button
            onClick={handleAnnouncementsClick}
            className="hover:text-blue-200 cursor-pointer"
          >
            Announcements
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setBellOpen(!bellOpen)
                setOpen(false)
              }}
              className="relative p-1.5 rounded-full hover:bg-blue-700 transition focus:outline-none cursor-pointer flex items-center justify-center text-white"
              title="Notifications"
              aria-label="Announcements notifications"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {bellOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && onMarkAllRead && (
                    <button
                      onClick={onMarkAllRead}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                  {announcements.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 text-xs">
                      No announcements yet.
                    </div>
                  ) : (
                    announcements.slice(0, 6).map((item) => {
                      const id = String(item._id || item.id)
                      const isUnread = !readAnnouncementIds.includes(id)

                      return (
                        <div
                          key={id || item.timestamp}
                          onClick={() => handleNotificationClick(item)}
                          className={`p-3 text-left hover:bg-gray-50 transition cursor-pointer flex gap-3 items-start ${
                            isUnread ? "bg-blue-50/40" : ""
                          }`}
                        >
                          <div className="mt-1 shrink-0">
                            {isUnread ? (
                              <span className="w-2 h-2 rounded-full bg-blue-600 block"></span>
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-gray-300 block"></span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <p className="text-xs font-bold text-gray-900 truncate">
                                {item.title || "Announcement"}
                              </p>
                              {getPriorityTag(item.priority)}
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {item.message}
                            </p>
                            <span className="text-[10px] text-gray-400 mt-1 block">
                              {item.createdAt
                                ? new Date(item.createdAt).toLocaleDateString(
                                    undefined,
                                    {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )
                                : "Recent"}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
                  <button
                    onClick={handleAnnouncementsClick}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 py-1 block w-full cursor-pointer"
                  >
                    View All Announcements →
                  </button>
                </div>
              </div>
            )}
          </div>

          {user ? (
            <button
              onClick={logout}
              className="hover:text-blue-200 cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={onLogin}
              className="hover:text-blue-200 cursor-pointer"
            >
              Login
            </button>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar