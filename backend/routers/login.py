from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import mysql.connector
import config
import random

router = APIRouter()

@router.post("/api/users/{usertag}")
def login(usertag: str):
    conn = connect_db()
    cur = conn.cursor(dictionary=True)  # 取得結果を辞書型で扱う設定

    try:
        cur.execute("SELECT id FROM users WHERE user_tag=%s", (usertag, ))  
        result = cur.fetchall()  

        if not result:
            new_id = generate_unique_id(cur)
            cur.execute("INSERT INTO users (id, user_tag) VALUES (%s, %s)", (new_id, usertag))
            conn.commit()
            response = {
                "status": "success",
                "message": "User created",
                "user_id": new_id
            }
            return JSONResponse(content=response, status_code=201) 
        else:
            response = {
                "status": "success",
                "message": "User already exists",
                "user_id": result[0]['id']
            }
            return JSONResponse(content=response, status_code=200)

    # リソースのクリーンアップ
    finally:
        cur.close()
        conn.close()

def generate_unique_id(cur):
    while True:
        random_id = random.randint(1, 1000000)  # 1から1000000の間でランダムな整数を生成
        cur.execute("SELECT id FROM users WHERE id = %s", (random_id,))
        result = cur.fetchall()
        if not result:  # ID が存在しない場合
            return random_id

def connect_db():
    # DBへ接続
    conn = mysql.connector.connect(
        user=config.user,
        password=config.password,
        host=config.host,
        database=config.database,
        ssl_disabled=True
    )
    # DBの接続確認
    if not conn.is_connected():
        raise Exception("MySQLサーバへの接続に失敗しました")
    return conn
