# Plataforma de Práctica de Programación USB – LeetCode-like

Proyecto desarrollado para el curso **Laboratorio de Software III** (Universidad de San Buenaventura, Cali).  
Inspirado en LeetCode, permite a los estudiantes autenticarse, ver problemas organizados por dificultad, escribir código en un editor Monaco y recibir retroalimentación (simulada por ahora).

## Tabla de Contenidos
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación y ejecución (backend)](#instalación-y-ejecución-backend)
- [Instalación y ejecución (frontend)](#instalación-y-ejecución-frontend)
- [Endpoints principales](#endpoints-principales)
- [Variables de entorno](#variables-de-entorno)
- [Nota sobre la ejecución de código](#nota-sobre-la-ejecución-de-código)
- [Autores](#autores)

## Tecnologías

| Capa          | Tecnología                          |
|---------------|-------------------------------------|
| Backend       | Python 3.11 + Flask                 |
| Base de datos | MySQL 8.0 + SQLAlchemy (PyMySQL)    |
| Autenticación | JWT (Flask-JWT-Extended)            |
| Frontend      | React 18 + Vite + Monaco Editor     |
| Estilos       | CSS plano (puede mejorarse)         |
| Entorno       | Python venv, npm                    |

## Estructura del proyecto

leetcode-usb/
├── backend/
│ ├── src/
│ │ ├── app.py
│ │ ├── extensions.py
│ │ ├── models/
│ │ ├── routes/
│ │ └── services/
│ ├── .env (no subido)
│ ├── requirements.txt
│ └── venv/ (ignorado)
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── services/
│ │ └── App.jsx
│ ├── package.json
│ └── ...
├── docs/
│ ├── adr/ (Decisiones arquitectónicas)
│ ├── diagrams/ (Diagramas C4 en PlantUML)
│ └── definition-of-done.md
├── scripts/
│ └── seed_db.py
├── .gitignore
└── README.md

## Requisitos previos

- **Python 3.11** (recomendado) – [Descargar](https://www.python.org/downloads/release/python-3119/)
- **MySQL 8.0** – [Descargar](https://dev.mysql.com/downloads/installer/)
- **Node.js 18+** – [Descargar](https://nodejs.org/)
- **Git** – [Descargar](https://git-scm.com/downloads/win)

## Instalación y ejecución (backend)

1. Clonar el repositorio

2. Crear entorno virtual y activarlo
cd backend
python -m venv venv
venv\Scripts\activate        # Windows PowerShell

3. Instalar dependencias
   
pip install -r requirements.txt

4. Configurar variables de entorno
Crea el archivo backend/.env con el siguiente contenido (ajusta las credenciales de MySQL):
FLASK_APP=src/app.py
FLASK_ENV=development
SECRET_KEY=clave_super_secreta_123
JWT_SECRET_KEY=otra_clave_para_jwt_456
DATABASE_URL=mysql+pymysql://leetcode_user:Segura123@localhost/leetcode_usb
JUDGE0_URL=http://localhost:2358   # (no necesario para simulación)

5. Crear base de datos y usuario en MySQL
CREATE DATABASE leetcode_usb;
CREATE USER 'leetcode_user'@'localhost' IDENTIFIED BY 'Segura123';
GRANT ALL PRIVILEGES ON leetcode_usb.* TO 'leetcode_user'@'localhost';
FLUSH PRIVILEGES;

6. Ejecutar el backend
python -m src.app

7. (Opcional) Poblar la base de datos con problemas de ejemplo
Desde otra terminal (o deteniendo el servidor):
cd ..
python scripts/seed_db.py

### Instalación y ejecución (frontend)
1. Ir a la carpeta frontend e instalar dependencias

cd frontend
npm install
npm install axios @monaco-editor/react react-router-dom

2. Ejecutar el servidor de desarrollo
npm run dev
El frontend estará en http://localhost:5173.

3. Uso básico
Regístrate o inicia sesión con un usuario creado (puedes hacerlo desde la interfaz o con Postman).
Explora la lista de problemas, filtra por dificultad.
Haz clic en un problema para ver su descripción y casos de prueba públicos.
Escribe código en el editor Monaco y presiona Ejecutar.
Los resultados (simulados) se mostrarán en el panel derecho.

## Endpoints principales
Método	Endpoint	Descripción	Autenticación
POST	/api/auth/register	Registrar nuevo usuario	No
POST	/api/auth/login	Iniciar sesión, devuelve JWT	No
GET	/api/problems/	Listar problemas (filtro opcional)	JWT
GET	/api/problems/:id	Detalle de problema + casos públicos	JWT
POST	/api/submissions/	Enviar código para evaluación (simulado)	JWT

## Variables de entorno (backend)
Variable	Propósito	Ejemplo
DATABASE_URL	Conexión a MySQL	mysql+pymysql://user:pass@localhost/db
SECRET_KEY	Clave para sesiones de Flask	clave_super_secreta_123
JWT_SECRET_KEY	Clave para firmar tokens JWT	otra_clave_para_jwt_456
JUDGE0_URL	URL del servicio de ejecución (mock)	http://localhost:2358 (no necesario para mock)

### Autores
David Steven Hernandez Garces – Estudiante de Ingeniería de Sistemas, USB Cali
