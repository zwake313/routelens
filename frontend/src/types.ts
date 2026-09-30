import type { FeatureCollection } from "geojson"

export interface RouteStats {
  distance_km: number
  elevation_gain_m: number | null
  elevation_loss_m: number | null
  min_elevation_m: number | null
  max_elevation_m: number | null
  duration_seconds: number | null
  average_speed_kmh: number | null
  point_count: number
}

export interface ElevationPoint {
  distance_km: number
  elevation_m: number
}

export interface GPXAnalysis {
  filename: string
  route_name: string | null
  track_count: number
  segment_count: number
  stats: RouteStats
  geometry: FeatureCollection
  elevation_profile: ElevationPoint[]
}