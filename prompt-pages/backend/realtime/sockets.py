from flask_socketio import SocketIO, join_room, leave_room

socketio = SocketIO(
    async_mode="threading",
    cors_allowed_origins="*"
)

@socketio.on("connect")
def on_connect():
    print("Client connected")

@socketio.on("disconnect")
def on_disconnect():
    print("Client disconnected")

@socketio.on("join")
def on_join(data):
    room_id = data.get("roomId")
    if not room_id:
        return
    join_room(room_id)
    print(f"Client joined room {room_id}")

@socketio.on("leave")
def on_leave(data):
    room_id = data.get("roomId")
    if not room_id:
        return
    leave_room(room_id)
    print(f"Client left room {room_id}")
