# backend/src/utils.py
from functools import wraps
from flask import request
from flask_jwt_extended import verify_jwt_in_request

def jwt_required_except_options(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if request.method == 'OPTIONS':
            return '', 200
        verify_jwt_in_request()
        return fn(*args, **kwargs)
    return wrapper