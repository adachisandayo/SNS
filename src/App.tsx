import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TimeLine from './components/Timeline';
import Login from './components/Login';
import Users from './components/Users';
import Post from './components/Post';


function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/timeline' element={<TimeLine />} />
          <Route path='/users' element={<Users />} />
          <Route path='/post' element={<Post />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
