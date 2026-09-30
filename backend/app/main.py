from fastapi import FastAPI, File, HTTPException, UploadFile

from app.models.route import GPXAnalysis
from app.services.gpx_parser import analyze_gpx


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


@app.post("/api/analyze", response_model=GPXAnalysis)
async def analyze_gpx_endpoint(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".gpx"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid .gpx file."
        )

    try:
        contents = await file.read()
        gpx_text = contents.decode("utf-8")

        analysis = analyze_gpx(gpx_text)

        return {
            "filename": file.filename,
            **analysis,
        }

    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=f"Unable to parse GPX file: {str(error)}"
        )