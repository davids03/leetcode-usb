import subprocess
import tempfile
import os
import sys
import shutil
import re

LANG_CONFIG = {
    'python': {
        'ext': '.py',
        'compile_cmd': None,
        'run_cmd': lambda f: [sys.executable, f],
        'cleanup': None
    },
    'javascript': {
        'ext': '.js',
        'compile_cmd': None,
        'run_cmd': lambda f: ['node', f],
        'cleanup': None
    },
    'java': {
        'ext': '.java',
        'compile_cmd': lambda f: ['javac', f],
        'run_cmd': lambda f: ['java', '-cp', os.path.dirname(f), os.path.splitext(os.path.basename(f))[0]],
        'cleanup': lambda d: [os.path.join(d, f) for f in os.listdir(d) if f.endswith('.class')]
    },
    'cpp': {
        'ext': '.cpp',
        'compile_cmd': lambda f: ['g++', f, '-o', os.path.splitext(f)[0]],
        'run_cmd': lambda f: [os.path.splitext(f)[0]],
        'cleanup': lambda d: [os.path.join(d, f) for f in os.listdir(d) if f.endswith('.exe') or (not os.path.splitext(f)[1] and f != os.path.basename(d))]
    }
}

def execute_code(source_code, language, stdin=''):
    lang = language.lower()
    if lang not in LANG_CONFIG:
        return {
            'status': 'error',
            'output': None,
            'error': f'Lenguaje "{lang}" no soportado. Opciones: {list(LANG_CONFIG.keys())}'
        }

    config = LANG_CONFIG[lang]
    temp_dir = tempfile.mkdtemp()
    file_path = os.path.join(temp_dir, f'solution{config["ext"]}')

    try:
        # Escribir código fuente
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(source_code)

        # Compilar si es necesario
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

        # Ejecutar
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
            output = run_result.stdout.strip()
            return {
                'status': 'accepted',
                'output': output if output else '(sin salida)',
                'error': None
            }

    except subprocess.TimeoutExpired:
        return {
            'status': 'runtime_error',
            'output': None,
            'error': 'Tiempo de ejecución excedido (límite: 5 segundos)'
        }
    except Exception as e:
        return {
            'status': 'error',
            'output': None,
            'error': f'Error interno: {str(e)}'
        }
    finally:
        # Limpiar archivos temporales
        shutil.rmtree(temp_dir, ignore_errors=True)

def _clean_error(error_msg, file_path, temp_dir):
    if not error_msg:
        return None
    # Reemplazar rutas absolutas por marcadores
    base_name = os.path.basename(file_path)
    clean = error_msg.replace(temp_dir, '[temp]')
    clean = clean.replace(file_path, f'[temp]/{base_name}')
    # Eliminar líneas que contienen rutas del sistema (opcional)
    lines = clean.split('\n')
    filtered = [line for line in lines if not re.search(r'C:\\|/usr/|/bin/', line)]
    result = '\n'.join(filtered[:10])
    return result if result else 'Error desconocido'