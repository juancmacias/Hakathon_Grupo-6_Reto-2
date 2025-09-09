from crewai import Agent, Task, Crew
from crewai.tools import BaseTool
from crewai_tools import PDFSearchTool
from langchain_community.tools import DuckDuckGoSearchRun

# Custom class to Duck Duck Go
class DuckDuckGoTool(BaseTool):
    name: str = "DuckDuckGo Search Tool"
    description: str = "Search the web for a given query."

    def _run(self, query: str) -> str:
        duckduckgo_tool = DuckDuckGoSearchRun()
        
        response = duckduckgo_tool.invoke(query)

        return response

# Toos
pdf_tool = PDFSearchTool(path="references/")
duckduckgo_tool = DuckDuckGoTool()

# Agent definition
tooth_fairy_agent = Agent(
    role="Guía cultural del Ratoncito Pérez en Madrid",
    goal=(
        "Ofrecer recomendaciones personalizadas sobre qué hacer, ver y comer en Madrid, "
        "relacionadas con la figura del Ratoncito Pérez, usando las coordenadas gps recibidas "
        " y limitando la busqueda a un kilometro alrededor de las coordenadas gps."
    ),
    backstory=(
        "Soy un agente experto en historia local, cultura y gastronomía madrileña. "
        "Tengo un conocimiento profundo sobre el Ratoncito Pérez, su museo en Madrid y "
        "otros lugares relacionados. Uso referencias académicas y turísticas para dar respuestas fiables."
    ),
    verbose=True
)

# Task definition
get_information = Task(
    description=(
        "Dado un par de coordenadas {gps} en Madrid, encuentra qué hacer, ver y comer cerca, alrededor de "
        "las coordenadas {gps} con énfasis en el {topic} y referencias culturales. Usa los PDFs disponibles como fuente."
    ),
    expected_output=(
        "Una lista organizada con: 1) actividades culturales, 2) lugares turísticos relacionados, 3) opciones gastronómicas locales."
    ),
    tools=[pdf_tool, duckduckgo_tool],
    agent=tooth_fairy_agent
)

# --- Crew ---
crew = Crew(
    agents=[tooth_fairy_agent],
    tasks=[get_information],
    verbose=True
)

# Run the agent
def run_agent(gps_coords: list[float], topic: str = "Ratoncito Pérez"):
    """
    Función para ejecutar la crew con las coordenadas y el tema dados.
    """
    return crew.kickoff(inputs={
        "gps": gps_coords,
        "topic": topic
    })

if __name__ == "__main__":
    # GPS coordinates example -> Puerta del Sol, Madrid
    gps_coords = [40.4168, -2.7038]
    
    result = crew.kickoff(inputs={
        "gps": gps_coords,
        "topic": "Ratoncito Pérez"
    })

    print("\n=== Recomendaciones del Ratoncito Pérez en Madrid ===\n")
    print(result)
