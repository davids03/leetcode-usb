from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from src.extensions import db
from src.models.user import User

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data.get('username') or not data.get('password') or not data.get('email'):
        return jsonify({"msg": "Faltan campos"}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"msg": "Usuario ya existe"}), 409
    
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "Usuario creado"}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()
    if not user or not user.check_password(data.get('password')):
        return jsonify({"msg": "Credenciales inválidas"}), 401
    
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": access_token, "user": user.to_dict()}), 200