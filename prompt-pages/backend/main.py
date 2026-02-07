from flask import Flask, render_template, url_for, request
from routes.rooms import bp as rooms_bp
from realtime.sockets import socketio
#setup flask app, specify template and static folders
#app = Flask(__name__, template_folder="../apps/web/src/pages/templates", static_folder="../apps/web/src/static")


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
@app.route("/new_room", methods=["POST"])
def enter_room():
    room_id = request.form.get("room-id").strip()
    print(room_id)
    return render_template("personalised.html", room_id=room_id)

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)