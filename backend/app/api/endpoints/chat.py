from fastapi import APIRouter, UploadFile, File, HTTPException, Body
from app.services.gemini_service import gemini_service
from app.core.config import settings
import os
import shutil
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    file_uri: Optional[str] = None

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """
    Uploads a resume and creates a new chat session.
    """
    try:
        file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        session_id, file_uri = gemini_service.create_session(file_path=file_path)
        
        # Cleanup: Delete the local file after uploading to Gemini
        # We don't want to store user resumes permanently on the server
        try:
            os.remove(file_path)
        except Exception as e:
            print(f"Error deleting temp file: {e}")

        return {"session_id": session_id, "file_uri": file_uri, "message": "Resume uploaded and session started."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
async def chat(request: ChatRequest):
    """
    Sends a message to the chat session.
    If no session_id is provided, tries to use the default resume session.
    """
    try:
        if not request.session_id:
             # Create a default session if one doesn't exist for this user context
             session_id, _ = gemini_service.create_session(file_uri=request.file_uri)
             request.session_id = session_id
             
        response_text, new_session_id = gemini_service.get_chat_response(request.session_id, request.message, request.file_uri)
        
        return {"response": response_text, "session_id": new_session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
def health_check():
    return {"status": "ok"}
