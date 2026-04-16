# Definition of Done (DoD) – Sprint Corte Dos

Una **historia de usuario** o **tarea técnica** se considera **TERMINADA** solo cuando cumple **todos** los siguientes criterios.

---

## 1. Criterios funcionales (basados en las HUs)

- [ ] **La implementación satisface todos los criterios de aceptación** de la HU correspondiente (según el documento de requisitos).
- [ ] **Las validaciones de entrada y salida** se manejan según lo especificado:
  - Mensajes de error genéricos en login (no se revelan detalles de seguridad).
  - Errores de compilación/ejecución sin exposición de rutas internas.
- [ ] **Los casos de prueba públicos** (HU4) se ejecutan correctamente contra la solución del estudiante, mostrando estado “Aprobado/Fallo” por cada caso.
- [ ] **El flujo completo** (inicio de sesión → listado de problemas → detalle con ejemplos → ejecución simulado) funciona sin intervención manual en el entorno de desarrollo.

---

## 2. Criterios técnicos y de calidad

- [ ] **El código pasa las pruebas automatizadas** definidas para esa HU (unitarias e integración). Al menos:
  - Pruebas de endpoints críticos (auth, problemas, envío simulado).
  - Pruebas de seguridad básica (inyección SQL, XSS en editor).
- [ ] **No hay errores de compilación o linting**:
  - Frontend: ESLint (sin errores).
  - Backend: Flake8 o equivalente (sin errores graves).
- [ ] **La base de datos** tiene el esquema actualizado (usando `db.create_all()` o migraciones Alembic) y refleja los modelos sin conflictos.
- [ ] **El código sigue los estándares de estilo** del proyecto:
  - Python: PEP8.
  - JavaScript/React: Airbnb o estándar recomendado.
- [ ] **No hay vulnerabilidades conocidas** en dependencias críticas (revisión con `npm audit` y `safety check`).

---

## 3. Criterios de documentación

- [ ] **La funcionalidad nueva está documentada** en el `README.md` (si es relevante para el usuario o desarrollador).
- [ ] **Los endpoints nuevos** están documentados (al menos en comentarios del código o en un archivo `API.md`).
- [ ] **Se actualizó el diagrama C4** si la arquitectura cambió (no aplica para este corte, pero se verifica).
- [ ] **Los ADRs relevantes** se crearon o actualizaron (ej: decisión de simular ejecución de código).

---

## 4. Criterios de integración y despliegue

- [ ] **La rama de la característica** se integró a `develop` (o `main`) mediante **pull request** revisado por al menos otro miembro del equipo.
- [ ] **La integración continua (CI)** pasa exitosamente (si está configurada: pruebas, linting).
- [ ] **La funcionalidad se probó en entorno local** con el stack completo (Flask, MySQL, React).
- [ ] **No hay regresiones** en funcionalidades ya terminadas (se ejecutan pruebas de humo manuales).

---

## 5. Criterios de experiencia de usuario (UX)

- [ ] **Los mensajes de error** son legibles, no técnicos y no revelan información interna.
- [ ] **La interfaz responde** en menos de 2 segundos para operaciones habituales (listado, detalle de problema, ejecución simulada).
- [ ] **El editor de código** (Monaco) muestra resaltado de sintaxis, numeración de líneas y permite escribir/editar cómodamente.
- [ ] **La navegación** entre páginas (login → problemas → detalle → volver) es intuitiva y mantiene el estado de autenticación.

---

## 6. Criterios de seguridad (específicos del proyecto)

- [ ] **Las contraseñas** se almacenan con hash bcrypt (costo 12).
- [ ] **Los JWT** tienen tiempo de expiración configurado (`JWT_ACCESS_TOKEN_EXPIRES`) y se validan en cada endpoint protegido.
- [ ] **La ejecución de código** (aunque simulada) no permite acceso al sistema de archivos ni comandos del servidor. En la simulación, no se ejecuta código real.
- [ ] **Las variables sensibles** (secret keys, contraseñas DB) se gestionan con `.env` y no están en el repositorio.
- [ ] **CORS** está configurado para permitir solo el origen del frontend en desarrollo (`http://localhost:5173`).

---

## 7. Aceptación final por el Product Owner

- [ ] **El product owner (docente o representante)** ha verificado la HU en una demo y la acepta como completada.
- [ ] **Los criterios de aceptación** definidos en las HUs se cumplen al 100% (o se justifica técnicamente si algún criterio se posterga).

---

## Notas adicionales

- La DoD puede evolucionar durante el sprint si el equipo identifica nuevos criterios, pero cualquier cambio debe ser consensuado y documentado.
- Para tareas técnicas que no son HU (ej: configuración de Judge0, ajustes de CORS), se aplican los criterios 2, 3, 4 y 6, más la verificación de que la tarea cumple su objetivo definido en el tablero Kanban.
- En caso de usar simulación de ejecución de código (ADR-004), se acepta temporalmente que no se ejecute código real, siempre que la interfaz y el flujo de datos funcionen correctamente.