# FastAPI Server script

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from llm import LLM

app = FastAPI()
llm = LLM()

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
    noteOrChord: str = Form(...)        
):
    response = llm.query(query=text, chord=noteOrChord)
    return JSONResponse(content={"message": response})