import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TimeLine from './components/Timeline';
import Login from './components/Login';


function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/timeline' element={<TimeLine />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
