from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import json
from pathlib import Path
import os

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


history_file = Path("~/.webhistory/chrome.json").expanduser()
hook_file = Path("~/.webhistory/hook.sh").expanduser()
history_file.parent.mkdir(parents=True, exist_ok=True)
if not history_file.exists():
    history_file.touch()  # Creates an empty file

@app.post("/")
async def receive_history(request: Request):
    try:
        data = await request.json()
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    history = []
    if history_file.exists():
        try:
            with open(history_file, "r", encoding="utf-8") as file:
                history = json.load(file)
        except json.JSONDecodeError:
            pass  # If existing file is corrupted, it starts fresh

    history.append(data)
    
    with open(history_file, "w", encoding="utf-8") as file:
        json.dump(history, file, indent=4)

    if hook_file.exists() and os.access(hook_file, os.X_OK):
        with open(hook_file, "r") as file:
            os.system(f"echo '{json.dumps(data, indent=4)}' | bash {hook_file}")

    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=2222)