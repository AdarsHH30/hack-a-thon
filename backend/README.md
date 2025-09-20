# Backend API

A simple FastAPI backend with test routes.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install fastapi uvicorn
```

### 2. Run the Server

```bash
python main.py
```

The server will start on `http://localhost:8001`

### 3. Test the API

Open your browser and visit:

- `http://localhost:8001` - Welcome message
- `http://localhost:8001/docs` - Interactive API documentation
- `http://localhost:8001/health` - Health check

## 📋 Available Routes

| Method | Endpoint                 | Description        |
| ------ | ------------------------ | ------------------ |
| GET    | `/`                      | Welcome message    |
| GET    | `/health`                | Health check       |
| GET    | `/api/test/`             | Simple test        |
| GET    | `/api/test/hello`        | Hello world        |
| GET    | `/api/test/hello/{name}` | Personalized hello |
| POST   | `/api/test/echo`         | Echo back data     |
| GET    | `/api/test/status`       | Service status     |

## 🔧 Troubleshooting

### Port Already in Use?

If port 8001 is busy, run with a different port:

```bash
python main.py 8002
```

### Python Command Not Found?

Try using `python3` instead:

```bash
python3 main.py
```

### Missing FastAPI?

Install it:

```bash
pip install fastapi uvicorn
```

## 🧪 Test Examples

### GET Request

```
curl http://localhost:8001/api/test/hello/John
```

### POST Request

```
curl -X POST http://localhost:8001/api/test/echo \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello World"}'
```

That's it! 🎉
