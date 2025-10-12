@echo off

echo ================================
echo Running isort (import sorting)...
echo ================================
isort . --skip .venv --skip-glob "**/migrations" 

echo ================================
echo Running black (code formatter)...
echo ================================
black . --exclude="(.venv|migrations/)"

echo ================================
echo Running flake8 (style checker)...
echo ================================
flake8 . --exclude=.venv,my-docs/ --extend-exclude=migrations,asgi.py --max-line-length=100

echo ================================
echo All checks completed!
