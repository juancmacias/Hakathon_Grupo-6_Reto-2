from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from frontend.agent.tooth_fairy_agent import run_agent


# --- Configuración de FastAPI ---
app = FastAPI(
    title="API del Ratoncito Pérez",
    description="Endpoint para obtener recomendaciones culturales y turísticas sobre el Ratoncito Pérez en Madrid.",
    version="1.0.0",
)

# Modelo de datos para la entrada (input) del endpoint
class GPSCoordinates(BaseModel):
    gps: list[float]

# Endpoint principal
@app.post("/tooth-fairy/recommendations")
async def get_recommendations(coords: GPSCoordinates):
    """
    Recibe coordenadas GPS y devuelve recomendaciones sobre lugares 
    relacionados con el Ratoncito Pérez en Madrid.
    """
    # Validar que se reciban exactamente dos coordenadas (latitud y longitud)
    if len(coords.gps) != 2:
        raise HTTPException(status_code=400, detail="Las coordenadas GPS deben ser una lista con dos valores: [latitud, longitud].")

    try:
        # Llamar a la función del agente desde el otro archivo
        result = run_agent(coords.gps)
        
        # Devolver el resultado como un JSON
        return {"recommendations": result}

    except Exception as e:
        # Manejar posibles errores
        raise HTTPException(status_code=500, detail=str(e))