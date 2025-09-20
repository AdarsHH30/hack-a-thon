from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

router = APIRouter()


class JobDescription(BaseModel):
    title: str
    company: str
    location: str
    description: str
    requirements: List[str]
    salary_range: Optional[str] = None
    job_type: Optional[str] = "Full-time"
    experience_level: Optional[str] = "Mid-level"


class JobDescriptionResponse(BaseModel):
    message: str
    job_id: int
    job: JobDescription
    timestamp: str


job_storage = {}
job_counter = 1


@router.post("/get-job-description", response_model=JobDescriptionResponse)
async def receive_job_description(job_data: JobDescription):
    """
    Receive job description from frontend and store it
    """
    global job_counter

    try:
        job_id = job_counter
        job_storage[job_id] = job_data.dict()
        job_storage[job_id]["id"] = job_id
        job_storage[job_id]["created_at"] = datetime.now().isoformat()

        job_counter += 1

        return {
            "message": "Job description received and stored successfully",
            "job_id": job_id,
            "job": job_data,
            "timestamp": datetime.now().isoformat(),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing job description: {str(e)}"
        )


@router.get("/get-job-description/{job_id}")
async def get_stored_job_description(job_id: int):
    """
    Retrieve a stored job description by ID
    """
    if job_id not in job_storage:
        raise HTTPException(status_code=404, detail=f"Job with ID {job_id} not found")

    return {
        "message": "Job description retrieved successfully",
        "job": job_storage[job_id],
        "timestamp": datetime.now().isoformat(),
    }


@router.get("/get-job-description")
async def get_all_stored_job_descriptions():
    """
    Retrieve all stored job descriptions
    """
    return {
        "message": "All job descriptions retrieved successfully",
        "count": len(job_storage),
        "jobs": list(job_storage.values()),
        "timestamp": datetime.now().isoformat(),
    }
