from fastapi import FastAPI
from routers import upload, retrieve, chat

app = FastAPI()

app.include_router(upload.router, prefix="/upload")
app.include_router(retrieve.router)
app.include_router(chat.router)
