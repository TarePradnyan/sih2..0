from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Database setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database model for posts
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text, nullable=False)

# Community page
@app.route("/community/", methods=["GET", "POST"])
def community():
    if request.method == "POST":
        user = request.form['user']
        content = request.form['content']
        if user.strip() and content.strip():
            new_post = Post(user=user, content=content)
            db.session.add(new_post)
            db.session.commit()
        return redirect(url_for("community"))

    posts = Post.query.order_by(Post.id.desc()).all()
    return render_template("comm.html", posts=posts)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
