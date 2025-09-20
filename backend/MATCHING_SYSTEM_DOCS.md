# Resume-Job Matching System Documentation

## Overview

This comprehensive AI-powered resume-job matching system implements a sophisticated 6-step matching pipeline that combines hard keyword matching with semantic analysis to provide accurate matching scores, verdicts, and actionable suggestions.

## Architecture

### Core Components

1. **Text Preprocessor** (`text_preprocessor.py`)

   - Cleans and normalizes text from resumes and job descriptions
   - Removes stopwords, handles special characters
   - Extracts skills and keywords by category
   - Tokenizes text for further processing

2. **Hard Matcher** (`hard_matcher.py`)

   - Performs exact keyword matching
   - Implements fuzzy string matching for variations/typos
   - Maintains comprehensive skills database
   - Categorizes skills by type (programming languages, frameworks, etc.)

3. **Semantic Matcher** (`semantic_matcher.py`)

   - Uses Sentence-BERT embeddings for semantic understanding
   - Calculates cosine similarity between resume and job descriptions
   - Provides fallback to TF-IDF vectorization
   - Supports batch processing and caching

4. **Matching Engine** (`matching_engine.py`)
   - Orchestrates the complete matching pipeline
   - Combines hard and semantic scores with configurable weights
   - Determines verdicts based on thresholds
   - Generates actionable suggestions

## Matching Pipeline

### Step 1: Text Preprocessing

- **Input**: Raw resume and job description text
- **Process**: Clean text, normalize formatting, extract keywords/skills
- **Output**: Preprocessed text data with categorized skills

### Step 2: Hard Match (Keywords & Skills)

- **Exact Matching**: Direct keyword overlap between texts
- **Fuzzy Matching**: Similar terms using rapidfuzz (85% similarity threshold)
- **Skills Database**: 500+ categorized technical and soft skills
- **Score**: `(matched_keywords / total_jd_keywords) × 100`

### Step 3: Semantic Match (Embeddings)

- **Model**: Sentence-BERT `all-MiniLM-L6-v2` (80MB, CPU-friendly)
- **Process**: Convert texts to vector embeddings
- **Similarity**: Cosine similarity between embeddings
- **Score**: `cosine_similarity × 100`

### Step 4: Scoring Formula

```
Final Score = (0.6 × Semantic Score) + (0.4 × Hard Match Score)
```

_Weights are configurable_

### Step 5: Verdict Determination

- **High Suitability**: ≥ 75%
- **Medium Suitability**: 50-74%
- **Low Suitability**: < 50%
  _Thresholds are configurable_

### Step 6: Output Generation

- Relevance score (0-100)
- Verdict classification
- Matched skills list
- Missing skills list
- Actionable suggestions
- Detailed analysis breakdown

## API Endpoints

### 1. Text Matching

```http
POST /api/matching/match-text
Content-Type: application/json

{
  "resume_text": "Python developer with Django experience...",
  "job_description_text": "Looking for Python developer...",
  "config": {
    "weights": {
      "semantic_weight": 0.7,
      "hard_match_weight": 0.3
    }
  }
}
```

### 2. PDF Matching

```http
POST /api/matching/match-pdf
Content-Type: multipart/form-data

resume_file: [PDF file]
jd_file: [PDF file]
config: {"weights": {"semantic_weight": 0.6}}
```

### 3. Batch Matching

```http
POST /api/matching/batch-match
Content-Type: application/json

{
  "resume_text": "Python developer...",
  "job_descriptions": [
    "Python developer position...",
    "Senior developer role..."
  ]
}
```

### 4. Configuration Management

```http
GET /api/matching/config/default
POST /api/matching/config/validate
```

## Response Format

```json
{
  "success": true,
  "timestamp": "2024-01-20T10:30:00.000Z",
  "relevance_score": 82.5,
  "verdict": "High Suitability",
  "matched_skills": ["python", "django", "postgresql", "aws", "docker"],
  "missing_skills": ["kubernetes", "typescript", "redis"],
  "suggestions": [
    "Consider mentioning any exposure to: kubernetes, typescript",
    "You're a strong match! Emphasize your relevant experience",
    "Prepare to discuss specific projects using the matched technologies"
  ],
  "score_breakdown": {
    "hard_match_score": 75.0,
    "semantic_score": 87.5,
    "final_score": 82.5,
    "calculation": "(0.6 × 87.5) + (0.4 × 75.0) = 82.5"
  },
  "match_statistics": {
    "exact_matches": 8,
    "fuzzy_matches": 3,
    "missing_skills_count": 5,
    "keyword_match_rate": 68.2
  },
  "detailed_analysis": {
    "strengths": [
      "Strong technical match with 11 relevant skills",
      "Excellent semantic alignment with job requirements"
    ],
    "areas_for_improvement": ["kubernetes", "typescript", "redis"],
    "semantic_confidence": "High",
    "skill_categories_analysis": {
      "programming_languages": {
        "match_rate": 100.0,
        "matched_skills": ["python", "javascript"],
        "missing_skills": []
      }
    }
  }
}
```

## Configuration Options

### Weights Configuration

```json
{
  "weights": {
    "semantic_weight": 0.6, // 0.0 to 1.0
    "hard_match_weight": 0.4 // Must sum to 1.0
  }
}
```

### Thresholds Configuration

```json
{
  "thresholds": {
    "high_suitability": 75, // 0-100
    "medium_suitability": 50, // 0-100
    "low_suitability": 0 // 0-100
  }
}
```

### Advanced Configuration

```json
{
  "fuzzy_threshold": 85, // 0-100, minimum similarity for fuzzy matches
  "max_suggestions": 5, // 1-10, maximum suggestions to generate
  "semantic_model": "all-MiniLM-L6-v2", // Sentence-BERT model name
  "enable_caching": true // Cache embeddings for faster subsequent requests
}
```

## Installation & Setup

### 1. Install Dependencies

```bash
cd /path/to/backend
pip install -r requirements.txt
```

### 2. Download NLTK Data (if needed)

```python
import nltk
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
```

### 3. Start the Server

```bash
python main.py
```

### 4. Test the System

```bash
python test_matching_system.py
```

## Dependencies

### Core Dependencies

- `fastapi` - Web framework
- `pydantic` - Data validation
- `numpy` - Numerical operations
- `requests` - HTTP requests for Groq API

### AI/ML Dependencies

- `sentence-transformers` - Semantic embeddings (recommended)
- `scikit-learn` - TF-IDF fallback and cosine similarity
- `nltk` - Text preprocessing
- `rapidfuzz` - Fast fuzzy string matching (recommended)
- `fuzzywuzzy` - Fuzzy string matching fallback

### Optional Dependencies

- `torch` - PyTorch backend for sentence-transformers
- `transformers` - Hugging Face transformers library
- `tokenizers` - Fast tokenization

## Performance Considerations

### Model Performance

- **Sentence-BERT**: Best accuracy, ~2-5 seconds per match
- **TF-IDF Fallback**: Good accuracy, ~0.1-0.5 seconds per match
- **Basic Fallback**: Limited accuracy, ~0.01 seconds per match

### Optimization Tips

1. **Enable Caching**: Set `enable_caching: true` for repeated matches
2. **Batch Processing**: Use `/batch-match` for multiple job descriptions
3. **Preprocessing Cache**: Cache preprocessed data for frequently used texts
4. **GPU Acceleration**: Use CUDA-enabled PyTorch for faster embeddings

### Resource Usage

- **Memory**: 200-500MB (depending on model)
- **CPU**: 1-4 cores recommended
- **Disk**: 100MB for models, 10MB for cache

## Error Handling

### Common Issues

1. **Empty/Invalid Text**: Returns graceful error with suggestions
2. **Missing Dependencies**: Falls back to available implementations
3. **Model Loading Errors**: Automatically uses TF-IDF fallback
4. **PDF Extraction Failures**: Clear error messages with file details

### Fallback Mechanisms

1. **Sentence-BERT → TF-IDF → Basic similarity**
2. **rapidfuzz → fuzzywuzzy → basic string matching**
3. **Advanced text cleaning → basic cleaning**

## Customization

### Adding New Skills

Edit `hard_matcher.py`:

```python
"new_category": [
    "skill1", "skill2", "skill3"
]
```

### Custom Preprocessing

Extend `TextPreprocessor` class:

```python
class CustomPreprocessor(TextPreprocessor):
    def custom_cleaning_logic(self, text):
        # Your custom logic here
        return processed_text
```

### Custom Scoring Weights

```python
custom_config = {
    "weights": {
        "semantic_weight": 0.8,    # Favor semantic matching
        "hard_match_weight": 0.2
    }
}
```

## Testing

### Running Tests

```bash
# Full test suite
python test_matching_system.py

# Individual components
python -m app.services.matching.text_preprocessor
python -m app.services.matching.hard_matcher
python -m app.services.matching.semantic_matcher
python -m app.services.matching.matching_engine
```

### Test Coverage

- ✅ Basic text matching
- ✅ Custom configuration
- ✅ Edge cases (empty inputs, no matches)
- ✅ Performance benchmarks
- ✅ Error handling
- ✅ PDF processing integration

## Best Practices

### For Production Use

1. **Monitor Performance**: Track response times and accuracy
2. **Cache Frequently Used Embeddings**: Reduce computation time
3. **Validate Input Sizes**: Limit text length to prevent timeouts
4. **Use Proper Error Handling**: Provide meaningful error messages
5. **Regular Model Updates**: Keep sentence-transformers updated

### For Accuracy

1. **Train Domain-Specific Models**: For specialized industries
2. **Expand Skills Database**: Add industry-specific terms
3. **Tune Weights**: Based on your specific use case
4. **Clean Input Data**: Better preprocessing → better results

## Troubleshooting

### Installation Issues

```bash
# If sentence-transformers fails to install
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install sentence-transformers

# If rapidfuzz fails
pip install fuzzywuzzy python-Levenshtein

# If NLTK data is missing
python -c "import nltk; nltk.download('all')"
```

### Runtime Issues

- **Slow Performance**: Check if GPU is available, reduce text length
- **Memory Errors**: Use smaller model or TF-IDF fallback
- **Import Errors**: Check dependency installation

### API Issues

- **404 Errors**: Ensure matching routes are included in main.py
- **Validation Errors**: Check request format matches Pydantic models
- **Timeout Errors**: Reduce text length or increase timeout settings

## Support

For issues and questions:

1. Check the test script output for diagnostic information
2. Review error logs for specific error messages
3. Verify all dependencies are correctly installed
4. Test with simple examples before complex use cases

## License

This resume-job matching system is part of the Innomatics project.
