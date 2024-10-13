from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
from fastapi.responses import JSONResponse
from fastapi.responses import *
from pinecone import Pinecone
import json

import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

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

@app.post("/chat/completions")
async def chat_completions(request: ChatRequest):
    message_list = messages
    message_list.extend(request.messages)
    response = client.chat.completions.create(
    model="gpt-4o",
    messages=message_list,
    tools=tools
    )
    tool_called = response.choices[0].message.tool_calls
    tool_results = []
    if tool_called:
        print(response.choices[0].message)
        message_list.extend(response.choices[0].message)
        #for tool_call in response.choices[0].message.tool_calls:
        tool_call = response.choices[0].message.tool_calls[0]
        arguments = json.loads(tool_call.function.arguments)
        search_query = arguments['search_query']
        search_result = query(search_query)
        tool_results.append(search_result)
        function_call_result_message = {
            "role": "tool",
            "content": str(search_result),
            "name": 'query',
            "tool_call_id": tool_call.id
        }
        message_list.extend({'role':'tool', 'content': str(function_call_result_message)})

        response = client.chat.completions.create(
            model='gpt-4o',
            messages=message_list,
        )
        print(message_list)
        message_list.extend({'role':'assistant', 'content': str(response.choices[0].message.content)})
        print("CRAZY BAT OUT OF CONGRESS")

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

curl -X POST "https://172.203.217.224/chat/completions" -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"Hello!"}]}'
"""