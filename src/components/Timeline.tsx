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
import { Post, User } from "../types/index";
import TimelineElement from "./TimelineElement"; // コンポーネントのインポート



const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 1000
});


function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ユーザ名を取得
  const user_tag = searchParams.get("name");
  if (!user_tag) {
    navigate("/");
  }

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
  const fetchPosts = async () => {
    try {
      const response = await api.get(`/api/timeline/${user_tag}`);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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

      <button onClick={handleNavigateToPost}>投稿</button>
      <button onClick={() => handleNavigateToUser(user_tag)}>マイページ</button>
    </>

  );
}

export default App;
