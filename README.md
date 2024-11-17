# 簡易SNS
このプラットフォームは[こちら](https://github.com/docomo-KOSAMAX/FAVE/tree/master)を参考に作成したものです。


## フロントエンド
- React(TypeScript)
- Material UI


## バックエンド
- Python: FastAPI
- MySQL: データベース


### 使用方法
- backendフォルダにcongig.pyを作成し、user, password, host, databaseの情報を追加します。
- MYSQLで以下のテーブルを作成します。

### ER図
```mermaid
erDiagram
    USERS {
        INTEGER id PK "Unique"
        VARCHAR(15) user_tag
        TEXT user_name
    }
    
    POSTS {
        INTEGER id PK "Unique"
        TEXT message
        INTEGER user_id FK "外部キー制約: usersテーブルのid"
        DATETIME post_date_time
    }
    
    POST_REACTIONS {
        INTEGER post_id FK "外部キー制約: postsテーブルのid"
        INTEGER user_id FK "外部キー制約: usersテーブルのid"
        PRIMARY KEY(src_user_id)
        PRIMARY KEY(dst_user_id)
    }

    FOLLOWS {
        %% INTEGER id PK "Unique"
        INTEGER src_id FK "外部キー制約: usersテーブルのid"
        INTEGER dst_id FK "外部キー制約: usersテーブルのid"
        PRIMARY KEY(src_user_id)
        PRIMARY KEY(dst_user_id)
    }
    
    USERS ||--o{ POSTS : "user_id"
    POSTS ||--o{ POST_REACTIONS : "post_id"
    USERS ||--o{ POST_REACTIONS : "user_id"
    USERS ||--o{ FOLLOWS : "src_user_id"
    USERS ||--o{ FOLLOWS : "dst_user_id"

```
    

