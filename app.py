from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
import randfacts as rf

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///facts.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Fact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fact_text = db.Column(db.String(500), nullable=False)

def init_db():
    with app.app_context():
        db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_fact')
def get_fact():
    fact = rf.get_fact()
    new_fact = Fact(fact_text=fact)
    db.session.add(new_fact)
    db.session.commit()
    return jsonify({'fact': fact})

@app.route('/history')
def history():
    facts = Fact.query.order_by(Fact.id.desc()).all()
    return jsonify([fact.fact_text for fact in facts])

@app.route('/clear_history')
def clear_history():
    db.session.query(Fact).delete()
    db.session.commit()
    return jsonify({"message": "History cleared!"})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
