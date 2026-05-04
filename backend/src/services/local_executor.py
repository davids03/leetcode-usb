import subprocess
import tempfile
import os
import re

def execute_python_code(source_code, stdin=''):
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, encoding='utf-8') as f:
        f.write(source_code)
        temp_file = f.name

    try:
        result = subprocess.run(
            ['python', temp_file],
            input=stdin,
            capture_output=True,
            text=True,
            timeout=5
        )
    except subprocess.TimeoutExpired:
        os.unlink(temp_file)
        return {'status': 'runtime_error', 'output': None, 'error': 'Tiempo límite excedido (5 segundos).'}
    except Exception as e:
        os.unlink(temp_file)
        return {'status': 'error', 'output': None, 'error': f'Error interno: {str(e)}'}

    os.unlink(temp_file)

    if result.returncode == 0:
        return {'status': 'accepted', 'output': result.stdout, 'error': None}
    else:
        error_msg = result.stderr.strip()
        error_msg = re.sub(r'File ".*\.py"', 'File "<código>"', error_msg)
        if 'SyntaxError' in error_msg or 'IndentationError' in error_msg:
            return {'status': 'compile_error', 'output': None, 'error': error_msg}
        else:
            return {'status': 'runtime_error', 'output': None, 'error': error_msg}