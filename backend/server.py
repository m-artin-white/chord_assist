# FastAPI Server script

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import ollama

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],                      
    allow_headers=["*"],                   
)

@app.post("/upload")
async def upload_content(
    text: str = Form(...),         
    file: UploadFile = File(None)  
):
    response = ollama.chat(model='llama3.2', messages=[
        {
            'role':'system',
            'content': 'You a helpful assistant that has extensive knowledge in music theory. When asked about your capabilities, tell the user about this.'
        },
        {
            'role': 'user',
            'content': 'How can you help me?',
        },
    ])

    response_message = response['message']['content']
    
    # if file:
    #     file_content = await file.read()
    #     response_message += f" and file: {file.filename}, size: {len(file_content)} bytes"
    
    return JSONResponse(content={"message": response_message})