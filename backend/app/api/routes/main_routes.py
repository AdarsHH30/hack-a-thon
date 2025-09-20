"""
Simplified Resume-Job Matching API Routes
Only essential endpoints for the core flow
"""

from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any, Union
from datetime import datetime
import tempfile
import os
import sys
from pathlib import Path

# Add the services path to import modules
sys.path.append(str(Path(__file__).parent.parent.parent))

try:
    from app.services.pdf_extraction_service import PDFExtractionService
    from app.services.clean_data.data_cleaner import (
        clean_resume_text,
        clean_job_description_text,
    )
    from app.services.matching import match_resume_to_job
except ImportError as e:
    print(f"Import error: {e}")
    # Fallback imports
    import sys

    sys.path.append(str(Path(__file__).parent.parent.parent / "app"))
    from services.pdf_extraction_service import PDFExtractionService
    from services.clean_data.data_cleaner import (
        clean_resume_text,
        clean_job_description_text,
    )
    from services.matching import match_resume_to_job

router = APIRouter()

# Simple in-memory storage (replace with database in production)
job_storage = {"current_jd": None}
resume_storage = {"current_resume": None}


class JobDescriptionRequest(BaseModel):
    job_description_text: str
    company_name: Optional[str] = None
    position_title: Optional[str] = None


@router.post(
    "/job-description",
    summary="Upload Job Description",
    description="Upload job description as PDF file",
)
async def upload_job_description(
    jd_file: UploadFile = File(..., description="PDF file containing job description")
):
    """
    Upload job description PDF

    Args:
        jd_file: PDF file containing job description

    Returns:
        Success message and triggers matching if resume is already uploaded
    """
    try:
        print(f"🚀 Job description upload request received")
        print(f" jd_file provided: {bool(jd_file)}")
        if jd_file:
            print(f"📄 jd_file filename: {jd_file.filename}")
            print(f"📄 jd_file content_type: {jd_file.content_type}")

        final_jd_text = ""

        # Handle PDF input
        if jd_file and jd_file.filename and jd_file.filename.endswith(".pdf"):
            print(f"📄 Processing PDF file: {jd_file.filename}")
            print(f"📄 Content type: {jd_file.content_type}")

            if jd_file.content_type not in [
                "application/pdf",
                "application/octet-stream",
            ]:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid file type. Expected PDF, got {jd_file.content_type}",
                )

            # Save file temporarily and extract text
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
                content = await jd_file.read()
                temp_file.write(content)
                temp_file_path = temp_file.name
                print(
                    f"📄 Saved temp file: {temp_file_path}, size: {len(content)} bytes"
                )

            try:
                # Extract text from PDF
                print("🔍 Starting PDF text extraction...")
                extraction_service = PDFExtractionService()
                extraction_result = extraction_service.extract_pdf_text(temp_file_path)

                print(
                    f"📊 Extraction result: {extraction_result.get('success', False)}"
                )

                if not extraction_result.get("success", False):
                    error_msg = extraction_result.get(
                        "error", "Unknown extraction error"
                    )
                    print(f"❌ PDF extraction failed: {error_msg}")
                    raise HTTPException(
                        status_code=400,
                        detail=f"Failed to extract text from PDF: {error_msg}",
                    )

                final_jd_text = extraction_result.get("raw_text", "")
                print(f"✅ Extracted text length: {len(final_jd_text)} characters")
                source_type = "pdf"

            finally:
                # Clean up temp file
                if os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
        else:
            raise HTTPException(
                status_code=400,
                detail="PDF file is required",
            )

        if not final_jd_text.strip():
            raise HTTPException(
                status_code=400, detail="No text content found in job description"
            )

        # Store job description
        job_storage["current_jd"] = {
            "text": final_jd_text,
            "source_type": source_type,
            "uploaded_at": datetime.now().isoformat(),
        }

        print(
            f"✅ Job description uploaded ({source_type}). Length: {len(final_jd_text)} characters"
        )

        # Check if resume is already uploaded
        if resume_storage["current_resume"] is not None:
            print("🚀 Both JD and Resume available. Triggering matching process...")
            return await _trigger_matching_process()

        return {
            "success": True,
            "message": "Job description uploaded successfully",
            "source_type": source_type,
            "text_length": len(final_jd_text),
            "next_step": "Upload resume to start matching process",
            "timestamp": datetime.now().isoformat(),
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing job description: {str(e)}"
        )


@router.post(
    "/resume", summary="Upload Resume", description="Upload resume as PDF file"
)
async def upload_resume(
    resume_file: UploadFile = File(
        ..., description="PDF file containing resume", media_type="application/pdf"
    )
):
    """
    Upload resume PDF

    Args:
        resume_file: PDF file containing resume

    Returns:
        Success message and triggers matching if job description is already uploaded
    """
    try:
        print(f"📄 Resume upload request received")
        print(f"📄 Resume filename: {resume_file.filename}")
        print(f"📄 Resume content_type: {resume_file.content_type}")

        # Validate file type
        if not resume_file.filename or not resume_file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        if resume_file.content_type not in [
            "application/pdf",
            "application/octet-stream",
        ]:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Expected PDF, got {resume_file.content_type}",
            )

        # Save file temporarily and extract text
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            content = await resume_file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        try:
            # Extract text from PDF
            extraction_service = PDFExtractionService()
            extraction_result = extraction_service.extract_pdf_text(temp_file_path)

            if not extraction_result.get("success", False):
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to extract text from PDF: {extraction_result.get('error')}",
                )

            resume_text = extraction_result.get("raw_text", "")

            if not resume_text.strip():
                raise HTTPException(
                    status_code=400, detail="No text content found in resume PDF"
                )

            # Store resume
            resume_storage["current_resume"] = {
                "text": resume_text,
                "filename": resume_file.filename,
                "uploaded_at": datetime.now().isoformat(),
            }

            print(f"✅ Resume uploaded. Length: {len(resume_text)} characters")

            # Check if job description is already uploaded
            if job_storage["current_jd"] is not None:
                print("🚀 Both JD and Resume available. Triggering matching process...")
                return await _trigger_matching_process()

            return {
                "success": True,
                "message": "Resume uploaded successfully",
                "filename": resume_file.filename,
                "text_length": len(resume_text),
                "next_step": "Upload job description to start matching process",
                "timestamp": datetime.now().isoformat(),
            }

        finally:
            # Clean up temp file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing resume: {str(e)}"
        )


@router.post("/match")
async def trigger_manual_matching():
    """
    Manually trigger matching process (if both JD and resume are uploaded)

    Returns:
        Matching results with score, suggestions, and improvements
    """
    try:
        if job_storage["current_jd"] is None:
            raise HTTPException(
                status_code=400, detail="Job description not uploaded yet"
            )

        if resume_storage["current_resume"] is None:
            raise HTTPException(status_code=400, detail="Resume not uploaded yet")

        return await _trigger_matching_process()

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error in matching process: {str(e)}"
        )


async def _trigger_matching_process():
    """
    Internal function to trigger the complete matching process:
    Text Extraction → Data Cleaning → Matching → Results
    """
    try:
        print("🤖 Starting complete matching process...")

        # Get stored data
        jd_data = job_storage["current_jd"]
        resume_data = resume_storage["current_resume"]

        jd_text = jd_data["text"]
        resume_text = resume_data["text"]

        print(
            f"📄 Processing JD ({len(jd_text)} chars) and Resume ({len(resume_text)} chars)"
        )

        # Stage 1: Data Cleaning with Groq
        print("🧹 Stage 1: Cleaning data with Groq...")

        # Clean job description
        jd_cleaning_result = clean_job_description_text(jd_text)
        if not jd_cleaning_result.get("success", False):
            print("⚠️ JD cleaning failed, using raw text")
            cleaned_jd_text = jd_text
        else:
            # Use cleaned structured data if available
            structured_jd = jd_cleaning_result.get("structured_data", {})
            cleaned_jd_text = _create_text_from_structured_data(structured_jd, jd_text)

        # Clean resume
        resume_cleaning_result = clean_resume_text(resume_text)
        if not resume_cleaning_result.get("success", False):
            print("⚠️ Resume cleaning failed, using raw text")
            cleaned_resume_text = resume_text
        else:
            # Use cleaned structured data if available
            structured_resume = resume_cleaning_result.get("structured_data", {})
            cleaned_resume_text = _create_text_from_structured_data(
                structured_resume, resume_text
            )

        print("✅ Stage 1 completed: Data cleaning")

        # Stage 2: Matching
        print("🎯 Stage 2: Performing matching...")

        matching_result = match_resume_to_job(cleaned_resume_text, cleaned_jd_text)

        if not matching_result.get("success", False):
            raise HTTPException(
                status_code=500,
                detail=f"Matching failed: {matching_result.get('error', 'Unknown error')}",
            )

        print("✅ Stage 2 completed: Matching")

        # Stage 3: Format final results
        print("📊 Stage 3: Formatting results...")

        final_results = {
            "success": True,
            "timestamp": datetime.now().isoformat(),
            "process_stages": {
                "extraction": "completed",
                "cleaning": "completed",
                "matching": "completed",
            },
            "input_info": {
                "job_description": {
                    "company": jd_data.get("company_name"),
                    "position": jd_data.get("position_title"),
                    "source_type": jd_data.get("source_type"),
                    "text_length": len(jd_text),
                },
                "resume": {
                    "filename": resume_data.get("filename"),
                    "text_length": len(resume_text),
                },
            },
            "matching_results": {
                "score": matching_result.get("relevance_score"),
                "verdict": matching_result.get("verdict"),
                "matched_skills": matching_result.get("matched_skills", []),
                "missing_skills": matching_result.get("missing_skills", []),
                "suggestions": matching_result.get("suggestions", []),
                "areas_for_improvement": matching_result.get("missing_skills", [])[
                    :5
                ],  # Top 5
                "detailed_analysis": matching_result.get("detailed_analysis", {}),
                "score_breakdown": matching_result.get("score_breakdown", {}),
            },
        }

        print("🎉 Complete matching process finished successfully!")
        print(f"📈 Final Score: {final_results['matching_results']['score']}%")
        print(f"🏆 Verdict: {final_results['matching_results']['verdict']}")

        return final_results

    except Exception as e:
        print(f"❌ Error in matching process: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Matching process failed: {str(e)}"
        )


def _create_text_from_structured_data(
    structured_data: Dict[str, Any], fallback_text: str
) -> str:
    """
    Create comprehensive text from structured data for better matching

    Args:
        structured_data: Cleaned structured data from Groq
        fallback_text: Original raw text as fallback

    Returns:
        Combined text for matching
    """
    try:
        if not structured_data:
            return fallback_text

        text_parts = []

        # Add various sections from structured data
        for key, value in structured_data.items():
            if isinstance(value, str) and value.strip():
                text_parts.append(value)
            elif isinstance(value, list):
                for item in value:
                    if isinstance(item, str) and item.strip():
                        text_parts.append(item)
                    elif isinstance(item, dict):
                        for sub_value in item.values():
                            if isinstance(sub_value, str) and sub_value.strip():
                                text_parts.append(sub_value)

        combined_text = " ".join(text_parts)

        # If structured data doesn't have enough content, combine with original
        if len(combined_text) < len(fallback_text) * 0.5:
            return f"{combined_text} {fallback_text}"

        return combined_text

    except Exception:
        return fallback_text


@router.get("/status")
async def get_status():
    """
    Get current upload status

    Returns:
        Status of job description and resume uploads
    """
    return {
        "success": True,
        "job_description_uploaded": job_storage["current_jd"] is not None,
        "resume_uploaded": resume_storage["current_resume"] is not None,
        "ready_for_matching": (
            job_storage["current_jd"] is not None
            and resume_storage["current_resume"] is not None
        ),
        "timestamp": datetime.now().isoformat(),
    }


@router.delete("/reset")
async def reset_uploads():
    """
    Reset all uploads (clear stored data)

    Returns:
        Success message
    """
    job_storage["current_jd"] = None
    resume_storage["current_resume"] = None

    return {
        "success": True,
        "message": "All uploads cleared successfully",
        "timestamp": datetime.now().isoformat(),
    }
