from openai import OpenAI
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
import tempfile
from fastapi.responses import FileResponse
from pymilvus import (
    Collection,
    FieldSchema,
    CollectionSchema,
    DataType,
    connections,
)
import aiofiles
import os
import numpy as np
from enum import Enum
from typing import Optional, List

from fastapi.middleware.cors import CORSMiddleware

from datetime import datetime
import uuid

from dotenv import load_dotenv

from pinecone import Pinecone

load_dotenv()
client = OpenAI()

index_name = "example-index2"
namespace_name = "example-namespace"

keyB = os.getenv("PINECONE_API_KEY")

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Enum for data source types
class DataSource(str, Enum):
    audio = "audio"
    typed_notes = "typed-notes"


# Helper function to save files
async def save_file(client_id: int, course_id: str, lecture_id: str, file: UploadFile, file_type: str) -> str:
    file_path = f"uploaded_files/{client_id}-{course_id}-{lecture_id}-{file_type}"

    try:
        async with aiofiles.open(file_path, "wb") as out_file:
            content = await file.read()
            await out_file.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    if not os.path.exists(file_path):
        raise HTTPException(status_code=500, detail="File was not saved successfully.")

    return file_path


@app.post("/upload-data/{client_id}/{course_id}/{lecture_id}/{doctype}")
async def upload_data(client_id: str, course_id: str, lecture_id: str, doctype: str, file: UploadFile = File(...)):
    file_path = await save_file(client_id, course_id, lecture_id, file, doctype)
    return {"message": "Data processed successfully!", "path": file_path, "embedding_stored": True}


@app.get("/files/{client_id}/{course_id}/{lecture_id}/{file_type}")
async def get_audio_file(client_id: str, course_id: str, lecture_id: str, file_type: str):
    """
    Endpoint to retrieve raw data files (audio, typed_text)
    """
    file_path = f"uploaded_files/{client_id}-{course_id}-{lecture_id}-{file_type}"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)


# main.py

# app = FastAPI(title="Audio to Text Converter API")

# Directory to save the extracted text files
TEXT_SAVE_DIRECTORY = "extracted_texts"

# Ensure the directory exists
os.makedirs(TEXT_SAVE_DIRECTORY, exist_ok=True)


@app.post("/upload-audio/{client_id}/{course_id}/{lecture_id}/{file_type}")
async def upload_audio(client_id: str, course_id: str, lecture_id: str, file_type: str, file: UploadFile = File(...)):
    """
    Endpoint to upload an MP3 file, transcribe audio using Whisper, embed text, and store data.
    """
    try:
        client = OpenAI()
        EMBEDDING_SIZE = 3072
        clid = client_id
        COURSE_ID = [clid] * EMBEDDING_SIZE
        lid = lecture_id
        LECTURE_ID = [lid] * EMBEDDING_SIZE
        cid = course_id
        CLIENT_ID = [cid] * EMBEDDING_SIZE
        DOCUMENT_TYPE = [file_type] * EMBEDDING_SIZE
        
        def get_embedding(text, model="text-embedding-3-large"):
            text = text.replace("\n", " ")
            return client.embeddings.create(input=[text], model=model).data[0].embedding

        pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

        index = pc.Index("example-index2")
        await file.seek(0)

        file_path = f"uploaded_files/{client_id}-{course_id}-{lecture_id}-{file_type}"
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(await file.read())

        with open('./temp.mp3','wb') as temp_file:
            temp_file.write(await file.read())
        with open('./temp.mp3','rb') as temp_file:      
            print(f"Transcribing...")
            transcription = client.audio.transcriptions.create(model="whisper-1", file=temp_file)
        print("Transcribe success!")
        TEXTS = transcription.text.split("\n\n")
        TEXTS = [item for l in TEXTS for item in l.split("\n")]

        if not TEXTS:
            raise HTTPException(status_code=400, detail="No text found in the audio.")

        EMBEDDINGS = [get_embedding(text) for text in TEXTS]
        IDS = [str(uuid.uuid4()) for _ in range(len(EMBEDDINGS))]
        combined = list(
            zip(
                IDS,
                CLIENT_ID[: len(EMBEDDINGS)],
                COURSE_ID[: len(EMBEDDINGS)],
                LECTURE_ID[: len(EMBEDDINGS)],
                TEXTS,
                EMBEDDINGS,
                DOCUMENT_TYPE[: len(EMBEDDINGS)],
            )
        )

        vectors = [
            {
                "id": id,
                "values": embedding,
                "metadata": {
                    "client_id": clientid,
                    "course_id": courseid,
                    "lecture_id": lectureid,
                    "text": text,
                    "document_type": file_type,
                },
            }
            for (id, clientid, courseid, lectureid, text, embedding, file_type) in combined
        ]
        index.upsert(vectors=vectors)
        print("SUCCESS")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    return {"message": "Audio processed and text embedded successfully."}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001)
