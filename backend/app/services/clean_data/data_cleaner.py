"""
Clean Data Service using Groq API
Converts raw text data into structured JSON format
"""

import json
import os
import re
import requests
from typing import Dict, Any, Optional
from pathlib import Path
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
        Handles both single jobs and multiple jobs in one document

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

                # Check if the response contains multiple jobs (array) or single job (object)
                if isinstance(cleaned_data, list):
                    # Multiple jobs found
                    return {
                        "success": True,
                        "structured_data": cleaned_data,
                        "raw_text": raw_text,
                        "multiple_jobs": True,
                        "job_count": len(cleaned_data),
                    }
                else:
                    # Single job found
                    return {
                        "success": True,
                        "structured_data": [
                            cleaned_data
                        ],  # Convert to array for consistency
                        "raw_text": raw_text,
                        "multiple_jobs": False,
                        "job_count": 1,
                    }
            else:
                print(
                    f"❌ Groq API call failed: {response.get('error', 'Unknown error')}"
                )
                # Use fallback parsing
                fallback_data = self._fallback_job_parsing(raw_text)
                return {
                    "success": False,
                    "error": response.get("error", "Unknown error occurred"),
                    "raw_text": raw_text,
                    "structured_data": [fallback_data],  # Still return structured data
                    "multiple_jobs": False,
                    "job_count": 1,
                    "fallback_used": True,
                }

        except Exception as e:
            return {
                "success": False,
                "error": f"Error cleaning data: {str(e)}",
                "raw_text": raw_text,
                "multiple_jobs": False,
                "job_count": 0,
            }

    def _create_resume_prompt(self, raw_text: str) -> str:
        """Create a prompt for resume data extraction"""
        return f"""You are a JSON-only data extraction assistant. Your response must be valid JSON only - no explanations, no markdown, no additional text.

Extract and structure the following resume data into JSON format. Use ONLY the exact words and phrases from the original text. Do not add, modify, or interpret any information. Simply organize the existing content into the specified JSON structure.

Raw Resume Text:
{raw_text}

CRITICAL INSTRUCTIONS:
1. Return ONLY valid JSON - no text before or after
2. Use exact text from the source - do not modify or interpret
3. Ensure all JSON keys are present even if empty
4. Do not include any comments or explanations

REQUIRED JSON STRUCTURE:
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

JSON OUTPUT ONLY:"""

    def _create_job_description_prompt(self, raw_text: str) -> str:
        """Create a prompt for job description data extraction that handles multiple jobs and dynamic fields"""
        return f"""You are an expert job description parser. Your task is to extract ALL relevant information from job descriptions and organize it into clean, structured JSON.

IMPORTANT: Do NOT use a rigid structure. Instead, analyze the job description and identify ALL distinct sections and fields present. Extract each piece of information you find.

Raw Job Description Text:
{raw_text}

EXTRACTION RULES:
1. Identify ALL distinct sections in the job description (e.g., "Eligibility Criteria", "Skills", "Stipend", "Schedule", "Benefits", etc.)
2. Extract EVERY piece of information, no matter how specific
3. For multiple jobs in one document, create separate objects for each job
4. Use the EXACT text from the source - do not modify, summarize, or interpret
5. Group related information logically
6. Include ALL details like stipend amounts, bond periods, eligibility criteria, schedules, etc.

OUTPUT FORMAT:
- If multiple jobs: Return an array of job objects
- If single job: Return a single job object
- Each job object should have ALL the fields you can identify from the text

Example of what to extract:
- "stipend": "₹5,000 per month"
- "bond": "2.6 years, including the internship period"
- "eligibility_criteria": "B.Tech, BE; 2023 and earlier pass-outs"
- "schedule": "Day shift, Monday to Friday"
- "skills": ["Python", "Spark", "Kafka", "Pyspark", "C++"]
- "job_types": ["Full-time", "Internship", "Fresher", "Permanent"]
- "internship_duration": "6 months"
- "location": "Pune (Onsite)"

Extract EVERY field you can identify. Be thorough and comprehensive.

JSON OUTPUT ONLY (no explanations, no markdown):"""

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
                "temperature": 0.0,  # Zero temperature for consistent JSON formatting
                "max_tokens": 2048,
            }

            response = requests.post(self.base_url, headers=headers, json=payload)
            response.raise_for_status()

            result = response.json()

            if "choices" in result and len(result["choices"]) > 0:
                content = result["choices"][0]["message"]["content"]
                print(
                    f"🔍 Groq API response received, length: {len(content)} characters"
                )

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

                    # Try multiple approaches to extract valid JSON
                    structured_data = None

                    # Approach 1: Try to find the first complete JSON object/array
                    # Look for JSON array first (for multiple jobs)
                    array_match = re.search(r"\[.*\]", content, re.DOTALL)
                    if array_match:
                        try:
                            json_content = array_match.group()
                            structured_data = json.loads(json_content)
                        except json.JSONDecodeError:
                            pass  # Try next approach

                    # Approach 2: Look for JSON object
                    if structured_data is None:
                        object_match = re.search(r"\{.*\}", content, re.DOTALL)
                        if object_match:
                            try:
                                json_content = object_match.group()
                                structured_data = json.loads(json_content)
                            except json.JSONDecodeError:
                                pass  # Try next approach

                    # Approach 3: Try parsing the entire content
                    if structured_data is None:
                        try:
                            structured_data = json.loads(content)
                        except json.JSONDecodeError:
                            pass  # Try next approach

                    # Approach 4: Extract JSON from mixed content (find first { and last })
                    if structured_data is None:
                        start_idx = content.find("{")
                        end_idx = content.rfind("}")
                        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
                            try:
                                json_content = content[start_idx : end_idx + 1]
                                structured_data = json.loads(json_content)
                            except json.JSONDecodeError:
                                pass  # All approaches failed

                    if structured_data is not None:
                        print(f"✅ Successfully parsed JSON response")
                        return {"success": True, "data": structured_data}
                    else:
                        print(f"❌ No valid JSON found in Groq response")
                        print(f"Raw response preview: {content[:200]}...")
                        return {
                            "success": False,
                            "error": "No valid JSON found in response",
                            "raw_response": content[:500],  # Limit raw response length
                        }

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
            print(f"❌ Unexpected error in _call_groq_api: {str(e)}")
            return {"success": False, "error": f"Unexpected error: {str(e)}"}

    def _fallback_job_parsing(self, raw_text: str) -> Dict[str, Any]:
        """
        Enhanced fallback parsing when Groq API fails - extract all identifiable fields from raw text
        """
        print("🔄 Using enhanced fallback parsing for job description")

        # Initialize with common fields found in job descriptions
        job_data = {
            "job_title": "",
            "company": "",
            "location": "",
            "employment_type": "",
            "department": "",
            "job_summary": "",
            "responsibilities": [],
            "required_skills": [],
            "preferred_skills": [],
            "qualifications": {"education": [], "experience": "", "certifications": []},
            "benefits": [],
            "salary_range": "",
            "stipend": "",
            "bond": "",
            "internship_duration": "",
            "eligibility_criteria": [],
            "schedule": "",
            "job_types": [],
            "application_deadline": "",
            "contact_info": {"email": "", "phone": "", "website": ""},
        }

        lines = raw_text.split("\n")
        current_section = ""
        section_content = []

        # Enhanced pattern matching for various job description fields
        patterns = {
            "stipend": ["stipend", "salary", "compensation", "pay"],
            "bond": ["bond", "commitment", "agreement"],
            "internship_duration": ["duration", "internship period", "months"],
            "eligibility_criteria": [
                "eligibility",
                "requirements",
                "criteria",
                "qualification",
            ],
            "schedule": ["schedule", "shift", "timing", "hours"],
            "job_types": ["job type", "employment type", "position type"],
            "location": ["location", "place", "site", "office"],
            "skills": ["skills", "technologies", "tools", "expertise"],
            "responsibilities": ["responsibilities", "duties", "role", "will do"],
            "benefits": ["benefits", "perks", "advantages"],
        }

        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Check if this line starts a new section
            lower_line = line.lower()
            for field, keywords in patterns.items():
                if any(keyword in lower_line for keyword in keywords):
                    # Save previous section if it had content
                    if current_section and section_content:
                        self._process_section_content(
                            job_data, current_section, section_content
                        )

                    current_section = field
                    section_content = [line]
                    break
            else:
                # Continue accumulating content for current section
                if current_section:
                    section_content.append(line)

        # Process the last section
        if current_section and section_content:
            self._process_section_content(job_data, current_section, section_content)

        # Extract basic info using simple patterns
        for line in lines[:30]:  # Check first 30 lines for basic info
            line = line.strip()
            if not line:
                continue

            # Job title patterns
            if not job_data["job_title"] and any(
                keyword in line.lower()
                for keyword in [
                    "engineer",
                    "developer",
                    "analyst",
                    "manager",
                    "intern",
                    "specialist",
                    "scientist",
                ]
            ):
                job_data["job_title"] = line

            # Company patterns
            if not job_data["company"] and any(
                keyword in line.lower()
                for keyword in [
                    "ltd",
                    "inc",
                    "corp",
                    "company",
                    "technologies",
                    "solutions",
                    "ray",
                    "axion",
                ]
            ):
                job_data["company"] = line

        return job_data

    def _process_section_content(
        self, job_data: Dict[str, Any], section: str, content: list
    ):
        """Process accumulated content for a specific section"""
        content_text = " ".join(content)

        if section == "stipend":
            # Extract stipend information
            stipend_match = re.search(
                r"[₹$]\s*[\d,]+(?:\s*per\s+\w+)?", content_text, re.IGNORECASE
            )
            if stipend_match:
                job_data["stipend"] = stipend_match.group()

        elif section == "bond":
            # Extract bond information
            bond_match = re.search(
                r"\d+(?:\.\d+)?\s*(?:years?|months?)", content_text, re.IGNORECASE
            )
            if bond_match:
                job_data["bond"] = bond_match.group()

        elif section == "internship_duration":
            # Extract duration
            duration_match = re.search(
                r"\d+(?:\.\d+)?\s*(?:months?|years?)", content_text, re.IGNORECASE
            )
            if duration_match:
                job_data["internship_duration"] = duration_match.group()

        elif section == "eligibility_criteria":
            # Extract eligibility items
            criteria = []
            for item in content:
                if item.strip().startswith("•") or item.strip().startswith("-"):
                    criteria.append(item.strip()[1:].strip())
            job_data["eligibility_criteria"] = criteria

        elif section == "schedule":
            job_data["schedule"] = content_text

        elif section == "job_types":
            # Extract job types
            types = []
            for item in content:
                if "full-time" in item.lower():
                    types.append("Full-time")
                if "internship" in item.lower():
                    types.append("Internship")
                if "fresher" in item.lower():
                    types.append("Fresher")
                if "permanent" in item.lower():
                    types.append("Permanent")
            job_data["job_types"] = list(set(types))  # Remove duplicates

        elif section == "skills":
            # Extract skills
            skills = []
            for item in content:
                if item.strip().startswith("•") or item.strip().startswith("-"):
                    skill = item.strip()[1:].strip()
                    # Split by commas and common separators
                    sub_skills = [
                        s.strip()
                        for s in skill.replace(" and ", ", ").split(", ")
                        if s.strip()
                    ]
                    skills.extend(sub_skills)
            job_data["required_skills"] = skills

        elif section == "responsibilities":
            # Extract responsibilities
            responsibilities = []
            for item in content:
                if item.strip().startswith("•") or item.strip().startswith("-"):
                    responsibilities.append(item.strip()[1:].strip())
            job_data["responsibilities"] = responsibilities

        elif section == "location":
            # Extract location
            location_match = re.search(
                r"(?:location|place|site|office)[:\s]*([^\n\r]+)",
                content_text,
                re.IGNORECASE,
            )
            if location_match:
                job_data["location"] = location_match.group(1).strip()

        elif section == "benefits":
            job_data["benefits"] = [content_text]


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
