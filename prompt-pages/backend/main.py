from flask import Flask, render_template, url_for, request
from routes.rooms import bp as rooms_bp
from realtime.sockets import socketio
from utils.read_data import find_room, manage_containers


#setup flask app, specify template and static folders
app = Flask(__name__, template_folder="../apps/web/src/pages/templates", static_folder="../apps/web/src/static")


#app.register_blueprint(rooms_bp)

#main route
@app.route("/")
def home():
    return render_template("index.html")

#create a new room with given room id
@app.route("/create_room", methods=["POST"])
def create_room():
    room_id = request.form.get("room-id").strip()
    print(room_id)
    return render_template("personalised.html", room_id=room_id)

#enter pre-existing room with given room id
@app.route("/enter_room", methods=["POST"])
def enter_room():
    #get room id from form request
    room_id = request.form.get("room-id").strip()
    room_data =find_room(room_id)
    manage_containers(room_data["containers"])
    return render_template("personalised.html", room_id=room_id)



if __name__ == "__main__":
    app.run(debug=True, use_reloader=True)