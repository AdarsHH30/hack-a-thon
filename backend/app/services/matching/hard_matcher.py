"""
Hard Matching Module for Resume-Job Matching
Implements exact and fuzzy string matching for skills and keywords
"""

import json
import logging
from typing import List, Dict, Set, Tuple, Any
from pathlib import Path

# Set up logging
logger = logging.getLogger(__name__)

try:
    from rapidfuzz import fuzz, process
except ImportError:
    # Fallback to fuzzywuzzy if rapidfuzz is not available
    try:
        from fuzzywuzzy import fuzz, process
    except ImportError:
        # If neither is available, we'll implement basic fuzzy matching
        fuzz = None
        process = None

# Module-level skills database for efficiency
_SKILLS_DATABASE = {
    "programming_languages": [
        "python",
        "java",
        "javascript",
        "typescript",
        "c",
        "c++",
        "c#",
        "csharp",
        "php",
        "ruby",
        "go",
        "golang",
        "rust",
        "scala",
        "kotlin",
        "swift",
        "r",
        "matlab",
        "perl",
        "lua",
        "haskell",
        "clojure",
        "erlang",
        "elixir",
        "dart",
        "objective-c",
        "visual basic",
        "vba",
        "cobol",
        "fortran",
        "assembly",
        "shell",
        "bash",
        "powershell",
        "batch",
    ],
    "web_technologies": [
        "html",
        "html5",
        "css",
        "css3",
        "sass",
        "scss",
        "less",
        "bootstrap",
        "tailwind",
        "material-ui",
        "bulma",
        "foundation",
        "semantic-ui",
        "react",
        "reactjs",
        "react.js",
        "angular",
        "angularjs",
        "vue",
        "vuejs",
        "vue.js",
        "svelte",
        "ember",
        "backbone",
        "jquery",
        "d3",
        "d3.js",
        "three.js",
        "webgl",
        "canvas",
        "svg",
        "xml",
        "json",
        "ajax",
        "rest",
        "graphql",
        "websockets",
        "webrtc",
        "pwa",
        "spa",
        "responsive design",
    ],
    "backend_frameworks": [
        "django",
        "flask",
        "fastapi",
        "tornado",
        "pyramid",
        "bottle",
        "express",
        "expressjs",
        "node",
        "nodejs",
        "node.js",
        "koa",
        "hapi",
        "spring",
        "spring boot",
        "hibernate",
        "struts",
        "play framework",
        "laravel",
        "symfony",
        "codeigniter",
        "cakephp",
        "zend",
        "yii",
        "ruby on rails",
        "rails",
        "sinatra",
        "grape",
        "padrino",
        "asp.net",
        ".net",
        "dotnet",
        "mvc",
        "web api",
        "wcf",
        "wpf",
    ],
    "databases": [
        "mysql",
        "postgresql",
        "postgres",
        "sqlite",
        "mariadb",
        "oracle",
        "sql server",
        "sqlserver",
        "mssql",
        "db2",
        "sybase",
        "access",
        "mongodb",
        "couchdb",
        "couchbase",
        "dynamodb",
        "cassandra",
        "hbase",
        "neo4j",
        "orientdb",
        "arangodb",
        "influxdb",
        "timescaledb",
        "redis",
        "memcached",
        "elasticsearch",
        "solr",
        "lucene",
        "sphinx",
        "firebase",
        "firestore",
        "realm",
        "sqlite",
        "h2",
        "derby",
    ],
    "cloud_platforms": [
        "aws",
        "amazon web services",
        "ec2",
        "s3",
        "rds",
        "lambda",
        "cloudfront",
        "azure",
        "microsoft azure",
        "azure functions",
        "blob storage",
        "cosmos db",
        "gcp",
        "google cloud",
        "google cloud platform",
        "app engine",
        "compute engine",
        "digital ocean",
        "linode",
        "vultr",
        "heroku",
        "netlify",
        "vercel",
        "cloudflare",
        "fastly",
        "alibaba cloud",
        "ibm cloud",
        "oracle cloud",
    ],
    "devops_tools": [
        "docker",
        "kubernetes",
        "k8s",
        "helm",
        "istio",
        "envoy",
        "consul",
        "terraform",
        "ansible",
        "puppet",
        "chef",
        "salt",
        "packer",
        "vagrant",
        "jenkins",
        "gitlab ci",
        "github actions",
        "travis ci",
        "circle ci",
        "bamboo",
        "teamcity",
        "azure devops",
        "aws codepipeline",
        "prometheus",
        "grafana",
        "elk stack",
        "logstash",
        "kibana",
        "fluentd",
        "nagios",
        "zabbix",
        "datadog",
        "new relic",
        "splunk",
    ],
    "data_science": [
        "pandas",
        "numpy",
        "scipy",
        "matplotlib",
        "seaborn",
        "plotly",
        "bokeh",
        "scikit-learn",
        "sklearn",
        "tensorflow",
        "keras",
        "pytorch",
        "jax",
        "xgboost",
        "lightgbm",
        "catboost",
        "opencv",
        "pillow",
        "imageio",
        "jupyter",
        "notebook",
        "ipython",
        "anaconda",
        "conda",
        "pip",
        "spark",
        "pyspark",
        "hadoop",
        "hive",
        "pig",
        "kafka",
        "storm",
        "airflow",
        "luigi",
        "prefect",
        "dask",
        "ray",
        "mlflow",
        "kubeflow",
    ],
    "mobile_development": [
        "android",
        "ios",
        "react native",
        "flutter",
        "xamarin",
        "ionic",
        "cordova",
        "phonegap",
        "titanium",
        "sencha",
        "unity",
        "unreal",
        "swift",
        "objective-c",
        "kotlin",
        "java",
        "dart",
        "c#",
    ],
    "testing_frameworks": [
        "pytest",
        "unittest",
        "nose",
        "doctest",
        "selenium",
        "playwright",
        "jest",
        "mocha",
        "jasmine",
        "karma",
        "cypress",
        "webdriver",
        "junit",
        "testng",
        "mockito",
        "powermock",
        "cucumber",
        "specflow",
        "rspec",
        "minitest",
        "phpunit",
        "codeception",
        "behat",
    ],
    "soft_skills": [
        "leadership",
        "teamwork",
        "communication",
        "problem solving",
        "critical thinking",
        "analytical thinking",
        "creativity",
        "innovation",
        "project management",
        "time management",
        "organization",
        "planning",
        "attention to detail",
        "multitasking",
        "adaptability",
        "flexibility",
        "collaboration",
        "mentoring",
        "coaching",
        "training",
        "presentation",
        "public speaking",
        "writing",
        "documentation",
        "research",
        "customer service",
        "client relations",
        "stakeholder management",
    ],
    "methodologies": [
        "agile",
        "scrum",
        "kanban",
        "lean",
        "waterfall",
        "devops",
        "cicd",
        "tdd",
        "test driven development",
        "bdd",
        "behavior driven development",
        "pair programming",
        "code review",
        "continuous integration",
        "continuous deployment",
        "microservices",
        "soa",
        "rest",
        "soap",
        "mvc",
        "mvvm",
        "mvp",
        "clean architecture",
        "solid principles",
    ],
    "certifications": [
        "aws certified",
        "azure certified",
        "google cloud certified",
        "cisco certified",
        "microsoft certified",
        "oracle certified",
        "comptia",
        "cissp",
        "cism",
        "cisa",
        "pmp",
        "prince2",
        "itil",
        "scrum master",
        "product owner",
        "safe",
        "togaf",
        "zachman",
    ],
}

# Cache all skills for faster lookups
_ALL_SKILLS_SET = set()
for category_skills in _SKILLS_DATABASE.values():
    _ALL_SKILLS_SET.update(category_skills)


class SkillsDatabase:
    """
    Comprehensive skills database for technical and soft skills matching
    """

    def __init__(self):
        # Use module-level database for efficiency
        self.skills_db = _SKILLS_DATABASE
        self.fuzzy_threshold = 85  # Minimum similarity score for fuzzy matching

    def get_all_skills(self) -> List[str]:
        """Get all skills from all categories"""
        return list(_ALL_SKILLS_SET)

    def get_skills_by_category(self, category: str) -> List[str]:
        """Get skills from a specific category"""
        return self.skills_db.get(category, [])

    def categorize_skill(self, skill: str) -> List[str]:
        """Find which categories a skill belongs to"""
        categories = []
        skill_lower = skill.lower()
        for category, skills in self.skills_db.items():
            if skill_lower in [s.lower() for s in skills]:
                categories.append(category)
        return categories


class HardMatcher:
    """
    Hard matching engine for exact and fuzzy skill/keyword matching
    """

    def __init__(self, fuzzy_threshold: int = 85):
        self.skills_db = SkillsDatabase()
        self.fuzzy_threshold = fuzzy_threshold
        self.fuzzy_available = fuzz is not None

        if not self.fuzzy_available:
            logger.warning(
                "Fuzzy matching libraries (rapidfuzz/fuzzywuzzy) not available. Using basic fuzzy matching fallback."
            )

    def exact_match(
        self, resume_tokens: Set[str], jd_tokens: Set[str]
    ) -> Dict[str, Any]:
        """
        Perform exact keyword matching between resume and job description

        Args:
            resume_tokens: Set of tokens from resume
            jd_tokens: Set of tokens from job description

        Returns:
            Dict with exact match results
        """
        # Convert to lowercase for matching
        resume_lower = {token.lower() for token in resume_tokens}
        jd_lower = {token.lower() for token in jd_tokens}

        # Find exact matches
        exact_matches = resume_lower.intersection(jd_lower)
        missing_from_resume = jd_lower - resume_lower
        extra_in_resume = resume_lower - jd_lower

        # Calculate score
        total_jd_tokens = len(jd_lower)
        matched_count = len(exact_matches)
        exact_score = (
            (matched_count / total_jd_tokens * 100) if total_jd_tokens > 0 else 0
        )

        return {
            "exact_matches": list(exact_matches),
            "missing_keywords": list(missing_from_resume),
            "extra_keywords": list(extra_in_resume),
            "matched_count": matched_count,
            "total_jd_keywords": total_jd_tokens,
            "exact_match_score": float(round(exact_score, 2)),
        }

    def fuzzy_match(
        self, resume_tokens: List[str], jd_tokens: List[str]
    ) -> Dict[str, Any]:
        """
        Perform fuzzy matching for similar terms

        Args:
            resume_tokens: List of tokens from resume
            jd_tokens: List of tokens from job description

        Returns:
            Dict with fuzzy match results
        """
        if not self.fuzzy_available:
            return self._basic_fuzzy_match(resume_tokens, jd_tokens)

        fuzzy_matches = []
        fuzzy_matched_jd = set()

        for jd_token in jd_tokens:
            # Find best match in resume
            if process:
                best_match = process.extractOne(
                    jd_token,
                    resume_tokens,
                    scorer=fuzz.ratio,
                    score_cutoff=self.fuzzy_threshold,
                )
            else:
                best_match = None
                best_score = 0
                for resume_token in resume_tokens:
                    score = fuzz.ratio(jd_token, resume_token)
                    if score > best_score and score >= self.fuzzy_threshold:
                        best_score = score
                        best_match = (resume_token, score)

            if best_match:
                fuzzy_matches.append(
                    {
                        "jd_term": jd_token,
                        "resume_term": best_match[0],
                        "similarity": best_match[1],
                    }
                )
                fuzzy_matched_jd.add(jd_token)

        # Calculate fuzzy score
        total_jd_tokens = len(jd_tokens)
        fuzzy_matched_count = len(fuzzy_matched_jd)
        fuzzy_score = (
            (fuzzy_matched_count / total_jd_tokens * 100) if total_jd_tokens > 0 else 0
        )

        return {
            "fuzzy_matches": fuzzy_matches,
            "fuzzy_matched_count": fuzzy_matched_count,
            "total_jd_tokens": total_jd_tokens,
            "fuzzy_match_score": float(round(fuzzy_score, 2)),
        }

    def _basic_fuzzy_match(
        self, resume_tokens: List[str], jd_tokens: List[str]
    ) -> Dict[str, Any]:
        """Basic fuzzy matching when rapidfuzz/fuzzywuzzy is not available"""
        fuzzy_matches = []
        fuzzy_matched_jd = set()

        for jd_token in jd_tokens:
            for resume_token in resume_tokens:
                # Simple character-based similarity
                similarity = self._calculate_similarity(jd_token, resume_token)
                if similarity >= self.fuzzy_threshold:
                    fuzzy_matches.append(
                        {
                            "jd_term": jd_token,
                            "resume_term": resume_token,
                            "similarity": similarity,
                        }
                    )
                    fuzzy_matched_jd.add(jd_token)
                    break

        fuzzy_score = (len(fuzzy_matched_jd) / len(jd_tokens) * 100) if jd_tokens else 0

        return {
            "fuzzy_matches": fuzzy_matches,
            "fuzzy_matched_count": len(fuzzy_matched_jd),
            "total_jd_tokens": len(jd_tokens),
            "fuzzy_match_score": float(round(fuzzy_score, 2)),
        }

    def _calculate_similarity(self, str1: str, str2: str) -> float:
        """Calculate basic similarity percentage between two strings"""
        if str1 == str2:
            return 100.0

        # Simple character overlap ratio
        set1, set2 = set(str1.lower()), set(str2.lower())
        intersection = len(set1.intersection(set2))
        union = len(set1.union(set2))

        return (intersection / union * 100) if union > 0 else 0.0

    def skills_match(
        self, resume_data: Dict[str, Any], jd_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Match skills specifically from the skills database

        Args:
            resume_data: Preprocessed resume data
            jd_data: Preprocessed job description data

        Returns:
            Dict with skills matching results
        """
        # Extract skills from both texts
        resume_skills = self._extract_database_skills(resume_data["skills_data"])
        jd_skills = self._extract_database_skills(jd_data["skills_data"])

        # Find matches
        exact_skill_matches = set(resume_skills).intersection(set(jd_skills))
        missing_skills = set(jd_skills) - set(resume_skills)
        extra_skills = set(resume_skills) - set(jd_skills)

        # Fuzzy match missing skills
        fuzzy_skill_matches = []
        if self.fuzzy_available and missing_skills:
            for missing_skill in missing_skills:
                if process:
                    best_match = process.extractOne(
                        missing_skill,
                        resume_skills,
                        scorer=fuzz.ratio,
                        score_cutoff=self.fuzzy_threshold,
                    )
                else:
                    best_match = None
                    best_score = 0
                    for resume_skill in resume_skills:
                        score = self._calculate_similarity(missing_skill, resume_skill)
                        if score > best_score and score >= self.fuzzy_threshold:
                            best_score = score
                            best_match = (resume_skill, score)

                if best_match:
                    fuzzy_skill_matches.append(
                        {
                            "required_skill": missing_skill,
                            "resume_skill": best_match[0],
                            "similarity": best_match[1],
                        }
                    )

        # Calculate skill match score
        total_required_skills = len(jd_skills)
        matched_skills = len(exact_skill_matches) + len(fuzzy_skill_matches)
        skill_score = (
            (matched_skills / total_required_skills * 100)
            if total_required_skills > 0
            else 0
        )

        return {
            "required_skills": list(jd_skills),
            "resume_skills": list(resume_skills),
            "exact_skill_matches": list(exact_skill_matches),
            "fuzzy_skill_matches": fuzzy_skill_matches,
            "missing_skills": list(
                missing_skills
                - {match["required_skill"] for match in fuzzy_skill_matches}
            ),
            "extra_skills": list(extra_skills),
            "skill_match_score": float(round(skill_score, 2)),
            "total_required_skills": total_required_skills,
            "total_matched_skills": matched_skills,
        }

    def _extract_database_skills(self, skills_data: Dict[str, List[str]]) -> List[str]:
        """Extract skills that are in our database"""
        all_db_skills = self.skills_db.get_all_skills()
        found_skills = []

        for category_skills in skills_data.values():
            for skill in category_skills:
                # Check if skill is in database (case-insensitive)
                for db_skill in all_db_skills:
                    if skill.lower() == db_skill.lower():
                        found_skills.append(db_skill)
                        break

        return list(set(found_skills))

    def comprehensive_hard_match(
        self, resume_data: Dict[str, Any], jd_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Perform comprehensive hard matching combining exact, fuzzy, and skills matching

        Args:
            resume_data: Preprocessed resume data
            jd_data: Preprocessed job description data

        Returns:
            Dict with comprehensive hard match results
        """
        # Exact keyword matching
        exact_results = self.exact_match(
            resume_data["keyword_set"], jd_data["keyword_set"]
        )

        # Fuzzy keyword matching
        fuzzy_results = self.fuzzy_match(resume_data["tokens"], jd_data["tokens"])

        # Skills database matching
        skills_results = self.skills_match(resume_data, jd_data)

        # Calculate combined hard match score
        # Weight: 40% exact match, 30% fuzzy match, 30% skills match
        combined_score = (
            0.4 * exact_results["exact_match_score"]
            + 0.3 * fuzzy_results["fuzzy_match_score"]
            + 0.3 * skills_results["skill_match_score"]
        )

        return {
            "exact_match": exact_results,
            "fuzzy_match": fuzzy_results,
            "skills_match": skills_results,
            "hard_match_score": float(round(combined_score, 2)),
            "match_summary": {
                "total_keywords_matched": exact_results["matched_count"]
                + fuzzy_results["fuzzy_matched_count"],
                "total_skills_matched": skills_results["total_matched_skills"],
                "key_missing_skills": skills_results["missing_skills"][
                    :5
                ],  # Top 5 missing skills
                "key_matched_skills": list(skills_results["exact_skill_matches"])[
                    :10
                ],  # Top 10 matched skills
            },
        }


# Convenience functions
def perform_hard_match(
    resume_data: Dict[str, Any], jd_data: Dict[str, Any]
) -> Dict[str, Any]:
    """Perform hard matching between resume and job description"""
    matcher = HardMatcher()
    return matcher.comprehensive_hard_match(resume_data, jd_data)


# Example usage
if __name__ == "__main__":
    from text_preprocessor import preprocess_resume, preprocess_job_description

    # Sample data
    sample_resume = """
    Python Developer with 3 years experience in Django, Flask, PostgreSQL, 
    React.js, AWS, Docker. Strong problem-solving and teamwork skills.
    """

    sample_jd = """
    Looking for Python Developer with Django, React, PostgreSQL, AWS knowledge.
    Docker experience preferred. Good communication and leadership skills required.
    """

    # Preprocess
    resume_data = preprocess_resume(sample_resume)
    jd_data = preprocess_job_description(sample_jd)

    # Perform hard matching
    matcher = HardMatcher()
    results = matcher.comprehensive_hard_match(resume_data, jd_data)

    print("=== Hard Matching Results ===")
    print(f"Hard Match Score: {results['hard_match_score']}%")
    print(f"Exact matches: {results['exact_match']['matched_count']}")
    print(f"Fuzzy matches: {results['fuzzy_match']['fuzzy_matched_count']}")
    print(f"Skills matched: {results['skills_match']['total_matched_skills']}")
    print(f"Missing skills: {results['skills_match']['missing_skills']}")
