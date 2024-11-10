import React from 'react';
import { useEffect, useState } from 'react'
import axios from "axios";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 1000
})


function Timeline() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  },[])

  const fetchPosts = async () => {
    try {
      const response = await api.get("/api/posts/123");
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

export default Timeline;
