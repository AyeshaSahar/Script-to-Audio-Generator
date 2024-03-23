from fastapi import FastAPI, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import audiostack
import os
import uuid
import uvicorn
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.mount("/audio_files", StaticFiles(directory="audio_files"), name="audio_files")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

audiostack.api_key = os.getenv("AUDIOSTACK_API_KEY")

@app.post("/generate-audio/")
async def generate_audio(script: str = Form(...)):
    try:
        os.makedirs("audio_files", exist_ok=True)

        name = "Cosmo"
        preset = "musicenhanced"
        template = "sound_affects"
        file_name = f"audio_{uuid.uuid4()}.wav"
        file_path = os.path.join("audio_files", file_name)  

        created_script = audiostack.Content.Script.create(
            scriptText=script, scriptName="test_script", projectName="project"
        )

        speech = audiostack.Speech.TTS.create(scriptItem=created_script, voice=name, speed=1)
        
        mix = audiostack.Production.Mix.create(
            speechItem=speech,
            soundTemplate=template,
            masteringPreset=preset,
        )
        mix.download(fileName=file_path)  
        return {"url": f"/audio_files/{file_name}"}
    
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("shutdown")
def cleanup():
    for f in os.listdir("audio_files"):
        if f.endswith('.wav'):
            os.remove(os.path.join("audio_files", f))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
