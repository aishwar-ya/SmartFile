from fastapi import FastAPI

app = FastAPI()     # creates our backend application.


@app.get("/")       # creates the home API.
def home():
    return {
        "message": "Smart File Backend is working!"
    }               # sends a response when someone visits the backend.