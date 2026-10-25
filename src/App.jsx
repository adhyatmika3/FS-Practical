
import { useContext, useEffect, useState } from "react"
import { io } from "socket.io-client"
import Navbar from "./components/Navbar"
import HackathonCard from "./components/HackathonCard"
import Login from "./components/Login"
import hackathons from "./components/Hackathon"
import { UserContext } from "./context/UserContext"
import {
  isHackathonUpcoming,
  isHackathonCompleted,
  parseHackathonDate,
} from "./utils/dateUtils"

const API_URL = import.meta.env.VITE_API_URL || ""
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"

function formatDateForInput(dateStr) {
  if (!dateStr) return ""
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim())) {
    return dateStr.trim()
  }
  const parsed = parseHackathonDate(dateStr)
  if (parsed && !isNaN(parsed.getTime())) {
    const y = parsed.getFullYear()
    const m = String(parsed.getMonth() + 1).padStart(2, "0")
    const d = String(parsed.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }
  return ""
}

function App() {
  const { user, token, registeredHackathons, removeRegistration } =
    useContext(UserContext)

  const [showLogin, setShowLogin] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [filter, setFilter] = useState("upcoming")
  const [announcements, setAnnouncements] = useState([])
  const [connectionStatus, setConnectionStatus] = useState("Connecting...")
  const [announcementMessage, setAnnouncementMessage] = useState("")
  const [publishing, setPublishing] = useState(false)
  const [publishStatus, setPublishStatus] = useState("")

  // Hackathons state
  const [hackathonsList, setHackathonsList] = useState([])
  const [loadingHackathons, setLoadingHackathons] = useState(true)

  // Admin CRUD Modal state
  const [modalMode, setModalMode] = useState(null) // "create" | "edit" | null
  const [editingHackathonId, setEditingHackathonId] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    organizer: "",
    description: "",
    location: "",
    date: "",
    registrationDeadline: "",
  })
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")
  const [adminNotice, setAdminNotice] = useState("")

  // Delete confirmation modal state
  const [deletingHackathon, setDeletingHackathon] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  // Admin Registrations state
  const [adminRegistrations, setAdminRegistrations] = useState([])
  const [loadingAdminRegistrations, setLoadingAdminRegistrations] = useState(false)

  const role = user?.role || user?.user?.role
  const isAdmin = role?.toLowerCase() === "admin"

  const fetchHackathons = async () => {
    try {
      setLoadingHackathons(true)
      const response = await fetch(`${API_URL}/api/hackathons`)
      const data = await response.json()
      if (response.ok && data.success && Array.isArray(data.data)) {
        const normalized = data.data.map((item) => ({
          ...item,
          id: item._id || item.id,
          title: item.name || item.title || "Untitled Hackathon",
          name: item.name || item.title || "Untitled Hackathon",
          date: item.date,
          description: item.description || "",
          organizer: item.organizer || "",
          location: item.location || "",
          registrationDeadline: item.registrationDeadline || "",
        }))
        setHackathonsList(normalized)
      } else {
        // Fallback to static seed if API returned empty on fresh install
        setHackathonsList(hackathons)
      }
    } catch (error) {
      console.error("Error fetching hackathons:", error)
      setHackathonsList(hackathons)
    } finally {
      setLoadingHackathons(false)
      setLoaded(true)
    }
  }

  const fetchAdminRegistrations = async () => {
    if (!token || !isAdmin) return
    try {
      setLoadingAdminRegistrations(true)
      const response = await fetch(`${API_URL}/api/registrations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (response.ok && data.success && Array.isArray(data.data)) {
        setAdminRegistrations(data.data)
      }
    } catch (error) {
      console.error("Error loading admin registrations:", error)
    } finally {
      setLoadingAdminRegistrations(false)
    }
  }

  useEffect(() => {
    fetchHackathons()
  }, [])

  useEffect(() => {
    if (isAdmin && token) {
      fetchAdminRegistrations()
    }
  }, [isAdmin, token])

  const filteredHackathons = hackathonsList.filter((hackathon) => {
    if (filter === "completed") {
      return isHackathonCompleted(hackathon)
    }
    return isHackathonUpcoming(hackathon)
  })

  const headingText =
    filter === "completed" ? "Completed Hackathons" : "Upcoming Hackathons"

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter)
    setShowLogin(false)
  }

  const handleHome = () => {
    setFilter("upcoming")
    setShowLogin(false)
  }

  useEffect(() => {
    const socketConnection = io(SOCKET_URL)

    socketConnection.on("connect", () => {
      setConnectionStatus("Connected")
      socketConnection.emit("join-announcements")
    })

    socketConnection.on("disconnect", () => {
      setConnectionStatus("Disconnected")
    })

    socketConnection.on("connect_error", () => {
      setConnectionStatus("Connection failed")
    })

    socketConnection.on("new-announcement", (announcement) => {
      setAnnouncements((previous) => [...previous, announcement])
    })

    socketConnection.on("new-registration", () => {
      fetchAdminRegistrations()
    })

    return () => {
      socketConnection.disconnect()
    }
  }, [])

  const publishAnnouncement = async (event) => {
    event.preventDefault()

    if (!announcementMessage.trim() || !token) {
      setPublishStatus("Please log in and enter an announcement.")
      return
    }

    try {
      setPublishing(true)
      setPublishStatus("")

      const response = await fetch(`${API_URL}/api/announcements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: announcementMessage.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Could not publish announcement")
      }

      setAnnouncementMessage("")
      setPublishStatus("Announcement published successfully!")
    } catch (error) {
      setPublishStatus(error.message || "Failed to publish announcement.")
    } finally {
      setPublishing(false)
    }
  }

  // Admin Modal Handlers
  const handleOpenCreate = () => {
    setFormData({
      name: "",
      organizer: "",
      description: "",
      location: "",
      date: "",
      registrationDeadline: "",
    })
    setFormError("")
    setFormSuccess("")
    setEditingHackathonId(null)
    setModalMode("create")
  }

  const handleOpenEdit = (hackathon) => {
    setFormData({
      name: hackathon.name || hackathon.title || "",
      organizer: hackathon.organizer || "",
      description: hackathon.description || "",
      location: hackathon.location || "",
      date: formatDateForInput(hackathon.date),
      registrationDeadline: formatDateForInput(hackathon.registrationDeadline),
    })
    setFormError("")
    setFormSuccess("")
    setEditingHackathonId(hackathon.id || hackathon._id)
    setModalMode("edit")
  }

  const handleCloseModal = () => {
    setModalMode(null)
    setEditingHackathonId(null)
    setFormError("")
    setFormSuccess("")
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormError("")
    setFormSuccess("")

    if (!formData.name.trim()) {
      setFormError("Hackathon title/name is required.")
      return
    }
    if (!formData.organizer.trim()) {
      setFormError("Organizer is required.")
      return
    }
    if (!formData.location.trim()) {
      setFormError("Location is required.")
      return
    }
    if (!formData.date.trim()) {
      setFormError("Event date is required.")
      return
    }
    if (!formData.registrationDeadline.trim()) {
      setFormError("Registration deadline is required.")
      return
    }

    try {
      setFormSubmitting(true)
      const isEdit = modalMode === "edit"
      const url = isEdit
        ? `${API_URL}/api/hackathons/${editingHackathonId}`
        : `${API_URL}/api/hackathons`
      const method = isEdit ? "PUT" : "POST"

      const payload = {
        name: formData.name.trim(),
        organizer: formData.organizer.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        date: formData.date.trim(),
        registrationDeadline: formData.registrationDeadline.trim(),
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg =
          data.message ||
          (data.errors && data.errors.map((err) => err.message).join(", ")) ||
          "Operation failed"
        throw new Error(errorMsg)
      }

      const successMsg = isEdit
        ? "Hackathon updated successfully!"
        : "Hackathon created successfully!"

      setFormSuccess(successMsg)
      setAdminNotice(successMsg)
      await fetchHackathons()

      setTimeout(() => {
        handleCloseModal()
      }, 700)
    } catch (err) {
      setFormError(err.message || "An error occurred while saving the hackathon.")
    } finally {
      setFormSubmitting(false)
    }
  }

  // Delete Handlers
  const handleOpenDelete = (hackathon) => {
    setDeletingHackathon(hackathon)
    setDeleteError("")
  }

  const handleCancelDelete = () => {
    setDeletingHackathon(null)
    setDeleteError("")
  }

  const handleConfirmDelete = async () => {
    if (!deletingHackathon) return

    const hackathonId = deletingHackathon.id || deletingHackathon._id

    try {
      setDeleteLoading(true)
      setDeleteError("")

      const response = await fetch(`${API_URL}/api/hackathons/${hackathonId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete hackathon")
      }

      // Handle related registrations to prevent orphaned records
      if (removeRegistration) {
        removeRegistration(hackathonId)
      }

      await fetchHackathons()
      await fetchAdminRegistrations()
      setAdminNotice("Hackathon deleted successfully.")
      setDeletingHackathon(null)
    } catch (err) {
      setDeleteError(err.message || "Could not delete hackathon.")
    } finally {
      setDeleteLoading(false)
    }
  }

  if (!user && showLogin) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar
          onLogin={() => setShowLogin(true)}
          onHome={handleHome}
          onFilterChange={handleFilterChange}
        />
        <Login />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar
          onLogin={() => setShowLogin(true)}
          onHome={handleHome}
          onFilterChange={handleFilterChange}
        />

        <section className="text-center py-20 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome to Hackathon Hub
          </h1>

          <p className="text-gray-600 text-lg mb-6">
            Find a hackathon, register, and start building.
          </p>

          <button
            onClick={() => setShowLogin(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Login to Register
          </button>
        </section>

        <section className="max-w-4xl mx-auto px-6 pb-12">
          <Announcements
            status={connectionStatus}
            announcements={announcements}
          />
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {headingText}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHackathons.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-500 font-medium text-lg">
                  {filter === "completed"
                    ? "No completed hackathons"
                    : "No upcoming hackathons"}
                </p>
              </div>
            ) : (
              filteredHackathons.map((hackathon) => (
                <HackathonCard
                  key={hackathon.id}
                  id={hackathon.id}
                  title={hackathon.title}
                  date={hackathon.date}
                  description={hackathon.description}
                  canRegister={filter !== "completed"}
                  isAdmin={false}
                  hackathon={hackathon}
                />
              ))
            )}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        onLogin={() => setShowLogin(true)}
        onHome={handleHome}
        onFilterChange={handleFilterChange}
      />

      <section className="text-center py-12 px-4">
        {loaded && (
          <p className="text-green-600 font-medium mb-4">
            Hackathons loaded successfully!
          </p>
        )}

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Welcome to Hackathon Hub
        </h1>

        <p className="text-gray-600 text-lg">
          Find a hackathon, register, and start building.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-8">
        {adminNotice && (
          <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-xl flex justify-between items-center mb-6">
            <span className="font-medium">{adminNotice}</span>
            <button
              onClick={() => setAdminNotice("")}
              className="text-green-700 hover:text-green-900 font-bold text-lg leading-none"
            >
              &times;
            </button>
          </div>
        )}

        {isAdmin && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Admin Controls
                </h2>
                <p className="text-sm text-gray-500">
                  Create and manage hackathon events across the platform
                </p>
              </div>

              <button
                id="create-hackathon-button"
                onClick={handleOpenCreate}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm transition"
              >
                <span className="text-xl leading-none">+</span> Create Hackathon
              </button>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Broadcast Live Announcement
            </h3>

            <form onSubmit={publishAnnouncement}>
              <textarea
                value={announcementMessage}
                onChange={(event) =>
                  setAnnouncementMessage(event.target.value)
                }
                placeholder="Enter a hackathon announcement..."
                maxLength={1000}
                required
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-3 mb-3"
              />

              <button
                type="submit"
                disabled={publishing || !announcementMessage.trim()}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {publishing ? "Publishing..." : "Publish Announcement"}
              </button>

              {publishStatus && (
                <p className="mt-3 text-sm text-gray-700">
                  {publishStatus}
                </p>
              )}
            </form>
          </div>
        )}

        <Announcements
          status={connectionStatus}
          announcements={announcements}
        />
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {headingText}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHackathons.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500 font-medium text-lg">
                {filter === "completed"
                  ? "No completed hackathons"
                  : "No upcoming hackathons"}
              </p>
            </div>
          ) : (
            filteredHackathons.map((hackathon) => (
              <HackathonCard
                key={hackathon.id}
                id={hackathon.id}
                title={hackathon.title}
                date={hackathon.date}
                description={hackathon.description}
                canRegister={filter !== "completed"}
                isAdmin={isAdmin}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                hackathon={hackathon}
              />
            ))
          )}
        </div>
      </section>

      {/* Regular User: My Registrations (Hidden for Admin) */}
      {!isAdmin && (
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              My Registrations
            </h2>

            {registeredHackathons.length === 0 ? (
              <p className="text-gray-500">
                You have not registered for any hackathon yet.
              </p>
            ) : (
              <div className="space-y-3">
                {registeredHackathons.map((hackathon) => (
                  <div
                    key={hackathon.id || hackathon._id}
                    className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {hackathon.title || hackathon.name}
                      </h3>
                      <p className="text-blue-600 text-sm">{hackathon.date}</p>
                    </div>

                    <span className="text-green-600 font-medium text-sm flex items-center gap-1">
                      ✓ Registered
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Admin Only: Registered Participants Table */}
      {isAdmin && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Registered Participants
                  </h2>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                    Total: {adminRegistrations.length}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Manage participant registrations persisted across all events
                </p>
              </div>

              <button
                onClick={fetchAdminRegistrations}
                disabled={loadingAdminRegistrations}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-2 rounded-lg font-medium transition self-start sm:self-auto disabled:opacity-50"
              >
                {loadingAdminRegistrations ? "Refreshing..." : "↻ Refresh List"}
              </button>
            </div>

            {adminRegistrations.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl">
                <p className="text-gray-500 font-medium text-lg">
                  No registered participants found.
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  When users register for hackathons, their details will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                      <th className="py-3 px-4">Participant Name</th>
                      <th className="py-3 px-4">Participant Email</th>
                      <th className="py-3 px-4">Hackathon Name</th>
                      <th className="py-3 px-4">Hackathon Date</th>
                      <th className="py-3 px-4">Registration Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                    {adminRegistrations.map((reg) => (
                      <tr key={reg._id} className="hover:bg-gray-50 transition">
                        <td className="py-3.5 px-4 font-medium text-gray-900">
                          {reg.user?.name || "N/A"}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">
                          {reg.user?.email || "N/A"}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-blue-600">
                          {reg.hackathon?.name || "N/A"}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">
                          {reg.hackathon?.date || "N/A"}
                        </td>
                        <td className="py-3.5 px-4 text-gray-500">
                          {reg.createdAt
                            ? new Date(reg.createdAt).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Admin Create / Edit Modal */}
      {modalMode && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">
                {modalMode === "edit" ? "Edit Hackathon" : "Create New Hackathon"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none font-bold p-1"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg mb-4">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Hackathon Name / Title *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="e.g. AI Innovation Summit 2026"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Organizer *
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleFormChange}
                  placeholder="e.g. HackHub Global"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  placeholder="e.g. Bangalore, India / Virtual"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Registration Deadline *
                  </label>
                  <input
                    type="date"
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleFormChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Describe the challenge, tracks, and prizes..."
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {formSubmitting
                    ? "Saving..."
                    : modalMode === "edit"
                    ? "Update Hackathon"
                    : "Create Hackathon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Delete Confirmation Dialog */}
      {deletingHackathon && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50"
          onClick={handleCancelDelete}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Delete Hackathon
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Confirm permanent deletion of this event.
                </p>
              </div>
              <button
                onClick={handleCancelDelete}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none font-bold"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {deleteError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4">
                {deleteError}
              </div>
            )}

            <p className="text-gray-700 text-sm mb-4 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                &ldquo;{deletingHackathon.title || deletingHackathon.name}&rdquo;
              </span>
              ? All associated registrations will also be removed. This action
              cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCancelDelete}
                disabled={deleteLoading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Delete Hackathon"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Announcements({ status, announcements }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Live Hackathon Announcements
        </h2>

        <span className="text-sm text-gray-500">{status}</span>
      </div>

      {announcements.length === 0 ? (
        <p className="text-gray-500">
          No new announcements yet. Updates will appear here in real time.
        </p>
      ) : (
        <div className="space-y-3">
          {announcements.map((item, index) => (
            <div
              key={`${item.timestamp}-${index}`}
              className="border border-blue-200 bg-blue-50 rounded-lg p-4"
            >
              <p className="text-gray-800">{item.message}</p>

              <p className="text-xs text-gray-500 mt-2">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
