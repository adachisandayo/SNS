import { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Box,
  Typography,
  Dialog,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Posts, User } from "../types/index";
import TimelineElement from "./TimelineElement"; // コンポーネントのインポート
import Post from "./Post"; // Postコンポーネントをインポート



const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 1000
});


function App() {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ユーザ名を取得
  const user_tag = searchParams.get("name");

  // 投稿ページへ遷移
  const handleNavigateToPost = () => {
    navigate(`/post/?name=${user_tag}`);
  };

  // ユーザページへ遷移
  const handleNavigateToUser = (userid: string | null) => {
    navigate(`/users/?name=${user_tag}&user=${userid}`);
  };


  // ユーザ検索APIの呼び出し
  const fetchFilteredUsers = useCallback( async (value: string) => {
    try {
      const response = await api.get(`/api/search/${value}`);
      setFilteredUsers(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);


  //ユーザ検索ボックスの入力監視用
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchFilteredUsers(searchTerm);
    }, 500); //0.5秒後にAPI呼び出し

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchFilteredUsers]);


  // タイムラインを取得
  const fetchPosts = () => {
    api.get(`/api/timeline/${user_tag}`)
      .then((response) => {
        setPosts(response.data);
        console.log(response.data);
      })
      .catch ((error) => {
        console.error("Error fetching posts:", error);
      });
  };

  useEffect(() => {
    if (!user_tag) {
      navigate("/");
    } else {
      fetchPosts();
    }
  }, [user_tag, navigate]);

  //リアクションがクリックされたときの処理
  const handleLike = () => {
    console.log("いいね！");
  };

  return (
    <>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder='ユーザを検索'
      />


      {filteredUsers.map((user) => (
        <div key={user.id}>
          <div onClick={() => handleNavigateToUser(user.user_tag)}>{user.user_tag}</div>
        </div>
      ))}

{/* 
      {posts.map((item) => (
        <div key={item.id}>
          <p>ID: {item.id}</p>
          <a href="" onClick={() => handleNavigateToUser(item.user_tag)}>{item.user_tag}</a>
          <p>Message: {item.message}</p>
          <p>{item.post_datetime}</p>
          <button onClick={handleLike}>いいね</button>
        </div>
      ))} */}
      
      {posts.map((post) => (
        <TimelineElement
          key={post.id}
          post={post}
          onLike={handleLike}
        />
      ))}

<Button
          variant="contained"
          color="primary"
          onClick={handleNavigateToPost}
          sx={{
            background: 'linear-gradient(135deg, #6C63FF 0%, #48A9FE 100%)',
            color: '#FFFFFF',
            fontWeight: 'bold',
            borderRadius: '24px',
            padding: '10px 24px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            outline: 'none', // 黒い枠を防ぐ
            '&:focus': {
              outline: 'none', // フォーカス時も黒い枠を防ぐ
            },
            '&:hover': {
              background: 'linear-gradient(135deg, #5A55E0 0%, #3C99DC 100%)',
              boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          投稿する
        </Button>
      <button onClick={() => handleNavigateToUser(user_tag)}>マイページ</button>
    </>

  );
}

export default App;
