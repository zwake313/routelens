from fastapi import FastAPI

app = FastAPI(
    title="RouteLens API",
    description="Backend API for GPX route analysis",
    version="0.1.0"
)


@app.get("/")
def root():
    return {
        "message": "RouteLens API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }