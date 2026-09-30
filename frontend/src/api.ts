import type { GPXAnalysis } from "./types"

const API_BASE_URL = "http://127.0.0.1:8000"

export async function analyzeGPX(
  file: File
): Promise<GPXAnalysis> {

  const formData = new FormData()

  formData.append("file", file)

  const response = await fetch(
    `${API_BASE_URL}/api/analyze`,
    {
      method: "POST",
      body: formData
    }
  )

  if (!response.ok) {
    const errorData = await response.json()

    throw new Error(
      errorData.detail || "Unable to analyze GPX file."
    )
  }

  return response.json()
}