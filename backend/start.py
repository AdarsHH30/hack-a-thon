#!/usr/bin/env python3
"""
Startup script for Render deployment
Handles environment variables and graceful startup
"""

import os
import sys
import uvicorn
from pathlib import Path

# Add the current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

def main():
    """Main startup function"""
    
    # Get port from environment variable (Render sets this)
    port = int(os.getenv("PORT", 8001))
    
    # Set default environment variables if not set
    os.environ.setdefault("PYTHONPATH", str(current_dir))
    
    print(f"🚀 Starting Innomatics Resume-Job Matching API")
    print(f"📍 Working directory: {current_dir}")
    print(f"🌐 Port: {port}")
    print(f"🔧 Python path: {sys.path[:3]}...")
    
    # Import the FastAPI app
    try:
        from main import app
        print("✅ FastAPI app imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import FastAPI app: {e}")
        sys.exit(1)
    
    # Start the server
    try:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=port,
            workers=1,
            log_level="info",
            access_log=True
        )
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()