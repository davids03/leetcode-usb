import os
import sys
# Añadir la carpeta 'backend' al path para que 'src' sea reconocido
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from src.extensions import db, bcrypt, jwt

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600
    
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    CORS(app)
    
    from src.models.user import User
    from src.models.problem import Problem
    from src.models.test_case import TestCase
    from src.models.submission import Submission
    from src.models.submission_result import SubmissionResult
    
    with app.app_context():
        db.create_all()
    
    @app.route('/health', methods=['GET'])
    def health():
        return jsonify({"status": "ok"}), 200
    
    from src.routes.auth_routes import bp as auth_bp
    from src.routes.problem_routes import bp as problem_bp
    from src.routes.submission_routes import bp as submission_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(problem_bp)
    app.register_blueprint(submission_bp)


    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)