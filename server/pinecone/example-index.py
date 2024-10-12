from pinecone import Pinecone, ServerlessSpec
import os

# Initialize a clientos
pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))

index = pc.Index('example-index')
index.upsert(
  vectors=[
    {"id": "A", "values": [0.1, 0.1, 0.1, 0.1] * 384},
    {"id": "B", "values": [0.2, 0.2, 0.2, 0.2] * 384},
    {"id": "C", "values": [0.3, 0.3, 0.3, 0.3] * 384},
    {"id": "D", "values": [0.4, 0.4, 0.4, 0.4] * 384}
  ]
)