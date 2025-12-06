# Chat With My Resume

Interact with your resume using AI. This application allows you to upload a PDF resume and chat with it to extract information, ask questions, and get insights using Google's Gemini AI.

## Features

*   **PDF Upload**: Securely upload your resume (PDF format).
*   **AI Chat**: Ask questions about the resume content (e.g., "What is the candidate's experience with Python?").
*   **Smart Parsing**: Uses Google's Gemini AI to understand context and details.
*   **Modern UI**: Clean, responsive interface built with React and Tailwind CSS.

## Tech Stack

*   **Frontend**: React, Vite, Tailwind CSS, Framer Motion
*   **Backend**: Python, FastAPI, Uvicorn
*   **AI**: Google Generative AI (Gemini)

## Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

*   **Node.js**: v18 or higher
*   **Python**: v3.9 or higher
*   **Gemini API Key**: Get one from [Google AI Studio](https://aistudio.google.com/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/chat_with_my_resume.git
    cd chat_with_my_resume
    ```

2.  **Backend Setup**

    Navigate to the backend directory:
    ```bash
    cd backend
    ```

    Create a virtual environment:
    ```bash
    # Windows
    python -m venv venv
    .\venv\Scripts\activate

    # macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

    Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

    Create a `.env` file in the `backend` directory:
    ```env
    GEMINI_API_KEY=your_actual_api_key_here
    ALLOWED_ORIGINS=http://localhost:5173
    ```

    Start the backend server:
    ```bash
    uvicorn main:app --reload
    ```
    The backend will run on `http://localhost:8000`.

3.  **Frontend Setup**

    Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```

    Install dependencies:
    ```bash
    npm install
    ```

    (Optional) Create a `.env` file in the `frontend` directory if you need to override the API URL:
    ```env
    VITE_API_URL=http://localhost:8000/api
    ```

    Start the frontend development server:
    ```bash
    npm run dev
    ```
    The frontend will usually run on `http://localhost:5173`.

### Running the App

1.  Ensure both the Backend (port 8000) and Frontend (port 5173) terminals are running.
2.  Open your browser and go to `http://localhost:5173`.
3.  Upload a PDF resume and start chatting!

## Deployment

*   **Frontend**: Ready for Vercel/Netlify. Configure `VITE_API_URL` in your project settings.
*   **Backend**: Ready for Render/Railway. Configure `GEMINI_API_KEY` and `ALLOWED_ORIGINS` in your environment variables.
