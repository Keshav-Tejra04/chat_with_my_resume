import os
import google.generativeai as genai
from app.core.config import settings
import uuid

# Configure Gemini
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

class GeminiService:
    def __init__(self):
        self.sessions = {} # In-memory storage: {session_id: chat_session_object}
        self.default_resume_path = os.path.join(settings.UPLOAD_DIR, settings.DEFAULT_RESUME_FILENAME)
        self.default_model = None
        self._initialize_default_session()

    def _initialize_default_session(self):
        """Pre-loads the default resume if available."""
        if os.path.exists(self.default_resume_path):
            print(f"Loading default resume from {self.default_resume_path}")
            try:
                # Upload to Gemini (or check if already uploaded - for now just upload)
                # In production, you'd want to cache the file URI
                gemini_file = genai.upload_file(self.default_resume_path, mime_type="application/pdf")
                
                self.default_model = genai.GenerativeModel(
                    model_name="gemini-2.0-flash",
                    generation_config=settings.GENERATION_CONFIG,
                    system_instruction="You are a helpful assistant representing Keshav Tejra. Answer questions based on the provided resume. Be professional and concise."
                )
                # We don't start a chat here, we start it per user session
                self.default_file = gemini_file
            except Exception as e:
                print(f"Error loading default resume: {e}")

    def create_session(self, file_path: str = None):
        """Creates a new chat session. If file_path is None, uses default resume."""
        session_id = str(uuid.uuid4())
        
        target_file = None
        
        if file_path:
            # User uploaded file
            gemini_file = genai.upload_file(file_path, mime_type="application/pdf")
            target_file = gemini_file
            system_instruction = "You are a helpful assistant. Answer questions based on the provided resume."
        elif self.default_file:
            # Default resume
            target_file = self.default_file
            system_instruction = "You are a helpful assistant representing Keshav Tejra. Answer questions based on the provided resume."
        else:
            raise Exception("No resume available to chat with.")

        model = genai.GenerativeModel(
            model_name="gemini-2.0-flash",
            generation_config=settings.GENERATION_CONFIG,
            system_instruction=system_instruction
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
        return session_id

    def get_chat_response(self, session_id: str, message: str):
        if session_id not in self.sessions:
             # If session not found, try to create a default one (fallback)
             # This is simple logic for now
             session_id = self.create_session()
        
        chat = self.sessions[session_id]
        response = chat.send_message(message)
        return response.text

gemini_service = GeminiService()
