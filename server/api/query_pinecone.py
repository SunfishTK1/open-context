from pinecone import Pinecone
from openai import OpenAI
import os
import requests
from dotenv import load_dotenv


load_dotenv()
client = OpenAI()

index_name = "example-index"
namespace_name = "example-namespace"

pc = Pinecone(api_key="YOUR_API_KEY")
index = pc.Index(index_name)

def query(search_query, clientId=None, courseId=None, lectureId=None, top_k=10):
    
    response = client.embeddings.create(
            input=search_query,
            model="text-embedding-3-large"
        )
    embedding = response.data[0].embedding
    our_filter = {}
    if clientId:
        our_filter.update({
            "clientId": {"$eq": clientId}
        })
    if courseId:
        our_filter.update({
            "courseId": {"$eq": courseId}
        })
    if lectureId:
        our_filter.update({
            "lectureId": {"$eq": lectureId}
        })
    
    return index.query(
        namespace=namespace_name,
        vector=embedding,
        filter=our_filter,
        top_k=top_k,
        include_metadata=True
    )
'''
index.query(
    namespace=namespace_name,
    vector=[0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
    filter={
        "genre": {"$eq": "documentary"}
    },
    top_k=1,
    include_metadata=True # Include metadata in the response.
)
'''
