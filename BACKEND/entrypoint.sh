#!/bin/sh

export PYTHONPATH=/app

# Wait for the database to be ready
echo "Waiting for database..."
until python manage.py check --database default; do
  >&2 echo "Database is unavailable - sleeping"
  sleep 2
done

# Run Django migrations
python manage.py migrate --noinput

# Create superuser if it doesn't exist
echo "Creating superuser if not exists..."
python manage.py create_superuser

# Collect static files
python manage.py collectstatic --noinput

# Start Gunicorn via Python module to avoid executable issues
exec python -m gunicorn project.wsgi:application --bind 0.0.0.0:8000 --workers 3
