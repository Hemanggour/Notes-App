# Use official Python slim image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the backend code
COPY . .

# Expose port
EXPOSE 8000

# Copy entrypoint script
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Use the script as CMD
CMD ["./entrypoint.sh"]
