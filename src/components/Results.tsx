import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Results.css';

const Results: React.FC = () => {
  const [dbGrads, setDbGrads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'graduates'), (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((doc: any) => !doc.isDraft);
      setDbGrads(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const cards = loading ? [] : [...dbGrads].sort((a, b) => {
    if (a.name?.toLowerCase().includes('javlonbek xoliqulov')) return -1;
    if (b.name?.toLowerCase().includes('javlonbek xoliqulov')) return 1;
    return 0;
  });

  if (!loading && cards.length === 0) {
    return null;
  }

  return (
    <section className="results-section" id="natijalar" data-aos="fade-up">
      <div className="container results-container">
        <span className="results-kicker">BIZNING BITIRUVCHILAR</span>
        <h2 className="results-title">
          ULAR ALLAQACHON<br />
          UNIVERSITETLARDA
        </h2>

        <div className="results-grid">
          {cards.slice(0, 8).map((card, index) => (
            <article 
              className="result-card" 
              key={card.id || index}
              onClick={() => !loading && navigate('/students/' + card.id)}
              style={{cursor: loading ? 'default' : 'pointer'}}
            >
              {/* Grant badge on the card corner */}
              {card.badge && <span className="result-badge">{card.badge}</span>}
              <div className={`result-photo ${loading ? 'skeleton' : ''}`}>
                {!loading && <img src={card.image} alt={card.name} />}
              </div>
              <div className="result-body">
                <span className={`result-university ${loading ? 'skeleton' : ''}`}>
                  {!loading && card.university}
                </span>
                <h3>{card.name}</h3>
              </div>
            </article>
          ))}
        </div>

        <button className="results-more" onClick={() => navigate('/students?tab=graduates')} style={{ cursor: 'pointer', background: 'transparent' }}>
          Barcha bitiruvchilar natijasini ko'rish <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
};

export default Results;
