from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI

import os
import load_dotenv

load_dotenv()

app = FastAPI()

# Define the request body model
class ChatRequest(BaseModel):
    messages: list

# Initialize OpenAI API key
client = OpenAI()

@app.post("/chat/completions")
async def chat_completions(request: ChatRequest):
    response = client.chat.completions.create(
    model="gpt-4o",
    messages=request.messages
)
    return response.choices[0].message["content"]

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


"""
curl -X POST "http://localhost:8000/chat/completions" -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"Hello!"}]}'
"""