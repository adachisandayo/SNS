import { useEffect, useState } from 'react';
import axios from "axios";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Posts, User } from "../types/index";
import TimelineElement from "./TimelineElement"; // コンポーネントのインポート



const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 1000
});


function App() {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [following, setFollowing]= useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const src_tag = searchParams.get("name");
  const dst_tag = searchParams.get("user");
  if (!src_tag || !dst_tag) {
    navigate("/");
  }

  const handleNavigateToPost = () => {
    navigate(`/post/?name=${src_tag}`);
  }

  const handleNavigateToTimeline = () => {
    navigate(`/timeline/?name=${src_tag}`);
  }

  // ユーザをフォローするときに呼び出す関数
  const handleFollow = () => {
    if (following == "フォロー") {
      api.post(`/api/follows/${src_tag}/${dst_tag}`)
      .then((response) => {
        console.log("Post successful:", response);
        if (response.status === 200) {
          setFollowing("フォロー中")
        } 
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("フォローに失敗しました。もう一度お試しください。");
      });
    } else if (following == "フォロー中") {
      api.delete(`/api/follows/${src_tag}/${dst_tag}`)
      .then((response) => {
        console.log("Post successful:", response);
        if (response.status === 200) {
          setFollowing("フォロー")
        } 
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("フォロー解除に失敗しました。もう一度お試しください。");
      });
    }
  };  

  useEffect(() => {
    fetchPosts();
  },[])

  const fetchPosts = async () => {
    try {
      const response = await api.get(`/api/posts/${src_tag}/${dst_tag}`);
      const {posts, follow} = response.data
      setPosts(posts);
      if (follow) {
        setFollowing("フォロー中")
      } else {
        setFollowing("フォロー")
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  //リアクションがクリックされたときの処理
  const handleLike = () => {
    console.log("いいね！");
  };

  return (
    <>
      <h1>{dst_tag}</h1>
      {src_tag !== dst_tag && (
        <button onClick={handleFollow}>{following}</button>
      )}
      {/* {posts.map((item) => (
        <div key={item.id}>
          <p>ID: {item.id}</p>
          <p>{dst_tag}</p>
          <p>Message: {item.message}</p>
          <p>{item.post_datetime}</p>
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
      <button onClick={handleNavigateToTimeline}>タイムライン</button>
    </>
  )
}

export default App;
