import sqlite3
from flask import g, Flask, render_template, request, session, redirect, url_for, jsonify
from flask_socketio import join_room, leave_room, send, SocketIO, emit, disconnect
from datetime import datetime


DATABASE="chat.db"
app = Flask(__name__,static_folder="static")
app.config["SECRET_KEY"] = "SIH25010" 
socketio = SocketIO(app)


rooms={}

@app.route("/", methods=["POST", "GET"])
def home():
    return render_template("home.html")

@app.route("/community/", methods=["POST", "GET"])
def community():
    pincode = session.get("pincode")
    # if pincode not in rooms:
    #     return redirect("/") 

    return render_template("comm.html", name=session.get("name"), pincode=session.get("pincode"))


@app.route("/crop_Suggestion", methods=["POST", "GET"])
def crop_Suggestion():
    return render_template("crop_sugg.html")

@app.route("/market", methods=["POST", "GET"])
def market():
    return render_template("market.html")

@app.route("/soil_health", methods=["POST", "GET"])
def soil():
    return render_template("soil_health.html")

@app.route("/login", methods=["POST", "GET"])
def profile():

    if request.method =='POST':
        name = request.form.get("name")
        phoneNumber = request.form.get("phonenumber")
        pincode = request.form.get("pincode")

        print(f"{name} logged in with {phoneNumber} from {pincode}")


        redirect("/")



    return render_template("login.html")

@app.route("/accounts", methods=["POST", "GET"])
def accounts():
    if request.method == "POST":
        session.clear()
        name    = request.form.get("name")
        pincode = request.form.get("pincode")
        join = request.form.get("join", False)
        create = request.form.get("create", False)

        if not name:    
            return render_template("accounts.html", error="Please enter name", pincode=pincode, name=name)

        if join!= False and not pincode:
            return render_template("accounts.html", error="Please enter pincode", pincode=pincode, name=name)
        
        rooms[pincode] = { "members":0, "messages":[] }
        
        session["pincode"] = pincode
        session["name"] = name
        print(f"pincode = {pincode}")
        
        return render_template("comm.html" , pincode=pincode)


    return render_template("accounts.html")

    rooms[pincode]["members"] +=1

@socketio.on("init")
def init(data):
    name = data.get("name")
    pincode = data.get("pincode")
    if not name or not pincode:
        return
    join_room(pincode)
    send({"name": name, "message": "has entered the community"}, to=pincode)


@socketio.on("message")
def Message(data):
    name = data["name"]
    pincode = data["pincode"]
    msg = data["msg"]

    # Store in the database
    with sqlite3.connect(DATABASE) as conn:
        c = conn.cursor()
        c.execute("INSERT INTO messages (room, name, msg) VALUES (?, ?, ?)", (pincode, name, msg))
        conn.commit()

    # Broadcast the message
    send({"name": name, "msg": msg}, to=pincode)


@app.route("/get_chat/<pincode>")
def get_chat(pincode):
    with sqlite3.connect(DATABASE) as conn:
        c = conn.cursor()
        c.execute("SELECT name, msg, timestamp FROM messages WHERE room=? ORDER BY timestamp ASC", (pincode,))
        rows = c.fetchall()
        messages = [{"name": row[0], "msg": row[1], "timestamp": row[2]} for row in rows]
    return jsonify(messages)



def init_db():
    with sqlite3.connect(DATABASE) as conn:
        c = conn.cursor()
        c.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                room TEXT NOT NULL,
                name TEXT NOT NULL,
                msg TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        """)
        conn.commit()

init_db()  # Call this once at startup



if __name__ =="__main__":
    socketio.run(app, debug=True)





# commiteed