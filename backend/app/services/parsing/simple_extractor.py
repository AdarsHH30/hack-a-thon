"""
Simple PDF Text Extractor
Only extracts raw text and filename from PDF files
"""

import json
from typing import Dict, Any
from datetime import datetime
import fitz  # PyMuPDF
from pathlib import Path


class SimplePDFExtractor:
    """
    Simple PDF text extractor that only returns raw text and filename
    """

    def extract_pdf(self, pdf_path: str) -> Dict[str, Any]:
        """Extract raw text and filename from PDF"""
        try:
            # Extract raw text
            raw_text = self._extract_text_from_pdf(pdf_path)

            if not raw_text.strip():
                return {"error": "Could not extract text from PDF"}

            # Return simple result with just text and filenamenow
            result = {
                "source_file": Path(pdf_path).name,
                "extracted_at": datetime.now().isoformat(),
                "raw_text": raw_text.strip(),
                "text_length": len(raw_text.strip()),
                "success": True,
            }

            return result

        except Exception as e:
            return {
                "source_file": Path(pdf_path).name if pdf_path else "unknown",
                "extracted_at": datetime.now().isoformat(),
                "error": f"Error extracting text from PDF: {str(e)}",
                "success": False,
            }

    def _extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text from PDF using PyMuPDF"""
        try:
            doc = fitz.open(pdf_path)
            text = ""
            for page_num in range(doc.page_count):
                page = doc[page_num]
                page_text = page.get_text()
                text += page_text
                text += "\n"
            doc.close()
            return text
        except Exception as e:
            raise Exception(f"Error reading PDF file: {str(e)}")


# Convenience function
def extract_pdf_text(file_path: str) -> Dict[str, Any]:
    """Extract text from PDF file"""
    extractor = SimplePDFExtractor()
    return extractor.extract_pdf(file_path)


# Test execution
if __name__ == "__main__":
    # Test with sample PDF
    sample_pdf = (
        "/home/adarsh/Innomatics/backend/app/public/sample-pdfs/Adarsh Hegde.pdf"
    )

    try:
        result = extract_pdf_text(sample_pdf)
        print("PDF Text Extraction Result:")
        print(json.dumps(result, indent=2))

        # Save to res.json
        output_path = Path(
            "/home/adarsh/Innomatics/backend/app/services/parsing/res.json"
        )
        output_path.parent.mkdir(parents=True, exist_ok=True)

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=4, ensure_ascii=False)

        print(f"\nText extraction results saved to: {output_path}")

    except Exception as e:
        print(f"Error: {e}")
