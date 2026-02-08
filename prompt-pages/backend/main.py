from flask import Flask, render_template, url_for, request, flash, redirect, jsonify
from routes.rooms import bp as rooms_bp
from realtime.sockets import socketio
import realtime.events  # noqa: F401 - register socket handlers
from utils.manage_data import find_room, manage_containers, create_new_room, save_room
from utils.room_id import generate_room_id
import os
import json
from pathlib import Path


#setup flask app, specify template and static folders
app = Flask(__name__, template_folder="../apps/web/src/pages/templates", static_folder="../apps/web/src/static")
#secret key for flash messages
app.secret_key = "secret-key"

#initialize socket.io with flask app
socketio.init_app(app, cors_allowed_origins="*")




#main route
@app.route("/")
def home():
    return render_template("index.html")

#create a new room with given room id
@app.route("/create_room", methods=["POST", "GET"])
def create_room():
    #get room name from form request
    room_name = request.form.get("room-name").strip()
    print(room_name)
    #generate random room id (8 characters)
    room_id = generate_room_id()
    print(room_id)
    create_new_room(room_id, room_name)
    return render_template("room.html", room_name=room_name, room_id=room_id)

#enter pre-existing room with given room id
@app.route("/enter_room", methods=["POST", "GET"])
def enter_room():
    #get room id from form request
    room_id = request.form.get("room-id").strip()
    room_data =find_room(room_id)
    #check if id is valid
    if not room_data:
        flash("Room not found.", "error")
        return redirect(url_for("home"))
    manage_containers(room_data["containers"])
    print(room_data)
    return render_template("enter_room.html", room_id=room_id, data=room_data)

#app.register_blueprint(rooms_bp)
# receiving data in a list of dictionnaries
#[{'caption': 'edit me', 'name': 'user', 'date': 'Sun Feb 08 2026', 
# 'id': 'post_1770564941285', 'top': '', 'left': ''}, {'caption': 'edit me', 
# 'name': 'user', 'date': 'Sun Feb 08 2026', 'id': 'post_1770564941444', 
# 'top': '156px', 'left': '1062px'}]
ROOM_DATA_PATH = Path(__file__).resolve().parent / "room_data.json"

@app.route("/process_data", methods=["POST"])
def process_data():
    payload = request.get_json()

    room_id = payload[0]
    new_posts = payload[1:]
    save_room(room_id, new_posts)
    

    return "", 200



if __name__ == "__main__":
    #socketio.run(app, debug=True, host="0.0.0.0", port=5000, allow_unsafe_werkzeug=True)
    app.run(debug=True, use_reloader=False)