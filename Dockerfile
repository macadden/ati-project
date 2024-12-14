
# Use the official Python image as the base image
FROM python:3.9

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /app

# Install dependencies
COPY pyproject.toml poetry.lock ./
RUN pip install poetry && poetry config virtualenvs.create false && poetry install --no-interaction --no-ansi


# Document container-side port
EXPOSE 8000

# Install netcat (nc) based on the distribution
RUN apt-get update && apt-get install -y netcat-openbsd || apt-get install -y netcat-traditional

# Copy the Django project files to the container
COPY . .

# Copy the entrypoint script
COPY docker-entrypoint.sh ./

# Give execute permissions to the entrypoint script
RUN chmod +x docker-entrypoint.sh

# Switch back to the root directory
WORKDIR /app

# Start the Django development server
CMD ["./docker-entrypoint.sh"]
