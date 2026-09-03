import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './AllPages.css';

const sampleUniversities = [
  'Harvard', 'NYU Abu Dhabi', 'University of Chicago', 'University of Hong Kong',
  'Kyoto University', 'Carnegie Mellon', 'University of Toronto', 'WIUT',
  'Webster University', 'Central Asian University', 'Drexel University', 'Amity University',
];

const AllUniversities: React.FC = () => {
  const [dbUniversities, setDbUniversities] = useState<string[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'universities'), (snapshot) => {
      setDbUniversities(snapshot.docs.map(doc => doc.data().name));
    });
    return () => unsub();
  }, []);

  const universities = [...dbUniversities, ...sampleUniversities];

  return (
    <div className="page-container">
      <div className="container">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} /> Asosiy sahifaga qaytish
        </Link>
        <h1 className="page-title">Bitiruvchilarimiz qabul qilingan barcha universitetlar</h1>
        <div className="all-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
          {universities.map((uni, index) => (
            <div 
              key={index} 
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                fontWeight: 600,
                color: 'var(--text-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100px'
              }}
            >
              {uni}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllUniversities;
