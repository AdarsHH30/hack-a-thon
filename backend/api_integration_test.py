#!/usr/bin/env python3
"""
Quick test of the new integrated API endpoints
"""
import requests
import json
import time


def test_endpoints():
    base_url = "http://localhost:8002/api/matching"

    print("🚀 Testing Integrated API Endpoints")
    print("=" * 50)

    # Test 1: Health Check
    print("1. Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health", timeout=10)
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Health: {result['status']}")
            print(f"   📊 Test Score: {result.get('test_score', 0):.2f}%")
        else:
            print(f"   ❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Health check error: {e}")

    # Test 2: Quick Test
    print("\n2. Testing quick test endpoint...")
    try:
        response = requests.get(f"{base_url}/test/quick", timeout=15)
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Quick Test: {result['message']}")
            print(f"   📊 Score: {result.get('score', 0):.2f}%")
            print(f"   🏆 Verdict: {result.get('verdict', 'Unknown')}")
            print(f"   🔧 Status: {result.get('system_status', 'Unknown')}")
        else:
            print(f"   ❌ Quick test failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Quick test error: {e}")

    # Test 3: Basic Text Matching
    print("\n3. Testing text matching endpoint...")
    try:
        test_data = {
            "resume_text": "Python developer with Django and AWS experience",
            "job_description_text": "Looking for Python developer with cloud experience",
        }

        response = requests.post(f"{base_url}/match-text", json=test_data, timeout=20)

        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Text Matching: Success")
            print(f"   📊 Score: {result.get('relevance_score', 0):.2f}%")
            print(f"   🏆 Verdict: {result.get('verdict', 'Unknown')}")
            print(f"   ✅ Matched Skills: {len(result.get('matched_skills', []))}")
            print(f"   ❌ Missing Skills: {len(result.get('missing_skills', []))}")
        else:
            print(f"   ❌ Text matching failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"   ❌ Text matching error: {e}")

    print("\n🎉 API endpoint testing completed!")
    print("📋 Available endpoints:")
    print("   • GET  /api/matching/health")
    print("   • GET  /api/matching/test/quick")
    print("   • GET  /api/matching/test/comprehensive")
    print("   • POST /api/matching/match-text")
    print("   • POST /api/matching/match-pdf")
    print("   • POST /api/matching/batch-match")
    print("   • GET  /api/matching/config/default")


if __name__ == "__main__":
    # Wait a moment for server to be ready
    time.sleep(2)
    test_endpoints()
