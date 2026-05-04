from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models.problem import Problem
from src.models.test_case import TestCase

problems_bp = Blueprint('problems', __name__, url_prefix='/problems')

@problems_bp.route('', methods=['GET', 'OPTIONS'])
def get_problems():
    if request.method == 'OPTIONS':
        return '', 200
    jwt_required()
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

@problems_bp.route('/<int:problem_id>', methods=['GET', 'OPTIONS'])
def get_problem_detail(problem_id):
    if request.method == 'OPTIONS':
        return '', 200
    jwt_required()
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