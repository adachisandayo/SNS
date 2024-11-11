from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import mysql.connector
import config
import datetime
import random


router = APIRouter()

class RequestBody(BaseModel):
    message: str

@router.post("/api/posts/{usertag}")
def add_posts(body: RequestBody, usertag):
    message = body.message
    print(message)

    conn = connect_db()
    cur = conn.cursor(dictionary=True)  # 取得結果を辞書型で扱う設定

    userid = get_user_id(usertag, cur) 
    dt_now = datetime.datetime.now()


    try:
        new_id = generate_unique_id(cur)

        query_for_fetching = ("insert into posts values( %s, %s, %s, %s)")

        # SQL実行時にパラメータを渡す
        cur.execute(query_for_fetching, (new_id, message, userid, dt_now))
        conn.commit()
        response = {
            "status": "success",
            "message": "User created",
            "user_id": new_id
        }
        return JSONResponse(content=response, status_code=200) 


    # リソースのクリーンアップ
    finally:
        cur.close()
        conn.close()


def get_user_id(usertag, cur):
    cur.execute("SELECT id FROM users WHERE user_tag=%s", (usertag, ))  
    result = cur.fetchone()  

    if not result:
        print("idが存在しません")
        return None
    else:
        return result["id"]


def generate_unique_id(cur):
    while True:
        random_id = random.randint(1, 1000000)  # 1から1000000の間でランダムな整数を生成
        cur.execute("SELECT id FROM posts WHERE id = %s", (random_id,))
        result = cur.fetchall()
        if not result:  # ID が存在しない場合
            return random_id
        

def connect_db():
    # DBへ接続
    conn = mysql.connector.connect(
        user = config.user,
        password = config.password,
        host = config.host,
        database = config.database,
        ssl_disabled=True
    )
    # DBの接続確認
    if not conn.is_connected():
        raise Exception("MySQLサーバへの接続に失敗しました")
    return conn