from fastapi import APIRouter, File, UploadFile, HTTPException
from datetime import datetime
from typing import Optional
import os

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
