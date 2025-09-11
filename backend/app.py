#!/usr/bin/env python3
"""
FastAPI Application para el Agente Turístico de Madrid
Backend API REST para el agente CrewAI con Gemini + PDFs + OpenStreetMap
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import uvicorn
import os
import sys
import asyncio
from datetime import datetime
import logging

# Agregar el directorio agent al path
sys.path.append(os.path.join(os.path.dirname(__file__), 'agent'))

try:
    from agent.agente_coordenadas import (
        main as agent_main, 
        openstreetmap, 
        crear_llm_gemini, 
        inicializar_vectorstore,
        buscar_lugares_openstreetmap
    )
except ImportError as e:
    print(f"❌ Error importando módulos del agente: {e}")
    sys.exit(1)

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Crear la aplicación FastAPI
# Detectar si estamos en Hugging Face Spaces
is_hf_space = os.getenv("SPACE_ID") is not None

# En Hugging Face Spaces NO usar root_path, causa problemas de ruteo
app = FastAPI(
    title="Ratoncito Pérez Agent API",
    description="API REST para el agente turístico de Madrid con CrewAI, Gemini y OpenStreetMap",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS para permitir requests desde frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic para request/response
class TourismQuery(BaseModel):
    query: str = Field(..., description="Consulta turística del usuario")
    lat: Optional[float] = Field(None, description="Latitud para búsqueda GPS")
    lon: Optional[float] = Field(None, description="Longitud para búsqueda GPS")
    radio_km: Optional[float] = Field(1.0, description="Radio de búsqueda en kilómetros")
    categoria: Optional[str] = Field(None, description="Categoría de lugares")
    adulto: Optional[bool] = Field(False, description="Actividades para adultos")
    infantil: Optional[bool] = Field(False, description="Actividades para niños")
    accesibilidad: Optional[bool] = Field(False, description="Opciones accesibles")


class TourismResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    execution_time: Optional[float] = None
    timestamp: datetime

class RootResponse(BaseModel):
    message: str
    version: str
    description: str
    docs: str
    endpoints: Dict[str, str]

# Variables globales para el agente
llm = None
vectorstore = None

@app.on_event("startup")
async def startup_event():
    """Inicializar el agente al arrancar la aplicación"""
    global llm, vectorstore

    logger.info("🚀 Iniciando Ratoncito Pérez API...")
    
    # Detectar entorno
    is_hf_space = os.getenv("SPACE_ID") is not None
    if is_hf_space:
        logger.info("🤗 Ejecutándose en Hugging Face Spaces")
    else:
        logger.info("💻 Ejecutándose en entorno local")

    try:
        logger.info("⚙️ Configurando LLM Gemini...")
        llm = crear_llm_gemini()
        # Inicializar vectorstore
        logger.info("📚 Inicializando vectorstore...")
        vectorstore = inicializar_vectorstore()
        logger.info("✅ Vectorstore inicializado")

        logger.info("✅ Ratoncito Pérez API iniciado correctamente")

    except Exception as e:
        logger.error(f"❌ Error durante el startup: {e}")
        logger.error(f"📍 Tipo de error: {type(e).__name__}")
        # No hacer raise para que la API al menos arranque
        logger.warning("⚠️ API iniciada con funcionalidad limitada")
        logger.info("🔧 Algunos endpoints pueden no funcionar correctamente")

@app.get("/", response_model=RootResponse)
async def root():
    """Endpoint raíz con información de la API"""
    return RootResponse(
        message="Ratoncito Pérez agente API",
        version="1.0.0",
        description="API REST para consultas turísticas de Madrid con IA/Ratoncito Pérez",
        docs="/docs",
        endpoints={
            "guide": "/guide - Guía turística completa del Ratoncito Pérez",
            "health": "/health - Estado de la API",
            "locations": "/locations - Ubicaciones de ejemplo en Madrid",
            "docs": "/docs - Documentación Swagger UI",
            "redoc": "/redoc - Documentación ReDoc"
        }
    )

@app.get("/health")
async def health_check():
    """Endpoint de health check"""
    try:
        global llm, vectorstore
        
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "environment": {
                "is_hf_space": os.getenv("SPACE_ID") is not None,
                "space_id": os.getenv("SPACE_ID", "local"),
                "python_version": sys.version.split()[0],
                "working_directory": os.getcwd()
            },
            "components": {
                "llm": "initialized" if llm else "not_initialized",
                "vectorstore": "initialized" if vectorstore else "not_initialized"
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }




@app.post("/guide", response_model=TourismResponse)
async def generate_tourism_guide(query: TourismQuery):
    """
    Generar guía turística completa usando el agente CrewAI
    
    - **query**: Consulta turística del usuario
    - **lat/lon**: Coordenadas GPS opcionales para búsqueda local
    - **radio_km**: Radio de búsqueda en kilómetros
    - **categoria**: Filtro de categoría para lugares
    - **adulto/infantil/accesibilidad**: Filtros adicionales
    """
    global llm, vectorstore
    
    if not llm or not vectorstore:
        raise HTTPException(
            status_code=503, 
            detail="Agente no inicializado. Intente más tarde."
        )
    
    start_time = datetime.now()
    
    try:
        logger.info(f"📝 Procesando consulta: {query.query}")
        
        # Ejecutar el agente principal
        resultado = agent_main(
            user_query=query.query,
            vectorstore=vectorstore,
            llm=llm,
            adulto=query.adulto,
            infantil=query.infantil,
            accesibilidad=query.accesibilidad,
            lat=query.lat,
            lon=query.lon,
            radio_km=query.radio_km,
            categoria_foursquare=query.categoria
        )
        
        execution_time = (datetime.now() - start_time).total_seconds()
        
        return TourismResponse(
            success=True,
            message="Guía turística generada exitosamente",
            data={
                "guide": resultado,
                "query_params": query.dict(),
                #"sources": ["PDFs", "Internet", "OpenStreetMap"] if query.lat and query.lon else ["PDFs", "Internet"]
            },
            execution_time=execution_time,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        logger.error(f"❌ Error generando guía: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error interno generando guía turística: {str(e)}"
        )




@app.get("/locations")
async def get_sample_locations():
    """
    Obtener ubicaciones de ejemplo en Madrid
    """
    ubicaciones = {
        "Puerta del Sol": {"lat": 40.4170, "lon": -3.7036},
        "Museo del Prado": {"lat": 40.4138, "lon": -3.6921},
        "Palacio Real": {"lat": 40.4180, "lon": -3.7144},
        "Parque del Retiro": {"lat": 40.4153, "lon": -3.6844},
        "Plaza Mayor": {"lat": 40.4155, "lon": -3.7074},
        "Gran Vía": {"lat": 40.4200, "lon": -3.7025},
        "Estadio Santiago Bernabéu": {"lat": 40.4530, "lon": -3.6883},
        "Aeropuerto Barajas": {"lat": 40.4719, "lon": -3.5626}
    }
    
    return {
        "success": True,
        "locations": ubicaciones,
        "timestamp": datetime.now()
    }

# Función para ejecutar el servidor
def run_server(host: str = "0.0.0.0", port: int = 8000, reload: bool = False):
    """
    Ejecutar el servidor FastAPI
    
    Args:
        host: Host donde ejecutar el servidor
        port: Puerto donde ejecutar el servidor  
        reload: Si activar el auto-reload para desarrollo
    """
    print("🌟 Ratoncito Pérez API")
    print(f"🚀 Iniciando servidor en http://{host}:{port}")
    print(f"📚 Documentación en http://{host}:{port}/docs")
    print("💡 Ctrl+C para detener el servidor")
    
    uvicorn.run(
        "app:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )

if __name__ == "__main__":
    # Detectar si estamos en Hugging Face Spaces
    import os
    is_hf_space = os.getenv("SPACE_ID") is not None
    
    if is_hf_space:
        # Configuración para Hugging Face Spaces
        run_server(
            host="0.0.0.0",
            port=7860,
            reload=False
        )
    else:
        # Configuración para desarrollo local
        run_server(
            host="127.0.0.1",
            port=8000,
            reload=True
        )
