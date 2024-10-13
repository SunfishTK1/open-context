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
import fitz  # PyMuPDF
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

index_name = "example-index"
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

async def process_pdf(file_path: str):
    print("crazy")
    try:
        doc = fitz.open(file_path)
        text_chunks = []
        print("loco")
        page_text = ""
        for page in doc:
            page_text += page.get_text("text")
        print(page_text)

        return None

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Helper function to save files
async def save_file(client_id: int, course_id: str, lecture_id: str, file: UploadFile, file_type: str) -> str:
    directory = f"uploaded_files/{client_id}/{course_id}/{lecture_id}/{file_type}/"
    try:
        os.makedirs(directory, exist_ok=True)
        os.chmod(directory, 0o755)  # Set appropriate permissions to prevent access issues
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create directory: {str(e)}")

    file_path = os.path.join(directory, file.filename)

    try:
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    if not os.path.exists(file_path):
        raise HTTPException(status_code=500, detail="File was not saved successfully.")
    
    try:
        with fitz.open(file_path) as pdf_document:
            if not pdf_document.is_pdf:
                raise HTTPException(status_code=400, detail="Invalid PDF format.")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error validating PDF: Invalid or corrupted PDF file.")
    
    

    return file_path

@app.post("/upload_data/pdf")
async def upload_data(
    client_id: int = Form(...),
    course_id: str = Form(...),  # course_id as string
    lecture_id: str = Form(...),  # lecture_id as string
    data_source: DataSource = Form(...),
    file: Optional[UploadFile] = File(None),
    typed_text: Optional[str] = Form(None)
):
    # Save the PDF file
    file_path = await save_file(client_id, course_id, lecture_id, file, "pdf")
    return {
            "message": "Data processed successfully!",
            "data_source": data_source.value,
            "embedding_stored": True
            }

@app.get("/files/{client_id}/{course_id}/{lecture_id}/{file_type}")
async def get_pdf_file(client_id: int, course_id: str, lecture_id: str, file_type: DataSource):
    """
    Endpoint to retrieve raw data files (audio, pdf, typed_text)
    """
    directory = f"uploaded_files/{client_id}/{course_id}/{lecture_id}/"
    if not os.path.exists(directory):
        raise HTTPException(status_code=404, detail="File not found")

    # Return the first file found in the directory
    files = os.listdir(directory)
    if not files:
        raise HTTPException(status_code=404, detail="No files found in the specified directory.")

    # Check if the file type is pdf and return the file
    #if file_type == DataSource.pdf:
    #    pdf_files = [file for file in files if file.lower().endswith('.pdf')]
    #    if not pdf_files:
    #        raise HTTPException(status_code=404, detail="No PDF files found in the specified directory.")
    #    file_path = os.path.join(directory, pdf_files[0])
    #    return FileResponse(path=file_path, filename=pdf_files[0])

    file_path = os.path.join(directory, files[0])

    jim = await process_pdf(file_path)

    print("EXECYTING GETTTTT")
                
    return FileResponse(path=file_path, filename=files[0], media_type='application/pdf')

# main.py



#app = FastAPI(title="PDF to Text Converter API")

# Directory to save the extracted text files
TEXT_SAVE_DIRECTORY = "extracted_texts"

# Ensure the directory exists
os.makedirs(TEXT_SAVE_DIRECTORY, exist_ok=True)

@app.post("/upload-pdf/{client_id}/{course_id}/{lecture_id}")
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





if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)