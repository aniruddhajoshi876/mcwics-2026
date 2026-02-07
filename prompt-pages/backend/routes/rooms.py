import secrets
from datetime import datetime, timezone
from flask import Blueprint, request, jsonify

bp = Blueprint("rooms", __name__, url_prefix="/rooms")

# in-memory store: room_id -> { "id", "prompt", "created_at" }
_rooms = {}


def _room_json(room):
    return {
        "id": room["id"],
        "prompt": room["prompt"],
        "created_at": room["created_at"],
    }


@bp.route("", methods=["GET"])
def list_rooms():
    return jsonify([_room_json(r) for r in _rooms.values()])


@bp.route("", methods=["POST"])
def create_room():
    data = request.get_json() or {}
    prompt = (data.get("prompt") or "").strip()
    if not prompt:
        return jsonify({"error": "prompt is required"}), 400
    room_id = secrets.token_urlsafe(6)
    room = {
        "id": room_id,
        "prompt": prompt,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    _rooms[room_id] = room
    return jsonify(_room_json(room)), 201


@bp.route("/<room_id>")
def get_room(room_id):
    if room_id not in _rooms:
        return jsonify({"error": "room not found"}), 404
    return jsonify(_room_json(_rooms[room_id]))
