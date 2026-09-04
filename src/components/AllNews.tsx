import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import './AllPages.css';

const sampleNews = [
  {
    id: 'news-1',
    date: '24-08-2026',
    title: "Sarbon Universiteti Woosong Universiteti huzuridagi iDegree rahbariyati bilan onlayn uchrashuv o'tkazdi",
    image: '/school.png'
  },
  {
    id: 'news-2',
    date: '19-08-2026',
    title: "Sarbon Universiteti va British Council hamkorlikning istiqbollari",
    image: '/school.png'
  },
  {
    id: 'news-3',
    date: '03-08-2026',
    title: "Sarbon Universiteti va Jiangsu Normal Universiteti O'zaro...",
    image: '/school.png'
  },
  {
    id: 'news-4',
    date: '15-07-2026',
    title: "Sarbon University - Bo'sh ish o'rinlarini haqida ma'lumot...",
    text: "Sarbon University jamoasiga qo'shilishni istaysizmi? Endi barcha vakant...",
    image: '/school.png'
  },
  {
    id: 'news-5',
    date: '06-07-2026',
    title: 'Sarbon universitetida giyohvandlikka qarshi...',
    text: 'Sarbon universitetida ichki ishlar organlari vakillari ishtirokida...',
    image: '/school.png'
  },
  {
    id: 'news-6',
    date: '01-07-2026',
    title: 'Muzaffar Muxitdinovich Djalalov Sarbon Universiteti rektori eti...',
    image: '/school.png'
  },
  {
    id: 'news-7',
    date: '15-06-2026',
    title: "Oliy ta'lim, fan va innovatsiyalar vazirligi huzuridagi Talaba va...",
    text: "Tanlovda qatnashish uchun ishtirokchilar @kitobtanlovbot orqali...",
    image: '/school.png'
  },
];

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const Icon = CalendarDays;
  return (
    <span className="updates-badge">
      <Icon size={15} strokeWidth={2.2} />
      {children}
    </span>
  );
};

const AllNews: React.FC = () => {
  const [dbNews, setDbNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'news'), (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((doc: any) => !doc.isDraft); // Filter out drafts
      setDbNews(data.reverse()); // Reverse to show newest first
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const newsList = loading ? sampleNews : (dbNews.length > 0 ? dbNews : sampleNews);

  return (
    <div className="page-container">
      <div className="container">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} /> Asosiy sahifaga qaytish
        </Link>
        <h1 className="page-title">Barcha Yangiliklar</h1>
        <div className="all-grid">
          {newsList.length === 0 ? (
            <p>Hozircha yangiliklar yo'q.</p>
          ) : (
            newsList.map((item: any, i: number) => (
              <div 
                className="ng-card" 
                key={item.id || i} 
                onClick={() => !loading && navigate('/news/' + item.id)}
                style={{cursor: loading ? 'default' : 'pointer'}}
              >
                <div className={`ng-card-image-wrapper ${loading ? 'skeleton' : ''}`}>
                  {!loading && <img src={item.image || '/school.png'} alt={item.title} />}
                </div>
                <div className="ng-card-info">
                  <h3 className={`ng-card-name ${loading ? 'skeleton' : ''}`} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h3>
                  {item.text && <p className={loading ? 'skeleton' : ''} style={{ fontSize: 14, color: '#666', marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.text}</p>}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div className={loading ? 'skeleton' : ''} style={{ borderRadius: '4px', width: loading ? '80px' : 'auto' }}>
                      {!loading && <Badge>{item.date}</Badge>}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AllNews;
