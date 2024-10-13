import PyPDF2
from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec
import os
import re

client = OpenAI()

def get_embedding(text, model="text-embedding-3-large"):
    text = text.replace("\n", " ")
    return client.embeddings.create(input=[text], model=model).data[0].embedding

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

index = pc.Index("example-index2")


audio_file = open("/Users/utkanuygur/Desktop/open-context/server/pinecone/audio.mp3", "rb")
transcription = client.audio.transcriptions.create(
    model="whisper-1",
    file=audio_file
)
sentences = re.split(r'(?<=[.!?])\s+', transcription.text)
TEXTS = [' '.join(sentences[i:i+5]) for i in range(0, len(sentences), 5)]
clid = 15330
NUM_VECTORS = len(TEXTS)
COURSE_ID = [clid] * NUM_VECTORS
lid = 2
LECTURE_ID = [lid] * NUM_VECTORS
cid = 2
CLIENT_ID = [cid] * NUM_VECTORS
doctype = "text"
DOCUMENT_TYPE = [doctype] * NUM_VECTORS
EMBEDDINGS = [get_embedding(text) for text in TEXTS]
IDS = [str(i) for i in range(1, NUM_VECTORS + 1)]
combined = list(zip(IDS, CLIENT_ID, COURSE_ID, LECTURE_ID, TEXTS, EMBEDDINGS, DOCUMENT_TYPE))

vectors = [
        {
            "id": id,
            "values": embedding,
            "metadata": {"client_id": clientid, "course_id": courseid, "lecture_id": lectureid, "text": text, "document_type": doctype}
        }
        for (id, clientid, courseid, lectureid, text, embedding, doctype) in combined
    ]
index.upsert(
    vectors=vectors
)
