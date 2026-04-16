from src.extensions import db
from datetime import datetime

class Submission(db.Model):
    __tablename__ = 'submissions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    problem_id = db.Column(db.Integer, db.ForeignKey('problems.id'), nullable=False)
    language = db.Column(db.String(50), nullable=False)
    code = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(30), default='pending')
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    results = db.relationship('SubmissionResult', backref='submission', lazy=True)