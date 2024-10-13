from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from openai import OpenAI
from fastapi.responses import JSONResponse
from fastapi.responses import *
from pinecone import Pinecone
import json
import PyPDF2

from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

index_name = "example-index2"
namespace_name = "default"

keyB = os.getenv("PINECONE_API_KEY")

pc = Pinecone(api_key=keyB)
index = pc.Index(index_name)

def query(search_query, clientId=None, courseId=None, lectureId=None, document_type=None, top_k=10):
    
    response = client.embeddings.create(
            input=search_query,
            model="text-embedding-3-large"
        )
    embedding = response.data[0].embedding
    our_filter = {}
    if clientId:
        our_filter.update({
            "client_id": {"$eq": clientId}
        })
    if courseId:
        our_filter.update({
            "course_id": {"$eq": courseId}
        })
    if lectureId:
        our_filter.update({
            "lecture_id": {"$eq": lectureId}
        })
    if document_type:
        our_filter.update({
            "document_type": {"$eq": document_type}
        })

    
    
    return index.query(
        vector=embedding,
        filter=our_filter,
        top_k=top_k,
        include_metadata=True
    )


# Define the request body model
class ChatRequest(BaseModel):
    messages: list

# Initialize OpenAI API key
client = OpenAI()

tools = [
    {
        "type": "function",
        "function": {
            "name": "query",
            "description": "Query the Pinecone index of class recordings, notes, and lecture slides for information that is relevant about the user's question.  The query will return the top 10 most relevant documents.  Your search query should be a natural language question or phrases and contain extensive levels of detail.",
            "parameters": {
                "type": "object",
                "properties": {
                    "search_query": {
                        "type": "string",
                        "description": "The detailed question or phrase that you would like to search for in the Pinecone index.",
                    },
                    "clientId": {
                        "type": "string",
                        "description": "The unique identifier of the client that owns the course.",
                    },
                    "courseId": {
                        "type": "string",
                        "description": "The unique identifier of the course that the user is asking about.",
                    },
                    "lectureId": {
                        "type": "string",
                        "description": "The unique identifier of the lecture that the user is asking about.",
                    },
                    "document_type": {
                        "type": "string",
                        "description": "The type of document that you would like to search for in the Pinecone index.",
                    },
                    "top_k": {
                        "type": "integer",
                        "description": "The number of most relevant documents that you would like to return.",
                    },
                },
                "required": ["search_query"],
                "additionalProperties": False,
            },
        }
    }
]

messages = []
messages.append({"role": "system", "content": "You are a helpful notes agent.  You can search for information in the Pinecone index of class recordings, notes, and lecture slides.  Please provide a detailed question or phrase that contains extensive levels of detail."})



# New endpoint for retrieving chat history
@app.get("/chat/history")
async def get_chat_history():
    # In a real application, you would typically fetch this from a database
    # For now, we'll return a dummy chat history
    dummy_history = [
        {
            "id": "1",
            "title": "First Chat",
            "messages": [
                {"role": "user", "content": "Hello!"},
                {"role": "assistant", "content": "Hi there! How can I help you today?"}
            ]
        },
        {
            "id": "2",
            "title": "Second Chat",
            "messages": [
                {"role": "user", "content": "What's the weather like?"},
                {"role": "assistant", "content": "I'm sorry, I don't have real-time weather information. You might want to check a weather website or app for the most up-to-date forecast."}
            ]
        }
    ]
    return JSONResponse(content=dummy_history)


@app.post("/chat/completions")
async def chat_completions(request: ChatRequest):
    message_list = messages
    message_list.extend(request.messages)
    response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=message_list,
    tools=tools
    )
    tool_called = response.choices[0].message.tool_calls
    tool_results = []
    if tool_called:
        #print(response.choices[0].message)
        message_list.append({"role": "assistant", "tool_calls": response.choices[0].message.tool_calls})
        #for tool_call in response.choices[0].message.tool_calls:
        tool_call = response.choices[0].message.tool_calls[0]
        arguments = json.loads(tool_call.function.arguments)
        search_query = arguments['search_query']
        search_result = query(search_query)
        #tool_results.append(search_result)
        function_call_result_message = {
            "role": "tool",
            "content": str(search_result),
            "tool_call_id": tool_call.id
        }
        #print("YOLO")
        #print(function_call_result_message)
        #print('\n')
        #print('\n')
        #print('\n')
        message_list.append(function_call_result_message)

        response = client.chat.completions.create(
            model='gpt-4o-mini',
            messages=message_list,
        )
        #print(message_list)
        message_list.extend({'role':'assistant', 'content': str(response.choices[0].message.content)})
        #print("CRAZY BAT OUT OF CONGRESS")

    new_message = {'role': 'assistant', 'content': response.choices[0].message.content}
    return request.messages + [new_message]

    '''
    return JSONResponse(
            status_code=200,
            content={
                "text": "Success",
                "data": response.messages.append(response.choices[0].message)
            }
        )
    '''

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        return JSONResponse(status_code=400, content={"message": "Only PDF files are allowed"})

    try:
        # Read the PDF content
        pdf_content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_content))
        
        # Extract text from all pages
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()

        # Create embeddings for the extracted text
        response = client.embeddings.create(
            input=text,
            model="text-embedding-3-large"
        )
        embedding = response.data[0].embedding

        # Store the embedding in Pinecone
        unique_id = f"pdf_{file.filename}_{os.urandom(4).hex()}"
        index.upsert(vectors=[
            (unique_id, embedding, {"content": text, "filename": file.filename})
        ])

        return JSONResponse(status_code=200, content={"message": "PDF processed and stored successfully", "id": unique_id})
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Error processing PDF: {str(e)}"})

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


"""
curl -X POST "http://localhost:8000/chat/completions" -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"Hello!"}]}'

curl -X POST "https://172.203.217.224/chat/completions" -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"Hello!"}]}'
"""