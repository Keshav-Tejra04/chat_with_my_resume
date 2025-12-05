from fastapi import APIRouter, UploadFile, File, HTTPException, Body
from app.services.gemini_service import gemini_service
from app.core.config import settings
import os
import shutil
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    session_id: str = None

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """
    Uploads a resume and creates a new chat session.
    """
    try:
        file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        session_id = gemini_service.create_session(file_path)
        return {"session_id": session_id, "message": "Resume uploaded and session started."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
async def chat(request: ChatRequest):
    """
    Sends a message to the chat session.
    If no session_id is provided, tries to use the default resume session.
    """
    try:
        # If session_id is missing, we might want to start a default session
        # But for now, let's assume the frontend handles session_id or we create one
        if not request.session_id:
             # Create a default session if one doesn't exist for this user context
             # Since we don't have user auth, we just create a new session with default resume
             request.session_id = gemini_service.create_session()
             
        response_text = gemini_service.get_chat_response(request.session_id, request.message)
        return {"response": response_text, "session_id": request.session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
def health_check():
    return {"status": "ok"}
