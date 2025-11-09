# Keep Render Service Alive - Simple Solutions

Your backend now has `/health` and `/api/ping` endpoints that prevent sleeping.

## ✅ Easiest Solutions (No Coding Required)

### Option 1: UptimeRobot (Recommended - 100% Free)

1. Go to https://uptimerobot.com/
2. Sign up for free account
3. Click "Add New Monitor"
4. Settings:
   - Monitor Type: HTTP(s)
   - Friendly Name: "Hackathon Backend"
   - URL: `https://your-render-url.onrender.com/health`
   - Monitoring Interval: 5 minutes
5. Click "Create Monitor"

**That's it!** UptimeRobot will ping your service every 5 minutes forever (free).

### Option 2: Cron-job.org (Also Free)

1. Go to https://cron-job.org/
2. Sign up for free account
3. Create new cron job:
   - Title: "Keep Backend Alive"
   - Address: `https://your-render-url.onrender.com/health`
   - Schedule: Every 10 minutes (_/10 _ \* \* \*)
4. Save

### Option 3: BetterStack (Free tier available)

1. Go to https://betterstack.com/better-uptime
2. Sign up and add your URL
3. Set check interval to 5-10 minutes

## 🔧 Manual Option: Run Keep-Alive Script Locally

If you have a computer that's always on:

```bash
# Set your Render URL
export RENDER_URL="https://your-service.onrender.com"

# Run the keep-alive script
python keep_alive.py
```

This will ping your service every 10 minutes.

## 🚀 Best Practice

**Use UptimeRobot** - It's:

- 100% free
- No coding required
- Reliable
- Also monitors if your service goes down
- Sends email alerts if service is down

## 📝 Your Service URLs

After deploying to Render, replace these:

- Health Check: `https://your-service.onrender.com/health`
- Ping: `https://your-service.onrender.com/api/ping`

Both endpoints work to keep your service alive!
