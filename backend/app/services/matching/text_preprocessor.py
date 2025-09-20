"""
Text Preprocessing Module for Resume-Job Matching
Handles text cleaning, normalization, and preprocessing for better matching accuracy
"""

import re
import string
from typing import List, Set, Dict, Any
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, RegexpTokenizer
from nltk.stem import PorterStemmer, WordNetLemmatizer


# Download NLTK data once at module level for efficiency
def _ensure_nltk_data():
    """Ensure required NLTK data is downloaded"""
    try:
        nltk.data.find("tokenizers/punkt")
    except LookupError:
        nltk.download("punkt", quiet=True)

    try:
        nltk.data.find("corpora/stopwords")
    except LookupError:
        nltk.download("stopwords", quiet=True)

    try:
        nltk.data.find("corpora/wordnet")
    except LookupError:
        nltk.download("wordnet", quiet=True)


# Download data once when module is imported
_ensure_nltk_data()

# Cache stopwords for efficiency
_cached_stop_words = set(stopwords.words("english"))
_domain_stopwords = {
    "experience",
    "years",
    "year",
    "work",
    "working",
    "job",
    "position",
    "role",
    "responsibilities",
    "responsible",
    "including",
    "company",
    "team",
    "teams",
    "project",
    "projects",
    "skills",
    "skill",
    "knowledge",
    "ability",
    "able",
    "requirements",
    "required",
    "preferred",
    "plus",
    "nice",
    "have",
    "must",
    "should",
    "candidate",
    "candidates",
    "applicant",
    "applicants",
}
_cached_stop_words.update(_domain_stopwords)

# Cache skills sets for faster lookups
_SKILLS_SETS = {
    "programming_languages": {
        "python",
        "java",
        "javascript",
        "typescript",
        "cplusplus",
        "csharp",
        "php",
        "ruby",
        "go",
        "rust",
        "scala",
        "kotlin",
        "swift",
        "r",
        "matlab",
        "sql",
        "html",
        "css",
        "shell",
        "bash",
        "powershell",
    },
    "frameworks": {
        "react",
        "reactjs",
        "angular",
        "vue",
        "vuejs",
        "django",
        "flask",
        "fastapi",
        "express",
        "nodejs",
        "spring",
        "hibernate",
        "bootstrap",
        "jquery",
        "tensorflow",
        "pytorch",
        "keras",
        "scikit-learn",
        "pandas",
        "numpy",
        "matplotlib",
        "seaborn",
        "plotly",
    },
    "databases": {
        "mysql",
        "postgresql",
        "mongodb",
        "redis",
        "elasticsearch",
        "sqlite",
        "oracle",
        "sqlserver",
        "dynamodb",
        "cassandra",
        "firebase",
        "cosmos",
        "mariadb",
    },
    "cloud_platforms": {
        "aws",
        "azure",
        "gcp",
        "docker",
        "kubernetes",
        "terraform",
        "ansible",
        "jenkins",
        "gitlab",
        "github",
        "bitbucket",
        "cloudformation",
        "helm",
        "prometheus",
        "grafana",
    },
    "tools": {
        "git",
        "jira",
        "confluence",
        "slack",
        "teams",
        "zoom",
        "postman",
        "swagger",
        "figma",
        "sketch",
        "photoshop",
        "illustrator",
        "tableau",
        "powerbi",
        "excel",
        "word",
    },
    "data_science": {
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
    },
}


class TextPreprocessor:
    """
    Comprehensive text preprocessing for resume and job description matching
    """

    def __init__(self):
        self.stemmer = PorterStemmer()
        self.lemmatizer = WordNetLemmatizer()
        # Use faster regex tokenizer
        self.tokenizer = RegexpTokenizer(r"\w+")
        # Use cached stopwords
        self.stop_words = _cached_stop_words.copy()

    def clean_text(self, text: str) -> str:
        """
        Basic text cleaning and normalization

        Args:
            text (str): Raw text to clean

        Returns:
            str: Cleaned and normalized text
        """
        if not text:
            return ""

        # Convert to lowercase
        text = text.lower()

        # Remove extra whitespace and normalize
        text = re.sub(r"\s+", " ", text)

        # Remove special characters but keep important ones
        text = re.sub(r"[^\w\s\-\+\#\.]", " ", text)

        # Handle common programming languages and technologies
        text = re.sub(r"\bc\+\+\b", "cplusplus", text)
        text = re.sub(r"\bc\#\b", "csharp", text)
        text = re.sub(r"\b\.net\b", "dotnet", text)
        text = re.sub(r"\bnode\.js\b", "nodejs", text)
        text = re.sub(r"\breact\.js\b", "reactjs", text)
        text = re.sub(r"\bvue\.js\b", "vuejs", text)

        # Remove extra spaces
        text = re.sub(r"\s+", " ", text).strip()

        return text

    def tokenize_and_filter(
        self, text: str, remove_stopwords: bool = True
    ) -> List[str]:
        """
        Tokenize text and optionally remove stopwords

        Args:
            text (str): Text to tokenize
            remove_stopwords (bool): Whether to remove stopwords

        Returns:
            List[str]: List of filtered tokens
        """
        # Clean text first
        text = self.clean_text(text)

        # Tokenize using faster regex tokenizer
        tokens = self.tokenizer.tokenize(text)

        # Filter tokens
        filtered_tokens = []
        for token in tokens:
            # Skip very short tokens (less than 2 characters)
            if len(token) < 2:
                continue

            # Skip pure numbers unless they might be version numbers
            if token.isdigit() and len(token) < 4:
                continue

            # Remove stopwords if requested
            if remove_stopwords and token.lower() in self.stop_words:
                continue

            filtered_tokens.append(token)

        return filtered_tokens

    def extract_skills_and_keywords(self, text: str) -> Dict[str, List[str]]:
        """
        Extract different types of skills and keywords from text

        Args:
            text (str): Text to analyze

        Returns:
            Dict[str, List[str]]: Dictionary with categorized skills and keywords
        """
        # Clean and tokenize
        tokens = self.tokenize_and_filter(text, remove_stopwords=True)

        # Use cached skills sets for faster lookups
        found_skills = {category: [] for category in _SKILLS_SETS.keys()}
        found_skills["general_keywords"] = []

        # Check for technical skills using set lookups (O(1))
        for token in tokens:
            token_lower = token.lower()
            for category, skills_set in _SKILLS_SETS.items():
                if token_lower in skills_set:
                    found_skills[category].append(token)

            # Add to general keywords if it's not a common word
            if len(token) > 2 and token.isalpha() and token not in self.stop_words:
                found_skills["general_keywords"].append(token)

        # Remove duplicates and sort
        for category in found_skills:
            found_skills[category] = sorted(list(set(found_skills[category])))

        return found_skills

    def preprocess_for_matching(self, text: str) -> Dict[str, Any]:
        """
        Complete preprocessing pipeline for matching

        Args:
            text (str): Raw text to preprocess

        Returns:
            Dict[str, Any]: Comprehensive preprocessing results
        """
        # Basic cleaning
        cleaned_text = self.clean_text(text)

        # Tokenization
        tokens = self.tokenize_and_filter(cleaned_text, remove_stopwords=True)
        tokens_with_stopwords = self.tokenize_and_filter(
            cleaned_text, remove_stopwords=False
        )

        # Skills extraction
        skills_data = self.extract_skills_and_keywords(text)

        # Create text for semantic matching (preserve some structure)
        semantic_text = self.clean_text(text)
        semantic_text = re.sub(r"\s+", " ", semantic_text)

        # Create keyword set for exact matching
        keyword_set = set(token.lower() for token in tokens)

        return {
            "original_text": text,
            "cleaned_text": cleaned_text,
            "semantic_text": semantic_text,
            "tokens": tokens,
            "tokens_with_stopwords": tokens_with_stopwords,
            "keyword_set": keyword_set,
            "skills_data": skills_data,
            "total_tokens": len(tokens),
            "unique_tokens": len(set(tokens)),
        }

    def extract_key_phrases(
        self, text: str, min_length: int = 2, max_length: int = 4
    ) -> List[str]:
        """
        Extract key phrases (n-grams) from text

        Args:
            text (str): Text to analyze
            min_length (int): Minimum phrase length
            max_length (int): Maximum phrase length

        Returns:
            List[str]: List of key phrases
        """
        tokens = self.tokenize_and_filter(text, remove_stopwords=True)
        phrases = []

        for n in range(min_length, max_length + 1):
            for i in range(len(tokens) - n + 1):
                phrase = " ".join(tokens[i : i + n])
                if len(phrase) > 3:  # Skip very short phrases
                    phrases.append(phrase)

        return list(set(phrases))


# Convenience functions
def preprocess_resume(resume_text: str) -> Dict[str, Any]:
    """Preprocess resume text for matching"""
    preprocessor = TextPreprocessor()
    return preprocessor.preprocess_for_matching(resume_text)


def preprocess_job_description(jd_text: str) -> Dict[str, Any]:
    """Preprocess job description text for matching"""
    preprocessor = TextPreprocessor()
    return preprocessor.preprocess_for_matching(jd_text)


# Example usage
if __name__ == "__main__":
    preprocessor = TextPreprocessor()

    sample_text = """
    We are looking for a Senior Python Developer with 5+ years of experience.
    Must have experience with Django, Flask, React.js, and PostgreSQL.
    Knowledge of AWS, Docker, and CI/CD pipelines is preferred.
    """

    result = preprocessor.preprocess_for_matching(sample_text)

    print("=== Text Preprocessing Results ===")
    print(f"Original text length: {len(result['original_text'])}")
    print(f"Cleaned text: {result['cleaned_text'][:100]}...")
    print(f"Total tokens: {result['total_tokens']}")
    print(f"Unique tokens: {result['unique_tokens']}")
    print(f"Skills found: {result['skills_data']}")
