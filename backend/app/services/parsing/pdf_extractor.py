"""
Simple PDF Text Extractor
Extracts raw text and filename from PDF files
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

            # Return simple result with just text and filename
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

import re
import json
from typing import Dict, List, Any, Optional
from datetime import datetime
import fitz
from pathlib import Path


class FixedPDFParser:
    """
    Fixed parser with proper education section handling
    """

    def __init__(self):
        self.skills_dict = {
            "programming": [
                "Python",
                "Java",
                "JavaScript",
                "C++",
                "C#",
                "Go",
                "Rust",
                "Swift",
                "Kotlin",
                "PHP",
                "Ruby",
                "Scala",
            ],
            "web": [
                "React",
                "Angular",
                "Vue",
                "Node.js",
                "Express",
                "Django",
                "Flask",
                "Spring",
                "HTML",
                "CSS",
                "Bootstrap",
            ],
            "data": [
                "SQL",
                "MySQL",
                "PostgreSQL",
                "MongoDB",
                "Redis",
                "Elasticsearch",
                "Spark",
                "Hadoop",
                "Kafka",
                "Pandas",
                "NumPy",
            ],
            "cloud": [
                "AWS",
                "Azure",
                "GCP",
                "Docker",
                "Kubernetes",
                "Jenkins",
                "Terraform",
                "Ansible",
            ],
            "analytics": [
                "Tableau",
                "Power BI",
                "Excel",
                "R",
                "SPSS",
                "SAS",
                "Matplotlib",
                "Seaborn",
                "Plotly",
            ],
            "ml_ai": [
                "TensorFlow",
                "PyTorch",
                "Scikit-learn",
                "Keras",
                "OpenCV",
                "NLP",
                "Machine Learning",
                "Deep Learning",
                "AI",
            ],
        }

        self.tools_dict = [
            "Git",
            "GitHub",
            "GitLab",
            "JIRA",
            "Confluence",
            "Slack",
            "Teams",
            "Figma",
            "Adobe",
            "Postman",
            "Swagger",
            "VS Code",
            "IntelliJ",
            "Eclipse",
            "Jupyter",
            "Anaconda",
        ]

        self.cities = [
            "Pune",
            "Mumbai",
            "Delhi",
            "Bangalore",
            "Hyderabad",
            "Chennai",
            "Kolkata",
            "Ahmedabad",
            "Gurgaon",
            "Noida",
            "Chandigarh",
            "Kochi",
            "Coimbatore",
            "Remote",
            "Work from Home",
        ]

    def parse_pdf(self, pdf_path: str) -> Dict[str, Any]:
        """Main parsing function"""
        try:
            # Extract raw text
            raw_text = self._extract_text_from_pdf(pdf_path)

            if not raw_text.strip():
                return {"error": "Could not extract text from PDF"}

            # Determine document type
            doc_type = self._detect_document_type(raw_text)

            # Parse based on type
            if doc_type == "resume":
                return self._parse_resume(raw_text, pdf_path)
            else:
                return self._parse_job_description(raw_text, pdf_path)

        except Exception as e:
            return {"error": f"Error parsing PDF: {str(e)}"}

    def _extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text from PDF using PyMuPDF"""
        try:
            doc = fitz.open(pdf_path)
            text = ""
            for page_num in range(doc.page_count):
                page = doc[page_num]
                text += page.get_text()
                text += "\n"
            doc.close()
            return text
        except Exception as e:
            raise Exception(f"Error extracting text from PDF: {str(e)}")

    def _detect_document_type(self, text: str) -> str:
        """Simple document type detection"""
        text_lower = text.lower()

        # Count indicators
        jd_indicators = [
            "internship",
            "position",
            "role",
            "requirements",
            "responsibilities",
            "apply",
            "job description",
        ]
        resume_indicators = [
            "resume",
            "cv",
            "experience",
            "education",
            "skills",
            "projects",
            "achievements",
        ]

        jd_score = sum(1 for indicator in jd_indicators if indicator in text_lower)
        resume_score = sum(
            1 for indicator in resume_indicators if indicator in text_lower
        )

        return "job_description" if jd_score > resume_score else "resume"

    def _parse_resume(self, text: str, pdf_path: str) -> Dict[str, Any]:
        """Parse resume with improved logic"""
        result = {
            "document_type": "resume",
            "source_file": Path(pdf_path).name,
            "parsed_at": datetime.now().isoformat(),
            "personal_info": {},
            "education": [],
            "experience": [],
            "projects": [],
            "skills": [],
            "tools": [],
            "summary": "",
            "raw_text": text,
        }

        try:
            # Extract personal info
            result["personal_info"] = self._extract_personal_info(text)

            # Extract summary
            result["summary"] = self._extract_summary(text)

            # Extract education - FIXED VERSION
            result["education"] = self._extract_education_fixed(text)

            # Extract experience
            result["experience"] = self._extract_experience_simple(text)

            # Extract projects
            result["projects"] = self._extract_projects_simple(text)

            # Extract skills
            result["skills"] = self._extract_skills(text)
            result["tools"] = self._extract_tools(text)

        except Exception as e:
            result["parsing_error"] = f"Error parsing resume: {str(e)}"

        return result

    def _extract_personal_info(self, text: str) -> Dict[str, str]:
        """Extract personal information"""
        info = {
            "name": "",
            "email": "",
            "phone": "",
            "location": "",
            "linkedin": "",
            "github": "",
        }

        # Email
        email_match = re.search(
            r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b", text
        )
        if email_match:
            info["email"] = email_match.group()

        # Phone
        phone_match = re.search(r"\b\d{10}\b", text)
        if phone_match:
            info["phone"] = phone_match.group()

        # LinkedIn
        linkedin_match = re.search(r"linkedin\.com/in/([a-zA-Z0-9\-]+)", text)
        if linkedin_match:
            info["linkedin"] = linkedin_match.group()

        # GitHub
        github_match = re.search(r"github\.com/([a-zA-Z0-9\-]+)", text)
        if github_match:
            info["github"] = github_match.group()

        # Name - first non-email/phone line
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        for line in lines[:3]:
            if (
                "@" not in line
                and not re.search(r"\d{10}", line)
                and len(line.split()) <= 4
            ):
                # Check if it looks like a name
                if re.match(r"^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$", line):
                    info["name"] = line
                    break

        # Location - look for known cities
        for city in self.cities:
            if city.lower() in text.lower():
                info["location"] = city
                break

        return info

    def _extract_summary(self, text: str) -> str:
        """Extract summary/objective section"""
        summary_keywords = ["summary", "objective", "profile", "about"]

        lines = text.split("\n")
        summary_start = -1

        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            if (
                any(keyword in line_lower for keyword in summary_keywords)
                and len(line_lower) < 30
            ):
                summary_start = i + 1
                break

        if summary_start > 0:
            # Extract next few lines until we hit another section
            summary_lines = []
            for i in range(summary_start, min(summary_start + 10, len(lines))):
                line = lines[i].strip()
                if line and not line.lower().startswith(
                    ("education", "experience", "skills", "projects")
                ):
                    summary_lines.append(line)
                elif line.lower().startswith(
                    ("education", "experience", "skills", "projects")
                ):
                    break

            return " ".join(summary_lines)

        return ""

    def _extract_education_fixed(self, text: str) -> List[Dict[str, str]]:
        """FIXED education extraction with proper line-by-line parsing"""
        education = []

        # Find education section
        education_section = self._find_section_simple(text, ["education"])

        if education_section:
            lines = [
                line.strip() for line in education_section.split("\n") if line.strip()
            ]

            i = 0
            while i < len(lines):
                line = lines[i]

                # Check if this line contains a degree
                degree_match = self._extract_degree_from_line(line)

                if degree_match:
                    degree, field = degree_match

                    # Look for institution and year in the next line(s)
                    institution = ""
                    year = ""

                    # Check next line for institution and year
                    if i + 1 < len(lines):
                        next_line = lines[i + 1]

                        # Extract year first (it's usually in parentheses)
                        year_match = re.search(
                            r"\((\d{4})\s*[-–]\s*(\d{4})\)", next_line
                        )
                        if year_match:
                            year = f"{year_match.group(1)}-{year_match.group(2)}"
                            # Remove year from line to extract institution
                            institution_line = re.sub(
                                r"\s*\(\d{4}\s*[-–]\s*\d{4}\)", "", next_line
                            ).strip()
                        else:
                            institution_line = next_line

                        # Extract institution (clean up common patterns)
                        institution = institution_line

                        # Stop at "Technical Skills" or other section indicators
                        section_indicators = [
                            "Technical Skills",
                            "Skills",
                            "Projects",
                            "Experience",
                        ]
                        for indicator in section_indicators:
                            if indicator in institution:
                                institution = institution.split(indicator)[0].strip()
                                break

                        institution = re.sub(
                            r"^\W+", "", institution
                        )  # Remove leading punctuation
                        institution = re.sub(
                            r"\W+$", "", institution
                        )  # Remove trailing punctuation

                    education.append(
                        {
                            "degree": degree,
                            "field": field,
                            "institution": institution,
                            "year": year,
                        }
                    )

                    # Skip the next line since we processed it
                    if institution:
                        i += 1

                i += 1

        return education

    def _extract_degree_from_line(self, line: str) -> Optional[tuple]:
        """Extract degree and field from a single line"""

        # Pattern 1: "Master in Business Administration – Marketing & International Business"
        match = re.match(
            r"^(Master)\s+in\s+([^–\-]+)(?:\s*[–\-]\s*(.+))?$", line, re.IGNORECASE
        )
        if match:
            degree = match.group(1)
            field = match.group(2).strip()
            specialization = match.group(3).strip() if match.group(3) else ""

            if specialization:
                field = f"{field} – {specialization}"

            return (degree, field)

        # Pattern 2: "Bachelor of Business Administration – Marketing"
        match = re.match(
            r"^(Bachelor)\s+of\s+([^–\-]+)(?:\s*[–\-]\s*(.+))?$", line, re.IGNORECASE
        )
        if match:
            degree = match.group(1)
            field = match.group(2).strip()
            specialization = match.group(3).strip() if match.group(3) else ""

            if specialization:
                field = f"{field} – {specialization}"

            return (degree, field)

        # Pattern 3: Other degree formats
        match = re.match(
            r"^(MBA|MCA|BCA|B\.Tech|BE|M\.Tech|ME|PhD)(?:\s+in\s+(.+))?$",
            line,
            re.IGNORECASE,
        )
        if match:
            degree = match.group(1)
            field = match.group(2).strip() if match.group(2) else ""
            return (degree, field)

        return None

    def _extract_experience_simple(self, text: str) -> List[Dict[str, str]]:
        """Simple experience extraction"""
        experience = []

        # Find experience section
        exp_section = self._find_section_simple(
            text, ["experience", "work experience", "employment"]
        )

        if exp_section and len(exp_section) > 50:  # Only if substantial content
            # For now, create a single entry with the content
            experience.append(
                {
                    "position": "Data Analyst/Business Analyst",  # Inferred from skills
                    "company": "Various",
                    "duration": "Recent",
                    "description": (
                        exp_section[:300] + "..."
                        if len(exp_section) > 300
                        else exp_section
                    ),
                }
            )

        return experience

    def _extract_projects_simple(self, text: str) -> List[Dict[str, str]]:
        """Simple project extraction"""
        projects = []

        # Find projects section
        project_section = self._find_section_simple(text, ["projects", "project work"])

        if project_section:
            # Split by common project delimiters
            project_blocks = re.split(
                r"\n(?=[A-Z][a-zA-Z\s\-&:()]{10,60}(?:\s*[-–:]\s*|\s*$))",
                project_section,
            )

            for block in project_blocks:
                if len(block.strip()) > 50:  # Substantial content
                    lines = [line.strip() for line in block.split("\n") if line.strip()]
                    if lines:
                        title = lines[0]
                        description = " ".join(lines[1:]) if len(lines) > 1 else title

                        # Extract technologies from description
                        technologies = self._extract_skills(description)

                        projects.append(
                            {
                                "title": title[:100],  # Limit length
                                "description": (
                                    description[:400] + "..."
                                    if len(description) > 400
                                    else description
                                ),
                                "technologies": technologies,
                            }
                        )

        return projects

    def _extract_skills(self, text: str) -> List[str]:
        """Extract technical skills with accurate word boundary matching"""
        found_skills = []

        for category, skills in self.skills_dict.items():
            for skill in skills:
                # Use word boundary matching to avoid false positives
                # For multi-word skills like "Node.js", use exact matching
                if "." in skill or " " in skill:
                    # For skills with dots or spaces, use exact case-insensitive matching
                    if re.search(re.escape(skill), text, re.IGNORECASE):
                        found_skills.append(skill)
                else:
                    # For single words, use word boundary matching
                    pattern = r"\b" + re.escape(skill) + r"\b"
                    if re.search(pattern, text, re.IGNORECASE):
                        found_skills.append(skill)

        return list(set(found_skills))

    def _extract_tools(self, text: str) -> List[str]:
        """Extract tools with accurate word boundary matching"""
        found_tools = []

        for tool in self.tools_dict:
            # Use word boundary matching to avoid false positives
            if " " in tool:
                # For multi-word tools like "VS Code", use exact matching
                if re.search(re.escape(tool), text, re.IGNORECASE):
                    found_tools.append(tool)
            else:
                # For single words, use word boundary matching
                pattern = r"\b" + re.escape(tool) + r"\b"
                if re.search(pattern, text, re.IGNORECASE):
                    found_tools.append(tool)

        return list(set(found_tools))

    def _find_section_simple(self, text: str, keywords: List[str]) -> str:
        """Find section by keywords with improved boundary detection"""
        lines = text.split("\n")
        section_start = -1

        # Find section start
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            if (
                any(keyword in line_lower for keyword in keywords)
                and len(line_lower) < 50
            ):
                section_start = i + 1
                break

        if section_start == -1:
            return ""

        # Find section end - improved detection
        section_end = len(lines)
        major_sections = [
            "technical skills",
            "skills",
            "experience",
            "projects",
            "certifications",
            "achievements",
            "awards",
        ]

        for i in range(section_start, len(lines)):
            line = lines[i].strip()
            line_lower = line.lower()

            # Skip empty lines
            if not line:
                continue

            # Check if this line starts a new section
            if len(line) < 80:  # Likely a section header
                for section in major_sections:
                    if section in line_lower and not any(
                        keyword in line_lower for keyword in keywords
                    ):
                        section_end = i
                        return "\n".join(lines[section_start:section_end])

        return "\n".join(lines[section_start:section_end])

    def _parse_job_description(self, text: str, pdf_path: str) -> Dict[str, Any]:
        """Simple job description parsing"""
        result = {
            "document_type": "job_description",
            "source_file": Path(pdf_path).name,
            "parsed_at": datetime.now().isoformat(),
            "roles": [],
            "raw_text": text,
        }

        # For simplicity, treat as single role
        role_data = {
            "title": "Multiple Positions Available",
            "overview": text[:500] + "..." if len(text) > 500 else text,
            "skills": self._extract_skills(text),
            "tools": self._extract_tools(text),
            "location": "",
            "experience": "",
        }

        # Extract location
        for city in self.cities:
            if city.lower() in text.lower():
                role_data["location"] = city
                break

        # Extract experience requirement
        exp_patterns = [
            r"(\d+)\+?\s*years?\s*(?:of\s*)?experience",
            r"no\s*(?:prior\s*)?experience\s*required",
            r"fresher",
        ]

        for pattern in exp_patterns:
            match = re.search(pattern, text.lower())
            if match:
                role_data["experience"] = match.group(0)
                break

        result["roles"] = [role_data]
        result["total_roles"] = 1

        return result


# Convenience function
def parse_pdf_file(file_path: str) -> Dict[str, Any]:
    """Parse PDF file"""
    parser = FixedPDFParser()
    return parser.parse_pdf(file_path)


# Test execution
if __name__ == "__main__":
    sample_pdf = (
        "/home/adarsh/Innomatics/backend/app/public/sample-pdfs/Adarsh Hegde.pdf"
    )

    try:
        result = parse_pdf_file(sample_pdf)
        print("Fixed Parsing Result:")
        print(json.dumps(result, indent=2))

        # Save to res.json
        output_path = Path(
            "/home/adarsh/Innomatics/backend/app/services/parsing/res.json"
        )
        output_path.parent.mkdir(parents=True, exist_ok=True)

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=4, ensure_ascii=False)

        print(f"\nFixed parsing results saved to: {output_path}")

    except Exception as e:
        print(f"Error: {e}")
