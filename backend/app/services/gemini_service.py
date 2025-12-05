import os
import google.generativeai as genai
from app.core.config import settings
import uuid
from app.core.prompts import SYSTEM_INSTRUCTION, DEFAULT_RESUME_INSTRUCTION

# Configure Gemini
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

class GeminiService:
    def __init__(self):
        self.sessions = {} # In-memory storage: {session_id: chat_session_object}
        self.default_resume_path = os.path.join(settings.UPLOAD_DIR, settings.DEFAULT_RESUME_FILENAME)
        self.default_model = None
        self.default_file = None
        self._initialize_default_session()

    def _initialize_default_session(self):
        """Pre-loads the default resume if available."""
        if os.path.exists(self.default_resume_path):
            print(f"Loading default resume from {self.default_resume_path}")
            try:
                gemini_file = genai.upload_file(self.default_resume_path, mime_type="application/pdf")
                
                self.default_model = genai.GenerativeModel(
                    model_name="gemini-2.0-flash",
                    generation_config=settings.GENERATION_CONFIG,
                    system_instruction=DEFAULT_RESUME_INSTRUCTION
                )
                # We don't start a chat here, we start it per user session
                self.default_file = gemini_file
            except Exception as e:
                print(f"Error loading default resume: {e}")

    def create_session(self, file_path: str = None, file_uri: str = None):
        """Creates a new chat session. If file_path is None, uses default resume."""
        session_id = str(uuid.uuid4())
        
        target_file = None
        current_system_instruction = ""
        
        if file_uri:
            # Reuse existing file from Gemini
            try:
                target_file = genai.get_file(file_uri)
                current_system_instruction = SYSTEM_INSTRUCTION
            except Exception as e:
                print(f"Error retrieving file from URI: {e}")
                raise Exception("Invalid file context.")

        elif file_path:
            # User uploaded file
            gemini_file = genai.upload_file(file_path, mime_type="application/pdf")
            target_file = gemini_file
            current_system_instruction = SYSTEM_INSTRUCTION
        elif self.default_file:
            # Default resume
            target_file = self.default_file
            current_system_instruction = DEFAULT_RESUME_INSTRUCTION
        else:
            raise Exception("No resume available to chat with.")

        model = genai.GenerativeModel(
            model_name="gemini-2.0-flash",
            generation_config=settings.GENERATION_CONFIG,
            system_instruction=current_system_instruction
        )

        chat = model.start_chat(
            history=[
                {
                    "role": "user",
                    "parts": [target_file, "Here is the resume context."]
                },
                {
                    "role": "model",
                    "parts": ["Understood. I have analyzed the resume. I am ready to answer questions about it."]
                }
            ]
        )
        
        self.sessions[session_id] = chat
        return session_id, target_file.uri

    def get_chat_response(self, session_id: str, message: str, file_uri: str = None):
        if session_id not in self.sessions:
             # If session not found, try to create a new one with the provided file_uri
             session_id, _ = self.create_session(file_uri=file_uri)
        
        chat = self.sessions[session_id]
        response = chat.send_message(message)
        return response.text, session_id

gemini_service = GeminiService()
