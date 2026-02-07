# Single Flask app lives in main.py; this re-exports it for `flask --app app run`.
from main import app
