"""
Регистрация, вход, профиль и статистика игроков сервера Мат&Решка
"""
import json
import os
import hashlib
import secrets
import smtplib
import urllib.request
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p10348444_project_alpha_creati")
GMAIL_USER = "matreshka.server.bot@gmail.com"
SITE_URL = "https://matreshka.poehali.dev"


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def get_minecraft_uuid(nickname: str) -> str | None:
    try:
        url = f"https://api.mojang.com/users/profiles/minecraft/{nickname}"
        req = urllib.request.urlopen(url, timeout=5)
        data = json.loads(req.read())
        return data.get("id")
    except Exception:
        return None


def send_verify_email(to_email: str, nickname: str, token: str):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Подтверждение регистрации на сервере Мат&Решка"
    msg["From"] = GMAIL_USER
    msg["To"] = to_email

    verify_url = f"{SITE_URL}?verify={token}"
    html = f"""
    <div style="background:#0a0a0a;color:#fff;font-family:monospace;padding:40px;max-width:500px;margin:auto;border:1px solid #cc2222;">
      <h2 style="color:#cc2222;letter-spacing:4px;">МАТ&amp;РЕШКА</h2>
      <p style="color:#aaa;">Привет, <b style="color:#fff;">{nickname}</b>!</p>
      <p style="color:#aaa;">Подтверди свою регистрацию на сервере:</p>
      <a href="{verify_url}" style="display:inline-block;margin:20px 0;padding:12px 24px;background:#cc2222;color:#fff;text-decoration:none;letter-spacing:2px;font-weight:bold;">
        ПОДТВЕРДИТЬ EMAIL
      </a>
      <p style="color:#555;font-size:12px;">Или скопируй ссылку: {verify_url}</p>
      <p style="color:#333;font-size:11px;">Если ты не регистрировался — просто проигнорируй это письмо.</p>
    </div>
    """
    msg.attach(MIMEText(html, "html"))
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(GMAIL_USER, os.environ["GMAIL_APP_PASSWORD"])
        server.sendmail(GMAIL_USER, to_email, msg.as_string())


def handler(event: dict, context) -> dict:
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": json.dumps({})}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")

    # Verify email
    if method == "GET" and action == "verify":
        token = params.get("token", "")
        conn = get_db()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE verify_token = %s AND is_verified = FALSE", (token,))
        row = cur.fetchone()
        if not row:
            conn.close()
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "Неверный или истёкший токен"})}
        cur.execute(f"UPDATE {SCHEMA}.users SET is_verified = TRUE, verify_token = NULL WHERE id = %s", (row[0],))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True, "message": "Email подтверждён! Теперь можешь войти."})}

    # Get player profile + stats
    if method == "GET" and action == "profile":
        user_id = params.get("id", "")
        if not user_id:
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "Нет id"})}
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, nickname, is_admin, playtime_minutes, blocks_mined, kills, deaths, join_date, last_seen FROM {SCHEMA}.users WHERE id = %s",
            (user_id,)
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return {"statusCode": 404, "headers": cors, "body": json.dumps({"error": "Игрок не найден"})}

        nickname = row[1]
        uuid = get_minecraft_uuid(nickname)
        skin_url = f"https://crafatar.com/renders/body/{uuid}?scale=4&overlay" if uuid else None
        head_url = f"https://crafatar.com/avatars/{uuid}?size=64&overlay" if uuid else None

        playtime = row[3] or 0
        kd = round(row[5] / max(row[6], 1), 2) if row[6] else row[5] or 0

        return {"statusCode": 200, "headers": cors, "body": json.dumps({
            "id": row[0],
            "nickname": nickname,
            "is_admin": row[2],
            "skin_url": skin_url,
            "head_url": head_url,
            "uuid": uuid,
            "stats": {
                "playtime_h": round(playtime / 60, 1),
                "playtime_min": playtime,
                "blocks_mined": row[4] or 0,
                "kills": row[5] or 0,
                "deaths": row[6] or 0,
                "kd": kd,
            },
            "join_date": str(row[7])[:10] if row[7] else None,
            "last_seen": str(row[8])[:10] if row[8] else None,
        })}

    body = json.loads(event.get("body") or "{}")

    # Register
    if method == "POST" and action == "register":
        email = body.get("email", "").strip().lower()
        nickname = body.get("nickname", "").strip()
        password = body.get("password", "")
        if not email or not nickname or not password:
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "Заполни все поля"})}
        if len(password) < 6:
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "Пароль минимум 6 символов"})}

        conn = get_db()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s", (email,))
        if cur.fetchone():
            conn.close()
            return {"statusCode": 409, "headers": cors, "body": json.dumps({"error": "Email уже зарегистрирован"})}

        token = secrets.token_urlsafe(32)
        pw_hash = hash_password(password)
        cur.execute(
            f"INSERT INTO {SCHEMA}.users (email, nickname, password_hash, verify_token) VALUES (%s, %s, %s, %s)",
            (email, nickname, pw_hash, token)
        )
        conn.commit()
        conn.close()

        send_verify_email(email, nickname, token)
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True, "message": "Проверь почту — отправили письмо с подтверждением!"})}

    # Login
    if method == "POST" and action == "login":
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")
        if not email or not password:
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "Заполни все поля"})}

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, nickname, is_verified, is_admin FROM {SCHEMA}.users WHERE email = %s AND password_hash = %s",
            (email, hash_password(password))
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return {"statusCode": 401, "headers": cors, "body": json.dumps({"error": "Неверный email или пароль"})}
        if not row[2]:
            return {"statusCode": 403, "headers": cors, "body": json.dumps({"error": "Подтверди email перед входом"})}

        return {"statusCode": 200, "headers": cors, "body": json.dumps({
            "ok": True,
            "user": {"id": row[0], "nickname": row[1], "is_admin": row[3]},
        })}

    return {"statusCode": 404, "headers": cors, "body": json.dumps({"error": "Неизвестный метод"})}
