import sys
import os

# Añadir la ruta de la carpeta 'backend' al path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from src.app import create_app
from src.extensions import db
from src.models.problem import Problem
from src.models.test_case import TestCase

app = create_app()
with app.app_context():
    # Limpiar y crear tablas
    db.drop_all()
    db.create_all()
    
    # Problema 1
    p1 = Problem(
        title="Suma de dos números",
        description="Dados dos enteros separados por espacio, retorna su suma.",
        difficulty="easy",
        category="Matemáticas"
    )
    db.session.add(p1)
    db.session.flush()
    db.session.add_all([
        TestCase(problem_id=p1.id, input_data="3 5", expected_output="8", is_public=True, description="Caso 1: positivos"),
        TestCase(problem_id=p1.id, input_data="-1 10", expected_output="9", is_public=True, description="Caso 2: negativo")
    ])
    
    # Problema 2
    p2 = Problem(
        title="Par o impar",
        description="Dado un número entero, retorna 'par' o 'impar'.",
        difficulty="easy",
        category="Condicionales"
    )
    db.session.add(p2)
    db.session.flush()
    db.session.add_all([
        TestCase(problem_id=p2.id, input_data="4", expected_output="par", is_public=True),
        TestCase(problem_id=p2.id, input_data="7", expected_output="impar", is_public=True)
    ])
    
    # Problema 3
    p3 = Problem(
        title="Factorial",
        description="Calcula el factorial de n (n <= 10).",
        difficulty="medium",
        category="Recursión"
    )
    db.session.add(p3)
    db.session.flush()
    db.session.add_all([
        TestCase(problem_id=p3.id, input_data="5", expected_output="120", is_public=True),
        TestCase(problem_id=p3.id, input_data="0", expected_output="1", is_public=True)
    ])
    
    db.session.commit()
    print("Base de datos reiniciada y poblada con 3 problemas y casos de prueba.")