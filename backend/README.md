## How to get Ollama LLM running on local system:

### Steps: 

1. Download Ollama for your system here: https://ollama.com/
2. Run this command in terminal to get the Llama3.2:3B model: ollama pull llama3.2:3b  # for the 3B model
3. 'pip install -r requirements.txt' to download required libaries.
4. Run script as normal.

## How to run the FastAPI Server on your local system:

### Steps:

1. cd in the backend folder.
2. Run uvicorn server:app --reload in terminal.