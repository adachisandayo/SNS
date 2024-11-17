import React from 'react';
import { useEffect, useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, useTheme, useMediaQuery } from '@mui/material';

const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 1000
})


function App() {
  const [usertag, setUsertag] = useState("");
  const [loading, setLoading] = useState<boolean>(false); // ローディング状態
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate() ;


  const handleLogin = () => {
    if (!usertag) {
      setError("ユーザidを入力してください。")
    } else if (usertag.length > 15) {
      setError("ユーザidは15文字以内で入力してください。")
    } else {
      setLoading(true); // ローディング開始
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
        setLoading(false); // ローディング終了
      })
      .catch((error) => {
        console.error("Error:", error);
        setError('ログインに失敗しました。ユーザーidを確認してください。');
        setLoading(false); // ローディング終了
      });    
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };
  
  
  return (
    <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="100vh"
    position="relative"
    >
      <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={4}
      maxWidth="600px"
      width="80%"
      bgcolor="rgba(255, 255, 255, 0.7)"
      position="relative"
      sx={{
        backdropFilter: 'blur(10px)',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.06)',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: 2,
      }}
    >

        <Typography
          sx={{
            fontSize: 35, 
            fontFamily: 'inherit',
            fontWeight: 550,
            width: '100%',
            height: '100%',
            paddingLeft: 4, 
            textAlign: 'left', 
            marginBottom:3
           }}
        >
          SNSにログイン

        </Typography>
          <TextField
            label="ユーザー名"
            variant="outlined"
            value={usertag}
            onChange={(e) => setUsertag(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ marginBottom: 2, width: '100%' }}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}
          
          <Button
          variant="contained"
          onClick={handleLogin}
          fullWidth
          disabled={loading} // ローディング中はボタンを無効化
          sx={{
            background: loading ? '#CCC' : 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            color: 'white',
            fontWeight: 'bold',
            padding: '12px 24px',
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
            },
            '&:hover': {
              background: loading ? '#CCC' : 'linear-gradient(45deg, #FE6B8B 40%, #FF8E53 100%)',
              boxShadow: '0 4px 8px 2px rgba(255, 105, 135, .4)',
            },
          }}
        >
          {loading ? '読み込み中...' : 'ログイン または サインアップ'}
        </Button>
          
      </Box>
    </Box>
  )
}

export default App;
