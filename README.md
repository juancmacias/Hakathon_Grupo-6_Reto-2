# Hakathon Grupo 6 - Reto 2

Este repositorio contiene la solución al Reto 2 del Hakathon "Factoría F5 - Alvearium" el Grupo 6.

## Estructura del proyecto

```
frontend/        # Código fuente del frontend
model/           # Archivos relacionados con modelos (actualmente vacío)
.gitignore       # Configuración de archivos ignorados por Git
```

## Instrucciones

1. Clona el repositorio:
   ```
   git clone <url-del-repositorio>
   ```
2. Para el entorno Python:
    - Crea y activa un entorno virtual:
       ```powershell
       python -m venv venv
       .\venv\Scripts\activate
       ```
    - Instala las dependencias:
       ```powershell
       pip install -r requirements.txt
       ```
3. **Ejecutar la API del Ratoncito Pérez**
    - Una vez activado el entorno virtual y con las dependencias instaladas, ejecuta el siguiente comando desde la raíz del proyecto para iniciar el servidor:
      ```bash
      uvicorn backend.api.tooth_fairy_api:app --reload
      ```
    - El backend necesita un fichero `.env` con la configuracion del modelo.
    - La API estará disponible en `http://127.0.0.1:8000`.
    - Puedes acceder a la documentación interactiva (Swagger UI) en `http://127.0.0.1:8000/docs` para probar el endpoint.

4. Para el frontend (si aplica), instala las dependencias necesarias según el stack utilizado (Node.js, etc).
5. Sigue las instrucciones específicas en cada carpeta para ejecutar el proyecto.

## Notas
- El archivo `.gitkeep` se utiliza para mantener carpetas vacías en el repositorio.
- El archivo `.gitignore` ayuda a evitar subir archivos innecesarios o sensibles.

## Autores
Grupo 6:

- Stephanie Ángeles — [stephyangeles](https://github.com/stephyangeles)
- Oscar Rodríguez — [osrodgon](https://github.com/osrodgon)
- Monserrat González — [monigogo](https://github.com/monigogo)
- Maribel García — [MaribelGR-dev](https://github.com/MaribelGR-dev)
- Guillermo Halfon — [GHalfbbt](https://github.com/GHalfbbt)
- Juan Carlos Macías — [juancmacias](https://github.com/juancmacias)


## Licencia
Este proyecto está bajo la licencia MIT.
