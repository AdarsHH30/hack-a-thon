"""
Semantic Matching Module for Resume-Job Matching
Implements TF-IDF based semantic matching with cosine similarity
"""

import numpy as np
from typing import List, Dict, Any, Tuple, Optional
import pickle
import os
from pathlib import Path

try:
    from sklearn.metrics.pairwise import cosine_similarity
    from sklearn.feature_extraction.text import TfidfVectorizer

    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

# Global TF-IDF cache for efficiency
_TFIDF_CACHE = {}


class SemanticMatcher:
    """
    Semantic matching engine using TF-IDF vectorization and cosine similarity
    """

    def __init__(self, cache_dir: Optional[str] = None):
        """
        Initialize semantic matcher with TF-IDF approach

        Args:
            cache_dir: Directory to store cached embeddings (optional)
        """
        self.cache_dir = cache_dir or os.path.join(os.getcwd(), "cache", "embeddings")
        self.tfidf_vectorizer = None

        # Create cache directory if it doesn't exist
        os.makedirs(self.cache_dir, exist_ok=True)


class SemanticMatcher:
    """
    Semantic matching engine using Sentence-BERT embeddings and cosine similarity
    """

    def __init__(
        self, model_name: str = "all-MiniLM-L6-v2", cache_dir: Optional[str] = None
    ):
        """
        Initialize semantic matcher

        Args:
            model_name: Sentence-BERT model name (default: all-MiniLM-L6-v2 - 80MB, CPU-friendly)
            cache_dir: Directory to cache model and embeddings
        """
        self.model_name = model_name
        self.cache_dir = cache_dir or str(Path(__file__).parent / "cache")
        Path(self.cache_dir).mkdir(exist_ok=True)

        # Lazy loading - models are loaded only when needed
        self.model = None
        self.tfidf_vectorizer = None

    def _initialize_model(self):
        """Lazy initialization of the TF-IDF model for semantic matching"""
        print("Initializing TF-IDF based semantic matching (lightweight AI)")

        if SKLEARN_AVAILABLE:
            cache_key = "tfidf_vectorizer"
            if cache_key not in _TFIDF_CACHE:
                _TFIDF_CACHE[cache_key] = TfidfVectorizer(
                    max_features=5000,
                    stop_words="english",
                    ngram_range=(1, 3),
                    lowercase=True,
                    strip_accents="unicode",
                )
                print(
                    "✅ TF-IDF vectorizer initialized and cached for semantic matching"
                )
            self.tfidf_vectorizer = _TFIDF_CACHE[cache_key]
        else:
            print(
                "❌ scikit-learn not available - semantic matching will use basic text overlap"
            )
            print("Install scikit-learn for AI-powered semantic matching")

    def _initialize_tfidf(self):
        """Initialize TF-IDF vectorizer as fallback - DEPRECATED: Now handled in _initialize_model"""
        self._initialize_model()

    def encode_text(self, text: str, use_cache: bool = True) -> np.ndarray:
        """
        Encode text into vector representation

        Args:
            text: Input text to encode
            use_cache: Whether to check for cached embeddings

        Returns:
            np.ndarray: Vector representation of the text
        """
        # Check cache first if enabled
        if use_cache:
            cache_key = f"text_{hash(text)}"
            cached = self.load_cached_embeddings(cache_key)
            if cached is not None and len(cached) > 0:
                return cached[0]

        # Lazy load model if not initialized
        if self.tfidf_vectorizer is None:
            self._initialize_model()

        if self.tfidf_vectorizer is not None:
            # Use TF-IDF for semantic matching
            return self._encode_with_tfidf([text])[0]
        else:
            # Basic fallback - return word count vector
            return self._basic_encode(text)

    def encode_texts(self, texts: List[str], use_cache: bool = True) -> np.ndarray:
        """
        Encode multiple texts into vector representations

        Args:
            texts: List of texts to encode
            use_cache: Whether to check for cached embeddings

        Returns:
            np.ndarray: Matrix of vector representations
        """
        # Check cache first if enabled
        if use_cache and len(texts) == 1:
            cache_key = f"text_{hash(texts[0])}"
            cached = self.load_cached_embeddings(cache_key)
            if cached is not None:
                return cached

        # Lazy load model if not initialized
        if self.tfidf_vectorizer is None:
            self._initialize_model()

        if self.tfidf_vectorizer is not None:
            return self._encode_with_tfidf(texts)

        else:
            # Basic fallback
            return np.array([self._basic_encode(text) for text in texts])

    def _encode_with_tfidf(self, texts: List[str]) -> np.ndarray:
        """Encode texts using TF-IDF vectorizer"""
        try:
            if not hasattr(self.tfidf_vectorizer, "vocabulary_"):
                # First time - fit the vectorizer
                tfidf_matrix = self.tfidf_vectorizer.fit_transform(texts)
            else:
                # Already fitted - just transform
                tfidf_matrix = self.tfidf_vectorizer.transform(texts)

            return tfidf_matrix.toarray()
        except Exception as e:
            print(f"Error with TF-IDF encoding: {e}")
            return np.array([self._basic_encode(text) for text in texts])

    def _basic_encode(self, text: str) -> np.ndarray:
        """Basic encoding using word frequencies (fallback)"""
        # Simple word frequency vector (very basic)
        words = text.lower().split()
        word_counts = {}
        for word in words:
            word_counts[word] = word_counts.get(word, 0) + 1

        # Create a simple vector based on word counts
        # This is a very basic approach - not recommended for production
        return np.array([len(words), len(set(words)), sum(word_counts.values())])

    def calculate_similarity(self, text1: str, text2: str) -> float:
        """
        Calculate semantic similarity between two texts

        Args:
            text1: First text
            text2: Second text

        Returns:
            float: Similarity score between 0 and 1
        """
        if not text1.strip() or not text2.strip():
            return 0.0

        try:
            # Try to use embeddings (Sentence-BERT or TF-IDF)
            embeddings = self.encode_texts([text1, text2])

            if SKLEARN_AVAILABLE:
                similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
            else:
                # Manual cosine similarity calculation
                similarity = self._manual_cosine_similarity(
                    embeddings[0], embeddings[1]
                )

            return max(0.0, min(1.0, similarity))  # Ensure between 0 and 1

        except Exception as e:
            print(f"Error calculating similarity: {e}")
            return self._basic_text_similarity(text1, text2)

    def _manual_cosine_similarity(self, vec1: np.ndarray, vec2: np.ndarray) -> float:
        """Manual cosine similarity calculation"""
        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)

        if norm1 == 0 or norm2 == 0:
            return 0.0

        return dot_product / (norm1 * norm2)

    def _basic_text_similarity(self, text1: str, text2: str) -> float:
        """Basic text similarity using word overlap"""
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())

        if len(words1) == 0 and len(words2) == 0:
            return 1.0
        if len(words1) == 0 or len(words2) == 0:
            return 0.0

        intersection = len(words1.intersection(words2))
        union = len(words1.union(words2))

        return intersection / union if union > 0 else 0.0

    def semantic_match_detailed(self, resume_text: str, jd_text: str) -> Dict[str, Any]:
        """
        Perform detailed semantic matching with breakdown

        Args:
            resume_text: Resume text
            jd_text: Job description text

        Returns:
            Dict with detailed semantic matching results
        """
        # Overall similarity
        overall_similarity = self.calculate_similarity(resume_text, jd_text)

        # Split texts into sections for granular analysis
        resume_sections = self._split_into_sections(resume_text)
        jd_sections = self._split_into_sections(jd_text)

        # Calculate section-wise similarities
        section_similarities = {}
        for jd_section_name, jd_section_text in jd_sections.items():
            best_match_score = 0.0
            best_match_section = None

            for resume_section_name, resume_section_text in resume_sections.items():
                similarity = self.calculate_similarity(
                    resume_section_text, jd_section_text
                )
                if similarity > best_match_score:
                    best_match_score = similarity
                    best_match_section = resume_section_name

            section_similarities[jd_section_name] = {
                "best_match_section": best_match_section,
                "similarity_score": best_match_score,
                "jd_section_text": (
                    jd_section_text[:200] + "..."
                    if len(jd_section_text) > 200
                    else jd_section_text
                ),
            }

        # Calculate average section similarity
        section_scores = [
            data["similarity_score"] for data in section_similarities.values()
        ]
        avg_section_similarity = (
            sum(section_scores) / len(section_scores) if section_scores else 0.0
        )

        # Final semantic score (weighted combination)
        # 70% overall similarity, 30% average section similarity
        final_score = (0.7 * overall_similarity + 0.3 * avg_section_similarity) * 100

        return {
            "overall_similarity": float(round(overall_similarity * 100, 2)),
            "section_similarities": section_similarities,
            "average_section_similarity": float(round(avg_section_similarity * 100, 2)),
            "semantic_score": float(round(final_score, 2)),
            "model_used": (
                self.model_name
                if self.model
                else "TF-IDF" if self.tfidf_vectorizer else "Basic"
            ),
            "confidence": self._calculate_confidence(
                overall_similarity, len(resume_text), len(jd_text)
            ),
        }

    def _split_into_sections(self, text: str) -> Dict[str, str]:
        """Split text into logical sections for granular analysis"""
        sections = {}

        # Split by common section headers
        section_patterns = {
            "experience": [
                "experience",
                "work history",
                "employment",
                "professional experience",
            ],
            "skills": ["skills", "technical skills", "competencies", "technologies"],
            "education": ["education", "academic", "qualifications", "degree"],
            "responsibilities": [
                "responsibilities",
                "duties",
                "requirements",
                "required",
            ],
            "projects": ["projects", "portfolio", "achievements", "accomplishments"],
        }

        text_lower = text.lower()
        sentences = [s.strip() for s in text.split(".") if s.strip()]

        # Default section if no specific sections found
        sections["general"] = text

        for section_name, keywords in section_patterns.items():
            section_content = []
            for sentence in sentences:
                sentence_lower = sentence.lower()
                if any(keyword in sentence_lower for keyword in keywords):
                    section_content.append(sentence)

            if section_content:
                sections[section_name] = ". ".join(section_content)

        return sections

    def _calculate_confidence(
        self, similarity: float, resume_length: int, jd_length: int
    ) -> str:
        """Calculate confidence level in the semantic match"""
        min_length = 100  # Minimum text length for high confidence

        # Factors affecting confidence
        length_factor = min(resume_length, jd_length) / min_length
        similarity_factor = similarity

        combined_confidence = length_factor * similarity_factor

        if combined_confidence > 0.7:
            return "High"
        elif combined_confidence > 0.4:
            return "Medium"
        else:
            return "Low"

    def batch_similarity(
        self, resume_text: str, jd_list: List[str]
    ) -> List[Dict[str, Any]]:
        """
        Calculate similarity between one resume and multiple job descriptions

        Args:
            resume_text: Resume text
            jd_list: List of job description texts

        Returns:
            List of similarity results for each JD
        """
        results = []

        for i, jd_text in enumerate(jd_list):
            similarity_result = self.semantic_match_detailed(resume_text, jd_text)
            similarity_result["jd_index"] = i
            results.append(similarity_result)

        # Sort by semantic score (highest first)
        results.sort(key=lambda x: x["semantic_score"], reverse=True)

        return results

    def cache_embeddings(self, texts: List[str], cache_key: str) -> str:
        """Cache embeddings to disk for faster subsequent access"""
        cache_file = Path(self.cache_dir) / f"{cache_key}_embeddings.pkl"

        try:

            embeddings = self.encode_texts(texts, use_cache=False)
            with open(cache_file, "wb") as f:
                pickle.dump(embeddings, f)
            print(f"✅ Embeddings cached to {cache_file}")
            return str(cache_file)
        except Exception as e:
            print(f"❌ Failed to cache embeddings: {e}")
            return ""

    def load_cached_embeddings(self, cache_key: str) -> Optional[np.ndarray]:
        """Load cached embeddings from disk"""
        cache_file = Path(self.cache_dir) / f"{cache_key}_embeddings.pkl"

        try:
            if cache_file.exists():
                with open(cache_file, "rb") as f:
                    embeddings = pickle.load(f)
                print(f"✅ Loaded cached embeddings from {cache_file}")
                return embeddings
        except Exception as e:
            print(f"❌ Failed to load cached embeddings: {e}")

        return None


# Convenience functions
def calculate_semantic_similarity(resume_text: str, jd_text: str) -> Dict[str, Any]:
    """Calculate semantic similarity between resume and job description"""
    matcher = SemanticMatcher()
    return matcher.semantic_match_detailed(resume_text, jd_text)


def batch_semantic_matching(
    resume_text: str, jd_list: List[str]
) -> List[Dict[str, Any]]:
    """Perform semantic matching for one resume against multiple job descriptions"""
    matcher = SemanticMatcher()
    return matcher.batch_similarity(resume_text, jd_list)


# Example usage
if __name__ == "__main__":
    # Sample data
    sample_resume = """
    Experienced Python developer with 5 years in web development using Django and Flask.
    Strong background in React.js frontend development and PostgreSQL database design.
    Proficient in AWS cloud services, Docker containerization, and CI/CD pipelines.
    Led a team of 3 developers on multiple projects. Excellent problem-solving and communication skills.
    """

    sample_jd = """
    We are seeking a Senior Python Developer to join our growing team.
    The ideal candidate will have experience with Django or Flask frameworks,
    React.js for frontend development, and cloud platforms like AWS.
    Strong leadership and communication skills are essential.
    Experience with containerization and DevOps practices is a plus.
    """

    # Test semantic matching
    matcher = SemanticMatcher()
    result = matcher.semantic_match_detailed(sample_resume, sample_jd)

    print("=== Semantic Matching Results ===")
    print(f"Overall Similarity: {result['overall_similarity']}%")
    print(f"Final Semantic Score: {result['semantic_score']}%")
    print(f"Confidence: {result['confidence']}")
    print(f"Model Used: {result['model_used']}")
    print("\nSection Analysis:")
    for section, data in result["section_similarities"].items():
        print(
            f"  {section}: {data['similarity_score']:.1%} (matched with {data['best_match_section']})"
        )
