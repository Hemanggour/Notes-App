#!/bin/sh

export PYTHONPATH=/app

sleep 10  # Wait for the database to be ready

# Run Django migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Start Gunicorn via Python module to avoid executable issues
exec python -m gunicorn project.wsgi:application --bind 0.0.0.0:8000 --workers 3
