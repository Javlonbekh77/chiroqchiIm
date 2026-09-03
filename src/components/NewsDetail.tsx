import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './AllPages.css';

const sampleNews = [
  {
    id: 'news-1',
    date: '24-08-2026',
    title: "Sarbon Universiteti Woosong Universiteti huzuridagi iDegree rahbariyati bilan onlayn uchrashuv o'tkazdi",
    image: '/school.png',
    text: "Uchrashuv davomida qo'shma ta'lim dasturlari bo'yicha muhokamalar bo'lib o'tdi."
  },
  {
    id: 'news-2',
    date: '19-08-2026',
    title: "Sarbon Universiteti va British Council hamkorlikning istiqbollari",
    image: '/school.png',
    text: "Xalqaro standartlarga mos ingliz tili darslarini tashkil qilish to'g'risida kelishib olindi."
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
    text: "Sarbon University jamoasiga qo'shilishni istaysizmi? Endi barcha vakant o'rinlari haqida bilishingiz mumkin.",
    image: '/school.png'
  },
  {
    id: 'news-5',
    date: '06-07-2026',
    title: 'Sarbon universitetida giyohvandlikka qarshi...',
    text: 'Sarbon universitetida ichki ishlar organlari vakillari ishtirokida profilaktik tadbir o\'tkazildi.',
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
    text: "Tanlovda qatnashish uchun ishtirokchilar @kitobtanlovbot orqali ro'yxatdan o'tishlari mumkin.",
    image: '/school.png'
  },
];

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [newsItem, setNewsItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      // First check sample news
      const sample = sampleNews.find(n => n.id === id);
      if (sample) {
        setNewsItem(sample);
        setLoading(false);
        return;
      }

      // If not sample, fetch from db
      try {
        if (id) {
          const docRef = doc(db, 'news', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setNewsItem({ id: docSnap.id, ...docSnap.data() });
          }
        }
      } catch (error) {
        console.error("Yangilikni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <h2>Yuklanmoqda...</h2>
        </div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="page-container">
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <h2>Yangilik topilmadi</h2>
          <Link to="/news" style={{ color: 'var(--accent-orange)' }}>Yangiliklar ro'yxatiga qaytish</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link to="/news" className="back-link">
          <ArrowLeft size={20} /> Barcha yangiliklarga qaytish
        </Link>
        
        <div className="detail-layout" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div>
            <h1 className="detail-title">{newsItem.title}</h1>
            <div className="detail-meta" style={{ marginTop: '16px' }}>
              <span className="detail-meta-item">
                <CalendarDays size={18} /> {newsItem.date}
              </span>
            </div>
          </div>

          {newsItem.images && newsItem.images.length > 0 ? (
            <div className="news-carousel-container">
              <div className="news-carousel">
                {newsItem.images.map((img: string, i: number) => (
                  <div className="news-carousel-item" key={i}>
                    <img src={img} alt={`${newsItem.title} - ${i + 1}`} />
                  </div>
                ))}
              </div>
              {newsItem.images.length > 1 && (
                <div style={{ position: 'absolute', bottom: '15px', right: '20px', background: 'rgba(0,0,0,0.5)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                  Yonga suring ➔
                </div>
              )}
            </div>
          ) : (
            newsItem.image && (
              <img 
                src={newsItem.image} 
                alt={newsItem.title} 
                style={{ 
                  width: '100%', 
                  maxHeight: '500px',
                  objectFit: 'cover',
                  borderRadius: '20px', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                }} 
              />
            )
          )}

          <div className="detail-text">
            {newsItem.text ? (
              <p>{newsItem.text}</p>
            ) : (
              <p>Ushbu yangilik uchun batafsil ma'lumot kiritilmagan.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
