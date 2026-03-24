# Use official Python base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Copy the dataset from the parent directory (this assumes a specific build context or we copy it manually)
# Note: In docker-compose, we can bind mount it or use a separate copy step.
# For a standalone Dockerfile, it's better to have the dataset inside the context.
# We will handle the dataset path via environment variables or volume mounts in compose.
ENV DATASET_PATH=/app/dataset.csv

# Expose port
EXPOSE 8000

# Start uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
