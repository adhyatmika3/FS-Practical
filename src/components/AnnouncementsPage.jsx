import { useState } from "react"

function AnnouncementsPage({
  announcements = [],
  loading = false,
  error = "",
  isAdmin = false,
  token = "",
  apiUrl = "",
  onRefresh,
  highlightedId = null,
}) {
  // Admin form / modal states
  const [modalMode, setModalMode] = useState(null) // "create" | "edit" | null
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    priority: "Normal",
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")

  // Delete confirmation modal state
  const [deletingAnnouncement, setDeletingAnnouncement] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  const openCreateModal = () => {
    setFormData({
      title: "",
      message: "",
      priority: "Normal",
    })
    setFormError("")
    setFormSuccess("")
    setEditingId(null)
    setModalMode("create")
  }

  const openEditModal = (announcement) => {
    setFormData({
      title: announcement.title || "",
      message: announcement.message || "",
      priority: announcement.priority || "Normal",
    })
    setFormError("")
    setFormSuccess("")
    setEditingId(announcement._id || announcement.id)
    setModalMode("edit")
  }

  const closeModal = () => {
    setModalMode(null)
    setEditingId(null)
    setFormError("")
    setFormSuccess("")
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormError("")
    setFormSuccess("")

    if (!formData.title.trim()) {
      setFormError("Announcement title is required")
      return
    }
    if (!formData.message.trim()) {
      setFormError("Announcement message is required")
      return
    }

    setFormLoading(true)

    try {
      const url =
        modalMode === "edit"
          ? `${apiUrl}/api/announcements/${editingId}`
          : `${apiUrl}/api/announcements`
      const method = modalMode === "edit" ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          message: formData.message.trim(),
          priority: formData.priority,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            (Array.isArray(data.errors) && data.errors[0]?.message) ||
            "Failed to save announcement"
        )
      }

      setFormSuccess(
        modalMode === "edit"
          ? "Announcement updated successfully!"
          : "Announcement published successfully!"
      )

      if (onRefresh) onRefresh()

      setTimeout(() => {
        closeModal()
      }, 800)
    } catch (err) {
      setFormError(err.message || "An error occurred while saving.")
    } finally {
      setFormLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingAnnouncement) return
    setDeleteError("")
    setDeleteLoading(true)

    try {
      const id = deletingAnnouncement._id || deletingAnnouncement.id
      const response = await fetch(`${apiUrl}/api/announcements/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete announcement")
      }

      if (onRefresh) onRefresh()
      setDeletingAnnouncement(null)
    } catch (err) {
      setDeleteError(err.message || "Failed to delete announcement")
    } finally {
      setDeleteLoading(false)
    }
  }

  const getPriorityBadge = (priority) => {
    const p = (priority || "Normal").toLowerCase()
    if (p === "urgent") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
          Urgent
        </span>
      )
    }
    if (p === "important") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
          Important
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
        Normal
      </span>
    )
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "Just now"
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              Announcements
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Live Feed
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Stay updated with official hackathon announcements, deadlines, and schedule changes.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm transition text-sm shrink-0 cursor-pointer"
          >
            <span className="text-lg leading-none font-bold">+</span> Post Announcement
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-3"></div>
          <p className="text-gray-600 font-medium text-sm">
            Loading announcements...
          </p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700 shadow-sm mb-6">
          <p className="font-semibold text-sm mb-2">{error}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="text-xs bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition cursor-pointer"
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && announcements.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm max-w-xl mx-auto">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            📢
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            No Announcements Yet
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            There are no announcements published at the moment. When administrators post updates, they will appear here in real time.
          </p>
          {isAdmin && (
            <button
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition shadow-sm cursor-pointer"
            >
              Post First Announcement
            </button>
          )}
        </div>
      )}

      {/* Announcements List (Newest first) */}
      {!loading && !error && announcements.length > 0 && (
        <div className="space-y-5">
          {announcements.map((item) => {
            const id = item._id || item.id
            const isHighlighted = highlightedId && String(highlightedId) === String(id)

            return (
              <article
                key={id || item.timestamp}
                id={`announcement-${id}`}
                className={`bg-white border rounded-xl p-6 shadow-sm transition hover:shadow-md ${
                  isHighlighted
                    ? "border-blue-500 ring-2 ring-blue-300"
                    : "border-gray-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap mb-1">
                      {getPriorityBadge(item.priority)}
                      <h2 className="text-xl font-bold text-gray-900">
                        {item.title || "Announcement"}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Posted by <strong className="text-gray-700">{item.authorName || "Admin"}</strong></span>
                      <span>•</span>
                      <time dateTime={item.createdAt || item.timestamp}>
                        {formatDate(item.createdAt || item.timestamp)}
                      </time>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-xs px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition cursor-pointer"
                        title="Edit announcement"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingAnnouncement(item)}
                        className="text-xs px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg font-medium transition cursor-pointer"
                        title="Delete announcement"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line pt-2 border-t border-gray-100">
                  {item.message}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Admin Create / Edit Modal */}
      {modalMode && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">
                {modalMode === "edit"
                  ? "Edit Announcement"
                  : "Post New Announcement"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none font-bold p-1 cursor-pointer"
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
                  Announcement Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Hackathon Schedule Update"
                  maxLength={200}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Priority Level *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Normal">Normal</option>
                  <option value="Important">Important</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={5}
                  placeholder="Type the full announcement message here..."
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition cursor-pointer shadow-sm"
                >
                  {formLoading
                    ? "Saving..."
                    : modalMode === "edit"
                    ? "Update Announcement"
                    : "Publish Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingAnnouncement && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50"
          onClick={() => setDeletingAnnouncement(null)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Delete Announcement
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Confirm permanent removal of this notice.
                </p>
              </div>
              <button
                onClick={() => setDeletingAnnouncement(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none font-bold cursor-pointer"
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
              <strong className="text-gray-900">
                &ldquo;{deletingAnnouncement.title || "this announcement"}&rdquo;
              </strong>
              ? This action cannot be undone and will remove it from all users&apos; feeds.
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDeletingAnnouncement(null)}
                disabled={deleteLoading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition cursor-pointer shadow-sm"
              >
                {deleteLoading ? "Deleting..." : "Delete Announcement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnnouncementsPage
