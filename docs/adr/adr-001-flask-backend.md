# ADR-001: Uso de Flask como framework backend

## Estado
Aceptado

## Contexto
La plataforma requiere una API REST que maneje autenticación, gestión de problemas, ejecución de código y casos de prueba. El docente estableció **Python** como lenguaje de backend, pero no especificó un framework obligatorio. El equipo debe elegir entre Flask, Django REST Framework (DRF) y FastAPI.

Criterios considerados:
- Curva de aprendizaje para estudiantes de primer año.
- Tamaño del proyecto (alcance del corte dos: 4 HUs).
- Facilidad de integración con MySQL, JWT y Judge0.
- Legibilidad del código para revisiones académicas.

## Decisión
Se utilizará **Flask** con las siguientes extensiones:
- `Flask-SQLAlchemy` para ORM.
- `Flask-JWT-Extended` para autenticación stateless.
- `Flask-CORS` para comunicación con frontend React.
- `Flask-Bcrypt` para hashing de contraseñas.
- `python-dotenv` para configuración.

La API se organizará en blueprints: `auth`, `problems`, `submissions`, `test_cases`.

## Consecuencias
**Positivas:**
- Código explícito y minimalista, ideal para entender cada capa (rutas, controladores, servicios).
- Integración directa con SQLAlchemy y Judge0 sin capas adicionales.
- El equipo puede desarrollar rápidamente porque Flask no impone estructura rígida.
- Cumple exactamente el lineamiento del docente.

**Negativas:**
- Mayor responsabilidad en estructura y seguridad (no hay protección contra CSRF por defecto, se debe configurar CORS adecuadamente).
- Para alta concurrencia (futuro escalamiento), Flask síncrono podría requerir workers adicionales (Gunicorn con gevent o multiproceso).

## Opciones consideradas
- **Django REST Framework**: ORM potente, admin integrado, autenticación completa. Descartado por su curva de aprendizaje y sobreingeniería para el alcance actual.
- **FastAPI**: Asíncrono, documentación automática, validación con Pydantic. Descartado por no ser el framework solicitado por el docente y por menor alineación con el perfil académico.