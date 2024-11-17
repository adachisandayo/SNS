import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TimeLine from './components/Timeline';
import Login from './components/Login';
import Users from './components/Users';
import Post from './components/Post';
import './index.css'; // index.cssをインポート


const theme = createTheme({
  typography: {
    // 全体のフォントファミリーを指定（レイアウトは変えず、フォントだけ変更）
    fontFamily: `'Noto Sans JP', sans-serif`,
  },
});

const handleClose = () => {};
const handleUpdatePage = () => {};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter basename="/">
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/timeline' element={<TimeLine />} />
            <Route path='/users' element={<Users />} />
            <Route path="/post" element={<Post onClose={handleClose} handleUpdatePage={handleUpdatePage}/>} />
          </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
