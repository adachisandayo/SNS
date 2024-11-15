from fastapi import APIRouter
from fastapi.responses import JSONResponse
import mysql.connector
import config


router = APIRouter()


@router.get("/api/search/{word}")
def user_search(word):
    conn = connect_db()
    cur = conn.cursor(dictionary=True)  # 取得結果を辞書型で扱う設定
    
    cur.execute("select * from users where user_tag like %s", (f"%{word}%", ))
    results = cur.fetchall()
    
    return_dict = []
    for row in results:
        return_dict.append({
            "id":row['id'],
            "user_tag":row["user_tag"],
            "user_name":row["user_name"],
        })

    return return_dict

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