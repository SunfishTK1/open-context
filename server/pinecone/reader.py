import PyPDF2
from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec
import os

client = OpenAI()
EMBEDDING_SIZE = 3072
clid = 15210
COURSE_ID = [clid] * EMBEDDING_SIZE
lid = 10
LECTURE_ID = [lid] * EMBEDDING_SIZE
cid = 1
CLIENT_ID = [cid] * EMBEDDING_SIZE
doctype = "pdf"
DOCUMENT_TYPE = [doctype] * EMBEDDING_SIZE


def get_embedding(text, model="text-embedding-3-large"):
    text = text.replace("\n", " ")
    return client.embeddings.create(input=[text], model=model).data[0].embedding


pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

index = pc.Index("example-index2")

with open("/Users/utkanuygur/Desktop/open-context/server/pinecone/probability.pdf", "rb") as file:
    reader = PyPDF2.PdfReader(file)
    TEXTS = []
    for page_num in range(len(reader.pages)):
        page = reader.pages[page_num]
        a = (page.extract_text()).split("\n\n")
        TEXTS.append(a)
    TEXTS = [item for l in TEXTS for item in l]

EMBEDDINGS = [get_embedding(text) for text in TEXTS]
IDS = [str(i) for i in range(1, EMBEDDING_SIZE + 1)]
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
