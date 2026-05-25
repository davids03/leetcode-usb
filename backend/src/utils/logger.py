from ..extensions import db
from ..models import Log

def log_action(user_id, username, action, details=None, ip_address=None):
    """Registra una acción en la tabla logs"""
    log = Log(
        user_id=user_id,
        username=username,
        action=action,
        details=details,
        ip_address=ip_address
    )
    db.session.add(log)
    db.session.commit()