from fastapi import FastAPI, File, UploadFile
from services.chat_service import ChatProcessor

chat_processor = ChatProcessor()

@app.post("/chat")
async def chat_exchange(chat_history: List[ChatMessage]):
    response = chat_processor.process_chat_history(chat_history)
    return response


