from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from datetime import datetime
from typing import Optional
import os
import tempfile
import sys
from pathlib import Path

# Add the services path to import modules
sys.path.append(str(Path(__file__).parent.parent.parent))

from app.services.main import PDFExtractionService, extract_pdf_file
from app.services.clean_data.clean import clean_resume_text, clean_job_description_text

router = APIRouter()

# In-memory storage for PDF metadata (in production, use a database)
pdf_storage = {}
pdf_counter = 1


@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload and process PDF file
    """
    global pdf_counter

    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    if not file.content_type == "application/pdf":
        raise HTTPException(
            status_code=400, detail="Invalid file type. Please upload a PDF file"
        )

    try:
        # Read file content
        file_content = await file.read()
        file_size = len(file_content)

        file_id = pdf_counter
        pdf_counter += 1

        # In a real application, you would save the file to disk or cloud storage
        # For now, we'll just store metadata
        pdf_info = {
            "id": file_id,
            "filename": file.filename,
            "size": file_size,
            "content_type": file.content_type,
            "uploaded_at": datetime.now().isoformat(),
            "status": "uploaded",
        }

        pdf_storage[file_id] = pdf_info

        return {
            "message": "PDF uploaded successfully",
            "file_id": file_id,
            "filename": file.filename,
            "size_bytes": file_size,
            "timestamp": datetime.now().isoformat(),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")


@router.get("/pdf/{file_id}")
async def get_pdf_info(file_id: int):
    """
    Get information about uploaded PDF
    """
    if file_id not in pdf_storage:
        raise HTTPException(status_code=404, detail=f"PDF with ID {file_id} not found")

    return {
        "message": "PDF information retrieved successfully",
        "pdf": pdf_storage[file_id],
        "timestamp": datetime.now().isoformat(),
    }


@router.get("/pdf")
async def get_all_pdfs():
    """
    Get list of all uploaded PDFs
    """
    return {
        "message": "All PDFs retrieved successfully",
        "count": len(pdf_storage),
        "pdfs": list(pdf_storage.values()),
        "timestamp": datetime.now().isoformat(),
    }


@router.delete("/pdf/{file_id}")
async def delete_pdf(file_id: int):
    """
    Delete uploaded PDF
    """
    if file_id not in pdf_storage:
        raise HTTPException(status_code=404, detail=f"PDF with ID {file_id} not found")

    deleted_pdf = pdf_storage.pop(file_id)

    return {
        "message": "PDF deleted successfully",
        "deleted_pdf": deleted_pdf,
        "timestamp": datetime.now().isoformat(),
    }


@router.post("/process-pdf/{file_id}")
async def process_pdf(file_id: int):
    """
    Process uploaded PDF (placeholder for actual PDF processing logic)
    """
    if file_id not in pdf_storage:
        raise HTTPException(status_code=404, detail=f"PDF with ID {file_id} not found")

    pdf_storage[file_id]["status"] = "processing"
    pdf_storage[file_id]["processed_at"] = datetime.now().isoformat()

    processing_result = {
        "extracted_text": "Sample extracted text from PDF...",
        "pages": 2,
        "processing_time_ms": 1500,
        "status": "completed",
    }

    pdf_storage[file_id]["processing_result"] = processing_result
    pdf_storage[file_id]["status"] = "completed"

    return {
        "message": "PDF processed successfully",
        "file_id": file_id,
        "result": processing_result,
        "timestamp": datetime.now().isoformat(),
    }


@router.post("/process-complete-pdf")
async def process_complete_pdf(
    file: UploadFile = File(...), document_type: str = Form(default="resume")
):
    """
    Complete PDF processing: Extract text + Clean data in route layer
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    if not file.content_type == "application/pdf":
        raise HTTPException(
            status_code=400, detail="Invalid file type. Please upload a PDF file"
        )

    if document_type not in ["resume", "job_description"]:
        raise HTTPException(
            status_code=400,
            detail="Document type must be 'resume' or 'job_description'",
        )

    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        try:
            # Stage 1: Extract text using service layer
            print(f"🔍 Extracting text from {file.filename}...")
            extraction_service = PDFExtractionService()
            extraction_result = extraction_service.extract_pdf_text(temp_file_path)

            if not extraction_result.get("success", False):
                return {
                    "success": False,
                    "error": f"PDF extraction failed: {extraction_result.get('error')}",
                    "stage": "extraction",
                    "filename": file.filename,
                    "timestamp": datetime.now().isoformat(),
                }

            raw_text = extraction_result.get("raw_text", "")
            if not raw_text.strip():
                return {
                    "success": False,
                    "error": "No text content found in PDF",
                    "stage": "extraction",
                    "filename": file.filename,
                    "timestamp": datetime.now().isoformat(),
                }

            print(f"✅ Text extracted. Length: {len(raw_text)} characters")

            # Stage 2: Clean data using cleaning functions directly in route
            print(f"🤖 Cleaning {document_type} data...")

            if document_type == "resume":
                cleaning_result = clean_resume_text(raw_text)
            else:  # job_description
                cleaning_result = clean_job_description_text(raw_text)

            if not cleaning_result.get("success", False):
                return {
                    "success": False,
                    "error": f"Data cleaning failed: {cleaning_result.get('error')}",
                    "stage": "cleaning",
                    "filename": file.filename,
                    "extraction_data": extraction_result,
                    "timestamp": datetime.now().isoformat(),
                }

            print("✅ Data cleaned and structured successfully")

            # Combine results
            final_result = {
                "success": True,
                "filename": file.filename,
                "document_type": document_type,
                "document_info": extraction_result.get("document_info", {}),
                "structured_data": cleaning_result.get("structured_data", {}),
                "raw_text": raw_text,
                "processing_stages": {"extraction": "success", "cleaning": "success"},
                "processed_at": datetime.now().isoformat(),
            }

            print("🎉 Complete PDF processing finished successfully!")
            return final_result

        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)

    except Exception as e:
        # Clean up temporary file in case of error
        if "temp_file_path" in locals() and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)

        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")


@router.post("/extract-text-only")
async def extract_text_only(file: UploadFile = File(...)):
    """
    Extract text from PDF without cleaning (using service layer only)
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    if not file.content_type == "application/pdf":
        raise HTTPException(
            status_code=400, detail="Invalid file type. Please upload a PDF file"
        )

    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        try:
            # Extract text using service layer
            print(f"🔍 Extracting text from {file.filename}...")
            extraction_result = extract_pdf_file(temp_file_path)

            if extraction_result.get("success", False):
                extraction_result["filename"] = file.filename
                extraction_result["processed_at"] = datetime.now().isoformat()
                print("✅ Text extraction completed successfully!")
                return extraction_result
            else:
                return {
                    "success": False,
                    "error": extraction_result.get("error", "Unknown error"),
                    "filename": file.filename,
                    "timestamp": datetime.now().isoformat(),
                }

        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)

    except Exception as e:
        # Clean up temporary file in case of error
        if "temp_file_path" in locals() and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)

        raise HTTPException(
            status_code=500, detail=f"Error extracting text from PDF: {str(e)}"
        )
