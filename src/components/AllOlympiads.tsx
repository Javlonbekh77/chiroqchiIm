import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, Medal, Trophy } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { sampleOlympiads } from './SodiqSections';
import './AllPages.css';
import './SodiqSections.css';

const AllOlympiads: React.FC = () => {
  const [dbOlympiads, setDbOlympiads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'olympiads'), (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((item: any) => !item.isDraft);
      setDbOlympiads(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const olympiads = dbOlympiads;

  return (
    <div className="page-container" style={{ background: '#f7f9fc' }}>
      <div className="container">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} /> Asosiy sahifaga
        </Link>

        <div className="section-head centered" style={{ marginBottom: '40px' }}>
          <span style={{ color: 'var(--accent-orange)', fontWeight: 600, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Maktabimiz Faxri
          </span>
          <h1 className="page-title" style={{ marginTop: '8px' }}>
            Barcha <span>Olimpiada Natijalari</span>
          </h1>
          <p className="teachers-subtitle" style={{ maxWidth: '700px', margin: '12px auto 0' }}>
            O'quvchilarimiz va ustozlarimizning nufuzli fan olimpiadalari, xalqaro va respublika tanlovlaridagi zafarli odimlaridan baxramand bo'ling.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h2>Yuklanmoqda...</h2>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px' }}>
            {olympiads.map((item, index) => {
              const itemKey = item.id || `oly-${index + 1}`;
              const firstImg = (item.images && item.images[0]) || item.image;
              const statsArray = Array.isArray(item.stats) ? item.stats : (item.stats ? [item.stats] : []);

              return (
                <Link 
                  to={`/olympiads/${itemKey}`} 
                  key={itemKey} 
                  style={{ 
                    textDecoration: 'none', 
                    color: 'inherit', 
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#ffffff',
                    borderRadius: '20px',
                    padding: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <img 
                    src={firstImg} 
                    alt={item.title} 
                    style={{
                      width: '100%',
                      height: '230px',
                      objectFit: 'cover',
                      borderRadius: '14px',
                      marginBottom: '16px'
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ color: '#0f172a', fontSize: '20px', fontWeight: 700, margin: '0 0 10px 0', lineHeight: 1.3 }}>
                      {item.title}
                    </h3>
                    <p style={{ 
                      color: '#475569', 
                      fontSize: '14px', 
                      lineHeight: 1.6, 
                      margin: '0 0 18px 0',
                      display: '-webkit-box', 
                      WebkitLineClamp: 3, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden',
                      flex: 1
                    }}>
                      {item.text}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: 'auto' }}>
                      {statsArray.map((stat: string) => (
                        <span key={stat} style={{
                          background: 'rgba(255, 107, 0, 0.1)',
                          color: 'var(--accent-orange)',
                          fontWeight: 700,
                          fontSize: '13px',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          border: '1px solid rgba(255, 107, 0, 0.2)'
                        }}>
                          🏆 {stat}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}


      </div>
    </div>
  );
};

export default AllOlympiads;
