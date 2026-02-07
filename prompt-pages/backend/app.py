import secrets
from datetime import datetime, timezone
from flask import Flask, request, jsonify

app = Flask(__name__)
app.register_blueprint(rooms_bp)


@app.route("/")
def index():
    return {"ok": True}
