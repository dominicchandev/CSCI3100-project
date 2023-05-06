import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.routers import courses, users, login
app = FastAPI()

origins = ["http://localhost:3000"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(courses.router, prefix="/api/courses", tags=["courses"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(login.router, prefix="", tags=["login"])

@app.get("/api/healthchecker")
def check_health():
    return {'message': 'Hello World'}

if __name__=='__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000, reload=True)
