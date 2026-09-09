import { useState } from "react"

function useHackathons(data) {
  const [hackathonList] = useState(data)

  return hackathonList
}

export default useHackathons