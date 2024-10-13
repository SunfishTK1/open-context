from pinecone import Pinecone
from openai import OpenAI
import os
import requests
from dotenv import load_dotenv


load_dotenv()
client = OpenAI()

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

if __name__ == "__main__":
    print(query("hackharvard", courseId="hi"))


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
