from fastapi import APIRouter
import mysql.connector
import config

router = APIRouter()

@router.get("/api/timeline/{usertag}")
def get_items(usertag):
    conn = connect_db()
    cur = conn.cursor(dictionary=True)  # 取得結果を辞書型で扱う設定


    userid = get_user_id(usertag, cur) 

    query_for_fetching = (
        "SELECT p.*, u.user_tag, u.user_name "
        "FROM POSTS p "
        "JOIN USERS u ON p.user_id = u.id "
        "LEFT JOIN FOLLOWS f ON f.src_id = u.id "
        "WHERE u.id = %s "
        "OR u.id IN ("
            "SELECT f.dst_id "
            "FROM USERS u2 "
            "JOIN FOLLOWS f ON u2.id = f.src_id "
            "WHERE u2.id = %s"
        ") "
        "ORDER BY p.post_datetime DESC;"
    )

    # SQL実行時にパラメータを渡す
    cur.execute(query_for_fetching, (userid, userid))
    results = cur.fetchall()
    # for row in results:
    #     print(f"PostID: {row['id']}, Message: {row['message']},Userid: {row["user_id"]} UserTag: {row['user_tag']}, UserName: {row['user_name']}, PostDateTime: {row['post_datetime']}")

    return_dict = []
    for row in results:
        return_dict.append({
            "id":row['id'],
            "message":row["message"],
            "user_id":row["user_id"],
            "post_datetime":row["post_datetime"],
            "user_tag":row["user_tag"],
            "user_name":row["user_name"]
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