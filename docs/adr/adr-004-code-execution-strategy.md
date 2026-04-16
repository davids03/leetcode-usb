# ADR-004: Estrategia de ejecución de código (simulación inicial, migración futura a Judge0)

## Estado
Aceptado (con planes de evolución)

## Contexto
La HU3 y HU4 requieren ejecutar código enviado por estudiantes de forma segura y aislada, mostrando errores de compilación, ejecución y resultados contra casos de prueba. Durante el desarrollo, la configuración de Judge0 en Windows presentó problemas persistentes (sandbox `/box` no accesible). Se necesita una solución que permita avanzar con la lógica del frontend y backend, sin bloquear el proyecto.

## Decisión
**Fase 1 (desarrollo inmediato):** Implementar un **servicio simulado (mock)** en `judge0_service.py` que devuelva resultados predecibles sin ejecutar código real. Este mock permite probar el flujo completo (autenticación, envío, guardado en base de datos, visualización de resultados) sin depender de infraestructura externa. La simulación incluye:
- Éxito (`accepted`) para la mayoría de los casos.
- Errores simulados (`compile_error`, `runtime_error`) si el código está vacío o contiene palabras clave como "error".

**Fase 2 (futuro):** Migrar a una solución real de ejecución de código. Las alternativas consideradas son:
- **Judge0 (oficial)**: Requiere WSL2 o Linux para funcionar correctamente en Windows. Se intentó pero no se logró estabilizar en el tiempo disponible.
- **Piston API**: Más ligera y fácil de auto-alojar, con soporte para múltiples lenguajes.
- **Servicio en la nube (Judge0 CE demo)**: Usar la API pública `https://ce.judge0.com` para pruebas, con límites de uso.

## Consecuencias
**Positivas (simulación):**
- Permite completar el desarrollo del frontend y backend sin bloqueos.
- Fácil de modificar para probar diferentes escenarios (errores, tiempos de espera).
- No requiere recursos adicionales (Docker, WSL2).

**Negativas (simulación):**
- No ejecuta código real, por lo que no se puede validar la corrección de las soluciones de los estudiantes en un entorno real.
- No es adecuada para producción o demostración final con funcionalidad completa.

**Plan de migración:**
- Una vez que el proyecto esté funcional, se dedicará tiempo a configurar correctamente Judge0 en WSL2 (o usar Piston API).
- Se reemplazará el mock por el servicio real sin modificar la interfaz del endpoint, asegurando compatibilidad.

## Opciones consideradas
- **Judge0 nativo en Windows**: Descartado por problemas de compatibilidad del sandbox (`isolate`).
- **Docker con WSL2**: No se logró estabilizar en el tiempo disponible, pero es la ruta futura recomendada.
- **Piston API**: Alternativa prometedora, se evaluará en la siguiente fase.