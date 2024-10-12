from fastapi import FastAPI, File, UploadFile

app = FastAPI()

@app.post("/upload/text")
async def upload_text_file(
    client_id: str,
    course_id: str,
    lecture_id: str,
    file: UploadFile = File(...)
):
    # Save the file and update database records
    return {"message": "Text file uploaded successfully"}


@app.post("/upload/pdf")
async def upload_pdf_file(
    client_id: str,
    course_id: str,
    lecture_id: str,
    file: UploadFile = File(...)
):
    file_location = f"files/{client_id}/{course_id}/{lecture_id}/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # Update database records with file info
    return {"message": "PDF file uploaded successfully", "file_location": file_location}

@app.post("/upload/audio")
async def upload_audio_file(
    client_id: str,
    course_id: str,
    lecture_id: str,
    file: UploadFile = File(...)
):
    # Save the file and update database records
    return {"message": "Audio file uploaded successfully"}

from fastapi import WebSocket

@app.websocket("/upload/audio_stream")
async def upload_audio_stream(
    websocket: WebSocket,
    client_id: str,
    course_id: str,
    lecture_id: str
):
    await websocket.accept()
    with open("audio_stream.wav", "wb") as f:
        while True:
            data = await websocket.receive_bytes()
            if not data:
                break
            f.write(data)
    # Save the file and update database records
    await websocket.send_text("Audio stream uploaded successfully")
    await websocket.close()
