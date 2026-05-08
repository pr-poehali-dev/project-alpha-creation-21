"""
Загрузка и скачивание архива модов сервера Мат&Решка (S3)
"""
import json
import os
import base64
import boto3
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p10348444_project_alpha_creati")
BUCKET = "files"
S3_PREFIX = "mods/"


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def get_s3():
    return boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )


def cdn_url(key: str) -> str:
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"


def handler(event: dict, context) -> dict:
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")

    # List mods
    if method == "GET" and action == "list":
        conn = get_db()
        cur = conn.cursor()
        cur.execute(f"SELECT id, name, filename, s3_key, size_bytes, uploaded_at FROM {SCHEMA}.mods ORDER BY uploaded_at DESC")
        rows = cur.fetchall()
        conn.close()
        mods = [
            {
                "id": r[0],
                "name": r[1],
                "filename": r[2],
                "url": cdn_url(r[3]),
                "size_bytes": r[4],
                "uploaded_at": str(r[5]),
            }
            for r in rows
        ]
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"mods": mods})}

    # Upload mod (admin only — simple token check)
    if method == "POST" and action == "upload":
        body = json.loads(event.get("body") or "{}")
        admin_token = body.get("admin_token", "")
        if admin_token != os.environ.get("ADMIN_TOKEN", ""):
            return {"statusCode": 403, "headers": cors, "body": json.dumps({"error": "Нет прав"})}

        name = body.get("name", "").strip()
        filename = body.get("filename", "").strip()
        file_b64 = body.get("file_b64", "")
        if not name or not filename or not file_b64:
            return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "Заполни все поля"})}

        file_bytes = base64.b64decode(file_b64)
        s3_key = f"{S3_PREFIX}{filename}"
        s3 = get_s3()
        s3.put_object(Bucket=BUCKET, Key=s3_key, Body=file_bytes, ContentType="application/zip")

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.mods (name, filename, s3_key, size_bytes) VALUES (%s, %s, %s, %s) RETURNING id",
            (name, filename, s3_key, len(file_bytes))
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()

        return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True, "id": new_id, "url": cdn_url(s3_key)})}

    # Delete mod (admin only)
    if method == "DELETE" and action == "delete":
        body = json.loads(event.get("body") or "{}")
        admin_token = body.get("admin_token", "")
        if admin_token != os.environ.get("ADMIN_TOKEN", ""):
            return {"statusCode": 403, "headers": cors, "body": json.dumps({"error": "Нет прав"})}

        mod_id = body.get("id")
        conn = get_db()
        cur = conn.cursor()
        cur.execute(f"SELECT s3_key FROM {SCHEMA}.mods WHERE id = %s", (mod_id,))
        row = cur.fetchone()
        if not row:
            conn.close()
            return {"statusCode": 404, "headers": cors, "body": json.dumps({"error": "Мод не найден"})}

        s3 = get_s3()
        s3.delete_object(Bucket=BUCKET, Key=row[0])
        cur.execute(f"DELETE FROM {SCHEMA}.mods WHERE id = %s", (mod_id,))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True})}

    return {"statusCode": 404, "headers": cors, "body": json.dumps({"error": "Неизвестный метод"})}
