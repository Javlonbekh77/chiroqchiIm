import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Results.css';

const sampleCards = [
  {
    id: 'grad-1',
    badge: 'Grant',
    university: 'HARVARD UNIVERSITY',
    name: 'Jasurbek Umarov',
    bio: 'IELTS 8.0, SAT 1520. DTM bali: 189. Sertifikatlari: IELTS, SAT, matematika olimpiadasi.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=520&q=80',
  },
  {
    id: 'grad-2',
    badge: 'Grant',
    university: 'NYU ABU DHABI',
    name: 'Murod Aslamov',
    bio: 'IELTS 8.5, SAT 1540. DTM bali: 191. Sertifikatlari: IELTS, SAT, ingliz tili.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=520&q=80',
  },
  {
    id: 'grad-3',
    badge: 'Kontrakt',
    university: 'UNIVERSITY OF HONG KONG',
    name: 'Irgashev Mustafo',
    bio: 'IELTS 7.5, SAT 1520. DTM bali: 186. Sertifikatlari: IELTS, SAT, fizika yo\'nalishi.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=520&q=80',
  },
  {
    id: 'grad-4',
    badge: 'Grant',
    university: 'SABANCI UNIVERSITY',
    name: 'Umid Abdumuratov',
    bio: 'IELTS 7.0, SAT 1450. DTM bali: 181. Sertifikatlari: IELTS, SAT, robototexnika.',
    image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=520&q=80',
  },
];

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

  const cards = loading ? [] : (dbGrads.length > 0 ? dbGrads : sampleCards);

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
              <div className={`result-photo ${loading ? 'skeleton' : ''}`}>
                {!loading && <img src={card.image} alt={card.name} />}
                {!loading && <span className="result-badge">{card.badge || 'Grant'}</span>}
              </div>
              <div className="result-body">
                <span className={`result-university ${loading ? 'skeleton' : ''}`} style={{ width: loading ? '100px' : 'auto', minHeight: loading ? '15px' : 'auto', display: loading ? 'block' : 'inline' }}>
                  {!loading && card.university}
                </span>
                <h3 className={loading ? 'skeleton' : ''}>{card.name || 'Loading Name'}</h3>
                <p className={loading ? 'skeleton' : ''}>{card.bio || 'Loading description content for skeleton...'}</p>
              </div>
            </article>
          ))}
        </div>

        <button className="results-more" onClick={() => navigate('/students')} style={{ cursor: 'pointer', background: 'transparent' }}>
          Barcha natijalarni ko'rish <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
};

export default Results;
