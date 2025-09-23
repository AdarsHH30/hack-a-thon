# Optimized Dockerfile for Render deployment
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8001

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpoppler-cpp2 \
    libjpeg62-turbo \
    libpng16-16 \
    libfreetype6 \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copy requirements and install Python dependencies
COPY requirements-optimized.txt requirements.txt
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Download NLTK data with error handling
RUN python -c "import nltk; \
    try: \
        nltk.download('punkt', quiet=True); \
        nltk.download('stopwords', quiet=True); \
        nltk.download('wordnet', quiet=True); \
        print('NLTK data downloaded successfully'); \
    except Exception as e: \
        print(f'NLTK download failed: {e}'); \
        print('Application will use fallback methods');"

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Expose the port
EXPOSE $PORT

# Health check using curl instead of requests
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:$PORT/health || exit 1

# Command to run the application
CMD python start.py