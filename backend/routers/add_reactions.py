from fastapi import APIRouter
from fastapi.responses import JSONResponse
import mysql.connector
import config


router = APIRouter()


@router.post("/api/reactions/{usertag}/{post_id}")
def add_reactions(usertag, post_id):
    conn = connect_db()
    cur = conn.cursor(dictionary=True)  # 取得結果を辞書型で扱う設定

    user_id = get_user_id(usertag, cur)

    print(post_id, user_id)
    try:
        if not reactioning(user_id, post_id, cur):
            cur.execute("insert into post_reactions values(%s, %s)", (post_id, user_id))
            conn.commit()
            response = {
                "status": "success",
            }
            return JSONResponse(content=response, status_code=200)
        else:
            response = {
                "status": "failture",
            }
            return JSONResponse(content=response, status_code=202)
    finally:
        cur.close()
        conn.close()


@router.delete("/api/reactions/{usertag}/{post_id}")
def delete_reactions(usertag, post_id):
    conn = connect_db()
    cur = conn.cursor(dictionary=True)  # 取得結果を辞書型で扱う設定

    user_id = get_user_id(usertag, cur)

    try:
        if reactioning(user_id, post_id, cur):
            cur.execute("delete from post_reactions where post_id=%s and user_id=%s", (post_id, user_id))
            conn.commit()
            response = {
                "status": "success",
            }
            return JSONResponse(content=response, status_code=200)
        else:
            response = {
                "status": "failture",
            }
            return JSONResponse(content=response, status_code=202)
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


def reactioning(user_id, post_id, cur):
    cur.execute("select * from post_reactions where user_id = %s and post_id = %s", (user_id, post_id))
    result = cur.fetchone()  

    if not result:
        return False
    else:
        return True
    

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