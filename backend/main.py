from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.job_routes import router as job_router
from app.api.routes.pdf_routes import router as pdf_router

app = FastAPI(title="Innomatics API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(job_router, prefix="/api/jobs", tags=["jobs"])
app.include_router(pdf_router, prefix="/api/pdf", tags=["pdf"])
app.include_router(enhanced_pdf_router, prefix="/api/v2/pdf", tags=["enhanced-pdf"])


@app.get("/")
async def root():
    return {"message": "Welcome to Innomatics API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}


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
