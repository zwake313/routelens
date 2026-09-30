import "./style.css"

import { analyzeGPX } from "./api"
import type { GPXAnalysis } from "./types"


const app = document.querySelector<HTMLDivElement>("#app")

if (!app) {
  throw new Error("App container not found.")
}


app.innerHTML = `
  <main class="page">

    <header class="hero">
      <p class="eyebrow">GPX ROUTE INTELLIGENCE</p>

      <h1>RouteLens</h1>

      <p class="subtitle">
        Analyze distance, elevation, terrain,
        and route characteristics from GPX files.
      </p>
    </header>


    <section class="upload-panel">

      <label
        class="upload-label"
        for="gpx-file"
      >
        Select GPX file
      </label>

      <input
        id="gpx-file"
        type="file"
        accept=".gpx"
      />

      <button
        id="analyze-button"
        disabled
      >
        Analyze Route
      </button>

      <p id="status"></p>

    </section>


    <section
      id="results"
      class="results hidden"
    >
    </section>

  </main>
`

const fileInput =
  document.querySelector<HTMLInputElement>(
    "#gpx-file"
  )

const analyzeButton =
  document.querySelector<HTMLButtonElement>(
    "#analyze-button"
  )

const results =
  document.querySelector<HTMLDivElement>(
    "#results"
  )

const status =
  document.querySelector<HTMLParagraphElement>(
    "#status"
  )

if (!results) {
  throw new Error(
    "Results container not found."
  )
}


if (
  !fileInput ||
  !analyzeButton ||
  !results ||
  !status
) {
  throw new Error(
    "Required interface elements are missing."
  )
}

const resultsElement = results
let selectedFile: File | null = null


fileInput.addEventListener(
  "change",
  () => {

    const file = fileInput.files?.[0]

    if (!file) {
      selectedFile = null
      analyzeButton.disabled = true

      return
    }

    selectedFile = file
    analyzeButton.disabled = false

    status.textContent = `Selected: ${file.name}`
  }
)
analyzeButton.addEventListener(
  "click",
  async () => {

    if (!selectedFile) {
      return
    }

    analyzeButton.disabled = true

    status.textContent =
      "Analyzing route..."

    try {

      const analysis =
        await analyzeGPX(selectedFile)

      renderAnalysis(analysis)

      status.textContent =
        "Analysis complete."

    } catch (error) {

      if (error instanceof Error) {
        status.textContent = error.message
      } else {
        status.textContent =
          "An unexpected error occurred."
      }

    } finally {

      analyzeButton.disabled = false

    }
  }
)
function renderAnalysis(
  analysis: GPXAnalysis
) {

  resultsElement.classList.remove("hidden")

  resultsElement.innerHTML = `
    <h2>
      ${analysis.route_name ?? analysis.filename}
    </h2>

    <div class="stats-grid">

      <div class="stat-card">
        <span class="stat-value">
          ${analysis.stats.distance_km}
        </span>

        <span class="stat-label">
          Distance (km)
        </span>
      </div>


      <div class="stat-card">
        <span class="stat-value">
          ${analysis.stats.elevation_gain_m ?? "—"}
        </span>

        <span class="stat-label">
          Elevation Gain (m)
        </span>
      </div>


      <div class="stat-card">
        <span class="stat-value">
          ${analysis.stats.max_elevation_m ?? "—"}
        </span>

        <span class="stat-label">
          Max Elevation (m)
        </span>
      </div>


      <div class="stat-card">
        <span class="stat-value">
          ${analysis.stats.point_count}
        </span>

        <span class="stat-label">
          GPS Points
        </span>
      </div>

    </div>
  `
}