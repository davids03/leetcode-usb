from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.extensions import db
from src.models import Submission, SubmissionResult, Problem, TestCase
from src.services.judge0_service import execute_code

bp = Blueprint('submissions', __name__, url_prefix='/api/submissions')

@bp.route('/', methods=['POST'])
@jwt_required()
def submit_code():
    """
    Recibe: { problem_id, language, code }
    Ejecuta contra TODOS los casos de prueba del problema (públicos y privados)
    y guarda los resultados.
    """
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

    # Obtener TODOS los casos de prueba (públicos y privados)
    # print("2. Casos de prueba obtenidos:", len(test_cases))
    test_cases = TestCase.query.filter_by(problem_id=problem_id).all()
    if not test_cases:
        return jsonify({'msg': 'El problema no tiene casos de prueba'}), 400

    # Crear registro de Submission
    submission = Submission(
        user_id=user_id,
        problem_id=problem_id,
        language=language,
        code=code,
        status='pending'
    )
    db.session.add(submission)
    db.session.commit()

    # Ejecutar contra cada caso de prueba
    results = []
    all_passed = True
    final_status = 'accepted'

    for tc in test_cases:
        # Ejecutar código con la entrada del caso
        # print(f"3. Ejecutando caso {tc.id} con entrada: {tc.input_data}")
        judge_result = execute_code(code, language, stdin=tc.input_data)
        # print(f"4. Resultado de Judge0: {judge_result}")
        
        # Comparar salida obtenida vs esperada (si no hubo error)
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

        # Guardar resultado individual
        sub_result = SubmissionResult(
            submission_id=submission.id,
            test_case_id=tc.id,
            status=judge_result['status'],
            output=judge_result.get('output') or judge_result.get('error'),
            exec_time_ms=0  # Judge0 no da tiempo fácilmente, se puede omitir
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

    # Actualizar estado global del submission
    if all_passed:
        submission.status = 'accepted'
    else:
        submission.status = final_status
    db.session.commit()

    return jsonify({
        'submission_id': submission.id,
        'status': submission.status,
        'results': results
    }), 200