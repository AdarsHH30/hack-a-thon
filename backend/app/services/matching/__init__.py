"""
Resume-Job Matching Module
Complete solution for resume and job description matching with semantic and hard matching
"""

from .matching_engine import MatchingEngine, match_resume_to_job, batch_match_jobs
from .text_preprocessor import (
    TextPreprocessor,
    preprocess_resume,
    preprocess_job_description,
)
from .hard_matcher import HardMatcher, perform_hard_match
from .semantic_matcher import SemanticMatcher, calculate_semantic_similarity
from .extract import ResumeJobExtractor, analyze_resume_job_match

__all__ = [
    "MatchingEngine",
    "match_resume_to_job",
    "batch_match_jobs",
    "TextPreprocessor",
    "preprocess_resume",
    "preprocess_job_description",
    "HardMatcher",
    "perform_hard_match",
    "SemanticMatcher",
    "calculate_semantic_similarity",
    "ResumeJobExtractor",
    "analyze_resume_job_match",
]

__version__ = "1.0.0"
__author__ = "Innomatics Team"
__description__ = "AI-powered resume and job description matching system"
