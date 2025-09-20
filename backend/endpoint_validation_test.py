#!/usr/bin/env python3

import requests
import os
import time
import json


def test_api_endpoint():
    """Test the actual API endpoint"""

    try:
        # Wait a moment for server to be ready
        time.sleep(2)

        # Test 1: Check if server is running
        print("🔍 Testing server connection...")
        try:
            response = requests.get("http://localhost:8004/health", timeout=5)
            print(f"✅ Server is running: {response.status_code}")
        except requests.exceptions.ConnectionError:
            print("❌ Server is not responding")
            return False

        # Test 2: Test text upload first
        print("\n📝 Testing text upload...")
        text_data = {
            "jd_text": "Looking for a Python developer with 3+ years of experience in FastAPI and machine learning.",
            "company_name": "Test Company",
            "position_title": "Python Developer",
        }

        response = requests.post(
            "http://localhost:8004/api/job-description", data=text_data, timeout=10
        )
        print(f"📊 Text upload status: {response.status_code}")
        print(f"📄 Text upload response: {response.text}")

        # Test 3: Test PDF upload
        print("\n📄 Testing PDF upload...")
        pdf_path = "app/public/sample-pdfs/sample_jd_1.pdf"

        if not os.path.exists(pdf_path):
            print(f"❌ PDF file not found: {pdf_path}")
            return False

        with open(pdf_path, "rb") as f:
            files = {"jd_file": ("sample_jd_1.pdf", f, "application/pdf")}
            data = {"company_name": "Axion Ray", "position_title": "Software Engineer"}

            print(f"🚀 Sending PDF to http://localhost:8004/api/job-description")
            response = requests.post(
                "http://localhost:8004/api/job-description",
                files=files,
                data=data,
                timeout=30,
            )

            print(f"📊 PDF upload status: {response.status_code}")
            print(f"📄 PDF upload response: {response.text}")

            if response.status_code == 200:
                print("✅ PDF upload successful!")

                # Try to parse JSON response
                try:
                    json_response = response.json()
                    print(f"📋 Response details:")
                    print(f"   Source type: {json_response.get('source_type')}")
                    print(f"   Text length: {json_response.get('text_length')}")
                    print(f"   Message: {json_response.get('message')}")
                except:
                    print("⚠️ Response is not valid JSON")

                return True
            else:
                print(f"❌ PDF upload failed with status {response.status_code}")
                print(f"❌ Error details: {response.text}")
                return False

    except requests.exceptions.Timeout:
        print("❌ Request timed out")
        return False
    except Exception as e:
        print(f"❌ Error during API test: {str(e)}")
        return False


if __name__ == "__main__":
    print("🧪 Testing API endpoint...")
    success = test_api_endpoint()

    if success:
        print("\n🎉 API test PASSED!")
    else:
        print("\n💥 API test FAILED!")
