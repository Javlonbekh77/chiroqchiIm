import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import AllStudents from './components/AllStudents.tsx';
import StudentDetail from './components/StudentDetail.tsx';
import AllNews from './components/AllNews.tsx';
import NewsDetail from './components/NewsDetail.tsx';
import AllUniversities from './components/AllUniversities.tsx';
import Teachers from './components/Teachers.tsx';
import ScrollProgress from './components/ScrollProgress.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollProgress />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/students" element={<AllStudents />} />
        <Route path="/students/:id" element={<StudentDetail />} />
        <Route path="/news" element={<AllNews />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/universities" element={<AllUniversities />} />
        <Route path="/teachers" element={<Teachers />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
