from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.extensions import db
from src.models import User, Problem, TestCase
from ..utils.logger import log_action

bp = Blueprint('admin_problems', __name__, url_prefix='/api/admin/problems')

@bp.route('/', methods=['POST'])
@jwt_required()
def create_problem():
    # Verificar que el usuario sea administrador
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user or user.role != 'admin':
        return jsonify({"msg": "Acceso denegado. Se requieren privilegios de administrador."}), 403

    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    difficulty = data.get('difficulty')
    category = data.get('category')
    test_cases = data.get('test_cases', [])  # lista de objetos con input, expected_output, is_public, description

    # Validar campos obligatorios
    if not all([title, description, difficulty, category]):
        return jsonify({"msg": "Faltan campos requeridos: title, description, difficulty, category"}), 400

    if difficulty not in ['easy', 'medium', 'hard']:
        return jsonify({"msg": "Dificultad debe ser 'easy', 'medium' o 'hard'"}), 400

    # Crear el problema
    problem = Problem(
        title=title,
        description=description,
        difficulty=difficulty,
        category=category
    )
    db.session.add(problem)
    db.session.flush()  # Obtener el ID del problema antes de commit

    # Crear casos de prueba
    for tc in test_cases:
        input_data = tc.get('input')
        expected_output = tc.get('expected_output')
        is_public = tc.get('is_public', True)  # por defecto público
        description_tc = tc.get('description', '')
        if not input_data or not expected_output:
            continue  # omitir casos incompletos
        test_case = TestCase(
            problem_id=problem.id,
            input_data=input_data,
            expected_output=expected_output,
            is_public=is_public,
            description=description_tc
        )
        db.session.add(test_case)

    db.session.commit()

    # Registrar la acción en el log
    log_action(
        user_id=user.id,
        username=user.username,
        action='create_problem',
        details=f"problem_id={problem.id}, title={title}",
        ip_address=request.remote_addr
    )

    return jsonify({
        "msg": "Problema creado exitosamente",
        "problem_id": problem.id
    }), 201