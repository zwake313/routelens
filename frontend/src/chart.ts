import Chart from "chart.js/auto"
import type { ElevationPoint } from "./types"

export function renderElevationChart(
  canvasId: string,
  profile: ElevationPoint[],
): void {
  Chart.getChart(canvasId)?.destroy()

  new Chart(canvasId, {
    type: "line",
    data: {
      datasets: [
        {
          data: profile.map(({ distance_km, elevation_m }) => ({
            x: distance_km,
            y: elevation_m,
          })),
          pointRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "linear",
          title: {
            display: true,
            text: "Distance (km)",
          },
        },
        y: {
          title: {
            display: true,
            text: "Elevation (m)",
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  })
}