from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

from app.api.routes.main_routes import router as main_router

app = FastAPI(
    title="Innomatics Resume-Job Matching API",
    version="2.0.0",
    description="Professional API for resume-job matching with AI-powered analysis",
)

# More secure CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
    ],  # Specific frontend URLs
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],  # Only needed methods
    allow_headers=["Content-Type", "Authorization"],
)

# Main router for all functionality
app.include_router(main_router, prefix="/api", tags=["resume-job-matching"])


@app.get("/")
async def root():
    return {
        "message": "Welcome to Innomatics Resume-Job Matching API",
        "version": "2.0.0",
        "endpoints": {
            "upload_job_description": "POST /api/job-description",
            "upload_resume": "POST /api/resume",
            "get_matching_score": "POST /api/get-score",
            "manual_match": "POST /api/match",
            "get_all_jobs": "GET /api/get-jobs",
            "get_job_by_id": "GET /api/get-job/{job_id}",
            "status": "GET /api/status",
            "reset": "DELETE /api/reset",
        },
        "flow": "Upload JD → Upload Resume → Auto-match with AI cleaning and analysis",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "Simplified Resume-Job Matching API is running",
        "version": "2.0.0",
    }


if __name__ == "__main__":
    import uvicorn
    import sys

    port = 8001

    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"Invalid port: {sys.argv[1]}. Using default port {port}")

    print(f"Starting server on http://localhost:{port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
