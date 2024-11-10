import mysql.connector
import config
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 必要に応じて変更
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

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
    
cur = conn.cursor(dictionary=True)  # 取得結果を辞書型で扱う設定


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

@app.get("/posts")
def get_items():
    query__for_fetching = "select * from posts"
    cur.execute(query__for_fetching)

    return_dict = []
    for fetched_line in cur.fetchall():
        return_dict.append({
            "id":fetched_line['id'],
            "message":fetched_line["message"]
        })
    print(return_dict)
    return return_dict

