from fastapi import APIRouter
import mysql.connector
import config

router = APIRouter()

@router.get("/api/posts/{src_tag}/{dst_tag}")
def get_posts(src_tag, dst_tag):
    conn = connect_db()
    cur = conn.cursor(dictionary=True)  # 取得結果を辞書型で扱う設定

    src_id = get_user_id(src_tag, cur)
    dst_id = get_user_id(dst_tag, cur) 
    isFollow = following(src_id, dst_id, cur)

    query_for_fetching = (
        "SELECT "
            "p.*, "
            "COUNT(pr.user_id) AS reaction_count ,"
            "CASE "
                "WHEN EXISTS ("
                    "SELECT 1 "
                    "FROM POST_REACTIONS pr2 "
                    "WHERE pr2.post_id = p.id AND pr2.user_id = %s"
                    ") "
                "THEN 1 "
                "ELSE 0 "
            "END AS user_reacted "        
        "FROM POSTS p "
        "LEFT JOIN POST_REACTIONS pr ON p.id = pr.post_id "
        "WHERE p.user_id = %s "
        "GROUP BY p.id "
        "ORDER BY p.post_datetime DESC;"
    )

    # SQL実行時にパラメータを渡す
    cur.execute(query_for_fetching, (src_id, dst_id))
    results = cur.fetchall()
    
    return_dict = []
    for row in results:
        if (row["user_reacted"]):
            reacted = True
        else:
            reacted = False

        return_dict.append({
            "id":row['id'],
            "message":row["message"],
            "user_id":row["user_id"],
            "post_datetime":row["post_datetime"],
            "uer_tag":dst_tag, 
            "reaction_count":row["reaction_count"],
            "user_reacted": reacted            
        })
    # print(return_dict)
    return {
        "posts": return_dict, 
        "follow": isFollow
    }


def get_user_id(usertag, cur):
    cur.execute("SELECT id FROM users WHERE user_tag=%s", (usertag, ))  
    result = cur.fetchone()  

    if not result:
        print("idが存在しません")
        return None
    else:
        return result["id"]


def following(src_id, dst_id, cur):
    if src_id == dst_id:
        return False

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