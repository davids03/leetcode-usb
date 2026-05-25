from ..extensions import db
from datetime import datetime

class Log(db.Model):
    __tablename__ = 'logs'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    username = db.Column(db.String(80), nullable=False)  # copia del username para búsquedas rápidas
    action = db.Column(db.String(50), nullable=False)    # 'login', 'submission', 'create_problem', etc.
    details = db.Column(db.Text, nullable=True)          # información extra (ej: problem_id)
    ip_address = db.Column(db.String(45), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='logs')