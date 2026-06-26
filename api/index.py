from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from anthropic import Anthropic
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS so the frontend can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/api/chat")
def chat(request: ChatRequest):
    subscription_key = os.getenv("ANTHROPIC_SUBSCRIPTION_KEY")
    if not subscription_key:
        raise HTTPException(status_code=500, detail="ANTHROPIC_SUBSCRIPTION_KEY not configured")

    try:
        client = Anthropic(
            api_key="unused",  # auth handled by the Azure APIM gateway
            base_url="https://lgts1tetamapi01.azure-api.net/claude/anthropic",
            default_query={"subscription-key": subscription_key},
        )
        user_message = request.message
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system="You are a supportive mental coach.",
            messages=[
                {"role": "user", "content": user_message}
            ]
        )
        return {"reply": response.content[0].text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling Anthropic API: {str(e)}")
