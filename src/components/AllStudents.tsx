import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Award, GraduationCap } from 'lucide-react';
import './AllPages.css';
import './Results.css';

const SUBJECT_FILTERS = ['Barchasi', 'Matematika', 'IELTS', 'CEFR', 'Ona tili', 'Biologiya', 'Kimyo', 'Tarix', 'Fizika', 'DTM'];

const AllStudents: React.FC = () => {
  const [dbStudents, setDbStudents] = useState<any[]>([]);
  const [dbGrads, setDbGrads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState('Barchasi');
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') === 'graduates' ? 'graduates' : 'certificates';
  const [activeTab, setActiveTab] = useState<'certificates' | 'graduates'>(initialTab);

  useEffect(() => {
    const qTab = new URLSearchParams(location.search).get('tab');
    if (qTab === 'graduates') setActiveTab('graduates');
    else if (qTab === 'certificates') setActiveTab('certificates');
  }, [location.search]);

  useEffect(() => {
    let studentsLoaded = false;
    let gradsLoaded = false;

    const checkLoading = () => {
      if (studentsLoaded && gradsLoaded) setLoading(false);
    };

    const unsub = onSnapshot(collection(db, 'students'), (snapshot) => {
      setDbStudents(
        snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter((doc: any) => !doc.isDraft)
      );
      studentsLoaded = true;
      checkLoading();
    });
    
    const unsubGrads = onSnapshot(collection(db, 'graduates'), (snapshot) => {
      setDbGrads(
        snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter((doc: any) => !doc.isDraft)
      );
      gradsLoaded = true;
      checkLoading();
    });
    
    return () => { unsub(); unsubGrads(); };
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

  const filteredCertificates = (subjectFilter === 'Barchasi' 
    ? [...dbStudents] 
    : dbStudents.filter(s => 
        s.type === subjectFilter || 
        (s.certSubject && s.certSubject.toLowerCase().includes(subjectFilter.toLowerCase())) ||
        (subjectFilter === 'DTM' && s.certSubject && s.certSubject.toLowerCase().includes('dtm'))
      )).sort((a, b) => {
        const scoreA = parseScore(a.certScore || a.score);
        const scoreB = parseScore(b.certScore || b.score);
        return scoreB - scoreA;
      });

  const sortedGrads = [...dbGrads].sort((a, b) => {
    if (a.name?.toLowerCase().includes('javlonbek xoliqulov')) return -1;
    if (b.name?.toLowerCase().includes('javlonbek xoliqulov')) return 1;
    return 0;
  });

  return (
    <div className="page-container" style={{ background: '#f7f9fc' }}>
      <div className="container">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} /> Asosiy sahifaga qaytish
        </Link>

        <div className="section-head centered" style={{ marginBottom: '30px' }}>
          <h1 className="page-title">
            {activeTab === 'certificates' ? 'O\'quvchilar va Sertifikatlar' : 'Maktabimiz Bitiruvchilari'}
          </h1>
          <p className="teachers-subtitle" style={{ maxWidth: '650px', margin: '10px auto 0' }}>
            {activeTab === 'certificates' 
              ? 'Xalqaro va respublika sertifikatlariga ega iqtidorli o\'quvchilarimiz' 
              : 'Nufuzli oliy ta\'lim muassasalariga grant va kontrakt asosida kirgan bitiruvchilarimiz'}
          </p>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab('certificates')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '30px',
              border: activeTab === 'certificates' ? '2px solid var(--accent-orange)' : '1px solid #cbd3df',
              background: activeTab === 'certificates' ? 'var(--accent-orange)' : '#ffffff',
              color: activeTab === 'certificates' ? '#ffffff' : '#071a33',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: activeTab === 'certificates' ? '0 6px 20px rgba(255,107,0,0.3)' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            <Award size={18} /> Sertifikatlilar ({dbStudents.length})
          </button>
          
          <button
            onClick={() => setActiveTab('graduates')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '30px',
              border: activeTab === 'graduates' ? '2px solid var(--accent-orange)' : '1px solid #cbd3df',
              background: activeTab === 'graduates' ? 'var(--accent-orange)' : '#ffffff',
              color: activeTab === 'graduates' ? '#ffffff' : '#071a33',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: activeTab === 'graduates' ? '0 6px 20px rgba(255,107,0,0.3)' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            <GraduationCap size={18} /> Bitiruvchilar ({dbGrads.length})
          </button>
        </div>

        {/* Subject Filter for Certificates */}
        {activeTab === 'certificates' && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '8px', 
            marginBottom: '36px', 
            flexWrap: 'wrap',
            padding: '0 10px'
          }}>
            {SUBJECT_FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => setSubjectFilter(filter)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '22px',
                  border: subjectFilter === filter ? '2px solid var(--accent-orange)' : '1px solid #d1d5db',
                  background: subjectFilter === filter ? 'var(--accent-orange)' : '#f8fafc',
                  color: subjectFilter === filter ? '#fff' : '#374151',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: subjectFilter === filter ? '0 4px 14px rgba(255,107,0,0.25)' : 'none'
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        )}

        {/* Content View */}
        {activeTab === 'certificates' ? (
          filteredCertificates.length > 0 ? (
            <div className="all-grid">
              {filteredCertificates.map((student, i) => (
                <div 
                  className="ng-card" 
                  key={student.id || i}
                >
                  <div className="ng-card-image-wrapper">
                    <img src={student.image} alt={student.name} />
                  </div>
                  <div className="ng-card-info">
                    <h3 className="ng-card-name">{student.name}</h3>
                    <div className="ng-card-score-big">{student.certScore || student.score || ''}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : loading ? (
            <div className="all-grid">
              {Array(8).fill(0).map((_, i) => (
                <div className="ng-card" key={`skeleton-${i}`}>
                  <div className="ng-card-image-wrapper skeleton" style={{ width: '100%', height: '300px' }}></div>
                  <div className="ng-card-info">
                    <h3 className="ng-card-name skeleton" style={{ height: '20px', width: '70%', margin: '0 auto 10px' }}></h3>
                    <div className="ng-card-score-big skeleton" style={{ height: '30px', width: '40%', margin: '0 auto' }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '80px 20px', 
              color: '#94a3b8',
              fontSize: '16px'
            }}>
              {subjectFilter !== 'Barchasi' ? `"${subjectFilter}" fani bo'yicha sertifikatlar topilmadi` : 'Hali sertifikat ma\'lumotlari qo\'shilmagan'}
            </div>
          )
        ) : (
          sortedGrads.length > 0 ? (
            <div className="results-grid" style={{ maxWidth: '100%' }}>
              {sortedGrads.map((card, index) => (
                <article 
                  className="result-card" 
                  key={card.id || index}
                  onClick={() => navigate('/students/' + card.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {card.badge && <span className="result-badge">{card.badge}</span>}
                  <div className="result-photo">
                    <img src={card.image} alt={card.name} />
                  </div>
                  <div className="result-body">
                    <span className="result-university">
                      {card.university}
                    </span>
                    <h3>{card.name}</h3>
                    {card.bio && <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', display: 'block' }}>{card.bio}</p>}
                  </div>
                </article>
              ))}
            </div>
          ) : loading ? (
            <div className="results-grid" style={{ maxWidth: '100%' }}>
              {Array(8).fill(0).map((_, i) => (
                <article className="result-card" key={`skeleton-grad-${i}`}>
                  <div className="result-photo skeleton" style={{ height: '280px' }}></div>
                  <div className="result-body">
                    <span className="result-university skeleton" style={{ height: '15px', width: '50%', marginBottom: '10px' }}></span>
                    <h3 className="skeleton" style={{ height: '22px', width: '80%', marginBottom: '8px' }}></h3>
                    <p className="skeleton" style={{ height: '14px', width: '90%' }}></p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '80px 20px', 
              color: '#94a3b8',
              fontSize: '16px'
            }}>
              Hali bitiruvchi ma'lumotlari qo'shilmagan
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AllStudents;
