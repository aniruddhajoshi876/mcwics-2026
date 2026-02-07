import secrets
from datetime import datetime, timezone
from flask import Blueprint, request, jsonify

bp = Blueprint("rooms", __name__, url_prefix="/rooms")

# in-memory store: room_id -> { "id", "prompt", "created_at" }
_rooms = {}
# room_id -> list of { "id", "room_id", "image", "caption", "created_at" }
_submissions = {}


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


def _submission_json(sub):
    return {
        "id": sub["id"],
        "room_id": sub["room_id"],
        "image": sub["image"],
        "caption": sub["caption"],
        "created_at": sub["created_at"],
    }


@bp.route("/<room_id>/submissions", methods=["GET"])
def list_submissions(room_id):
    if room_id not in _rooms:
        return jsonify({"error": "room not found"}), 404
    subs = _submissions.get(room_id, [])
    # newest first
    ordered = sorted(subs, key=lambda s: s["created_at"], reverse=True)
    return jsonify([_submission_json(s) for s in ordered])


@bp.route("/<room_id>/submissions", methods=["POST"])
def create_submission(room_id):
    if room_id not in _rooms:
        return jsonify({"error": "room not found"}), 404
    data = request.get_json() or {}
    image = data.get("image")
    caption = (data.get("caption") or "").strip()[:300]
    if not image or not isinstance(image, str):
        return jsonify({"error": "image is required"}), 400
    sub_id = secrets.token_urlsafe(8)
    sub = {
        "id": sub_id,
        "room_id": room_id,
        "image": image,
        "caption": caption,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    _submissions.setdefault(room_id, []).append(sub)
    return jsonify(_submission_json(sub)), 201
