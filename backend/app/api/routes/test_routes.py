from fastapi import APIRouter, HTTPException
from datetime import datetime
from typing import Dict, Any

router = APIRouter()


@router.get("/")
async def test_root():
    """Simple test endpoint"""
    return {
        "message": "Test route is working!",
        "timestamp": datetime.now().isoformat(),
        "status": "success",
    }


@router.get("/hello")
async def say_hello():
    """Hello world endpoint"""
    return {"message": "Hello, World!", "endpoint": "test/hello"}


@router.get("/hello/{name}")
async def say_hello_to_name(name: str):
    """Personalized hello endpoint"""
    return {"message": f"Hello, {name}!", "name": name, "endpoint": "test/hello/{name}"}


@router.post("/echo")
async def echo_data(data: Dict[str, Any]):
    """Echo endpoint that returns the data sent to it"""
    return {
        "message": "Echo successful",
        "received_data": data,
        "timestamp": datetime.now().isoformat(),
    }


@router.get("/status")
async def get_status():
    """Status check endpoint"""
    return {
        "status": "online",
        "service": "Innomatics API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
    }


@router.get("/error-test")
async def test_error():
    """Test error handling"""
    raise HTTPException(status_code=400, detail="This is a test error")
