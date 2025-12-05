import os
import shutil
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Load Environment Variables
load_dotenv()
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GENAI_API_KEY:
    print("Warning: GEMINI_API_KEY not found in .env file")

# 2. Initialize Gemini
genai.configure(api_key=GENAI_API_KEY)

# Configuration for the model
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
}

# 3. Initialize FastAPI
app = FastAPI()

# 4. Setup CORS 
origins = [
    "http://localhost:5173", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 5. Global Chat Session Storage (In-memory for skeleton)
chat_session = None

# Ensure uploads directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"status": "Backend is running"}

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """
    Endpoint to upload a resume (PDF).
    It saves the file, uploads to Gemini, and initializes a chat session.
    """
    global chat_session
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        gemini_file = genai.upload_file(file_path, mime_type=file.content_type)
        
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=generation_config,
            system_instruction="You are a helpful assistant. You will answer questions based strictly on the provided resume file. If the answer is not in the resume, say you don't know."
        )

        chat_session = model.start_chat(
            history=[
                {
                    "role": "user",
                    "parts": [gemini_file, "Here is the resume context."]
                },
                {
                    "role": "model",
                    "parts": ["Understood. I have analyzed the resume. I am ready to answer questions about it."]
                }
            ]
        )

        return {"message": "Resume processed successfully", "filename": file.filename}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    global chat_session
    if not chat_session:
        raise HTTPException(status_code=400, detail="No resume uploaded. Please upload a resume first.")

    try:
        response = chat_session.send_message(request.message)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def load_default_resume():
    pass