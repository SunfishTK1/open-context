from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
from fastapi.responses import JSONResponse
from fastapi.responses import *

import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Define the request body model
class ChatRequest(BaseModel):
    messages: list

# Initialize OpenAI API key
client = OpenAI()

@app.post("/chat/completions")
async def chat_completions(request: ChatRequest):
    message_list = request.messages
    response = client.chat.completions.create(
    model="gpt-4o",
    messages=request.messages
    )
    message_list.append({'role':'assistant', 'content': str(response.choices[0].message.content)})
    print({'role':'assistant', 'content': str(response.choices[0].message.content)})
    return message_list
    '''
    return JSONResponse(
            status_code=200,
            content={
                "text": "Success",
                "data": response.messages.append(response.choices[0].message)
            }
        )
    '''

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


"""
curl -X POST "http://localhost:8000/chat/completions" -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"Hello!"}]}'
"""