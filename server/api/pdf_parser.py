from openai import OpenAI
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
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

from PyPDF2 import PdfReader
from datetime import datetime
import uuid
import io

import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PyPDF2 import PdfReader
from datetime import datetime
import uuid

from dotenv import load_dotenv

from pinecone import Pinecone

load_dotenv()
client = OpenAI()

index_name = "example-index2"
namespace_name = "example-namespace"

keyB = os.getenv("PINECONE_API_KEY")

#pc = Pinecone(api_key=keyB)
#index = pc.Index(index_name)

app = FastAPI()

# Enum for data source types
class DataSource(str, Enum):
    audio = "audio"
    pdf = "pdf"
    typed_notes = "typed-notes"

async def process_pdf(file_path):
    print("crazy")
    try:
        with open(file_path, "rb") as file:
            reader = PdfReader(file)
            TEXTS = []
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                a = (page.extract_text()).split("\n\n")
                TEXTS.append(a)
            TEXTS = [item for l in TEXTS for item in l]
            return "\n".join(TEXTS)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Helper function to save files
async def save_file(client_id: int, course_id: str, lecture_id: str, file: UploadFile, file_type: str) -> str:
    file_path = f"uploaded_files/{client_id}-{course_id}-{lecture_id}-{file_type}"

    try:
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    if not os.path.exists(file_path):
        raise HTTPException(status_code=500, detail="File was not saved successfully.")
    
    try:
        PdfReader(file_path)
    except Exception as e:
        print(f"expection:{e}" )
        raise HTTPException(status_code=400, detail=f"Error validating PDF: Invalid or corrupted PDF file. {e}")
    
    

    return file_path

@app.post("/upload-data/{client_id}/{course_id}/{lecture_id}/{doctype}")
async def upload_data(client_id: str, course_id: str, lecture_id: str, doctype: str, file: UploadFile = File(...)):
    file_path = await save_file(client_id, course_id, lecture_id, file, doctype)
    return {
            "message": "Data processed successfully!",
            "path": file_path,
            "embedding_stored": True
            }

@app.get("/files/{client_id}/{course_id}/{lecture_id}/{file_type}")
async def get_pdf_file(client_id: str, course_id: str, lecture_id: str, file_type : str):
    """
    Endpoint to retrieve raw data files (audio, pdf, typed_text)
    """
    file_path = f"uploaded_files/{client_id}-{course_id}-{lecture_id}-{file_type}"
    result = await process_pdf(file_path)
    print(result)
    return result

# main.py

#app = FastAPI(title="PDF to Text Converter API")

# Directory to save the extracted text files
TEXT_SAVE_DIRECTORY = "extracted_texts"

# Ensure the directory exists
os.makedirs(TEXT_SAVE_DIRECTORY, exist_ok=True)

@app.post("/upload-pdf/{client_id}/{course_id}/{lecture_id}/{doctype}")
async def upload_pdf(client_id: str, course_id: str, lecture_id: str, doctype: str, file: UploadFile = File(...)):
    """
    Endpoint to upload a PDF file, extract text, save it, and confirm success.
    """
    # Validate file type
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF file.")

    try:
        client = OpenAI()
        EMBEDDING_SIZE = 3072
        clid = client_id
        COURSE_ID = [clid] * EMBEDDING_SIZE
        lid = lecture_id
        LECTURE_ID = [lid] * EMBEDDING_SIZE
        cid = course_id
        CLIENT_ID = [cid] * EMBEDDING_SIZE
        doctype = "pdf"
        DOCUMENT_TYPE = [doctype] * EMBEDDING_SIZE


        def get_embedding(text, model="text-embedding-3-large"):
            text = text.replace("\n", " ")
            return client.embeddings.create(input=[text], model=model).data[0].embedding


        pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

        index = pc.Index("example-index2")
        #file_path = os.path.join("/Users/thomaskanz/Documents/CMU/Hackathons/HackHarvard/server/api", file.filename)
        await file.seek(0)
    
        # Use the file-like object provided by UploadFile
        reader = PdfReader(file.file)
        TEXTS = []
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            a = (page.extract_text()).split("\n\n")
            TEXTS.append(a)
        TEXTS = [item for l in TEXTS for item in l]

        EMBEDDINGS = [get_embedding(text) for text in TEXTS]
        IDS = [str(i) for i in range(1, EMBEDDING_SIZE + 1)]
        combined = list(zip(IDS, CLIENT_ID, COURSE_ID, LECTURE_ID, TEXTS, EMBEDDINGS, DOCUMENT_TYPE))

        vectors = [
                {
                    "id": id,
                    "values": embedding,
                    "metadata": {"client_id": clientid, "course_id": courseid, "lecture_id": lectureid, "text": text, "document_type": doctype}
                }
                for (id, clientid, courseid, lectureid, text, embedding, doctype) in combined
            ]
        index.upsert(
            vectors=vectors
        )
        print("SUCCESS")

        
        
        '''
        # Read file content into memory
        contents = await file.read()

        # Use PdfReader to extract text
        reader = PdfReader(io.BytesIO(contents))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""

        if not text.strip():
            raise HTTPException(status_code=400, detail="No text found in the PDF.")

        # Generate a unique filename
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        unique_id = uuid.uuid4().hex
        txt_filename = f"text_{timestamp}_{unique_id}.txt"
        txt_filepath = os.path.join(TEXT_SAVE_DIRECTORY, txt_filename)

        # Save the extracted text to a .txt file
        with open(txt_filepath, "w", encoding="utf-8") as txt_file:
            txt_file.write(text)
        '''
        # Optionally, you can return the path or URL to the saved file
        #return JSONResponse(
        ##    status_code=200,
        #    content={
        #        "message": "PDF processed and text extracted successfully.",
        #        "text_file": txt_filename
        #    }
        #)

    except Exception as e:
        # Log the exception if needed
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    return None

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
    

