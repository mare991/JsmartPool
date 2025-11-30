FROM python:3.12-slim

WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY hello.py .

# Expose Flask port
EXPOSE 5000

# Run Flask application
CMD ["python", "hello.py"]

