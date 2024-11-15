import { useEffect, useState } from 'react'
import axios from "axios";
import { styled } from '@mui/system';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';



const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 1000
})


function App() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPost, setnewPost] = useState("");

  const user_tag = searchParams.get("name");
  if (!user_tag) {
    navigate("/login");
  }

  const handleNavigateToTimeline = () => {
    navigate(`/timeline/?name=${user_tag}`)
  }

  useEffect(() => {
  },[])

  const handlePost = () => {

    const data = {
      message: newPost,
    };

    api.post(`/api/posts/${user_tag}`, data)
      .then((response) => {
        console.log("Post successful:", response);
        if (response.status === 200) {
          alert('投稿しました。');
          handleNavigateToTimeline();
        } 
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("投稿に失敗しました。もう一度お試しください。");
      });
  };


      <button onClick={handleNavigateToTimeline}>タイムライン</button>


  return (
    <div>
      <input
        type="text"
        value={newPost}
        onChange={(e) => setnewPost(e.target.value)}
      />
      <button onClick={handlePost}>投稿</button>
      <button onClick={handleNavigateToTimeline}>タイムライン</button>

    </div>
    
  )
}

export default App;
