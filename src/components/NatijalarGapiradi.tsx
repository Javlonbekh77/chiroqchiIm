import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import './NatijalarGapiradi.css';

const useCountUp = (end: number, duration: number = 2000, decimals: number = 0) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (started) return;
      const el = document.getElementById('natijalar-gapiradi');
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          setStarted(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    let animationFrame: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(end * easeProgress);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [started, end, duration]);

  return count.toFixed(decimals);
};

const NatijalarGapiradi: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Matematika');
  const [dbStudents, setDbStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'students'), (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((doc: any) => !doc.isDraft);
      setDbStudents(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const parseScore = (scoreStr: string | number | undefined) => {
    if (!scoreStr) return -1;
    let s = String(scoreStr).toUpperCase().replace(/\s+/g, '');
    s = s.replace(/А/g, 'A').replace(/В/g, 'B').replace(/С/g, 'C'); // Cyrillic to Latin

    if (s.includes('A+')) return 1000;
    if (s.includes('A')) return 900;
    if (s.includes('B+')) return 800;
    if (s.includes('B')) return 700;
    if (s.includes('C+')) return 600;
    if (s.includes('C')) return 500;
    
    const numMatch = s.match(/[\d.]+/);
    if (numMatch) {
      const val = parseFloat(numMatch[0]);
      if (!isNaN(val)) return val;
    }
    return 0;
  };

  const students = dbStudents.filter(s => 
    s.type === activeTab || 
    (s.certSubject && s.certSubject.toLowerCase().includes(activeTab.toLowerCase())) ||
    (activeTab === 'DTM' && s.certSubject && s.certSubject.toLowerCase().includes('dtm'))
  ).sort((a, b) => {
    const scoreA = parseScore(a.certScore || a.score);
    const scoreB = parseScore(b.certScore || b.score);
    return scoreB - scoreA;
  });

  const count1 = useCountUp(120);
  const count3 = useCountUp(185);
  const count4 = useCountUp(96);

  // Don't render entire section if no data at all
  if (!loading && dbStudents.length === 0) {
    return null;
  }

  return (
    <section className="natijalar-gapiradi" id="natijalar-gapiradi" data-aos="fade-up">
      <div className="container">
        <div className="ng-header">
          <div className="ng-header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
            <div>
              <h2 className="ng-title">Natijalar o'zlari gapiradi</h2>
              <p className="ng-subtitle">
                Chiroqchi IM o'quvchilarining sertifikat, DTM<br />
                va universitet natijalari
              </p>
            </div>
            <Link to="/students?tab=certificates" className="see-all-btn" style={{
              color: 'var(--accent-orange)',
              fontWeight: 600,
              textDecoration: 'none',
              padding: '10px 20px',
              border: '2px solid var(--accent-orange)',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}>Barchasini ko'rish →</Link>
          </div>
        </div>

        <div className="ng-stats">
          <div className="ng-stat-card">
            <h3>{count1}+</h3>
            <h4>Sertifikat olgan<br/>o'quvchilar</h4>
            <p>IELTS, SAT va fan sertifikatlari</p>
          </div>
          <div className="ng-stat-card">
            <h3>{count3}+</h3>
            <h4>DTM o'rtacha bali</h4>
            <p>Kirish imtihonlari uchun kuchli tayyorgarlik</p>
          </div>
          <div className="ng-stat-card">
            <h3>{count4}%</h3>
            <h4>Bitiruvchilar<br/>natijasi</h4>
            <p>Tanlagan yo'nalishiga muvaffaqiyatli o'tdi</p>
          </div>
        </div>

        <div className="ng-tabs">
          <div className="ng-tabs-container" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Matematika', 'IELTS', 'CEFR', 'Ona tili', 'Biologiya', 'Kimyo', 'Tarix', 'Fizika', 'DTM'].map(tab => (
              <button
                key={tab}
                className={`ng-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab as any)}
                style={{ padding: '8px 16px', fontSize: '14px', whiteSpace: 'nowrap' }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="ng-carousel-wrapper">
          <div className="ng-carousel">
            {students.length > 0 ? (
              students.slice(0, 8).map((student: any, i: number) => (
                <div 
                  className="ng-card" 
                  key={student?.id || i}
                >
                  <div className="ng-card-image-wrapper">
                    <img src={student.image} alt={student.name} />
                  </div>
                  <div className="ng-card-info">
                    <h3 className="ng-card-name">{student?.name}</h3>
                    <div className="ng-card-score-big">{student.certScore || student.score || ''}</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '50px 20px', 
                color: '#94a3b8', 
                width: '100%',
                fontSize: '15px'
              }}>
                Bu fan bo'yicha hali natija qo'shilmagan
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NatijalarGapiradi;
