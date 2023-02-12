import uvicorn
from fastapi import FastAPI

from server.routers import courses, users, login
app = FastAPI()

app.include_router(courses.router, prefix="/api/courses", tags=["courses"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(login.router, prefix="", tags=["login"])

@app.get("/api/healthchecker")
def check_health():
    return {'message': 'Hello World'}

if __name__=='__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000, reload=True)
