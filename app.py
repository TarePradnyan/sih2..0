from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from supabase_client import Client, supabase

app = Flask(__name__)
app.secret_key= "SIH25010"
CORS(app, origins=["https://sih25010.vercel.app/"])
# Database setup
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# db = SQLAlchemy(app)

# Database model for posts
# class Post(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user = db.Column(db.String(50), nullable=False)
#     content = db.Column(db.Text, nullable=False)
#     Date_Time = db.Column(db.Text, nullable=False)

@app.route("/")
def home():
    phone = session.get('phone')
    return render_template("home.html", phone=phone)

# Community page
@app.route("/community", methods=["GET", "POST"])
def community():
    user = session.get('phone')
    if not user:
        return redirect(url_for('farmer_login'))
    if request.method == "POST":
        time= datetime.now().strftime("%H:%M    %d-%m-%Y")
        content = request.form['content']
        if user.strip() and content.strip():
                response = supabase.from_('post').insert({
            'user': user,
            'content': content,
            'Date_Time': time
        }).execute()
        if response.get("status_code") == 201:
            return jsonify({'message': 'Post added successfully!'})
        else:
            return jsonify({'error': response.get("error")}), 400
        
       

    response = supabase.from_('post').select('*').order('Date_Time', desc=True).execute()
    print(response)
    if response.get("status_code") == 200:
        posts = response.get("data")
    else:
        posts = []
    return render_template('comm.html', phone=user, posts=posts)



@app.route("/crop_Suggestion")
def crop_Suggestion():
    phone = session.get('phone')
    return render_template("crop_sugg.html", phone=phone)

@app.route("/market/")
def market():
    phone = session.get('phone')
    return render_template("market.html", phone=phone)


@app.route("/soil_health/")
def soil_Healh():
    phone = session.get('phone')
    return render_template("soil_health.html", phone=phone)

@app.route("/farmer_login", methods=["GET", "POST"])
def farmer_login():
    if request.method == "POST":
        phoneNumber= request.form.get("phone")
        pincode= request.form.get("pincode")
        if phoneNumber and pincode:
            session['phone'] = phoneNumber
            session['pincode']= pincode
            print(f"{phoneNumber} joined from {pincode}")
            return redirect(url_for('home'))
        
        return redirect("/")
    return render_template("farmer_login.html")

@app.route("/logout")
def logout():
    session.pop('phone', None)
    return redirect(url_for('home'))

if __name__ == "__main__":
    # with app.app_context():
        # db.create_all()
    app.run(debug=True)
