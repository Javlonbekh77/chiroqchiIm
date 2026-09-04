import React, { useState, useEffect } from 'react';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import './Updates.css';

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

const AutoCarousel: React.FC<{ item: any }> = ({ item }) => {
  const images = item.images && item.images.length > 0 ? item.images : [item.image || '/school.png'];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 3 seconds per slide
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {images.map((src: string, i: number) => (
        <img 
          key={i} 
          src={src} 
          alt={item.title} 
          style={{ 
            opacity: currentIndex === i ? 1 : 0, 
            position: i === 0 ? 'relative' : 'absolute', 
            top: 0, left: 0, 
            width: '100%', height: '100%', 
            objectFit: 'cover',
            transition: 'opacity 0.8s ease' 
          }} 
        />
      ))}
      {images.length > 1 && (
        <div style={{ position: 'absolute', bottom: '15px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px', zIndex: 10 }}>
          {images.map((_: any, i: number) => (
            <div 
              key={i} 
              style={{ 
                width: '8px', height: '8px', 
                borderRadius: '50%', 
                backgroundColor: currentIndex === i ? 'var(--accent-orange)' : 'rgba(255,255,255,0.5)',
                transition: 'background-color 0.3s'
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Updates: React.FC = () => {
  const [dbNews, setDbNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'news'), (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((doc: any) => !doc.isDraft); // Filter out drafts
      setDbNews(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Split dbNews into large, medium, small based on size prop
  const dbLarge = dbNews.filter(n => n.size === 'large' || !n.size);
  const dbMedium = dbNews.filter(n => n.size === 'medium');
  const dbSmall = dbNews.filter(n => n.size === 'small');

  // Merging logic to preserve mock array structures if empty
  const mainNews = loading ? sampleNews[0] : (dbLarge.length > 0 ? dbLarge[0] : sampleNews[0]);
  const middleNews = loading ? sampleNews.slice(1, 3) : (dbMedium.length > 0 ? dbMedium.slice(0, 2) : sampleNews.slice(1, 3));
  const sideNews = loading ? sampleNews.slice(3, 6) : (dbSmall.length > 0 ? dbSmall.slice(0, 3) : sampleNews.slice(3, 6));
  
  const newsList = loading ? sampleNews : (dbNews.length > 0 ? dbNews : sampleNews);

  return (
    <section className="updates-section" id="yangiliklar" data-aos="fade-up">
      <div className="container updates-container">
        <div className="updates-head">
          <h2 className="updates-title">Maktab yangilik<span>lari</span></h2>
          <Link className="updates-link" to="/news">
            Barchasini ko'rish <ArrowRight size={18} />
          </Link>
        </div>

        {newsList.length === 0 ? (
          <p>Hozircha yangiliklar yo'q.</p>
        ) : (
          <div className="updates-grid">
            {mainNews && (
              <article className="updates-main-card" onClick={() => !loading && navigate('/news/' + mainNews.id)} style={{cursor: loading ? 'default' : 'pointer'}}>
                <div className={`updates-card-image ${loading ? 'skeleton' : ''}`}>
                  {!loading && <AutoCarousel item={mainNews} />}
                </div>
                <div className={`updates-main-meta ${loading ? 'skeleton' : ''}`} style={{ width: loading ? '100px' : 'auto' }}>
                  {!loading && <Badge>{mainNews.date}</Badge>}
                </div>
                <h3 className={loading ? 'skeleton' : ''} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{mainNews.title}</h3>
              </article>
            )}

            <div className="updates-middle-grid">
              {middleNews.map((item, i) => (
                <article className="updates-small-card" key={item.id || i} onClick={() => !loading && navigate('/news/' + item.id)} style={{cursor: loading ? 'default' : 'pointer'}}>
                  <div className={`updates-card-image ${loading ? 'skeleton' : ''}`}>
                    {!loading && <AutoCarousel item={item} />}
                  </div>
                  <div className={`updates-small-meta ${loading ? 'skeleton' : ''}`} style={{ width: loading ? '80px' : 'auto' }}>
                    {!loading && <Badge>{item.date}</Badge>}
                  </div>
                  <h3 className={loading ? 'skeleton' : ''} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h3>
                </article>
              ))}
            </div>

            <div className="updates-side-list">
              {sideNews.map((item, i) => (
                <article className="updates-side-item" key={item.id || i} onClick={() => !loading && navigate('/news/' + item.id)} style={{cursor: loading ? 'default' : 'pointer'}}>
                  <div className={`updates-card-image ${loading ? 'skeleton' : ''}`}>
                    {!loading && <AutoCarousel item={item} />}
                  </div>
                  <div className="updates-side-copy">
                    <h3 className={loading ? 'skeleton' : ''} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h3>
                    {item.text && <p className={loading ? 'skeleton' : ''} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.text}</p>}
                    <div className={`updates-side-meta ${loading ? 'skeleton' : ''}`} style={{ width: loading ? '80px' : 'auto' }}>
                      {!loading && <Badge>{item.date}</Badge>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Updates;
