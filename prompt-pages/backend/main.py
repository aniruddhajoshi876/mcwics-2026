from flask import Flask, render_template, url_for, request, flash, redirect
from routes.rooms import bp as rooms_bp
from realtime.sockets import socketio
from utils.manage_data import find_room, manage_containers, create_new_room
from utils.room_id import generate_room_id
import os


#setup flask app, specify template and static folders
app = Flask(__name__, template_folder="../apps/web/src/pages/templates", static_folder="../apps/web/src/static")
#secret key for flash messages
app.secret_key = "secret-key"

#initialize socket.io with flask app
#socketio.init_app(app, cors_allowed_origins="*")

#app.register_blueprint(rooms_bp)

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



if __name__ == "__main__":
    socketio.run(app, debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))