# backend/src/services/piston_service.py
import requests
import os

# 1. Define la URL base según tu variable de entorno
PISTON_API_URL = os.getenv('PISTON_API_URL', 'http://localhost:2000/api/v2')

def execute_code(source_code, language, stdin=''):
    """
    Ejecuta código enviándolo a Piston API.
    """
    # Mapea los nombres de lenguajes a como los entiende Piston.
    language_map = {
        'python': 'python',
        'javascript': 'javascript', # Node.js
        'java': 'java',
        'cpp': 'cpp',
    }

    piston_lang = language_map.get(language.lower())
    if not piston_lang:
        return {
            'status': 'error',
            'output': None,
            'error': f'Lenguaje no soportado: {language}'
        }

    # Construye el payload de la petición a Piston
    url = f"{PISTON_API_URL}/execute"
    payload = {
        "language": piston_lang,
        "version": "*",           # Usa la última versión disponible
        "files": [{"content": source_code}],
        "stdin": stdin
    }
    headers = {'Content-Type': 'application/json'}

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        result = response.json()

        # Analiza la respuesta de Piston
        if result.get('run'):
            # El campo 'code' es 0 si no hay error
            if result['run'].get('code') == 0:
                return {'status': 'accepted', 'output': result['run'].get('stdout'), 'error': None}
            else:
                # Si hay error, puede venir en stderr o stdout
                error_msg = result['run'].get('stderr') or result['run'].get('stdout')
                return {'status': 'runtime_error', 'output': None, 'error': error_msg}
        else:
            return {'status': 'error', 'output': None, 'error': 'Respuesta inesperada de Piston'}

    except requests.exceptions.Timeout:
        return {'status': 'error', 'output': None, 'error': 'Tiempo de espera agotado con Piston'}
    except requests.exceptions.RequestException as e:
        return {'status': 'error', 'output': None, 'error': f'Error de comunicación: {str(e)}'}