# ADR-003: Autenticación stateless con JWT

## Estado
Aceptado

## Contexto
La HU1 exige inicio de sesión seguro, sesión con tiempo de expiración definido y mensajes de error genéricos. Se consideraron:
- Sesiones tradicionales con cookies y almacenamiento en servidor (Redis o base de datos).
- OAuth2 externo (Google, GitHub) – fuera de alcance para primer corte.
- JWT (JSON Web Tokens) stateless.

## Decisión
Se implementa **JWT** mediante la extensión `Flask-JWT-Extended`. El flujo:
1. `POST /api/auth/login` recibe username y password.
2. Verifica hash bcrypt almacenado.
3. Genera un `access_token` con identidad del usuario y expiración configurable (1 hora).
4. El cliente almacena el token en `localStorage` (con medidas de seguridad).
5. Las peticiones protegidas incluyen el token en cabecera `Authorization: Bearer <token>`.
6. El decorador `@jwt_required()` valida el token antes de ejecutar el endpoint.
7. Los mensajes de error se capturan y retornan como "Credenciales inválidas" sin detalles técnicos.

Se incluye soporte para `refresh_token` (opcional) almacenado en base de datos con hash para permitir revocación.

## Consecuencias
**Positivas:**
- Stateless: el servidor no necesita almacenar sesiones, facilitando escalabilidad horizontal.
- El token firmado garantiza integridad (no puede ser modificado sin invalidarse).
- Expiración automática cumple el criterio de aceptación.
- Fácil de implementar con Flask-JWT-Extended.

**Negativas:**
- El token no puede ser invalidado antes de su expiración a menos que se implemente una lista negra. Se mitiga con refresh tokens rotativos y vida corta del access token.
- Almacenar token en `localStorage` expone a XSS; se recomienda usar `httpOnly cookies` en producción, pero requiere manejo CSRF.

## Opciones consideradas
- **Sesiones con Redis**: Revocación inmediata, control total, pero requiere estado en servidor y más complejidad. Descartado por simplicidad inicial.
- **OAuth2**: Estándar industrial, pero requiere proveedor externo y no es necesario para usuarios internos de la USB.