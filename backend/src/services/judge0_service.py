# backend/src/services/judge0_service.py
import subprocess
import tempfile
import os
import shutil
import sys
import platform

# Verificar disponibilidad de comandos
def _check_command(cmd):
    return shutil.which(cmd) is not None

LANG_CONFIG = {
    'python': {
        'ext': '.py',
        'compile_cmd': None,
        'run_cmd': lambda f: [sys.executable, f],
        'available': True,  # siempre disponible
        'version': 'Python'
    },
    'javascript': {
        'ext': '.js',
        'compile_cmd': None,
        'run_cmd': lambda f: ['node', f],
        'available': _check_command('node'),
        'version': 'Node.js'
    },
    'java': {
        'ext': '.java',
        'compile_cmd': lambda f: ['javac', f],
        'run_cmd': lambda f: ['java', '-cp', os.path.dirname(f), os.path.splitext(os.path.basename(f))[0]],
        'available': _check_command('javac') and _check_command('java'),
        'version': 'Java'
    },
    'cpp': {
        'ext': '.cpp',
        'compile_cmd': lambda f: ['g++', f, '-o', os.path.splitext(f)[0]],
        'run_cmd': lambda f: [os.path.splitext(f)[0]],
        'available': _check_command('g++'),
        'version': 'C++ (GCC)'
    }
}

def execute_code(source_code, language, stdin=''):
    lang = language.lower()
    if lang not in LANG_CONFIG:
        return {
            'status': 'error',
            'output': None,
            'error': f'Lenguaje "{lang}" no soportado.'
        }
    config = LANG_CONFIG[lang]
    if not config['available']:
        return {
            'status': 'error',
            'output': None,
            'error': f'El lenguaje {lang} no está disponible en el servidor. Faltan los binarios necesarios.'
        }
    
    temp_dir = tempfile.mkdtemp()
    file_path = os.path.join(temp_dir, f'solution{config["ext"]}')
    
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(source_code)
        
        # Compilación
        if config['compile_cmd']:
            compile_cmd = config['compile_cmd'](file_path)
            compile_result = subprocess.run(
                compile_cmd,
                capture_output=True,
                text=True,
                timeout=10,
                cwd=temp_dir
            )
            if compile_result.returncode != 0:
                error_msg = _clean_error(compile_result.stderr, file_path, temp_dir)
                return {
                    'status': 'compile_error',
                    'output': None,
                    'error': error_msg or 'Error de compilación'
                }
        
        # Ejecución
        run_cmd = config['run_cmd'](file_path)
        run_result = subprocess.run(
            run_cmd,
            input=stdin,
            capture_output=True,
            text=True,
            timeout=5,
            cwd=temp_dir
        )
        if run_result.returncode != 0:
            error_msg = _clean_error(run_result.stderr, file_path, temp_dir)
            return {
                'status': 'runtime_error',
                'output': None,
                'error': error_msg or 'Error en ejecución'
            }
        else:
            return {
                'status': 'accepted',
                'output': run_result.stdout.strip() or '(sin salida)',
                'error': None
            }
    except subprocess.TimeoutExpired:
        return {
            'status': 'runtime_error',
            'output': None,
            'error': 'Tiempo límite excedido'
        }
    except Exception as e:
        return {
            'status': 'error',
            'output': None,
            'error': str(e)
        }
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

def _clean_error(error_msg, file_path, temp_dir):
    if not error_msg:
        return None
    clean = error_msg.replace(temp_dir, '[temp]').replace(file_path, '[solution]')
    lines = clean.split('\n')
    # Limitar a primeras 5 líneas
    return '\n'.join(lines[:5]) if lines else 'Error desconocido'