"""
Clean Data Service using Groq API
Converts raw text data into structured JSON format
"""

import json
import os
import requests
from typing import Dict, Any, Optional
from pathlib import Path


class GroqDataCleaner:
    """
    Data cleaner that uses Groq API to convert raw text into structured JSON
    """

    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = "llama-3.1-8b-instant"

        if not self.api_key:
            print(
                "⚠️ GROQ_API_KEY environment variable not set. Data cleaning will be skipped."
            )
            print(
                "   To enable Groq API functionality, set GROQ_API_KEY in your environment variables."
            )
            print("   Get your API key from: https://console.groq.com/")
            self.api_available = False
        else:
            print("✅ Groq API key found. Data cleaning is available.")
            self.api_available = True

    def clean_resume_data(self, raw_text: str) -> Dict[str, Any]:
        """
        Convert raw resume text into structured JSON format

        Args:
            raw_text (str): Raw text extracted from PDF

        Returns:
            Dict[str, Any]: Structured resume data in JSON format
        """
        if not self.api_available:
            return {
                "success": False,
                "error": "Groq API not available, using raw text",
                "raw_text": raw_text,
            }

        try:
            prompt = self._create_resume_prompt(raw_text)
            response = self._call_groq_api(prompt)

            if response.get("success", False):
                cleaned_data = response.get("data", {})
                return {
                    "success": True,
                    "structured_data": cleaned_data,
                    "raw_text": raw_text,
                }
            else:
                return {
                    "success": False,
                    "error": response.get("error", "Unknown error occurred"),
                    "raw_text": raw_text,
                }

        except Exception as e:
            return {
                "success": False,
                "error": f"Error cleaning data: {str(e)}",
                "raw_text": raw_text,
            }

    def clean_job_description_data(self, raw_text: str) -> Dict[str, Any]:
        """
        Convert raw job description text into structured JSON format

        Args:
            raw_text (str): Raw text extracted from PDF

        Returns:
            Dict[str, Any]: Structured job description data in JSON format
        """
        try:
            prompt = self._create_job_description_prompt(raw_text)
            response = self._call_groq_api(prompt)

            if response.get("success", False):
                cleaned_data = response.get("data", {})
                return {
                    "success": True,
                    "structured_data": cleaned_data,
                    "raw_text": raw_text,
                }
            else:
                return {
                    "success": False,
                    "error": response.get("error", "Unknown error occurred"),
                    "raw_text": raw_text,
                }

        except Exception as e:
            return {
                "success": False,
                "error": f"Error cleaning data: {str(e)}",
                "raw_text": raw_text,
            }

    def _create_resume_prompt(self, raw_text: str) -> str:
        """Create a prompt for resume data extraction"""
        return f"""
Extract and structure the following resume data into JSON format. Use ONLY the exact words and phrases from the original text. Do not add, modify, or interpret any information. Simply organize the existing content into the specified JSON structure.

Raw Resume Text:
{raw_text}

Please return a JSON object with the following structure, using only the exact text from the resume:

{{
    "personal_info": {{
        "name": "",
        "email": "",
        "phone": "",
        "address": "",
        "linkedin": "",
        "github": ""
        
    }},
    "summary": "",
    "education": [
        {{
            "degree": "",
            "institution": "",
            "year": "",
            "gpa": "",
            "location": ""
        }}
    ],
    "experience": [
        {{
            "title": "",
            "company": "",
            "duration": "",
            "location": "",
            "responsibilities": []
        }}
    ],
    "skills": [],
    "certifications": [],
    "projects": [
        {{
            "name": "",
            "description": "",
            "technologies": [],
            "duration": ""
        }}
    ],
    "languages": [],
    "awards": []
}}

Return only the JSON object, no additional text or explanations.
"""

    def _create_job_description_prompt(self, raw_text: str) -> str:
        """Create a prompt for job description data extraction"""
        return f"""
Extract and structure the following job description data into JSON format. Use ONLY the exact words and phrases from the original text. Do not add, modify, or interpret any information. Simply organize the existing content into the specified JSON structure.

Raw Job Description Text:
{raw_text}

Please return a JSON object with the following structure, using only the exact text from the job description:

{{
    "job_title": "",
    "company": "",
    "location": "",
    "employment_type": "",
    "department": "",
    "job_summary": "",
    "responsibilities": [],
    "required_skills": [],
    "preferred_skills": [],
    "qualifications": {{
        "education": [],
        "experience": "",
        "certifications": []
    }},
    "benefits": [],
    "salary_range": "",
    "application_deadline": "",
    "contact_info": {{
        "email": "",
        "phone": "",
        "website": ""
    }}
}}

Return only the JSON object, no additional text or explanations.
"""

    def _call_groq_api(self, prompt: str) -> Dict[str, Any]:
        """
        Make API call to Groq

        Args:
            prompt (str): The prompt to send to Groq

        Returns:
            Dict[str, Any]: API response
        """
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }

            payload = {
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.1,  # Low temperature for consistent formatting
                "max_tokens": 2048,
            }

            response = requests.post(self.base_url, headers=headers, json=payload)
            response.raise_for_status()

            result = response.json()

            if "choices" in result and len(result["choices"]) > 0:
                content = result["choices"][0]["message"]["content"]

                # Try to parse the JSON response
                try:
                    # Clean the response to extract JSON
                    content = content.strip()

                    # Remove markdown code blocks
                    if content.startswith("```json"):
                        content = content[7:]
                    if content.startswith("```"):
                        content = content[3:]
                    if content.endswith("```"):
                        content = content[:-3]
                    content = content.strip()

                    # Try to find JSON object in the content
                    import re

                    json_match = re.search(r"\{.*\}", content, re.DOTALL)
                    if json_match:
                        json_content = json_match.group()
                        structured_data = json.loads(json_content)
                        return {"success": True, "data": structured_data}
                    else:
                        # If no JSON found, try parsing the whole content
                        structured_data = json.loads(content)
                        return {"success": True, "data": structured_data}

                except json.JSONDecodeError as e:
                    return {
                        "success": False,
                        "error": f"Failed to parse JSON response: {str(e)}",
                        "raw_response": content[:500],  # Limit raw response length
                    }
            else:
                return {"success": False, "error": "No valid response from Groq API"}

        except requests.exceptions.RequestException as e:
            # Get more detailed error information
            error_details = f"API request failed: {str(e)}"
            if hasattr(e, "response") and e.response is not None:
                try:
                    error_json = e.response.json()
                    error_details += f" - Response: {json.dumps(error_json)}"
                except:
                    error_details += f" - Response text: {e.response.text}"
            return {"success": False, "error": error_details}
        except Exception as e:
            return {"success": False, "error": f"Unexpected error: {str(e)}"}


# Convenience functions
def clean_resume_text(raw_text: str) -> Dict[str, Any]:
    """Clean resume text using Groq API"""
    cleaner = GroqDataCleaner()
    return cleaner.clean_resume_data(raw_text)


def clean_job_description_text(raw_text: str) -> Dict[str, Any]:
    """Clean job description text using Groq API"""
    cleaner = GroqDataCleaner()
    return cleaner.clean_job_description_data(raw_text)


# Test execution
if __name__ == "__main__":
    # Test with sample data
    sample_text = """
    John Doe
    Software Engineer
    john.doe@email.com
    (555) 123-4567
    
    Experience:
    - Senior Developer at Tech Corp (2020-2023)
    - Built web applications using Python and React
    - Led a team of 5 developers
    
    Education:
    - Bachelor of Science in Computer Science
    - University of Technology (2016-2020)
    
    Skills: Python, JavaScript, React, Node.js, SQL
    """

    try:
        result = clean_resume_text(sample_text)
        print("Resume Cleaning Result:")
        print(json.dumps(result, indent=2))

    except Exception as e:
        print(f"Error: {e}")
