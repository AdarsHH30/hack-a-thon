# Resume-Job Extractor (`extract.py`)

## Overview

The `ResumeJobExtractor` is an AI-powered module that provides comprehensive resume-job matching analysis using Groq's Llama model. Unlike basic keyword matching, this module acts as a genuine HR consultant, providing detailed scoring, skill analysis, experience assessment, and personalized improvement recommendations.

## Key Features

- **AI-Powered Analysis**: Uses Groq's Llama-3.1-8B model for intelligent analysis
- **Comprehensive Scoring**: Provides match scores from 0-100 with confidence levels
- **Detailed Skill Analysis**: Identifies matched skills, missing critical skills, and skill gaps
- **Experience Assessment**: Evaluates experience level, relevance, and career progression
- **Personalized Recommendations**: Gives specific, actionable improvement suggestions
- **Professional Output**: Structured JSON responses suitable for HR and recruitment use

## Usage

### Basic Usage

```python
from app.services.matching.extract import analyze_resume_job_match

result = analyze_resume_job_match(
    resume_text="Your resume text here...",
    job_description_text="Your job description here...",
    candidate_name="John Doe",  # Optional
    job_title="Software Engineer"  # Optional
)

print(f"Match Score: {result['score']}%")
print(f"Suitability: {result['verdict']}")
```

### Advanced Usage

```python
from app.services.matching.extract import ResumeJobExtractor

extractor = ResumeJobExtractor()

result = extractor.extract_and_score(
    resume_text=resume_content,
    job_description_text=job_content,
    candidate_name="Sarah Johnson",
    job_title="Data Engineer Intern"
)

# Access detailed analysis
assessment = result['overall_assessment']
print(f"Score: {assessment['match_score']}")
print(f"Summary: {assessment['summary']}")

# Get improvement recommendations
improvements = result['improvement_recommendations']
for action in improvements['immediate_actions']:
    print(f"• {action}")
```

## API Response Structure

```json
{
  "success": true,
  "timestamp": "2025-09-21T10:30:00.000000",
  "model_used": "groq-llama-3.1-8b-instant",
  "analysis_type": "comprehensive_resume_job_matching",

  "overall_assessment": {
    "match_score": 75,
    "suitability_level": "Medium Match",
    "confidence_level": "High",
    "summary": "Good technical foundation with some experience gaps..."
  },

  "skill_analysis": {
    "matched_skills": ["python", "sql", "git"],
    "missing_critical_skills": ["aws", "docker"],
    "skill_gaps": ["kubernetes", "spark"],
    "technical_competency": "Strong in core skills, needs cloud experience"
  },

  "experience_analysis": {
    "experience_match": "Meets minimum requirements",
    "relevant_experience_years": 3,
    "experience_quality": "Good practical experience",
    "career_progression": "Steady growth in development roles"
  },

  "improvement_recommendations": {
    "immediate_actions": [
      "Gain AWS certification",
      "Learn Docker containerization",
      "Build a personal project using cloud services"
    ],
    "skill_development": ["AWS", "Docker", "Kubernetes"],
    "experience_building": [
      "Contribute to open-source projects",
      "Take on cloud migration tasks"
    ],
    "resume_optimization": [
      "Highlight cloud experience",
      "Quantify project impacts"
    ]
  },

  "strengths": [
    "Solid Python programming skills",
    "Good understanding of databases",
    "Version control proficiency"
  ],

  "concerns": ["Limited cloud experience", "No containerization knowledge"],

  "recommendation": {
    "interview_recommendation": "Proceed with Caution",
    "justification": "Technical skills are adequate but lacks cloud experience",
    "next_steps": [
      "Schedule technical interview",
      "Request cloud certification timeline"
    ]
  }
}
```

## API Endpoint

The extractor is also available via REST API:

```
POST /api/ai-analyze
```

**Request Body (form-data):**

- `resume_text`: Raw resume text content
- `job_description_text`: Raw job description text content
- `candidate_name` (optional): Candidate name for personalization
- `job_title` (optional): Job title for context

**Response:** JSON object with comprehensive analysis (see structure above)

## Requirements

- **Groq API Key**: Set `GROQ_API_KEY` environment variable
- **Dependencies**: `requests` library for API calls

## Fallback Behavior

If Groq API is unavailable, the module falls back to basic keyword matching with limited analysis:

```json
{
  "success": false,
  "model_used": "fallback_keyword_matching",
  "score": 45.2,
  "verdict": "Medium Match",
  "suggestions": ["Enable Groq API for detailed analysis"]
}
```

## Integration

The module integrates seamlessly with the existing matching system:

```python
# Can be used alongside existing matchers
from app.services.matching import (
    match_resume_to_job,  # Existing matcher
    analyze_resume_job_match  # New AI analyzer
)

# Get both basic and AI analysis
basic_result = match_resume_to_job(resume, job)
ai_result = analyze_resume_job_match(resume, job)
```

## Example Output

```
🔍 Analyzing resume-job match using AI...
============================================================
📊 OVERALL ASSESSMENT
Match Score: 68/100
Suitability Level: Medium Match
Confidence: High
Summary: Solid technical foundation with Python and SQL experience, but needs cloud and containerization skills for this data engineering role.

🛠️ SKILLS ANALYSIS
✅ Matched Skills: python, sql, git, pandas
❌ Missing Critical Skills: aws, docker, spark
Technical Competency: Good core programming skills but lacks modern cloud infrastructure experience

💼 EXPERIENCE ANALYSIS
Experience Match: Meets basic requirements
Relevant Years: 3
Career Progression: Steady developer growth, ready for engineering role

📈 IMPROVEMENT RECOMMENDATIONS
Immediate Actions:
  • Obtain AWS Cloud Practitioner certification
  • Learn Docker and containerization basics
  • Build a data pipeline project using cloud services

Skill Development Priorities:
  • AWS services (S3, EC2, Lambda)
  • Docker and Kubernetes
```

This provides HR professionals and candidates with actionable insights for better hiring decisions and career development.
