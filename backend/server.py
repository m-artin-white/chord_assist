# Importing necessary modules and classes from FastAPI

# FastAPI is a modern web framework for building APIs with Python, known for its high performance.
# The `FastAPI` class is used to create an application instance, and `Form` is used to handle form data in API endpoints.
# Documentation: https://fastapi.tiangolo.com/
from fastapi import FastAPI, Form  

# The `JSONResponse` class is used to create custom JSON responses for API endpoints.
# Documentation: https://fastapi.tiangolo.com/advanced/custom-response/
from fastapi.responses import JSONResponse  

# The `CORSMiddleware` class is used to enable Cross-Origin Resource Sharing (CORS),
# allowing the API to handle requests from different origins, such as frontend applications.
# Documentation: https://fastapi.tiangolo.com/tutorial/cors/
from fastapi.middleware.cors import CORSMiddleware  

# Importing the LLM class from the `llm.py` module.
# This class interacts with the Large Language Model (Llama3.2) through the Ollama API.
# Ollama API documentation: https://ollama.com/docs
from llm import LLM


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
