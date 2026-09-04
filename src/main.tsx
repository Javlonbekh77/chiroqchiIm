import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollProgress from './components/ScrollProgress.tsx';
import Footer from './components/Footer.tsx';
import './index.css';

import App from './App.tsx';
import AllStudents from './components/AllStudents.tsx';
import StudentDetail from './components/StudentDetail.tsx';
import AllNews from './components/AllNews.tsx';
import NewsDetail from './components/NewsDetail.tsx';
import AllUniversities from './components/AllUniversities.tsx';
import Teachers from './components/Teachers.tsx';
import AllOlympiads from './components/AllOlympiads.tsx';
import OlympiadDetail from './components/OlympiadDetail.tsx';

const AdminPanel = lazy(() => import('./components/AdminPanel.tsx'));

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollProgress />
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: '#071a33', fontWeight: 600 }}>Yuklanmoqda...</div>}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/students" element={<AllStudents />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/news" element={<AllNews />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/universities" element={<AllUniversities />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/olympiads" element={<AllOlympiads />} />
          <Route path="/olympiads/:id" element={<OlympiadDetail />} />
        </Routes>
      </Suspense>
      <Footer />
    </BrowserRouter>
  </React.StrictMode>
);

