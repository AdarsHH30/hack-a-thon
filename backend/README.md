# Innomatics Resume-Job Matching API

Professional API for resume-job matching with AI-powered analysis using FastAPI.

## 🚀 Quick Start

### Local Development

1. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Server**

   ```bash
   python main.py
   ```

   The server will start on `http://localhost:8001`

3. **Test the API**
   - `http://localhost:8001` - Welcome message
   - `http://localhost:8001/docs` - Interactive API documentation
   - `http://localhost:8001/health` - Health check

### Docker Deployment

1. **Build the Docker Image**

   ```bash
   docker build -t resume-matching-api .
   ```

2. **Run Locally with Docker**
   ```bash
   docker run -p 8001:8001 resume-matching-api
   ```

## 📋 Available Endpoints

| Method | Endpoint                | Description                                  |
| ------ | ----------------------- | -------------------------------------------- |
| GET    | `/`                     | Welcome message with API overview            |
| GET    | `/health`               | Health check                                 |
| POST   | `/api/job-description`  | Upload job description                       |
| POST   | `/api/resume`           | Upload resume                                |
| POST   | `/api/get-score`        | Get matching score (Direct Groq AI Analysis) |
| POST   | `/api/ai-analyze`       | AI-powered analysis                          |
| POST   | `/api/match`            | Manual match                                 |
| GET    | `/api/get-jobs`         | Get all jobs                                 |
| GET    | `/api/get-job/{job_id}` | Get job by ID                                |
| GET    | `/api/status`           | Service status                               |
| DELETE | `/api/reset`            | Reset service                                |

## � Deployment to Render

This project is configured for easy deployment to Render using Docker:

1. **Connect your GitHub repository** to Render
2. **Create a new Web Service** in Render
3. **Select Docker** as the runtime
4. **Set the following environment variables** (if needed):
   - Any API keys or configuration required by your app
5. **Deploy!** Render will automatically build and deploy using the Dockerfile

The app will be available at the URL provided by Render.

## 🔧 Configuration

- **Port**: 8001 (configurable via command line argument)
- **CORS**: Configured for localhost:3000 and localhost:3001
- **Environment Variables**: Load from `.env` file using python-dotenv

## 🧪 Testing

Use the interactive docs at `/docs` or test with curl:

```bash
# Health check
curl http://localhost:8001/health

# Get API info
curl http://localhost:8001/
```
