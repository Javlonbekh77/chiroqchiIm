import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollProgress from './components/ScrollProgress.tsx';
import Footer from './components/Footer.tsx';
import './index.css';

const App = lazy(() => import('./App.tsx'));
const AdminPanel = lazy(() => import('./components/AdminPanel.tsx'));
const AllStudents = lazy(() => import('./components/AllStudents.tsx'));
const StudentDetail = lazy(() => import('./components/StudentDetail.tsx'));
const AllNews = lazy(() => import('./components/AllNews.tsx'));
const NewsDetail = lazy(() => import('./components/NewsDetail.tsx'));
const AllUniversities = lazy(() => import('./components/AllUniversities.tsx'));
const Teachers = lazy(() => import('./components/Teachers.tsx'));
const AllOlympiads = lazy(() => import('./components/AllOlympiads.tsx'));
const OlympiadDetail = lazy(() => import('./components/OlympiadDetail.tsx'));

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

