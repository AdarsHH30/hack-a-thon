"""
Resume-Job Matching Extractor using Groq AI
Provides intelligent scoring and improvement recommendations for resume-job matching
"""

import json
import os
import re
import requests
from typing import Dict, Any, Optional, List
from pathlib import Path
from datetime import datetime


class ResumeJobExtractor:
    """
    Intelligent Resume-Job Matching Extractor using Groq AI
    Provides comprehensive scoring and improvement recommendations
    """

    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        print(self.api_key)
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = "llama-3.1-8b-instant"

        if not self.api_key:
            print(
                "⚠️ GROQ_API_KEY environment variable not set. AI-powered extraction will be limited."
            )
            print(
                "   To enable full AI functionality, set GROQ_API_KEY in your environment variables."
            )
            self.api_available = False
        else:
            print("✅ Groq API key found. AI-powered extraction is available.")
            self.api_available = True

    def extract_and_score(
        self,
        resume_text: str,
        job_description_text: str,
        candidate_name: Optional[str] = None,
        job_title: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Extract insights and provide scoring for resume-job matching

        Args:
            resume_text: Raw resume text
            job_description_text: Raw job description text
            candidate_name: Optional candidate name for personalization
            job_title: Optional job title for context

        Returns:
            Dict with comprehensive matching analysis
        """
        if not self.api_available:
            return self._fallback_analysis(resume_text, job_description_text)

        try:
            # Create comprehensive analysis prompt
            prompt = self._create_analysis_prompt(
                resume_text, job_description_text, candidate_name, job_title
            )

            # Call Groq API
            response = self._call_groq_api(prompt)

            if response.get("success", False):
                analysis_data = response.get("data", {})

                # Validate and structure the response
                return self._structure_analysis_response(
                    analysis_data, resume_text, job_description_text
                )
            else:
                print(
                    f"❌ Groq API analysis failed: {response.get('error', 'Unknown error')}"
                )
                return self._fallback_analysis(resume_text, job_description_text)

        except Exception as e:
            print(f"❌ Error in extract_and_score: {str(e)}")
            return self._fallback_analysis(resume_text, job_description_text)

    def _create_analysis_prompt(
        self,
        resume_text: str,
        job_description_text: str,
        candidate_name: Optional[str],
        job_title: Optional[str],
    ) -> str:
        """Create a comprehensive analysis prompt for Groq"""

        context_info = ""
        if candidate_name:
            context_info += f"Candidate Name: {candidate_name}\n"
        if job_title:
            context_info += f"Target Position: {job_title}\n"

        return f"""You are an expert HR consultant and technical recruiter with 15+ years of experience in talent acquisition and career development. Your task is to provide a comprehensive, professional analysis of how well a candidate's resume matches a job description.

{context_info}

RESUME TEXT:
{resume_text}

JOB DESCRIPTION TEXT:
{job_description_text}

Please provide a detailed JSON analysis with the following structure. Be specific, actionable, and professional in your recommendations:

{{
  "overall_assessment": {{
    "match_score": <number 0-100, how well the candidate matches the role>,
    "suitability_level": "<High/Medium/Low Match>",
    "confidence_level": "<High/Medium/Low>",
    "summary": "<2-3 sentence professional summary of the match>"
  }},
  "skill_analysis": {{
    "matched_skills": [<array of skills that match between resume and JD>],
    "missing_critical_skills": [<array of important skills missing from resume>],
    "skill_gaps": [<array of skills that would strengthen the application>],
    "technical_competency": "<assessment of technical skills match>"
  }},
  "experience_analysis": {{
    "experience_match": "<assessment of experience level match>",
    "relevant_experience_years": <number of relevant years>,
    "experience_quality": "<assessment of experience depth and relevance>",
    "career_progression": "<assessment of career growth pattern>"
  }},
  "improvement_recommendations": {{
    "immediate_actions": [<3-5 specific, actionable steps to improve match score>],
    "skill_development": [<2-3 skills to prioritize learning>],
    "experience_building": [<2-3 ways to gain relevant experience>],
    "resume_optimization": [<2-3 specific resume improvements>]
  }},
  "strengths": [<3-5 key strengths of this candidate for this role>],
  "concerns": [<2-3 potential concerns or red flags>],
  "recommendation": {{
    "interview_recommendation": "<Recommend/Proceed with Caution/Not Recommended>",
    "justification": "<brief explanation for the recommendation>",
    "next_steps": [<2-3 suggested next steps for the candidate>]
  }}
}}

Guidelines:
- Be honest but constructive in your assessment
- Focus on technical skills, experience level, and role requirements
- Provide specific, actionable recommendations
- Consider both hard skills (technical) and soft skills (communication, leadership)
- Score should reflect realistic employability for this specific role
- Use industry-standard terminology and realistic expectations

Return ONLY valid JSON. No explanations, no markdown, no additional text."""

    def _call_groq_api(self, prompt: str) -> Dict[str, Any]:
        """
        Make API call to Groq for analysis

        Args:
            prompt: The analysis prompt

        Returns:
            Dict with API response
        """
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }

            payload = {
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.1,  # Low temperature for consistent analysis
                "max_tokens": 4096,  # Allow for detailed analysis
            }

            response = requests.post(self.base_url, headers=headers, json=payload)
            response.raise_for_status()

            result = response.json()

            if "choices" in result and len(result["choices"]) > 0:
                content = result["choices"][0]["message"]["content"]
                print(
                    f"🔍 Groq analysis response received, length: {len(content)} characters"
                )

                # Clean and parse JSON response
                content = content.strip()

                # Remove markdown code blocks if present
                if content.startswith("```json"):
                    content = content[7:]
                if content.startswith("```"):
                    content = content[3:]
                if content.endswith("```"):
                    content = content[:-3]
                content = content.strip()

                try:
                    analysis_data = json.loads(content)
                    return {"success": True, "data": analysis_data}
                except json.JSONDecodeError as e:
                    print(f"❌ JSON parsing error: {e}")
                    print(f"Raw content: {content[:500]}...")
                    return {
                        "success": False,
                        "error": f"Failed to parse JSON response: {str(e)}",
                    }
            else:
                return {"success": False, "error": "No valid response from Groq API"}

        except requests.exceptions.RequestException as e:
            return {"success": False, "error": f"API request failed: {str(e)}"}
        except Exception as e:
            return {"success": False, "error": f"Unexpected error: {str(e)}"}

    def _structure_analysis_response(
        self, analysis_data: Dict[str, Any], resume_text: str, job_description_text: str
    ) -> Dict[str, Any]:
        """Structure the analysis response with metadata"""

        # Ensure all required fields exist with defaults
        structured_response = {
            "success": True,
            "timestamp": datetime.now().isoformat(),
            "model_used": "groq-llama-3.1-8b-instant",
            "analysis_type": "comprehensive_resume_job_matching",
            "input_metadata": {
                "resume_length": len(resume_text),
                "job_description_length": len(job_description_text),
                "resume_preview": (
                    resume_text[:200] + "..." if len(resume_text) > 200 else resume_text
                ),
                "job_preview": (
                    job_description_text[:200] + "..."
                    if len(job_description_text) > 200
                    else job_description_text
                ),
            },
            "overall_assessment": analysis_data.get("overall_assessment", {}),
            "skill_analysis": analysis_data.get("skill_analysis", {}),
            "experience_analysis": analysis_data.get("experience_analysis", {}),
            "improvement_recommendations": analysis_data.get(
                "improvement_recommendations", {}
            ),
            "strengths": analysis_data.get("strengths", []),
            "concerns": analysis_data.get("concerns", []),
            "recommendation": analysis_data.get("recommendation", {}),
            # Legacy compatibility fields
            "score": analysis_data.get("overall_assessment", {}).get("match_score", 0),
            "verdict": analysis_data.get("overall_assessment", {}).get(
                "suitability_level", "Unknown"
            ),
            "matched_skills": analysis_data.get("skill_analysis", {}).get(
                "matched_skills", []
            ),
            "missing_skills": analysis_data.get("skill_analysis", {}).get(
                "missing_critical_skills", []
            ),
            "suggestions": analysis_data.get("improvement_recommendations", {}).get(
                "immediate_actions", []
            ),
        }

        return structured_response

    def _fallback_analysis(
        self, resume_text: str, job_description_text: str
    ) -> Dict[str, Any]:
        """Fallback analysis when Groq API is not available"""

        # Basic keyword matching as fallback
        resume_words = set(re.findall(r"\b\w+\b", resume_text.lower()))
        job_words = set(re.findall(r"\b\w+\b", job_description_text.lower()))

        matched_words = resume_words.intersection(job_words)
        match_score = (
            min(100, (len(matched_words) / len(job_words)) * 100) if job_words else 0
        )

        return {
            "success": False,
            "timestamp": datetime.now().isoformat(),
            "model_used": "fallback_keyword_matching",
            "analysis_type": "basic_keyword_matching",
            "input_metadata": {
                "resume_length": len(resume_text),
                "job_description_length": len(job_description_text),
            },
            "overall_assessment": {
                "match_score": round(match_score, 1),
                "suitability_level": (
                    "Low Match"
                    if match_score < 50
                    else "Medium Match" if match_score < 75 else "High Match"
                ),
                "confidence_level": "Low",
                "summary": f"Basic keyword matching shows {len(matched_words)} matching terms out of {len(job_words)} job requirements.",
            },
            "skill_analysis": {
                "matched_skills": list(matched_words)[:10],  # Limit to first 10
                "missing_critical_skills": [],
                "skill_gaps": [],
                "technical_competency": "Unable to assess without AI analysis",
            },
            "experience_analysis": {
                "experience_match": "Unable to assess without AI analysis",
                "relevant_experience_years": 0,
                "experience_quality": "Unable to assess without AI analysis",
                "career_progression": "Unable to assess without AI analysis",
            },
            "improvement_recommendations": {
                "immediate_actions": [
                    "Enable Groq API for detailed AI-powered analysis",
                    "Consider adding more specific technical skills to your resume",
                    "Tailor your resume keywords to match job requirements",
                ],
                "skill_development": [],
                "experience_building": [],
                "resume_optimization": [],
            },
            "strengths": ["Resume submitted for analysis"],
            "concerns": ["AI analysis not available - results are limited"],
            "recommendation": {
                "interview_recommendation": "Unable to determine",
                "justification": "AI analysis required for proper evaluation",
                "next_steps": ["Enable Groq API for comprehensive analysis"],
            },
            # Legacy compatibility
            "score": round(match_score, 1),
            "verdict": (
                "Low Match"
                if match_score < 50
                else "Medium Match" if match_score < 75 else "High Match"
            ),
            "matched_skills": list(matched_words)[:10],
            "missing_skills": [],
            "suggestions": ["Enable Groq API for detailed analysis"],
        }


# Convenience functions
def analyze_resume_job_match(
    resume_text: str,
    job_description_text: str,
    candidate_name: Optional[str] = None,
    job_title: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Convenience function to analyze resume-job match

    Args:
        resume_text: Raw resume text
        job_description_text: Raw job description text
        candidate_name: Optional candidate name
        job_title: Optional job title

    Returns:
        Dict with comprehensive analysis
    """
    extractor = ResumeJobExtractor()
    return extractor.extract_and_score(
        resume_text, job_description_text, candidate_name, job_title
    )


# Example usage
if __name__ == "__main__":
    # Example usage
    sample_resume = """
    John Doe
    Senior Python Developer

    Experience:
    - 5 years Python development
    - Django, Flask frameworks
    - PostgreSQL, MongoDB databases
    - AWS cloud services
    - Docker, Kubernetes

    Skills:
    - Python, JavaScript
    - React, Node.js
    - Git, Jenkins CI/CD
    """

    sample_jd = """
    Senior Python Developer Position

    Requirements:
    - 3+ years Python experience
    - Django or Flask
    - PostgreSQL or similar
    - AWS experience preferred
    - Docker containerization
    - REST API development

    Nice to have:
    - Kubernetes
    - React frontend skills
    - CI/CD experience
    """

    extractor = ResumeJobExtractor()
    result = extractor.extract_and_score(
        sample_resume,
        sample_jd,
        candidate_name="John Doe",
        job_title="Senior Python Developer",
    )

    print("=== Resume-Job Matching Analysis ===")
    print(f"Match Score: {result.get('score', 'N/A')}%")
    print(f"Suitability: {result.get('verdict', 'N/A')}")
    print(f"Matched Skills: {result.get('matched_skills', [])}")
    print(f"Missing Skills: {result.get('missing_skills', [])}")
    print(f"Recommendations: {result.get('suggestions', [])}")
