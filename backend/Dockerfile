FROM python:3.10-slim

# Directorio de trabajo
WORKDIR /app

# Variables de entorno para Hugging Face Spaces
ENV HOME=/app \
    HF_HOME=/app/huggingface \
    TRANSFORMERS_CACHE=/app/cache \
    PIP_ROOT_USER_ACTION=ignore \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

# Copiar requirements e instalar dependencias
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt uvicorn[standard]

# Copiar el resto del código
COPY . .

# Crear directorios y dar permisos
RUN mkdir -p /app/.local /app/cache /app/huggingface && \
    chmod -R 777 /app

EXPOSE 7860

# Comando optimizado para Hugging Face Spaces
CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860", "--workers", "1", "--timeout-keep-alive", "60"]