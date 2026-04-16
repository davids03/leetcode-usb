from src.extensions import db
from datetime import datetime

class Problem(db.Model):
    __tablename__ = 'problems'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.Enum('easy', 'medium', 'hard'), nullable=False)
    category = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    test_cases = db.relationship('TestCase', backref='problem', lazy=True, cascade='all, delete-orphan')