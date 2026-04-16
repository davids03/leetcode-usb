from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.problem import Problem
from src.models.test_case import TestCase

bp = Blueprint('problems', __name__, url_prefix='/api/problems')

@bp.route('/', methods=['GET'])
@jwt_required()
def get_problems():
    difficulty = request.args.get('difficulty')
    query = Problem.query
    if difficulty:
        query = query.filter_by(difficulty=difficulty)
    problems = query.all()
    return jsonify([{
        "id": p.id,
        "title": p.title,
        "difficulty": p.difficulty,
        "category": p.category
    } for p in problems]), 200

@bp.route('/<int:problem_id>', methods=['GET'])
@jwt_required()
def get_problem_detail(problem_id):
    problem = Problem.query.get_or_404(problem_id)
    test_cases = TestCase.query.filter_by(problem_id=problem_id, is_public=True).all()
    return jsonify({
        "id": problem.id,
        "title": problem.title,
        "description": problem.description,
        "difficulty": problem.difficulty,
        "category": problem.category,
        "test_cases": [{
            "id": tc.id,
            "description": tc.description,
            "input": tc.input_data,
            "expected_output": tc.expected_output
        } for tc in test_cases]
    }), 200