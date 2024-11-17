from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers import get_posts
from routers import get_timeline
from routers import login
from routers import add_posts
from routers import add_follows
from routers import user_search
from routers import add_reactions


app = FastAPI()
app.include_router(get_posts.router)
app.include_router(get_timeline.router)
app.include_router(login.router)
app.include_router(add_posts.router)
app.include_router(add_follows.router)
app.include_router(user_search.router)
app.include_router(add_reactions.router)


# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 必要に応じて変更
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}



