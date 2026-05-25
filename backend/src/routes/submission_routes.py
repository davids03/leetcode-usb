from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.extensions import db
from src.models import Submission, SubmissionResult, Problem, TestCase
from src.services.judge0_service import execute_code
from ..utils.logger import log_action   # importación relativa correcta

bp = Blueprint('submissions', __name__, url_prefix='/api/submissions')

@bp.route('/', methods=['POST'])
@jwt_required()
def submit_code():
    data = request.get_json()
    problem_id = data.get('problem_id')
    language = data.get('language')
    code = data.get('code')
    user_id = get_jwt_identity()

    if not all([problem_id, language, code]):
        return jsonify({'msg': 'Faltan campos: problem_id, language, code'}), 400

    problem = Problem.query.get(problem_id)
    if not problem:
        return jsonify({'msg': 'Problema no encontrado'}), 404

    test_cases = TestCase.query.filter_by(problem_id=problem_id).all()
    if not test_cases:
        return jsonify({'msg': 'El problema no tiene casos de prueba'}), 400

    submission = Submission(
        user_id=user_id,
        problem_id=problem_id,
        language=language,
        code=code,
        status='pending'
    )
    db.session.add(submission)
    db.session.commit()

    results = []
    all_passed = True
    final_status = 'accepted'

    for tc in test_cases:
        judge_result = execute_code(code, language, stdin=tc.input_data)
        
        passed = False
        if judge_result['status'] == 'accepted':
            obtained = judge_result['output'].strip()
            expected = tc.expected_output.strip()
            if obtained == expected:
                passed = True
            else:
                passed = False
                judge_result['status'] = 'wrong_answer'
                all_passed = False
                final_status = 'wrong_answer'
        else:
            all_passed = False
            if judge_result['status'] == 'compile_error':
                final_status = 'compile_error'
            elif judge_result['status'] == 'runtime_error':
                final_status = 'runtime_error'
            else:
                final_status = 'error'

        sub_result = SubmissionResult(
            submission_id=submission.id,
            test_case_id=tc.id,
            status=judge_result['status'],
            output=judge_result.get('output') or judge_result.get('error'),
            exec_time_ms=0
        )
        db.session.add(sub_result)
        results.append({
            'test_case_id': tc.id,
            'input': tc.input_data,
            'expected': tc.expected_output,
            'output': judge_result.get('output'),
            'error': judge_result.get('error'),
            'passed': passed
        })

    if all_passed:
        submission.status = 'accepted'
    else:
        submission.status = final_status
    db.session.commit()

    # Registrar el evento en el log (HU5)
    from src.models.user import User
    user = User.query.get(user_id)
    if user:
        log_action(
            user_id=user.id,
            username=user.username,
            action='submission',
            details=f"problem_id={problem_id}, submission_id={submission.id}, status={submission.status}",
            ip_address=request.remote_addr
        )

    return jsonify({
        'submission_id': submission.id,
        'status': submission.status,
        'results': results
    }), 200