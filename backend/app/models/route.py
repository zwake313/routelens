from typing import Any

from pydantic import BaseModel


class RouteStats(BaseModel):
    distance_km: float
    elevation_gain_m: float | None
    elevation_loss_m: float | None
    min_elevation_m: float | None
    max_elevation_m: float | None
    duration_seconds: float | None
    average_speed_kmh: float | None
    point_count: int


class ElevationPoint(BaseModel):
    distance_km: float
    elevation_m: float


class GPXAnalysis(BaseModel):
    filename: str
    route_name: str | None
    track_count: int
    segment_count: int
    stats: RouteStats
    geometry: dict[str, Any]
    elevation_profile: list[ElevationPoint]