from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from backend.agent.tooth_fairy_agent import run_agent

# --- FastAPI Configuration ---
app = FastAPI(
    title="Tooth Fairy AOI",
    description="Gets cultural and tourist recommendations about the Tooth Fairy in Madrid.",
    version="1.0.0",
)

# Endpoint payload
class GPSCoordinates(BaseModel):
    gps: list[float]

# Main ndpoint
@app.post("/tooth-fairy/recommendations")
async def get_recommendations(coords: GPSCoordinates):
    # Check payload
    if len(coords.gps) != 2:
        raise HTTPException(status_code=400, detail="GPS coordinates must be a list of length 2: [latitude, logitude].")

    try:
        # Call agent
        result = run_agent(coords.gps)
        
        # Return response
        return {"recommendations": result}

    except Exception as e:
        # Error handling
        raise HTTPException(status_code=500, detail=str(e))