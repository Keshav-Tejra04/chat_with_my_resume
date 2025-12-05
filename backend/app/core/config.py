import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Chat with Resume"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    UPLOAD_DIR: str = os.path.join(os.getcwd(), "uploads")
    DEFAULT_RESUME_FILENAME: str = "Keshav_Tejra_Resume.pdf"
    
    # Gemini Config
    GENERATION_CONFIG = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
    }

settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
