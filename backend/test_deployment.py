#!/usr/bin/env python3
"""
Test script to verify deployment readiness
"""

import sys
import os
from pathlib import Path

def test_imports():
    """Test all critical imports"""
    print("🧪 Testing imports...")
    
    try:
        import fastapi
        print(f"✅ FastAPI: {fastapi.__version__}")
    except ImportError as e:
        print(f"❌ FastAPI import failed: {e}")
        return False
    
    try:
        import uvicorn
        print(f"✅ Uvicorn: {uvicorn.__version__}")
    except ImportError as e:
        print(f"❌ Uvicorn import failed: {e}")
        return False
    
    try:
        import fitz
        print(f"✅ PyMuPDF: {fitz.__version__}")
    except ImportError as e:
        print(f"❌ PyMuPDF import failed: {e}")
        return False
    
    try:
        import nltk
        print(f"✅ NLTK: {nltk.__version__}")
    except ImportError as e:
        print(f"❌ NLTK import failed: {e}")
        return False
    
    try:
        from main import app
        print("✅ Main app import successful")
    except ImportError as e:
        print(f"❌ Main app import failed: {e}")
        return False
    
    return True

def test_nltk_data():
    """Test NLTK data availability"""
    print("\n🧪 Testing NLTK data...")
    
    try:
        import nltk
        
        # Test punkt tokenizer
        try:
            nltk.data.find('tokenizers/punkt')
            print("✅ NLTK punkt data available")
        except LookupError:
            print("⚠️ NLTK punkt data missing - downloading...")
            try:
                nltk.download('punkt', quiet=True)
                print("✅ NLTK punkt data downloaded")
            except Exception as e:
                print(f"❌ Failed to download punkt: {e}")
        
        # Test stopwords
        try:
            nltk.data.find('corpora/stopwords')
            print("✅ NLTK stopwords available")
        except LookupError:
            print("⚠️ NLTK stopwords missing - downloading...")
            try:
                nltk.download('stopwords', quiet=True)
                print("✅ NLTK stopwords downloaded")
            except Exception as e:
                print(f"❌ Failed to download stopwords: {e}")
        
        return True
    except Exception as e:
        print(f"❌ NLTK test failed: {e}")
        return False

def test_environment():
    """Test environment configuration"""
    print("\n🧪 Testing environment...")
    
    port = os.getenv("PORT", "8001")
    print(f"✅ PORT: {port}")
    
    groq_key = os.getenv("GROQ_API_KEY")
    if groq_key:
        print(f"✅ GROQ_API_KEY: {'*' * (len(groq_key) - 4)}{groq_key[-4:]}")
    else:
        print("⚠️ GROQ_API_KEY not set - AI features will use fallback")
    
    pythonpath = os.getenv("PYTHONPATH", "Not set")
    print(f"✅ PYTHONPATH: {pythonpath}")
    
    return True

def test_file_structure():
    """Test required files exist"""
    print("\n🧪 Testing file structure...")
    
    required_files = [
        "main.py",
        "start.py",
        "requirements-optimized.txt",
        "Dockerfile",
        "app/api/routes/main_routes.py",
        "app/services/pdf_extraction_service.py",
    ]
    
    all_exist = True
    for file_path in required_files:
        if Path(file_path).exists():
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} missing")
            all_exist = False
    
    return all_exist

def main():
    """Run all tests"""
    print("🚀 Innomatics Resume API - Deployment Test")
    print("=" * 50)
    
    tests = [
        ("File Structure", test_file_structure),
        ("Environment", test_environment),
        ("Imports", test_imports),
        ("NLTK Data", test_nltk_data),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n📋 Running {test_name} test...")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test crashed: {e}")
            results.append((test_name, False))
    
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    
    all_passed = True
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {test_name}: {status}")
        if not passed:
            all_passed = False
    
    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 All tests passed! Ready for deployment.")
        return 0
    else:
        print("⚠️ Some tests failed. Check the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())