# Chord Assist
This README file contains information on how to set up the Chord Assist application on your local machine for development.

***Follow the steps in order to ensure everything works.***

# Backend Setup:
### Ollama Setup:
- To use the chatbot while running the application you will need to setup Ollama on your local machine.
- You will need to install Ollama and the specific model you intend to use with the library for this to work.

### Steps: 

1. Download Ollama for your system here: https://ollama.com/
2. Run this command in terminal to get the Llama3.2 model: **"ollama pull llama3.2:3b"** 
3. 'pip install -r requirements.txt' to download required libaries.

___

### FastAPI Setup
- FastAPI is the server that hosts the routes for using the backend Python scripts.
- API calls are made to the routes from the frontend.
- There is currently only one route, which acts as route for sending queries directly to the LLM for processing and response generation.

### Steps:

1. cd into the backend folder.
2. There is no need to run "pip install -r requirements.txt" if you've done this already for the Ollama step.
3. Run uvicorn server:app --reload in terminal.
4. The server is now running on port 8000. The frontend will be able to send requests its routes.


# Frontend Setup:
### Setting up React + Vite:
- React + Vite is just standard React and built with Vite.

### Steps:
1. Ensure you have Node.js >= 20.16.0 installed.
2. Open up terminal in VSCode.
3. cd into the 'frontend' folder.
4. Run 'npm install'.
5. Run the commands that are stored in the 'requirements.txt' in the frontend folder. This will install the required libraries for the React-app to run. You will have to run a command like so "npm install axios @popperjs/core react-bootstrap ...". Ensure you install all libraries within requirements.txt.
6. To run the application run 'npm run dev' in the terminal.
7. Open up 'localhost:5173' in your browser to view application.