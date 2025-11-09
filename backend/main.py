from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import asyncio
import httpx
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

from app.api.routes.main_routes import router as main_router

# Self-ping configuration to keep Render alive
SELF_PING_ENABLED = os.getenv("SELF_PING_ENABLED", "false").lower() == "true"
SELF_PING_INTERVAL = int(os.getenv("SELF_PING_INTERVAL", "840"))  # 14 minutes default

app = FastAPI(
    title="Innomatics Resume-Job Matching API",
    version="2.0.0",
    description="Professional API for resume-job matching with AI-powered analysis",
)

# CORS configuration - Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=False,  # Must be False when allow_origins is ["*"]
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
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
            "get_matching_score": "POST /api/get-score (Direct Groq AI Analysis)",
            "ai_powered_analysis": "POST /api/ai-analyze",
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
    """Health check endpoint to prevent Render from sleeping"""
    return {
        "status": "healthy",
        "message": "Simplified Resume-Job Matching API is running",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat(),
        "self_ping_enabled": SELF_PING_ENABLED,
    }


async def self_ping_task():
    """Background task to ping self and prevent Render from sleeping"""
    if not SELF_PING_ENABLED:
        return

    # Wait for server to start
    await asyncio.sleep(60)

    async with httpx.AsyncClient() as client:
        while True:
            try:
                await asyncio.sleep(SELF_PING_INTERVAL)

                # Get the Render URL from environment or use localhost
                base_url = os.getenv("RENDER_EXTERNAL_URL", "http://localhost:8001")

                print(f"[{datetime.now().isoformat()}] Self-ping to keep alive...")
                response = await client.get(f"{base_url}/health", timeout=30.0)

                if response.status_code == 200:
                    print(f"✓ Self-ping successful: {response.json()}")
                else:
                    print(f"✗ Self-ping failed with status: {response.status_code}")

            except Exception as e:
                print(f"✗ Self-ping error: {e}")
                # Continue trying even if there's an error


@app.on_event("startup")
async def startup_event():
    """Start background tasks on startup"""
    if SELF_PING_ENABLED:
        print("🔄 Self-ping keep-alive enabled")
        print(f"   Interval: {SELF_PING_INTERVAL} seconds")
        asyncio.create_task(self_ping_task())
    else:
        print("ℹ️  Self-ping disabled. Use external service like UptimeRobot")
        print("   See RENDER_KEEP_ALIVE.md for setup instructions")


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
