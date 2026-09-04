import React, { useState, useEffect } from 'react';
import { ArrowRight, Award, ChevronDown, Mail, MapPin, Medal, Phone, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import './SodiqSections.css';

export const sampleOlympiads: any[] = [];


const faqs = [
  ['Qabul imtihoni qanday o\'tadi?', "Matematika, ingliz tili va mantiqiy fikrlash bo'yicha sinov o'tkaziladi."],
  ['Qaysi sinflar uchun qabul bor?', "Chiroqchi IMda 1-11 sinf o'quvchilar uchun ta'lim jarayoni tashkil etiladi."],
  ['Sertifikat va DTM tayyorgarligi bormi?', "Ha, o'quvchilar IELTS, SAT, fan sertifikatlari va DTM imtihonlariga tayyorlanadi."],
  ['Hujjatlarni qanday topshiraman?', 'Maktabga kelib yoki bog\'lanish formasi orqali ma\'lumot qoldirishingiz mumkin.'],
];

const SodiqSections: React.FC = () => {

  const [gallery, setGallery] = useState<string[]>([]);
  const [dbUniversities, setDbUniversities] = useState<string[]>([]);
  const [dbOlympiads, setDbOlympiads] = useState<any[]>([]);

  useEffect(() => {
    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data().image);
      setGallery(data);
    });
    
    const unsubUni = onSnapshot(collection(db, 'universities'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data().name);
      setDbUniversities(data);
    });

    const unsubOly = onSnapshot(collection(db, 'olympiads'), (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((item: any) => !item.isDraft);
      setDbOlympiads(data);
    });

    return () => {
      unsubGallery();
      unsubUni();
      unsubOly();
    };
  }, []);

  const universities = dbUniversities;
  const olympiads = dbOlympiads;
  const visibleOlympiads = olympiads.slice(0, 3);

  return (
    <>
      <section className="universities-section" id="universitetlar" data-aos="fade-up">
        <div className="container">
          <div className="section-head centered">
            <span>Universitetlar</span>
            <h2>O'quvchilarimiz qaysi universitetlarga kirishdi?</h2>
          </div>
          {universities.length > 0 ? (
            <div className="university-marquee">
              {universities.concat(universities).map((name, index) => (
                <div className="university-logo" key={`${name}-${index}`}>{name}</div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>Universitetlar hali qo'shilmagan</p>
          )}
          <p className="university-note">Chiroqchi IM bitiruvchilari TOP universitetlar sari dadil qadam tashlaydi</p>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/universities" className="see-all-btn" style={{
              display: 'inline-block',
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
      </section>

      <section className="olympiad-section" id="olimpiadachilar" data-aos="fade-up">
        <div className="container">
          <div className="section-head centered">
            <span>Yutuqlar</span>
            <h2>Olimpiadachilarimiz</h2>
            <p>O'quvchilarimiz fan olimpiadalari va xalqaro musobaqalarda erishgan natijalari</p>
          </div>
          {visibleOlympiads.length > 0 ? (
            <div className="olympiad-grid">
              {visibleOlympiads.map((item, index) => {
                const itemKey = item.id || `oly-${index + 1}`;
                const firstImg = (item.images && item.images[0]) || item.image;
                const statsArray = Array.isArray(item.stats) ? item.stats : (item.stats ? [item.stats] : []);

                return (
                  <Link to={`/olympiads/${itemKey}`} className="olympiad-card" key={itemKey} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <img src={firstImg} alt={item.title} />
                    <div>
                      <h3>{item.title}</h3>
                      <p style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.text}</p>
                      <div className="olympiad-stats">
                        {statsArray.map((stat: string) => <span key={stat}>{stat}</span>)}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p style={{textAlign: 'center'}}>Ma'lumotlar yuklanmoqda yoki hali qo'shilmagan.</p>
          )}

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Link to="/olympiads" className="see-all-btn" style={{
              display: 'inline-block',
              color: 'var(--accent-orange)',
              fontWeight: 600,
              textDecoration: 'none',
              padding: '12px 28px',
              border: '2px solid var(--accent-orange)',
              borderRadius: '10px',
              transition: 'all 0.3s ease',
              fontSize: '16px'
            }}>
              Barcha olimpiada natijalarini ko'rish →
            </Link>
          </div>


        </div>
      </section>

      <section className="gallery-section" id="galereya" data-aos="fade-up">
        <div className="container">
          <div className="section-head centered">
            <span>Foto galereya</span>
            <h2>Chiroqchi IM hayotidan lavhalar</h2>
          </div>
        </div>
        {gallery.length > 0 ? (
          <div className="gallery-carousel-wrapper">
            <div className="gallery-marquee">
              {gallery.concat(gallery).map((src, index) => (
                <img src={src} alt={`Chiroqchi IM galereya ${index + 1}`} key={`${src}-${index}`} />
              ))}
            </div>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>Galereya rasmlari hali qo'shilmagan</p>
        )}
      </section>

      <section className="faq-contact-section" id="aloqa" data-aos="fade-up">
        <div className="container faq-contact-grid">
          <div className="faq-panel">
            <span className="mini-kicker">FAQ</span>
            <h2>Ko'p beriladigan savollar</h2>
            {faqs.map(([question, answer]) => (
              <details className="faq-item" key={question}>
                <summary>{question}<ChevronDown size={18} /></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>

          <div className="contact-panel">
            <span className="mini-kicker">Bog'lanish</span>
            <h2>Anonim savol, taklif yoki murojaat qoldiring</h2>
            <p>Sizning fikringiz biz uchun muhim. Barcha murojaatlar e'tiborga olinadi.</p>
            <form className="contact-form">
              <input placeholder="Ismingiz (ixtiyoriy)" />
              <textarea 
                placeholder="Savol, taklif yoki murojaatingizni yozing..." 
                rows={4} 
                style={{
                  width: '100%', 
                  padding: '12px 16px', 
                  borderRadius: '12px', 
                  border: '1px solid #cbd3df', 
                  resize: 'vertical', 
                  fontFamily: 'inherit',
                  marginBottom: '16px'
                }}
              />
              <button type="button" onClick={() => { alert("Murojaatingiz qabul qilindi. Rahmat!"); }}>
                Yuborish <ArrowRight size={18} />
              </button>
            </form>
            <div className="contact-info">
              <span><MapPin size={18} /> Chiroqchi tumani, ixtisoslashtirilgan maktab</span>
              <span><Phone size={18} /> +998 90 123 45 67</span>
              <span><Mail size={18} /> info@chiroqchi-im.uz</span>
            </div>
          </div>
        </div>
        <div className="container map-container">
          <iframe
            title="Chiroqchi IM Google Maps location"
            src="https://www.google.com/maps?q=Chiroqchi%20ixtisoslashtirilgan%20maktab&output=embed"
            loading="lazy"
          />
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-container">
          <div className="footer-brand">
            <img src="/main-logo.png" alt="Chiroqchi IM" className="footer-logo" />
            <p>Kelajak shu yerdan qanot qoqadi. Ilm-fan, texnologiya va tarbiya uyg'unlashgan maskan.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h3>Havolalar</h3>
              <nav>
                <a href="#home">Bosh sahifa</a>
                <a href="#about">Maktab haqida</a>
                <a href="#natijalar">Natijalar</a>
                <a href="#galereya">Galereya</a>
              </nav>
            </div>
            <div className="footer-column">
              <h3>Aloqa</h3>
              <nav>
                <a href="#aloqa" style={{ color: 'var(--accent-orange)' }}>Savol yoki taklif qoldirish</a>
                <span>+998 90 123 45 67</span>
                <span>info@chiroqchi-im.uz</span>
                <span>Chiroqchi tumani, ixtisoslashtirilgan maktab</span>
              </nav>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="container developer-credit">
            <span className="dev-text">Designed & Developed by</span>
            <a href="https://t.me/javlonbek_xoliqulov" target="_blank" rel="noopener noreferrer" className="dev-name">
              Javlonbek Xoliqulov
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default SodiqSections;
