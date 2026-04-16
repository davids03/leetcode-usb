# ADR-002: Uso de MySQL como motor de base de datos

## Estado
Aceptado

## Contexto
La plataforma necesita persistir usuarios, problemas, casos de prueba, envíos y resultados. Se requiere:
- Integridad referencial (claves foráneas).
- Consultas eficientes (índices por usuario, problema, estado).
- Soporte para datos semiestructurados (resultados de cada caso de prueba).
- Migraciones versionadas (aunque en el corte dos se usa `db.create_all()` por simplicidad).

Las alternativas evaluadas son: MySQL, PostgreSQL, SQLite (solo desarrollo) y MongoDB (NoSQL).

## Decisión
Se elige **MySQL (versión 8.0)** como motor de base de datos, **SQLAlchemy** como ORM y (opcionalmente) **Alembic** para migraciones. El modelo de datos incluye `User`, `Problem`, `TestCase`, `Submission`, `SubmissionResult` y `RefreshToken`. Se usa el tipo `JSON` de MySQL para almacenar resultados detallados por caso (aunque en la práctica se usan columnas separadas por simplicidad).

La cadena de conexión se define en variable de entorno `DATABASE_URL` con el dialecto `mysql+pymysql://`. En desarrollo local se puede usar SQLite cambiando la URL, gracias a la abstracción de SQLAlchemy.

## Consecuencias
**Positivas:**
- MySQL es ampliamente adoptado, con gran cantidad de documentación y soporte comunitario.
- Excelente rendimiento en operaciones de lectura intensiva, típicas de una plataforma donde los estudiantes consultan problemas y ven resultados.
- El tipo `JSON` permite almacenar resultados de ejecución sin esquema fijo, manteniendo flexibilidad.
- La combinación MySQL + InnoDB garantiza integridad referencial y transacciones ACID.

**Negativas:**
- MySQL tiene algunas diferencias con el estándar SQL (por ejemplo, manejo de `ON DELETE CASCADE` requiere InnoDB, que ya está asegurado).
- En configuraciones por defecto, puede tener problemas con `utf8mb4` para emojis o caracteres especiales; se debe configurar explícitamente la codificación.
- La concurrencia de escritura (envíos de código) es moderada; MySQL maneja bien hasta miles de transacciones por segundo.

## Opciones consideradas
- **PostgreSQL**: Mayor cumplimiento de estándar SQL, JSONB más potente. Descartado por menor familiaridad del equipo y porque MySQL es suficiente para el alcance.
- **SQLite**: Sin servidor, archivo único, ideal para desarrollo. Descartado para producción por falta de concurrencia real.
- **MongoDB**: Sin integridad referencial nativa, consultas complejas entre colecciones. Descartado porque el modelo es mayormente relacional.