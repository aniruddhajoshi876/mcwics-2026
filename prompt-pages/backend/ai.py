
@app.route("/process_data", methods=["POST"])
def process_data():
    payload = request.get_json(silent=True) or {}
    room_id = payload.get("roomId")
    containers = payload.get("containers")

    if ROOM_DATA_PATH.exists():
        with ROOM_DATA_PATH.open("r", encoding="utf-8") as file:
            data = json.load(file)
    else:
        data = {}


    room_entry = data.get(room_id, {})
    room_entry["name"] = payload.get("name") or room_entry.get("name") or room_id
    room_entry["containers"] = containers
    data[room_id] = room_entry

    with ROOM_DATA_PATH.open("w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)

    return jsonify({"ok": True})