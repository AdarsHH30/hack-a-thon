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
job_storage = []  # Changed to list to store multiple job descriptions
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

        # Stage 2: Clean data with Groq API to extract structured information
        print("🧹 Stage 2: Cleaning job description data with Groq...")
        from app.services.clean_data.data_cleaner import clean_job_description_text

        cleaning_result = clean_job_description_text(final_jd_text)

        if not cleaning_result.get("success", False):
            print("⚠️ Data cleaning failed, proceeding with raw text only")
            # Create a single job entry with raw text
            job_id = len(job_storage) + 1
            job_data = {
                "id": job_id,
                "text": final_jd_text,
                "source_type": source_type,
                "uploaded_at": datetime.now().isoformat(),
                "filename": jd_file.filename if jd_file else None,
                "document_type": extraction_result.get("document_type"),
                "structured_data": {},
                "cleaning_status": "failed",
            }
            job_storage.append(job_data)
            jobs_created = 1
        else:
            # Data cleaning successful - handle multiple jobs if found
            structured_jobs = cleaning_result.get("structured_data", [])
            multiple_jobs = cleaning_result.get("multiple_jobs", False)
            job_count = cleaning_result.get("job_count", 1)

            print(f"✅ Data cleaning completed. Found {job_count} job(s)")

            jobs_created = 0
            uploaded_job_ids = []

            for i, job_structured_data in enumerate(structured_jobs):
                job_id = len(job_storage) + 1

                # For multiple jobs, split the raw text proportionally
                if multiple_jobs and job_count > 1:
                    # Simple text splitting - in production, you'd want more sophisticated splitting
                    text_chunks = final_jd_text.split("\n\n")
                    chunk_size = len(text_chunks) // job_count
                    start_idx = i * chunk_size
                    end_idx = (
                        (i + 1) * chunk_size if i < job_count - 1 else len(text_chunks)
                    )
                    job_text = "\n\n".join(text_chunks[start_idx:end_idx])
                else:
                    job_text = final_jd_text

                job_data = {
                    "id": job_id,
                    "text": job_text,
                    "source_type": source_type,
                    "uploaded_at": datetime.now().isoformat(),
                    "filename": (
                        jd_file.filename
                        if jd_file
                        else (
                            f"{jd_file.filename}_job_{i+1}"
                            if multiple_jobs
                            else jd_file.filename
                        )
                    ),
                    "document_type": extraction_result.get("document_type"),
                    "structured_data": job_structured_data,
                    "cleaning_status": "success",
                    "job_index": i + 1 if multiple_jobs else 1,
                    "total_jobs_in_document": job_count,
                }

                job_storage.append(job_data)
                uploaded_job_ids.append(job_id)
                jobs_created += 1

                print(f"✅ Job {i+1}/{job_count} uploaded. ID: {job_id}")

        print(f"🎉 Job description processing completed. Created {jobs_created} job(s)")

        # Check if resume is already uploaded
        if resume_storage["current_resume"] is not None:
            print("🚀 Both JD and Resume available. Triggering matching process...")
            return await _trigger_matching_process()

        # Return appropriate response based on number of jobs created
        if jobs_created == 1:
            response_message = "Job description uploaded and processed successfully"
        else:
            response_message = f"Job descriptions uploaded and processed successfully. Created {jobs_created} job positions"

        return {
            "success": True,
            "message": response_message,
            "source_type": source_type,
            "text_length": len(final_jd_text),
            "jobs_created": jobs_created,
            "uploaded_job_ids": (
                uploaded_job_ids
                if "uploaded_job_ids" in locals()
                else [len(job_storage)]
            ),
            "cleaning_status": (
                "success" if cleaning_result.get("success", False) else "failed"
            ),
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
                "document_type": extraction_result.get("document_type"),
                "structured_data": extraction_result.get("structured_data", {}),
            }

            print(f"✅ Resume uploaded. Length: {len(resume_text)} characters")

            # Check if job description is already uploaded
            if len(job_storage) > 0:
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
        if not job_storage:
            raise HTTPException(
                status_code=400, detail="No job descriptions uploaded yet"
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

        # Get stored data - use the most recent job description
        jd_data = job_storage[-1] if job_storage else None
        resume_data = resume_storage["current_resume"]

        if not jd_data:
            raise HTTPException(status_code=400, detail="No job descriptions available")

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

        # Stage 2: Direct Groq AI Analysis
        print("🤖 Stage 2: Performing direct Groq AI matching analysis...")

        # Import the AI extractor
        try:
            from app.services.matching.extract import analyze_resume_job_match
        except ImportError as e:
            print(f"❌ Failed to import AI extractor: {e}")
            raise HTTPException(
                status_code=500, detail="AI analysis module not available"
            )

        # Get candidate name and job title for better analysis
        candidate_name = None
        job_title = (
            jd_data.get("structured_data", {}).get("job_title") or "Unknown Position"
        )

        # Try to extract candidate name from resume data
        if resume_cleaning_result.get("success", False):
            structured_resume = resume_cleaning_result.get("structured_data", {})
            candidate_name = structured_resume.get("name") or structured_resume.get(
                "full_name"
            )

        # Perform direct Groq AI analysis
        matching_result = analyze_resume_job_match(
            resume_text=cleaned_resume_text,
            job_description_text=cleaned_jd_text,
            candidate_name=candidate_name,
            job_title=job_title,
        )

        if not matching_result.get("success", False):
            print(f"⚠️ AI analysis failed, but continuing with available results")

        print("✅ Stage 2 completed: Direct Groq AI Analysis")

        # Stage 3: Format final results
        print("📊 Stage 3: Formatting AI analysis results...")

        # Extract key information from AI analysis
        overall_assessment = matching_result.get("overall_assessment", {})
        skill_analysis = matching_result.get("skill_analysis", {})
        improvement_recommendations = matching_result.get(
            "improvement_recommendations", {}
        )

        final_results = {
            "success": True,
            "timestamp": datetime.now().isoformat(),
            "process_stages": {
                "extraction": "completed",
                "cleaning": "completed",
                "ai_analysis": "completed",
            },
            "input_info": {
                "job_description": {
                    "company": jd_data.get("structured_data", {}).get("company")
                    or "Unknown Company",
                    "position": jd_data.get("structured_data", {}).get("job_title")
                    or jd_data.get("filename", "Unknown Position"),
                    "source_type": jd_data.get("source_type"),
                    "text_length": len(jd_text),
                },
                "resume": {
                    "filename": resume_data.get("filename"),
                    "text_length": len(resume_text),
                },
            },
            "ai_analysis_results": {
                "overall_assessment": overall_assessment,
                "skill_analysis": skill_analysis,
                "experience_analysis": matching_result.get("experience_analysis", {}),
                "improvement_recommendations": improvement_recommendations,
                "strengths": matching_result.get("strengths", []),
                "concerns": matching_result.get("concerns", []),
                "recommendation": matching_result.get("recommendation", {}),
            },
            # Legacy compatibility fields
            "score": overall_assessment.get("match_score", 0),
            "verdict": overall_assessment.get("suitability_level", "Unknown"),
            "matched_skills": skill_analysis.get("matched_skills", []),
            "missing_skills": skill_analysis.get("missing_critical_skills", []),
            "suggestions": improvement_recommendations.get("immediate_actions", []),
            "areas_for_improvement": skill_analysis.get("skill_gaps", [])[:5],  # Top 5
        }

        print("🎉 Complete AI analysis process finished successfully!")
        print(f"📈 Match Score: {final_results['score']}%")
        print(f"🏆 Suitability: {final_results['verdict']}")

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
        "job_descriptions_count": len(job_storage),
        "job_descriptions_uploaded": len(job_storage) > 0,
        "resume_uploaded": resume_storage["current_resume"] is not None,
        "ready_for_matching": (
            len(job_storage) > 0 and resume_storage["current_resume"] is not None
        ),
        "timestamp": datetime.now().isoformat(),
    }


@router.get("/get-jobs")
async def get_jobs():
    """
    Get all uploaded job descriptions with detailed information

    Returns:
        List of all job descriptions with their details
    """
    try:
        if not job_storage:
            return {
                "success": True,
                "message": "No job descriptions uploaded yet",
                "jobs": [],
                "total_count": 0,
                "timestamp": datetime.now().isoformat(),
            }

        # Format job descriptions for response with Groq-structured data
        jobs_list = []
        for job in job_storage:
            # Use Groq API to parse job description into structured JSON
            groq_result = clean_job_description_text(job["text"])

            job_info = {
                "id": job["id"],
                "filename": job.get("filename"),
                "source_type": job["source_type"],
                "uploaded_at": job["uploaded_at"],
                "text_length": len(job["text"]),
                "full_text": job["text"],
                "document_type": job.get("document_type"),
                "groq_structured_data": (
                    groq_result.get("structured_data", {})
                    if groq_result.get("success")
                    else {}
                ),
                "groq_parsing_success": groq_result.get("success", False),
                "groq_error": (
                    groq_result.get("error") if not groq_result.get("success") else None
                ),
                "structured_data": job.get(
                    "structured_data", {}
                ),  # Keep existing PDF parser data
            }
            jobs_list.append(job_info)

        return {
            "success": True,
            "message": f"Found {len(job_storage)} job description(s)",
            "jobs": jobs_list,
            "total_count": len(job_storage),
            "timestamp": datetime.now().isoformat(),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving job descriptions: {str(e)}"
        )


@router.get("/get-job/{job_id}")
async def get_job_by_id(job_id: int):
    """
    Get a specific job description by ID

    Args:
        job_id: The ID of the job description to retrieve

    Returns:
        Detailed job description information
    """
    try:
        # Find job by ID
        job = None
        for j in job_storage:
            if j["id"] == job_id:
                job = j
                break

        if not job:
            raise HTTPException(
                status_code=404, detail=f"Job description with ID {job_id} not found"
            )

        # Use Groq API to parse job description into structured JSON
        groq_result = clean_job_description_text(job["text"])

        return {
            "success": True,
            "job": {
                "id": job["id"],
                "filename": job.get("filename"),
                "source_type": job["source_type"],
                "uploaded_at": job["uploaded_at"],
                "text_length": len(job["text"]),
                "full_text": job["text"],
                "document_type": job.get("document_type"),
                "groq_structured_data": (
                    groq_result.get("structured_data", {})
                    if groq_result.get("success")
                    else {}
                ),
                "groq_parsing_success": groq_result.get("success", False),
                "groq_error": (
                    groq_result.get("error") if not groq_result.get("success") else None
                ),
                "structured_data": job.get("structured_data", {}),
            },
            "timestamp": datetime.now().isoformat(),
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving job description: {str(e)}"
        )


@router.post("/get-score")
async def get_matching_score(
    resume_file: UploadFile = File(
        ..., description="PDF file containing resume", media_type="application/pdf"
    ),
    job_id: str = Form(..., description="Job ID to match against"),
):
    """
    Upload resume and get AI-powered matching analysis for a specific job

    This endpoint uses direct Groq AI analysis to provide:
    - Comprehensive match scoring (0-100)
    - Detailed skill analysis
    - Experience assessment
    - Personalized improvement recommendations
    - Professional HR-style analysis

    Args:
        resume_file: PDF file containing resume
        job_id: ID of the job description to match against

    Returns:
        Comprehensive AI analysis with scoring and improvement recommendations
    """
    try:
        print(f"📄 Get-score request received for job_id: {job_id}")
        print(f"📄 Resume filename: {resume_file.filename}")

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

        # Find job by job_id
        job_data = None
        for job in job_storage:
            if job.get("id") == job_id:
                job_data = job
                break

        if not job_data:
            raise HTTPException(
                status_code=404, detail=f"Job with ID {job_id} not found"
            )

        # Save file temporarily and extract text
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            content = await resume_file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        try:
            # Extract text from resume PDF
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

            print(f"✅ Resume extracted. Length: {len(resume_text)} characters")

            # Get job description text
            jd_text = job_data["text"]
            print(f"✅ Job description found. Length: {len(jd_text)} characters")

            # Stage 1: Data Cleaning with Groq
            print("🧹 Cleaning data with Groq...")

            # Clean job description
            jd_cleaning_result = clean_job_description_text(jd_text)
            if not jd_cleaning_result.get("success", False):
                print("⚠️ JD cleaning failed, using raw text")
                cleaned_jd_text = jd_text
            else:
                structured_jd = jd_cleaning_result.get("structured_data", {})
                cleaned_jd_text = _create_text_from_structured_data(
                    structured_jd, jd_text
                )

            # Clean resume
            resume_cleaning_result = clean_resume_text(resume_text)
            if not resume_cleaning_result.get("success", False):
                print("⚠️ Resume cleaning failed, using raw text")
                cleaned_resume_text = resume_text
            else:
                structured_resume = resume_cleaning_result.get("structured_data", {})
                cleaned_resume_text = _create_text_from_structured_data(
                    structured_resume, resume_text
                )

            print("✅ Data cleaning completed")

            # Stage 2: Direct Groq AI Analysis
            print("🤖 Performing direct Groq AI matching analysis...")

            # Import the AI extractor
            try:
                from app.services.matching.extract import analyze_resume_job_match
            except ImportError as e:
                print(f"❌ Failed to import AI extractor: {e}")
                raise HTTPException(
                    status_code=500, detail="AI analysis module not available"
                )

            # Get candidate name and job title for better analysis
            candidate_name = None
            job_title = (
                job_data.get("structured_data", {}).get("job_title")
                or "Unknown Position"
            )

            # Try to extract candidate name from resume data
            if resume_cleaning_result.get("success", False):
                structured_resume = resume_cleaning_result.get("structured_data", {})
                candidate_name = structured_resume.get("name") or structured_resume.get(
                    "full_name"
                )

            # Perform direct Groq AI analysis
            matching_result = analyze_resume_job_match(
                resume_text=cleaned_resume_text,
                job_description_text=cleaned_jd_text,
                candidate_name=candidate_name,
                job_title=job_title,
            )

            if not matching_result.get("success", False):
                print(f"⚠️ AI analysis failed, but continuing with available results")

            print("✅ Direct Groq AI matching completed")

            # Return the full AI analysis result with additional metadata
            analysis_response = {
                **matching_result,  # Include all extract.py results
                "job_id": job_id,
                "job_info": {
                    "company": job_data.get("structured_data", {}).get("company")
                    or "Unknown Company",
                    "position": job_data.get("structured_data", {}).get("job_title")
                    or job_data.get("filename", "Unknown Position"),
                },
                "resume_info": {
                    "filename": resume_file.filename,
                    "text_length": len(resume_text),
                },
                "processing_metadata": {
                    "data_cleaning_performed": True,
                    "ai_analysis_used": True,
                    "model_version": "groq-llama-3.1-8b-instant",
                    "matching_approach": "direct_groq_ai",
                },
            }

            print(
                f"🎉 Direct Groq AI analysis completed! Match Score: {matching_result.get('score', 'N/A')}%"
            )

            return analysis_response

        finally:
            # Clean up temp file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error in get-score endpoint: {str(e)}")
        import traceback

        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Error calculating score: {str(e)}"
        )


@router.post("/ai-analyze")
async def ai_powered_analysis(
    resume_text: str = Form(..., description="Raw resume text"),
    job_description_text: str = Form(..., description="Raw job description text"),
    candidate_name: Optional[str] = Form(None, description="Optional candidate name"),
    job_title: Optional[str] = Form(None, description="Optional job title"),
):
    """
    AI-powered comprehensive resume-job matching analysis

    Args:
        resume_text: Raw resume text content
        job_description_text: Raw job description text content
        candidate_name: Optional candidate name for personalized analysis
        job_title: Optional job title for context

    Returns:
        Comprehensive AI analysis with scoring and improvement recommendations
    """
    try:
        print("🤖 AI-powered analysis request received")
        print(f"📄 Resume length: {len(resume_text)} characters")
        print(f"📄 Job description length: {len(job_description_text)} characters")

        # Import the AI extractor
        try:
            from app.services.matching.extract import analyze_resume_job_match
        except ImportError:
            raise HTTPException(
                status_code=500, detail="AI analysis module not available"
            )

        # Perform AI-powered analysis
        analysis_result = analyze_resume_job_match(
            resume_text=resume_text,
            job_description_text=job_description_text,
            candidate_name=candidate_name,
            job_title=job_title,
        )

        if not analysis_result.get("success", False):
            # Return fallback results but still indicate it's not full AI analysis
            analysis_result["note"] = (
                "AI analysis unavailable, showing basic keyword matching results"
            )

        print("✅ AI analysis completed successfully")
        return analysis_result

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error in AI analysis endpoint: {str(e)}")
        import traceback

        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error in AI analysis: {str(e)}")


@router.delete("/reset")
async def reset_uploads():
    """
    Reset all uploads (clear stored data)

    Returns:
        Success message
    """
    job_storage.clear()
    resume_storage["current_resume"] = None

    return {
        "success": True,
        "message": "All uploads cleared successfully",
        "timestamp": datetime.now().isoformat(),
    }
