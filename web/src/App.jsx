import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import MonsterPage from './pages/MonsterPage';
import MainPage from './pages/MainPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/:token" 
          element={<MonsterPage />} 
        />
        <Route 
          path="/" 
          element={<MainPage />} 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
