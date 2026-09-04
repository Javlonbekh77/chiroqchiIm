import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Award, Trophy, Medal, Sparkles } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { sampleOlympiads } from './SodiqSections';
import './AllPages.css';

const OlympiadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    const fetchOlympiad = async () => {
      // Check sample list first
      const sample = sampleOlympiads.find(o => o.id === id);
      if (sample) {
        setItem(sample);
        setLoading(false);
        return;
      }

      // Check Firestore doc if id exists
      try {
        if (id) {
          const docRef = doc(db, 'olympiads', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setItem({ id: docSnap.id, ...docSnap.data() });
          }
        }
      } catch (err) {
        console.error("Olimpiada ma'lumotlarini yuklashda xatolik:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOlympiad();
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

  if (!item) {
    return (
      <div className="page-container">
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <h2>Olimpiada ma'lumoti topilmadi</h2>
          <Link to="/olympiads" style={{ color: 'var(--accent-orange)' }}>Barcha olimpiadalarga qaytish</Link>
        </div>
      </div>
    );
  }

  const images: string[] = item.images && item.images.length > 0 ? item.images : (item.image ? [item.image] : []);
  const statsArray: string[] = Array.isArray(item.stats) ? item.stats : (item.stats ? [item.stats] : []);

  return (
    <div className="page-container" style={{ background: '#f7f9fc' }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link to="/olympiads" className="back-link">
          <ArrowLeft size={20} /> Barcha olimpiadalarga qaytish
        </Link>
        
        <div className="detail-layout" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="detail-header">
            <span style={{ color: 'var(--accent-orange)', fontWeight: 700, textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} /> Olimpiada va Natijalar
            </span>
            <h1 className="detail-title" style={{ fontSize: '32px', marginTop: '8px', lineHeight: '1.3' }}>{item.title}</h1>
            
            {statsArray.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
                {statsArray.map((st, idx) => (
                  <span key={idx} style={{
                    background: 'rgba(255, 107, 0, 0.1)',
                    color: 'var(--accent-orange)',
                    fontWeight: 700,
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Trophy size={16} /> {st}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Main Image Display */}
          {images.length > 0 && (
            <div>
              <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 12px 36px rgba(0,0,0,0.1)', background: '#000' }}>
                <img 
                  src={images[activeImgIndex]} 
                  alt={item.title} 
                  style={{ 
                    width: '100%', 
                    maxHeight: '520px',
                    objectFit: 'cover',
                    display: 'block'
                  }} 
                />
              </div>

              {/* Thumbnails if multiple images */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '14px', overflowX: 'auto', paddingBottom: '8px' }}>
                  {images.map((img, idx) => (
                    <img 
                      key={idx}
                      src={img}
                      alt="Thumbnail"
                      onClick={() => setActiveImgIndex(idx)}
                      style={{
                        width: '80px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        border: activeImgIndex === idx ? '3px solid var(--accent-orange)' : '2px solid transparent',
                        opacity: activeImgIndex === idx ? 1 : 0.7,
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Article Text */}
          <div className="detail-text" style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', fontSize: '17px', lineHeight: '1.8', color: '#334155' }}>
            {item.text ? (
              <p>{item.text}</p>
            ) : (
              <p>Ushbu olimpiada natijasi bo'yicha batafsil ma'lumot tez orada joylashtiriladi.</p>
            )}
          </div>

          {/* Additional Badges Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-around', background: 'linear-gradient(135deg, #0b1727 0%, #1e293b 100%)', color: '#fff', padding: '24px', borderRadius: '16px', marginTop: '10px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><Medal size={22} color="#fbbf24" /> Yuqori Natija</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><Trophy size={22} color="#fbbf24" /> Nufuzli Bellashuv</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><Award size={22} color="#fbbf24" /> Chiroqchi IM Faxri</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OlympiadDetail;
