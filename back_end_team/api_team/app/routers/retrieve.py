from fastapi import FastAPI, File, UploadFile

app = FastAPI()

@app.get("/lectures/{lecture_id}")
async def get_lecture_info(lecture_id: str):
    # Retrieve lecture info from the database
    lecture = {}  # Fetch lecture data
    return lecture

@app.get("/courses/{course_id}")
async def get_course_info(course_id: str):
    # Retrieve course info from the database
    course = {}  # Fetch course data
    return course

