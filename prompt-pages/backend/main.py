from flask import Flask, render_template, url_for
from routes.rooms import bp as rooms_bp

app = Flask(__name__, template_folder="../apps/web/src/pages/templates")


app.register_blueprint(rooms_bp)


@app.route("/")
def home():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)