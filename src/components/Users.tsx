import React from 'react';
import { useEffect, useState } from 'react';
import axios from "axios";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';

const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 1000
});


function App() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const usertag = searchParams.get("name");
  const dst_usertag = searchParams.get("user");
  if (!usertag || !dst_usertag) {
    navigate("/");
  }

  const handleNavigateToPost = () => {
    navigate(`/post/?name=${usertag}`);
  }

  const handleNavigateToTimeline = () => {
    navigate(`/timeline/?name=${usertag}`);
  }

  // ユーザをフォローするときに呼び出す関数
  const handleFollow = () => {
    console.log("フォローしました！");
    api.post(`/api/follows/${usertag}/${dst_usertag}`)
    .then((response) => {
      console.log("Post successful:", response);
      if (response.status === 200) {
        alert('フォローしました。');
      } 
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("フォローに失敗しました。もう一度お試しください。");
    });
  };  

  useEffect(() => {
    fetchPosts();
  },[])

  const fetchPosts = async () => {
    try {
      const response = await api.get(`/api/posts/${dst_usertag}`);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
      
  }

  return (
    <div>
      {usertag !== dst_usertag && (
        <button onClick={handleFollow}>フォロー</button>
      )}
      {posts.map((item) => (
        <div key={item.id}>
          <p>ID: {item.id}</p>
          <p>{item.usertag}</p>
          <p>Message: {item.message}</p>
          <p>{item.post_datetime}</p>
        </div>
      ))}
      <button onClick={handleNavigateToPost}>投稿</button>
      <button onClick={handleNavigateToTimeline}>タイムライン</button>
    </div>
  )
}

export default App;
