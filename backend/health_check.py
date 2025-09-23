#!/usr/bin/env python3
"""
Health check script for deployed API
Usage: python health_check.py [URL]
"""

import sys
import requests
import json
from urllib.parse import urljoin

def check_endpoint(base_url, endpoint, method="GET", expected_status=200):
    """Check a specific endpoint"""
    url = urljoin(base_url, endpoint)
    
    try:
        if method == "GET":
            response = requests.get(url, timeout=10)
        elif method == "POST":
            response = requests.post(url, timeout=10)
        else:
            print(f"❌ Unsupported method: {method}")
            return False
        
        if response.status_code == expected_status:
            print(f"✅ {method} {endpoint} - {response.status_code}")
            return True
        else:
            print(f"❌ {method} {endpoint} - {response.status_code} (expected {expected_status})")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ {method} {endpoint} - Connection error: {e}")
        return False

def main():
    """Main health check function"""
    
    # Get URL from command line or use default
    if len(sys.argv) > 1:
        base_url = sys.argv[1]
    else:
        base_url = "http://localhost:8001"
    
    # Ensure URL ends with /
    if not base_url.endswith('/'):
        base_url += '/'
    
    print(f"🏥 Health Check for: {base_url}")
    print("=" * 50)
    
    # Define endpoints to check
    endpoints = [
        ("/", "GET", 200),
        ("/health", "GET", 200),
        ("/docs", "GET", 200),
        ("/api/status", "GET", 200),
    ]
    
    results = []
    
    for endpoint, method, expected_status in endpoints:
        result = check_endpoint(base_url, endpoint, method, expected_status)
        results.append((endpoint, result))
    
    print("\n" + "=" * 50)
    print("📊 Health Check Results:")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for endpoint, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {endpoint}: {status}")
    
    print(f"\n📈 Overall: {passed}/{total} endpoints healthy")
    
    if passed == total:
        print("🎉 All endpoints are healthy!")
        return 0
    else:
        print("⚠️ Some endpoints are not responding correctly.")
        return 1

if __name__ == "__main__":
    sys.exit(main())