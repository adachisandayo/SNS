import React from 'react';
import { useEffect, useState } from 'react'
import axios from "axios";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';

const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 1000
})


function App() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const user_tag = searchParams.get("name");
  if (!user_tag) {
    navigate("/login");
  }

  useEffect(() => {
    fetchPosts();
  },[])

  const fetchPosts = async () => {
    try {
      const response = await api.get(`/api/posts/${user_tag}`);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
      
  }

  return (
    <div>
      {posts.map((item) => (
        <div key={item.id}>
          <p>ID: {item.id}</p>
          <p>{item.user_tag}</p>
          <p>Message: {item.message}</p>
          <p>{item.post_datetime}</p>
        </div>
      ))}
    
    </div>
  )
}

export default App;
