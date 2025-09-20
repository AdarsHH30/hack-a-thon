"""
Main Service Integration
Combines PDF extraction and data cleaning pipeline
"""

import json
import sys
from pathlib import Path
from typing import Dict, Any, Optional

# Add the parent directories to the path to import modules
sys.path.append(str(Path(__file__).parent.parent))
sys.path.append(str(Path(__file__).parent))

from parsing.simple_extractor import extract_pdf_text
from clean_data.clean import clean_resume_text, clean_job_description_text


class PDFProcessingPipeline:
    """
    Complete PDF processing pipeline that extracts text and cleans data
    """

    def __init__(self):
        self.supported_types = ["resume", "job_description"]

    def process_pdf(
        self, pdf_path: str, document_type: str = "resume"
    ) -> Dict[str, Any]:
        """
        Complete pipeline: Extract PDF -> Clean Data -> Return Structured Result

        Args:
            pdf_path (str): Path to the PDF file
            document_type (str): Type of document ("resume" or "job_description")

        Returns:
            Dict[str, Any]: Complete processing result with structured data
        """
        try:
            # Validate inputs
            if not Path(pdf_path).exists():
                return {
                    "success": False,
                    "error": f"PDF file not found: {pdf_path}",
                    "stage": "validation",
                }

            if document_type not in self.supported_types:
                return {
                    "success": False,
                    "error": f"Unsupported document type: {document_type}. Supported: {self.supported_types}",
                    "stage": "validation",
                }

            print(f"🔍 Starting PDF processing pipeline for: {Path(pdf_path).name}")

            # Stage 1: Extract raw text from PDF
            print("📄 Stage 1: Extracting text from PDF...")
            extraction_result = extract_pdf_text(pdf_path)

            if not extraction_result.get("success", False):
                return {
                    "success": False,
                    "error": f"PDF extraction failed: {extraction_result.get('error', 'Unknown error')}",
                    "stage": "extraction",
                    "extraction_result": extraction_result,
                }

            raw_text = extraction_result.get("raw_text", "")
            if not raw_text.strip():
                return {
                    "success": False,
                    "error": "No text content found in PDF",
                    "stage": "extraction",
                    "extraction_result": extraction_result,
                }

            print(f"✅ Text extracted successfully. Length: {len(raw_text)} characters")

            # Stage 2: Clean and structure the data using Groq
            print("🤖 Stage 2: Cleaning and structuring data with Groq...")

            if document_type == "resume":
                cleaning_result = clean_resume_text(raw_text)
            else:  # job_description
                cleaning_result = clean_job_description_text(raw_text)

            if not cleaning_result.get("success", False):
                return {
                    "success": False,
                    "error": f"Data cleaning failed: {cleaning_result.get('error', 'Unknown error')}",
                    "stage": "cleaning",
                    "extraction_result": extraction_result,
                    "cleaning_result": cleaning_result,
                }

            print("✅ Data cleaned and structured successfully")

            # Stage 3: Combine results
            final_result = {
                "success": True,
                "document_info": {
                    "source_file": extraction_result.get("source_file"),
                    "processed_at": extraction_result.get("extracted_at"),
                    "document_type": document_type,
                    "text_length": extraction_result.get("text_length"),
                },
                "structured_data": cleaning_result.get("structured_data", {}),
                "raw_text": raw_text,
                "processing_stages": {"extraction": "success", "cleaning": "success"},
            }

            print("🎉 Pipeline completed successfully!")
            return final_result

        except Exception as e:
            return {
                "success": False,
                "error": f"Pipeline error: {str(e)}",
                "stage": "pipeline",
            }

    def process_and_save(
        self,
        pdf_path: str,
        document_type: str = "resume",
        output_path: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Process PDF and save results to JSON file

        Args:
            pdf_path (str): Path to the PDF file
            document_type (str): Type of document
            output_path (str, optional): Custom output path for results

        Returns:
            Dict[str, Any]: Processing result with save location
        """
        try:
            # Process the PDF
            result = self.process_pdf(pdf_path, document_type)

            # Determine output path
            if not output_path:
                pdf_name = Path(pdf_path).stem
                output_dir = Path(__file__).parent.parent / "public" / "parsed-results"
                output_dir.mkdir(parents=True, exist_ok=True)
                output_path = output_dir / f"{pdf_name}_{document_type}_processed.json"

            # Save results
            with open(output_path, "w", encoding="utf-8") as f:
                json.dump(result, f, indent=4, ensure_ascii=False)

            result["saved_to"] = str(output_path)
            print(f"💾 Results saved to: {output_path}")

            return result

        except Exception as e:
            return {
                "success": False,
                "error": f"Save error: {str(e)}",
                "stage": "saving",
            }


# Convenience functions
def process_pdf_file(pdf_path: str, document_type: str = "resume") -> Dict[str, Any]:
    """Process a PDF file through the complete pipeline"""
    pipeline = PDFProcessingPipeline()
    return pipeline.process_pdf(pdf_path, document_type)


def process_resume(pdf_path: str) -> Dict[str, Any]:
    """Process a resume PDF"""
    return process_pdf_file(pdf_path, "resume")


def process_job_description(pdf_path: str) -> Dict[str, Any]:
    """Process a job description PDF"""
    return process_pdf_file(pdf_path, "job_description")


# Main execution for testing
if __name__ == "__main__":
    # Example usage
    pipeline = PDFProcessingPipeline()

    sample_resume_path = (
        "/home/adarsh/Innomatics/backend/app/public/sample-pdfs/sample_jd_1.pdf"
    )

    if Path(sample_resume_path).exists():
        print("=" * 60)
        print("🚀 Testing PDF Processing Pipeline")
        print("=" * 60)

        # Process as resume
        result = pipeline.process_and_save(sample_resume_path, "job_description")

        if result.get("success"):
            print("\n📊 Processing Summary:")
            print(f"• Document: {result['document_info']['source_file']}")
            print(f"• Type: {result['document_info']['document_type']}")
            print(f"• Text Length: {result['document_info']['text_length']} characters")
            print(f"• Saved to: {result.get('saved_to', 'Not saved')}")

            # Print a sample of the structured data
            structured_data = result.get("structured_data", {})
            if structured_data:
                print("\n📋 Sample Structured Data:")
                if "personal_info" in structured_data:
                    personal_info = structured_data["personal_info"]
                    print(f"• Name: {personal_info.get('name', 'N/A')}")
                    print(f"• Email: {personal_info.get('email', 'N/A')}")
                    print(f"• Phone: {personal_info.get('phone', 'N/A')}")
        else:
            print(f"\n❌ Processing failed: {result.get('error')}")
            print(f"• Failed at stage: {result.get('stage')}")
    else:
        print(f"❌ Sample PDF not found: {sample_resume_path}")
        print("\n📝 Usage example:")
        print("python main.py")
        print("\nOr use programmatically:")
        print("from main import process_resume, process_job_description")
        print("result = process_resume('/path/to/resume.pdf')")
