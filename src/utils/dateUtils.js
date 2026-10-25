// Shared date parsing and classification utilities for HackHub

export const parseHackathonDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") return null

  // Support "DD Month YYYY" (e.g. "20 September 2026")
  const parts = dateStr.trim().split(/\s+/)
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10)
    const monthName = parts[1].toLowerCase()
    const year = parseInt(parts[2], 10)

    const months = {
      january: 0, jan: 0,
      february: 1, feb: 1,
      march: 2, mar: 2,
      april: 3, apr: 3,
      may: 4,
      june: 5, jun: 5,
      july: 6, jul: 6,
      august: 7, aug: 7,
      september: 8, sep: 8, sept: 8,
      october: 9, oct: 9,
      november: 10, nov: 10,
      december: 11, dec: 11,
    }

    if (!isNaN(day) && !isNaN(year) && monthName in months) {
      const parsed = new Date(year, months[monthName], day)
      if (!isNaN(parsed.getTime())) return parsed
    }
  }

  // Support "YYYY-MM-DD"
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim())) {
    const [y, m, d] = dateStr.trim().split("-").map(Number)
    return new Date(y, m - 1, d)
  }

  // Fallback for ISO or other standard date formats
  const parsed = new Date(dateStr)
  return isNaN(parsed.getTime()) ? null : parsed
}

export const isUpcoming = (dateStr) => {
  const eventDate = parseHackathonDate(dateStr)
  if (!eventDate) return false
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())
  return eventDay >= startOfToday
}

export const isCompleted = (dateStr) => {
  const eventDate = parseHackathonDate(dateStr)
  if (!eventDate) return false
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())
  return eventDay < startOfToday
}

export const isHackathonUpcoming = (hackathon) => {
  return isUpcoming(hackathon?.date)
}

export const isHackathonCompleted = (hackathon) => {
  return isCompleted(hackathon?.date)
}
