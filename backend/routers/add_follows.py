from fastapi import APIRouter
from fastapi.responses import JSONResponse
import mysql.connector
import config


router = APIRouter()


@router.post("/api/follows/{src_tag}/{dst_tag}")
def add_follows(src_tag, dst_tag):
    conn = connect_db()
    cur = conn.cursor(dictionary=True)  # 取得結果を辞書型で扱う設定

    src_id = get_user_id(src_tag, cur)
    dst_id = get_user_id(dst_tag, cur)


    try:
        if not following(src_id, dst_id, cur):
            cur.execute("insert into follows values(%s, %s)", (src_id, dst_id))
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


@router.delete("/api/follows/{src_tag}/{dst_tag}")
def delete_follows(src_tag, dst_tag):
    conn = connect_db()
    cur = conn.cursor(dictionary=True)  # 取得結果を辞書型で扱う設定

    src_id = get_user_id(src_tag, cur)
    dst_id = get_user_id(dst_tag, cur)

    print(src_id, dst_id)
    try:
        if following(src_id, dst_id, cur):
            cur.execute("delete from follows where src_id=%s and dst_id=%s", (src_id, dst_id))
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


def following(src_id, dst_id, cur):
    cur.execute("select * from follows where src_id = %s and dst_id = %s", (src_id, dst_id))
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