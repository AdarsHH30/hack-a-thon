from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.test_routes import router as test_router

app = FastAPI(title="Innomatics API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(test_router, prefix="/api/test", tags=["test"])


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
