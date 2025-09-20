"""
PDF Text Extraction Service
Handles PDF text extraction without data cleaning
"""

import json
import sys
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime

# Add the parent directories to the path to import modules
sys.path.append(str(Path(__file__).parent.parent))
sys.path.append(str(Path(__file__).parent))

from parsing.pdf_extractor import FixedPDFParser


class PDFExtractionService:
    """
    PDF text extraction service - handles only PDF text extraction
    """

    def __init__(self):
        self.supported_types = ["resume", "job_description"]

    def extract_pdf_text(self, pdf_path: str) -> Dict[str, Any]:
        """
        Extract text from PDF file

        Args:
            pdf_path (str): Path to the PDF file

        Returns:
            Dict[str, Any]: Extraction result with raw text
        """
        try:
            # Validate inputs
            if not Path(pdf_path).exists():
                return {
                    "success": False,
                    "error": f"PDF file not found: {pdf_path}",
                    "stage": "validation",
                }

            print(f"🔍 Starting PDF text extraction for: {Path(pdf_path).name}")

            # Extract raw text from PDF using advanced parser
            print("📄 Extracting text from PDF...")
            parser = FixedPDFParser()
            extraction_result = parser.parse_pdf(pdf_path)

            if "error" in extraction_result:
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

            # Return extraction result with structured data
            final_result = {
                "success": True,
                "document_info": {
                    "source_file": extraction_result.get("source_file"),
                    "extracted_at": extraction_result.get(
                        "parsed_at", datetime.now().isoformat()
                    ),
                    "text_length": len(raw_text),
                    "document_type": extraction_result.get("document_type"),
                },
                "raw_text": raw_text,
                "structured_data": {
                    k: v
                    for k, v in extraction_result.items()
                    if k
                    not in ["raw_text", "source_file", "parsed_at", "document_type"]
                },
                "processing_stages": {"extraction": "success", "parsing": "success"},
            }

            print("🎉 PDF text extraction completed successfully!")
            return final_result

        except Exception as e:
            return {
                "success": False,
                "error": f"Extraction error: {str(e)}",
                "stage": "extraction",
            }

    def extract_and_save(
        self,
        pdf_path: str,
        output_path: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Extract text from PDF and save results to JSON file

        Args:
            pdf_path (str): Path to the PDF file
            output_path (str, optional): Custom output path for results

        Returns:
            Dict[str, Any]: Extraction result with save location
        """
        try:
            # Extract text from PDF
            result = self.extract_pdf_text(pdf_path)

            # Determine output path
            if not output_path:
                pdf_name = Path(pdf_path).stem
                output_dir = Path(__file__).parent.parent / "public" / "parsed-results"
                output_dir.mkdir(parents=True, exist_ok=True)
                output_path = output_dir / f"{pdf_name}_extracted.json"

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
def extract_pdf_file(pdf_path: str) -> Dict[str, Any]:
    """Extract text from a PDF file"""
    service = PDFExtractionService()
    return service.extract_pdf_text(pdf_path)


# Main execution for testing
if __name__ == "__main__":
    # Example usage
    service = PDFExtractionService()

    sample_resume_path = (
        "/home/adarsh/Innomatics/backend/app/public/sample-pdfs/sample_jd_1.pdf"
    )

    if Path(sample_resume_path).exists():
        print("=" * 60)
        print("🚀 Testing PDF Text Extraction Service")
        print("=" * 60)

        # Extract text from PDF
        result = service.extract_and_save(sample_resume_path)

        if result.get("success"):
            print("\n📊 Extraction Summary:")
            print(f"• Document: {result['document_info']['source_file']}")
            print(f"• Text Length: {result['document_info']['text_length']} characters")
            print(f"• Saved to: {result.get('saved_to', 'Not saved')}")

            # Print a sample of the raw text
            raw_text = result.get("raw_text", "")
            if raw_text:
                print("\n📋 Sample Raw Text:")
                print(raw_text[:500] + "..." if len(raw_text) > 500 else raw_text)
        else:
            print(f"\n❌ Extraction failed: {result.get('error')}")
            print(f"• Failed at stage: {result.get('stage')}")
    else:
        print(f"❌ Sample PDF not found: {sample_resume_path}")
        print("\n📝 Usage example:")
        print("python main.py")
        print("\nOr use programmatically:")
        print("from main import extract_pdf_file")
        print("result = extract_pdf_file('/path/to/document.pdf')")
