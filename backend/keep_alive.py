"""
Keep-Alive Script for Render Deployment

This script pings your Render service every 10 minutes to prevent it from sleeping.
You can run this locally or deploy it to a service like:
- Render (as a separate cron job)
- GitHub Actions
- Heroku Scheduler
- Any other cron service

Alternatively, use external services like:
- UptimeRobot (https://uptimerobot.com/) - Free monitoring every 5 minutes
- Cron-job.org (https://cron-job.org/) - Free scheduled requests
- BetterUptime (https://betterstack.com/better-uptime)
"""

import requests
import time
import os
from datetime import datetime

# Your Render service URL
RENDER_URL = os.getenv("RENDER_URL", "https://your-service.onrender.com")


def ping_service():
    """Ping the service to keep it alive"""
    endpoints_to_ping = [
        f"{RENDER_URL}/health",
        f"{RENDER_URL}/api/ping",
    ]

    for endpoint in endpoints_to_ping:
        try:
            print(f"[{datetime.now().isoformat()}] Pinging {endpoint}...")
            response = requests.get(endpoint, timeout=30)

            if response.status_code == 200:
                print(f"✓ Success! Status: {response.status_code}")
                print(f"  Response: {response.json()}")
            else:
                print(f"✗ Failed! Status: {response.status_code}")

        except Exception as e:
            print(f"✗ Error pinging {endpoint}: {e}")

        print("-" * 50)


def main():
    """Main loop - runs every 10 minutes"""
    print("=" * 50)
    print("Keep-Alive Script Started")
    print(f"Target URL: {RENDER_URL}")
    print("=" * 50)

    while True:
        ping_service()
        # Sleep for 10 minutes (600 seconds)
        # Render sleeps after 15 minutes of inactivity
        print(f"\nSleeping for 10 minutes...\n")
        time.sleep(600)


if __name__ == "__main__":
    main()
