import json
import threading

LOCK = threading.Lock()
FILE = "room_data.json"

def load_data():
    try:
        with open(FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_room(room_id, state):
    with LOCK:
        data = load_data()
        data[room_id] = state
        with open(FILE, "w") as f:
            json.dump(data, f, indent=2)
