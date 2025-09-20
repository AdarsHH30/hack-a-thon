"""
Resume-Job Matching Engine
Combines text preprocessing, hard matching, and semantic matching with configurable scoring
"""

import json
import os
import logging
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime
from pathlib import Path

# Set up logging
logger = logging.getLogger(__name__)

# Import our matching modules
try:
    from .text_preprocessor import (
        TextPreprocessor,
        preprocess_resume,
        preprocess_job_description,
    )
    from .hard_matcher import HardMatcher, perform_hard_match
    from .semantic_matcher import SemanticMatcher, calculate_semantic_similarity
except ImportError:
    # Fallback for direct execution
    try:
        from text_preprocessor import (
            TextPreprocessor,
            preprocess_resume,
            preprocess_job_description,
        )
        from hard_matcher import HardMatcher, perform_hard_match
        from semantic_matcher import SemanticMatcher, calculate_semantic_similarity
    except ImportError as e:
        print(f"Warning: Could not import matching modules: {e}")


class MatchingEngine:
    """
    Complete resume-job matching engine with configurable scoring and verdict system
    """

    @staticmethod
    def _load_config_from_env() -> Dict[str, Any]:
        """Load configuration from environment variables"""
        config = {}

        # Weights
        if os.getenv("MATCHING_SEMANTIC_WEIGHT"):
            config.setdefault("weights", {})["semantic_weight"] = float(
                os.getenv("MATCHING_SEMANTIC_WEIGHT")
            )
        if os.getenv("MATCHING_HARD_WEIGHT"):
            config.setdefault("weights", {})["hard_match_weight"] = float(
                os.getenv("MATCHING_HARD_WEIGHT")
            )

        # Thresholds
        if os.getenv("MATCHING_HIGH_THRESHOLD"):
            config.setdefault("thresholds", {})["high_suitability"] = float(
                os.getenv("MATCHING_HIGH_THRESHOLD")
            )
        if os.getenv("MATCHING_MEDIUM_THRESHOLD"):
            config.setdefault("thresholds", {})["medium_suitability"] = float(
                os.getenv("MATCHING_MEDIUM_THRESHOLD")
            )

        # Other settings
        if os.getenv("MATCHING_FUZZY_THRESHOLD"):
            config["fuzzy_threshold"] = int(os.getenv("MATCHING_FUZZY_THRESHOLD"))
        if os.getenv("MATCHING_SEMANTIC_MODEL"):
            config["semantic_model"] = os.getenv("MATCHING_SEMANTIC_MODEL")
        if os.getenv("MATCHING_ENABLE_CACHING"):
            config["enable_caching"] = (
                os.getenv("MATCHING_ENABLE_CACHING").lower() == "true"
            )

        return config

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        Initialize matching engine with configuration

        Args:
            config: Configuration dictionary with weights and thresholds
        """
        # Default configuration
        self.config = {
            "weights": {"semantic_weight": 0.6, "hard_match_weight": 0.4},
            "thresholds": {
                "high_suitability": 75,
                "medium_suitability": 50,
                "low_suitability": 0,
            },
            "fuzzy_threshold": 85,
            "max_suggestions": 5,
            "enable_caching": True,
            "semantic_model": "all-MiniLM-L6-v2",
        }

        # Load from environment variables first
        env_config = self._load_config_from_env()
        self.config.update(env_config)

        # Update with user config (overrides env vars)
        if config:
            self.config.update(config)

        # Initialize components once for reuse
        self.text_preprocessor = TextPreprocessor()
        self.hard_matcher = HardMatcher(fuzzy_threshold=self.config["fuzzy_threshold"])
        self.semantic_matcher = SemanticMatcher(
            model_name=self.config["semantic_model"]
        )

        logger.info(f"MatchingEngine initialized with config: {self.config}")

    def _ensure_json_serializable(self, data):
        """Convert numpy types and other non-serializable types to JSON-compatible types"""
        import numpy as np

        if isinstance(data, (np.float32, np.float64)):
            return float(data)
        elif isinstance(data, (np.int32, np.int64)):
            return int(data)
        elif isinstance(data, np.ndarray):
            return data.tolist()
        elif isinstance(data, dict):
            return {
                key: self._ensure_json_serializable(value)
                for key, value in data.items()
            }
        elif isinstance(data, list):
            return [self._ensure_json_serializable(item) for item in data]
        elif isinstance(data, tuple):
            return tuple(self._ensure_json_serializable(item) for item in data)
        else:
            return data

    def match_resume_to_job(
        self, resume_text: str, job_description_text: str
    ) -> Dict[str, Any]:
        """
        Complete resume-job matching pipeline

        Args:
            resume_text: Raw resume text
            job_description_text: Raw job description text

        Returns:
            Dict with comprehensive matching results
        """
        try:
            print("🚀 Starting resume-job matching pipeline...")

            # Step 1: Text Preprocessing
            print("📄 Step 1: Preprocessing texts...")
            resume_data = preprocess_resume(resume_text)
            jd_data = preprocess_job_description(job_description_text)

            if (
                not resume_data["cleaned_text"].strip()
                or not jd_data["cleaned_text"].strip()
            ):
                return self._create_error_result("Empty or invalid text content")

            print(
                f"✅ Preprocessing completed. Resume: {resume_data['total_tokens']} tokens, JD: {jd_data['total_tokens']} tokens"
            )
            print(f"🔍 Resume skills found: {resume_data['skills_data']}")
            print(f"🔍 JD skills found: {jd_data['skills_data']}")
            print(
                f"📝 Resume semantic text preview: {resume_data['semantic_text'][:200]}..."
            )
            print(f"📝 JD semantic text preview: {jd_data['semantic_text'][:200]}...")

            # Step 2: Hard Matching
            print("🔍 Step 2: Performing hard matching (keywords & skills)...")
            hard_match_results = self.hard_matcher.comprehensive_hard_match(
                resume_data, jd_data
            )
            hard_match_score = float(
                hard_match_results["hard_match_score"]
            )  # Ensure Python float

            print(f"✅ Hard matching completed. Score: {hard_match_score}%")

            # Step 3: Semantic Matching
            print("🤖 Step 3: Performing semantic matching...")
            semantic_results = self.semantic_matcher.semantic_match_detailed(
                resume_data["semantic_text"], jd_data["semantic_text"]
            )
            semantic_score = float(
                semantic_results["semantic_score"]
            )  # Ensure Python float

            print(f"✅ Semantic matching completed. Score: {semantic_score}%")
            print(
                f"🎯 Semantic details: Overall={semantic_results['overall_similarity']}%, Model={semantic_results['model_used']}, Confidence={semantic_results['confidence']}"
            )
            print(
                f"📊 Section similarities: {semantic_results['section_similarities']}"
            )

            # Step 4: Calculate Final Score
            print("📊 Step 4: Calculating final score...")
            final_score = self._calculate_final_score(hard_match_score, semantic_score)

            print(f"✅ Final score calculated: {final_score}%")

            # Step 5: Determine Verdict
            print("⚖️ Step 5: Determining verdict...")
            verdict = self._determine_verdict(final_score)

            print(f"✅ Verdict determined: {verdict}")

            # Step 6: Generate Output
            print("📋 Step 6: Generating comprehensive output...")
            result = self._generate_comprehensive_output(
                resume_data,
                jd_data,
                hard_match_results,
                semantic_results,
                final_score,
                verdict,
            )

            print("🎉 Matching pipeline completed successfully!")

            # Ensure all data is JSON serializable
            serialized_result = self._ensure_json_serializable(result)
            return serialized_result

        except Exception as e:
            error_msg = f"Error in matching pipeline: {str(e)}"
            logger.error(error_msg, exc_info=True)
            print(f"❌ {error_msg}")
            return self._create_error_result(error_msg)

    def _calculate_final_score(
        self, hard_match_score: float, semantic_score: float
    ) -> float:
        """
        Calculate final score using configurable weights

        Final Score = (semantic_weight × Semantic Score) + (hard_match_weight × Hard Match Score)
        """
        semantic_weight = self.config["weights"]["semantic_weight"]
        hard_weight = self.config["weights"]["hard_match_weight"]

        final_score = (semantic_weight * semantic_score) + (
            hard_weight * hard_match_score
        )
        return float(round(final_score, 2))  # Ensure Python float

    def _determine_verdict(self, final_score: float) -> str:
        """
        Determine verdict based on score thresholds

        Args:
            final_score: Final calculated score

        Returns:
            str: Verdict (High Suitability, Medium Suitability, Low Suitability)
        """
        thresholds = self.config["thresholds"]

        if final_score >= thresholds["high_suitability"]:
            return "High Suitability"
        elif final_score >= thresholds["medium_suitability"]:
            return "Medium Suitability"
        else:
            return "Low Suitability"

    def _generate_comprehensive_output(
        self,
        resume_data: Dict[str, Any],
        jd_data: Dict[str, Any],
        hard_match_results: Dict[str, Any],
        semantic_results: Dict[str, Any],
        final_score: float,
        verdict: str,
    ) -> Dict[str, Any]:
        """Generate comprehensive matching output"""

        # Extract key information
        matched_skills = hard_match_results["skills_match"]["exact_skill_matches"]
        missing_skills = hard_match_results["skills_match"]["missing_skills"]
        fuzzy_skill_matches = [
            match["required_skill"]
            for match in hard_match_results["skills_match"]["fuzzy_skill_matches"]
        ]

        # Combine exact and fuzzy matches
        all_matched_skills = list(set(matched_skills + fuzzy_skill_matches))

        # Generate suggestions
        suggestions = self._generate_suggestions(missing_skills, verdict, final_score)

        # Create detailed breakdown
        score_breakdown = {
            "hard_match_score": float(hard_match_results["hard_match_score"]),
            "semantic_score": float(semantic_results["semantic_score"]),
            "final_score": float(final_score),
            "weights_used": self.config["weights"],
            "calculation": f"({self.config['weights']['semantic_weight']} × {semantic_results['semantic_score']}) + ({self.config['weights']['hard_match_weight']} × {hard_match_results['hard_match_score']}) = {final_score}",
        }

        # Match statistics
        match_statistics = {
            "total_jd_skills": len(
                jd_data["skills_data"].get("programming_languages", [])
                + jd_data["skills_data"].get("frameworks", [])
                + jd_data["skills_data"].get("databases", [])
                + jd_data["skills_data"].get("cloud_platforms", [])
            ),
            "total_resume_skills": len(
                resume_data["skills_data"].get("programming_languages", [])
                + resume_data["skills_data"].get("frameworks", [])
                + resume_data["skills_data"].get("databases", [])
                + resume_data["skills_data"].get("cloud_platforms", [])
            ),
            "exact_matches": len(matched_skills),
            "fuzzy_matches": len(fuzzy_skill_matches),
            "missing_skills_count": len(missing_skills),
            "keyword_match_rate": float(
                hard_match_results["exact_match"]["exact_match_score"]
            ),
        }

        # Detailed analysis
        detailed_analysis = {
            "strengths": self._identify_strengths(all_matched_skills, semantic_results),
            "areas_for_improvement": missing_skills[: self.config["max_suggestions"]],
            "semantic_confidence": semantic_results.get("confidence", "Medium"),
            "top_missing_skills": missing_skills[:3],
            "skill_categories_analysis": self._analyze_skill_categories(
                resume_data, jd_data
            ),
        }

        return {
            "success": True,
            "timestamp": datetime.now().isoformat(),
            "relevance_score": float(final_score),
            "verdict": verdict,
            "matched_skills": all_matched_skills,
            "missing_skills": missing_skills,
            "suggestions": suggestions,
            "score_breakdown": score_breakdown,
            "match_statistics": match_statistics,
            "detailed_analysis": detailed_analysis,
            "hard_match_details": hard_match_results,
            "semantic_match_details": semantic_results,
            "configuration_used": self.config,
        }

    def _generate_suggestions(
        self, missing_skills: List[str], verdict: str, score: float
    ) -> List[str]:
        """Generate actionable suggestions based on missing skills and verdict"""
        suggestions = []

        if verdict == "Low Suitability":
            suggestions.append(
                f"Consider gaining experience in key missing skills: {', '.join(missing_skills[:3])}"
            )
            suggestions.append(
                "Focus on building a stronger foundation in the core technologies mentioned in the job description"
            )
            if score < 30:
                suggestions.append(
                    "This position may require significant skill development - consider targeting more junior roles first"
                )

        elif verdict == "Medium Suitability":
            suggestions.append(
                f"Strengthen your profile by learning: {', '.join(missing_skills[:2])}"
            )
            suggestions.append(
                "Highlight transferable skills and relevant projects in your application"
            )
            suggestions.append(
                "Consider taking online courses or certifications in the missing technologies"
            )

        else:  # High Suitability
            if missing_skills:
                suggestions.append(
                    f"Consider mentioning any exposure to: {', '.join(missing_skills[:2])}"
                )
            suggestions.append(
                "You're a strong match! Emphasize your relevant experience in your application"
            )
            suggestions.append(
                "Prepare to discuss specific projects using the matched technologies"
            )

        # Add skill-specific suggestions
        if "aws" in [skill.lower() for skill in missing_skills[:5]]:
            suggestions.append(
                "Consider getting AWS certification or demonstrating cloud projects"
            )

        if any(
            skill in ["docker", "kubernetes"]
            for skill in [s.lower() for s in missing_skills[:5]]
        ):
            suggestions.append(
                "Containerization skills are valuable - consider learning Docker and Kubernetes"
            )

        return suggestions[: self.config["max_suggestions"]]

    def _identify_strengths(
        self, matched_skills: List[str], semantic_results: Dict[str, Any]
    ) -> List[str]:
        """Identify candidate's key strengths"""
        strengths = []

        if matched_skills:
            strengths.append(
                f"Strong technical match with {len(matched_skills)} relevant skills"
            )

        if semantic_results.get("semantic_score", 0) > 70:
            strengths.append("Excellent semantic alignment with job requirements")

        # Categorize matched skills
        skill_categories = {}
        for skill in matched_skills:
            # This is a simplified categorization
            if skill.lower() in ["python", "java", "javascript", "c++", "c#"]:
                skill_categories.setdefault("Programming Languages", []).append(skill)
            elif skill.lower() in ["react", "angular", "vue", "django", "flask"]:
                skill_categories.setdefault("Frameworks", []).append(skill)
            elif skill.lower() in ["aws", "azure", "gcp", "docker", "kubernetes"]:
                skill_categories.setdefault("Cloud & DevOps", []).append(skill)

        for category, skills in skill_categories.items():
            if len(skills) >= 2:
                strengths.append(f"Strong {category} background: {', '.join(skills)}")

        return strengths

    def _analyze_skill_categories(
        self, resume_data: Dict[str, Any], jd_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Analyze skill match by categories"""
        categories = [
            "programming_languages",
            "frameworks",
            "databases",
            "cloud_platforms",
            "tools",
        ]
        analysis = {}

        for category in categories:
            resume_skills = set(
                skill.lower() for skill in resume_data["skills_data"].get(category, [])
            )
            jd_skills = set(
                skill.lower() for skill in jd_data["skills_data"].get(category, [])
            )

            if jd_skills:
                matched = resume_skills.intersection(jd_skills)
                missing = jd_skills - resume_skills

                match_rate = (len(matched) / len(jd_skills)) * 100

                analysis[category] = {
                    "match_rate": round(match_rate, 1),
                    "matched_skills": list(matched),
                    "missing_skills": list(missing),
                    "total_required": len(jd_skills),
                }

        return analysis

    def _create_error_result(self, error_message: str) -> Dict[str, Any]:
        """Create standardized error result"""
        return {
            "success": False,
            "error": error_message,
            "timestamp": datetime.now().isoformat(),
            "relevance_score": 0,
            "verdict": "Error",
            "matched_skills": [],
            "missing_skills": [],
            "suggestions": ["Please check the input text and try again"],
        }

    def batch_match(
        self, resume_text: str, job_descriptions: List[str]
    ) -> List[Dict[str, Any]]:
        """
        Match one resume against multiple job descriptions

        Args:
            resume_text: Resume text
            job_descriptions: List of job description texts

        Returns:
            List of matching results sorted by relevance score
        """
        results = []

        for i, jd_text in enumerate(job_descriptions):
            print(f"Processing job description {i+1}/{len(job_descriptions)}...")
            result = self.match_resume_to_job(resume_text, jd_text)
            result["job_index"] = i
            results.append(result)

        # Sort by relevance score (highest first)
        results.sort(key=lambda x: x.get("relevance_score", 0), reverse=True)

        return results

    def update_config(self, new_config: Dict[str, Any]):
        """Update matching configuration"""
        self.config.update(new_config)

        # Reinitialize components if necessary
        if "fuzzy_threshold" in new_config:
            self.hard_matcher = HardMatcher(
                fuzzy_threshold=new_config["fuzzy_threshold"]
            )

        if "semantic_model" in new_config:
            self.semantic_matcher = SemanticMatcher(
                model_name=new_config["semantic_model"]
            )

    def get_config(self) -> Dict[str, Any]:
        """Get current configuration"""
        return self.config.copy()


# Global engine cache for performance
_ENGINE_CACHE = {}


def _get_engine(config: Optional[Dict[str, Any]] = None) -> MatchingEngine:
    """Get or create a cached MatchingEngine instance"""
    # Create a cache key from config
    config_key = json.dumps(config or {}, sort_keys=True) if config else "default"

    if config_key not in _ENGINE_CACHE:
        _ENGINE_CACHE[config_key] = MatchingEngine(config)

    return _ENGINE_CACHE[config_key]


# Convenience functions
def match_resume_to_job(
    resume_text: str, job_description_text: str, config: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Quick function to match resume to job description

    Args:
        resume_text: Resume text
        job_description_text: Job description text
        config: Optional configuration

    Returns:
        Dict with matching results
    """
    engine = _get_engine(config)
    return engine.match_resume_to_job(resume_text, job_description_text)


def batch_match_jobs(
    resume_text: str,
    job_descriptions: List[str],
    config: Optional[Dict[str, Any]] = None,
) -> List[Dict[str, Any]]:
    """
    Match one resume against multiple job descriptions

    Args:
        resume_text: Resume text
        job_descriptions: List of job description texts
        config: Optional configuration

    Returns:
        List of matching results
    """
    engine = _get_engine(config)
    return engine.batch_match(resume_text, job_descriptions)


# Example usage
if __name__ == "__main__":
    # Sample data
    sample_resume = """
    Senior Python Developer with 5+ years of experience in web development.
    Expertise in Django, Flask, React.js, PostgreSQL, and AWS cloud services.
    Strong background in Docker, CI/CD pipelines, and agile methodologies.
    Led team of 4 developers on multiple successful projects.
    Excellent problem-solving, communication, and leadership skills.
    """

    sample_jd = """
    We are seeking a Senior Python Developer to join our innovative team.
    Required Skills: Python, Django or Flask, React.js, PostgreSQL, AWS
    Preferred: Docker, Kubernetes, CI/CD, team leadership experience
    Strong communication and problem-solving skills essential.
    """

    # Test the matching engine
    print("=== Testing Resume-Job Matching Engine ===")

    # Custom configuration
    custom_config = {
        "weights": {"semantic_weight": 0.7, "hard_match_weight": 0.3},
        "thresholds": {
            "high_suitability": 80,
            "medium_suitability": 60,
            "low_suitability": 0,
        },
    }

    result = match_resume_to_job(sample_resume, sample_jd, custom_config)

    if result["success"]:
        print(f"\n🎯 Final Score: {result['relevance_score']}%")
        print(f"🏆 Verdict: {result['verdict']}")
        print(f"✅ Matched Skills: {', '.join(result['matched_skills'][:5])}")
        print(f"❌ Missing Skills: {', '.join(result['missing_skills'][:3])}")
        print("\n💡 Top Suggestions:")
        for suggestion in result["suggestions"][:3]:
            print(f"  • {suggestion}")
    else:
        print(f"❌ Error: {result['error']}")
