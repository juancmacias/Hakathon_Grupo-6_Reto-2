# Use the official Python devcontainer image
# Replace 3.12-bookworm with the desired Python version
FROM mcr.microsoft.com/devcontainers/python:3.12-bookworm

# Install the latest version of SQLite3
# This is crucial for getting the most recent features and security updates
RUN apt-get update && apt-get install -y --no-install-recommends \
    sqlite3 \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*