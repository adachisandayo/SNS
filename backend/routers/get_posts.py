from fastapi import APIRouter
import mysql.connector
import config

router = APIRouter()

@router.get("/api/posts/{usertag}")
def get_items(usertag):
    conn = connect_db()
    cur = conn.cursor(dictionary=True)  # 取得結果を辞書型で扱う設定


    userid = get_user_id(usertag, cur) 

    query_for_fetching = (
        "SELECT p.* "
        "FROM POSTS p "
        "WHERE p.user_id = %s "
        "ORDER BY p.post_datetime DESC;"
    )

    # SQL実行時にパラメータを渡す
    cur.execute(query_for_fetching, (userid, ))
    results = cur.fetchall()
    
    return_dict = []
    for row in results:
        return_dict.append({
            "id":row['id'],
            "message":row["message"],
            "user_id":row["user_id"],
            "post_datetime":row["post_datetime"],
            "uer_tag":usertag
        })
    # print(return_dict)
    return return_dict


def get_user_id(usertag, cur):
    cur.execute("SELECT id FROM users WHERE user_tag=%s", (usertag, ))  
    result = cur.fetchone()  

    if not result:
        print("idが存在しません")
        return None
    else:
        return result["id"]


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