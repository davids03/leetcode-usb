from src.extensions import db

class SubmissionResult(db.Model):
    __tablename__ = 'submission_results'
    
    id = db.Column(db.Integer, primary_key=True)
    submission_id = db.Column(db.Integer, db.ForeignKey('submissions.id'), nullable=False)
    test_case_id = db.Column(db.Integer, db.ForeignKey('test_cases.id'), nullable=False)
    status = db.Column(db.String(30))
    output = db.Column(db.Text)
    exec_time_ms = db.Column(db.Integer)