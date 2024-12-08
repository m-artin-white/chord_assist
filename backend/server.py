# FastAPI Server script

from fastapi import FastAPI, Form  # Importing FastAPI framework and Form handling
from fastapi.responses import JSONResponse  # Importing JSONResponse for structured responses
from fastapi.middleware.cors import CORSMiddleware  # Importing CORS middleware for cross-origin requests
from llm import LLM  # Importing the custom LLM class for querying the language model

# Initialize the FastAPI app
app = FastAPI()

# Create an instance of the LLM class
llm = LLM()

# Add CORS middleware to allow cross-origin requests from specified origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow requests only from the specified frontend URL
    allow_credentials=True,                  # Allow credentials such as cookies or HTTP authentication
    allow_methods=["*"],                     # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],                     # Allow all HTTP headers
)

@app.post("/upload")
async def upload_content(
    text: str = Form(...),           # Expect a 'text' parameter from the form data
    noteOrChord: str = Form(...)     # Expect a 'noteOrChord' parameter from the form data
):
    """
    Endpoint to handle uploading content and querying the language model.

    Args:
        text (str): The user's input text (query).
        noteOrChord (str): The chord or note information provided by the user.

    Returns:
        JSONResponse: A JSON response containing the model's message.
    """
    # Use the LLM class to query the model with the provided text and note/chord
    response = llm.query(query=text, chord=noteOrChord)
    # Return the model's response as a JSON object
    return JSONResponse(content={"message": response})
