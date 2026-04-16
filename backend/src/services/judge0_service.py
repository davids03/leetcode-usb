import time
import random

def execute_code(source_code, language, stdin=''):
    # Simula una respuesta exitosa
    # Para simular errores, puedes cambiar 'accepted' por 'compile_error' o 'runtime_error' de manera aleatoria o según el código.

    # Lógica simple para simular un error de compilación si el código está vacío
    if not source_code or source_code.strip() == "":
        return {
            'status': 'compile_error',
            'output': None,
            'error': 'Error de compilación simulado: el código no puede estar vacío.'
        }

    # Simula un error de ejecución si el código contiene "error"
    if "error" in source_code.lower():
        return {
            'status': 'runtime_error',
            'output': None,
            'error': 'Error de ejecución simulado: se encontró un problema en el código.'
        }

    # Respuesta de éxito por defecto
    return {
        'status': 'accepted',
        'output': f"Salida simulada para entrada: {stdin}",
        'error': None
    }