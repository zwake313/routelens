import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { FeatureCollection } from "geojson"

const maps = new Map<string, L.Map>()

export function renderRouteMap(elementId: string, route: FeatureCollection): void {
  maps.get(elementId)?.remove()

  const map = L.map(elementId)
  maps.set(elementId, map)

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map)

  const routeLayer = L.geoJSON(route).addTo(map)
  const bounds = routeLayer.getBounds()

  if (bounds.isValid()) {
    map.fitBounds(bounds)
  }
}