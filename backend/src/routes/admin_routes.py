from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models import User, Log
from src.extensions import db

bp = Blueprint('admin_logs', __name__, url_prefix='/api/admin')

@bp.route('/logs', methods=['GET'])
@jwt_required()
def get_logs():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user or user.role != 'admin':
        return jsonify({"msg": "Acceso denegado. Se requieren privilegios de administrador."}), 403

    username = request.args.get('username')
    action = request.args.get('action')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    query = Log.query

    if username:
        query = query.filter(Log.username == username)
    if action:
        query = query.filter(Log.action == action)
    if start_date:
        query = query.filter(Log.created_at >= start_date)
    if end_date:
        query = query.filter(Log.created_at <= end_date + ' 23:59:59')

    logs = query.order_by(Log.created_at.desc()).all()

    return jsonify([{
        'id': l.id,
        'username': l.username,
        'action': l.action,
        'details': l.details,
        'ip_address': l.ip_address,
        'created_at': l.created_at.isoformat()
    } for l in logs]), 200

@bp.route('/users', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_users():
    if request.method == 'OPTIONS':
        return '', 200
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user or user.role != 'admin':
        return jsonify({"msg": "Acceso denegado"}), 403

    role_filter = request.args.get('role')
    query = User.query
    if role_filter:
        query = query.filter(User.role == role_filter)
    users = query.order_by(User.created_at.desc()).all()
    return jsonify([{
        'id': u.id,
        'username': u.username,
        'email': u.email,
        'role': u.role,
        'created_at': u.created_at.isoformat()
    } for u in users]), 200
