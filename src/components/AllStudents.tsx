import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './AllPages.css';

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

const AllStudents: React.FC = () => {
  const [dbStudents, setDbStudents] = useState<any[]>([]);
  const [dbGrads, setDbGrads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let studentsLoaded = false;
    let gradsLoaded = false;

    const checkLoading = () => {
      if (studentsLoaded && gradsLoaded) setLoading(false);
    }

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

  const students = loading ? [...sampleIelts, ...sampleDtm] : (dbGrads.length > 0 || dbStudents.length > 0 ? [...dbGrads, ...dbStudents] : [...sampleIelts, ...sampleDtm]);

  return (
    <div className="page-container">
      <div className="container">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} /> Asosiy sahifaga qaytish
        </Link>
        <h1 className="page-title">Barcha Natija va Sertifikatlar</h1>
        <div className="all-grid">
          {students.map((student, i) => (
            <div 
              className="ng-card" 
              key={student.id || student.name || i}
              onClick={() => !loading && navigate('/students/' + (student.id || student.name))}
              style={{cursor: loading ? 'default' : 'pointer'}}
            >
              <div className={`ng-card-image-wrapper ${loading ? 'skeleton' : ''}`}>
                {!loading && <img src={student.image} alt={student.name} />}
              </div>
              <div className="ng-card-info">
                <h3 className={`ng-card-name ${loading ? 'skeleton' : ''}`}>{student.name}</h3>
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
  );
};

export default AllStudents;
