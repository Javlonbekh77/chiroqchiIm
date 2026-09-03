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

const sampleIelts = [
  { id: 'ielts-1', name: 'Manzura Karimova', score: 'IELTS: 8.0, DTM: 191', university: 'HARVARD UNIVERSITY', type: 'IELTS', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=520&q=80' },
  { id: 'ielts-2', name: 'Aslamov Murod', score: 'IELTS: 8.5, DTM: 193', university: 'NYU ABU DHABI', type: 'IELTS', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=520&q=80' },
  { id: 'ielts-3', name: 'Xotamov Saidvalixon', score: 'IELTS: 8.0, DTM: 187', university: 'UNIVERSITY OF HONG KONG', type: 'IELTS', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=520&q=80' },
  { id: 'ielts-4', name: 'Irgashev Mustafo', score: 'IELTS: 7.5, DTM: 184', university: 'SABANCI UNIVERSITY', type: 'IELTS', image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=520&q=80' }
];

const sampleDtm = [
  { id: 'dtm-1', name: 'Mavlonov Abbos', score: 'SAT: 1540, DTM: 186', university: 'TDTU', type: 'DTM', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=520&q=80' },
  { id: 'dtm-2', name: 'Rauf Lutfulloh', score: 'SAT: 1480, DTM: 181', university: 'O\'zMU', type: 'DTM', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=520&q=80' },
  { id: 'dtm-3', name: 'Alisher Qodirov', score: 'Ona tili: 95%, DTM: 189', university: 'TUIT', type: 'DTM', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=520&q=80' },
  { id: 'dtm-4', name: 'Zuhra Valiyeva', score: 'Tarix: 98%, DTM: 188', university: 'TDSHU', type: 'DTM', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=520&q=80' }
];

const NatijalarGapiradi: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('IELTS');
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

  const combinedStudents = loading ? [] : (dbStudents.length > 0 ? dbStudents : [...sampleIelts, ...sampleDtm]);
  const students = combinedStudents.filter(s => 
    s.type === activeTab || 
    (s.certSubject && s.certSubject.toLowerCase().includes(activeTab.toLowerCase())) ||
    (activeTab === 'DTM' && s.certSubject && s.certSubject.toLowerCase().includes('dtm'))
  );

  const count1 = useCountUp(120);
  const count2 = useCountUp(7.1, 2000, 1);
  const count3 = useCountUp(185);
  const count4 = useCountUp(96);

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
            <Link to="/students" className="see-all-btn" style={{
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
            <h3>{count2}</h3>
            <h4>IELTS o'rtacha ball</h4>
            <p>Eng faol o'quvchilarimiz natijasi</p>
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
            {['IELTS', 'CEFR', 'Ona tili', 'Matematika', 'Biologiya', 'Kimyo', 'Tarix', 'Fizika', 'DTM'].map(tab => (
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
            {students.slice(0, 8).map((student: any, i: number) => (
              <div 
                className="ng-card" 
                key={student?.id || student?.name || i}
                onClick={() => !loading && navigate('/students/' + (student?.id || student?.name))}
                style={{cursor: loading ? 'default' : 'pointer'}}
              >
                <div className={`ng-card-image-wrapper ${loading ? 'skeleton' : ''}`}>
                  {!loading && <img src={student.image} alt={student.name} />}
                </div>
                <div className="ng-card-info">
                  <h3 className={`ng-card-name ${loading ? 'skeleton' : ''}`}>{student?.name || 'Loading name'}</h3>
                  <div className={`ng-card-score ${loading ? 'skeleton' : ''}`}>{!loading ? (student.certScore ? `${student.certScore} ball` : (student.admissionScore || student.score)) : 'Loading score'}</div>
                  <div className={`ng-card-uni ${loading ? 'skeleton' : ''}`} style={{ fontWeight: 600, color: loading ? 'transparent' : 'var(--accent-orange)' }}>
                    {!loading ? (student.certSubject || student.university || (student.grade ? student.grade + "-sinf" : '')) : 'University'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NatijalarGapiradi;
