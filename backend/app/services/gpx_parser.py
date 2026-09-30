import math

import gpxpy

def haversine_distance(
    lat1: float,
    lon1: float,
    lat2: float,
    lon2: float
) -> float:
    earth_radius_m = 6_371_000

    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)

    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1_rad)
        * math.cos(lat2_rad)
        * math.sin(delta_lon / 2) ** 2
    )

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )

    return earth_radius_m * c

def analyze_gpx(gpx_content: str) -> dict:
    gpx = gpxpy.parse(gpx_content)

    track_count = len(gpx.tracks)
    segment_count = 0
    point_count = 0

    total_distance_m = 0.0

    elevation_gain_m = 0.0
    elevation_loss_m = 0.0
    elevations = []

    timestamps = []

    route_name = None

    for track in gpx.tracks:
        if route_name is None and track.name:
            route_name = track.name

        segment_count += len(track.segments)

        for segment in track.segments:
            points = segment.points

            point_count += len(points)

            for point in points:
                if point.elevation is not None:
                    elevations.append(point.elevation)

                if point.time is not None:
                    timestamps.append(point.time)

            for index in range(1, len(points)):
                previous = points[index - 1]
                current = points[index]

                total_distance_m += haversine_distance(
                    previous.latitude,
                    previous.longitude,
                    current.latitude,
                    current.longitude
                )

                if (
                    previous.elevation is not None
                    and current.elevation is not None
                ):
                    elevation_change = (
                        current.elevation - previous.elevation
                    )

                    if elevation_change > 0:
                        elevation_gain_m += elevation_change

                    elif elevation_change < 0:
                        elevation_loss_m += abs(elevation_change)

    min_elevation_m = min(elevations) if elevations else None
    max_elevation_m = max(elevations) if elevations else None

    duration_seconds = None
    average_speed_kmh = None

    if len(timestamps) >= 2:
        start_time = min(timestamps)
        end_time = max(timestamps)

        duration_seconds = (
            end_time - start_time
        ).total_seconds()

        if duration_seconds > 0:
            duration_hours = duration_seconds / 3600

            average_speed_kmh = (
                total_distance_m / 1000
            ) / duration_hours

    return {
        "route_name": route_name,
        "track_count": track_count,
        "segment_count": segment_count,
        "stats": {
            "distance_km": round(
                total_distance_m / 1000,
                2
            ),
            "elevation_gain_m": (
                round(elevation_gain_m, 1)
                if elevations
                else None
            ),
            "elevation_loss_m": (
                round(elevation_loss_m, 1)
                if elevations
                else None
            ),
            "min_elevation_m": (
                round(min_elevation_m, 1)
                if min_elevation_m is not None
                else None
            ),
            "max_elevation_m": (
                round(max_elevation_m, 1)
                if max_elevation_m is not None
                else None
            ),
            "duration_seconds": (
                round(duration_seconds, 1)
                if duration_seconds is not None
                else None
            ),
            "average_speed_kmh": (
                round(average_speed_kmh, 2)
                if average_speed_kmh is not None
                else None
            ),
            "point_count": point_count,
        },
    }