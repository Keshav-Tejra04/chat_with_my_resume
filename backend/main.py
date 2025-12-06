import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import chat
from dotenv import load_dotenv

# 1. Load Environment Variables
load_dotenv()

# 2. Initialize FastAPI
app = FastAPI(title="Resume Chat API")

# 3. Setup CORS
# Get allowed origins from env var (comma separated) or default to localhost
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_env:
    origins = [origin.strip() for origin in allowed_origins_env.split(",")]
else:
    origins = [
        "http://localhost:5173",
        "http://localhost:5174", 
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles

# 4. Include Routers
app.include_router(chat.router, prefix="/api")

# 5. Serve Static Files (Uploads)
# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"status": "Backend is running"}

from fastapi.responses import FileResponse

@app.get("/api/download-resume")
async def download_resume():
    file_path = "uploads/Keshav_Tejra_Resume.pdf"
    if os.path.exists(file_path):
        return FileResponse(file_path, filename="Keshav_Tejra_Resume.pdf", media_type="application/pdf")
    return {"error": "Resume not found"}