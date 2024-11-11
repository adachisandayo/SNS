import React from 'react';
import { useEffect, useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';


const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 1000
})


function App() {
  const [usertag, setUsertag] = useState("");
  const navigate = useNavigate() ;


  const addUser = () => {

    api.post(`api/users/${usertag}`)
    .then((response) => {
      console.log("Post successful:", response);
      if (response.status === 200) {
        alert('ログインしました。');
      } else if (response.status === 201) {
        alert("ユーザを新規作成しました。");
      }
    })
    .then(() => {
      navigate(`/timeline/?name=${usertag}`)
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("ログインに失敗しました。");
    });
  };
  return (
    <div>
      <h1>ログインページ</h1>
      <input
          type="text"
          value={usertag}
          onChange={(e) => setUsertag(e.target.value)}
        />
        <button onClick={addUser}>Login</button>
    </div>
  )
}

export default App;
