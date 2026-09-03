import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Medal, BookOpen, GraduationCap } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './AllPages.css';

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (id) {
          let docRef = doc(db, 'students', id);
          let docSnap = await getDoc(docRef);
          
          if (!docSnap.exists()) {
            docRef = doc(db, 'graduates', id);
            docSnap = await getDoc(docRef);
          }

          if (docSnap.exists()) {
            setStudent({ id: docSnap.id, ...docSnap.data() });
          }
        }
      } catch (error) {
        console.error("O'quvchini yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
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

  if (!student) {
    return (
      <div className="page-container">
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <h2>O'quvchi topilmadi</h2>
          <Link to="/students" style={{ color: 'var(--accent-orange)' }}>Ro'yxatga qaytish</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Link to="/students" className="back-link">
          <ArrowLeft size={20} /> Barcha natijalarga qaytish
        </Link>
        
        <div className="detail-layout" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div className="detail-sidebar" style={{ alignItems: 'center' }}>
            <div className="student-hero">
              {student.image && (
                <img src={student.image} alt={student.name} style={{ width: '250px', height: '250px', borderRadius: '50%', border: '6px solid white', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
              )}
              <h1 style={{ fontSize: '42px', marginTop: '10px' }}>{student.name}</h1>
              <div className="badge">
                {student.isGraduate ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><GraduationCap size={16} /> Bitiruvchi</span>
                ) : student.certSubject ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>{student.certSubject} sertifikati sohibi</span>
                ) : (
                  <span>{student.grade}-sinf o'quvchisi</span>
                )}
              </div>
            </div>
            
            {(student.calculatedDtm || student.certScore) && (
              <div style={{ background: '#eef2ff', color: '#3730a3', padding: '16px 32px', borderRadius: '12px', textAlign: 'center', fontWeight: 'bold', fontSize: '20px' }}>
                {student.certScore ? `Natija: ${student.certScore} ball` : `Taxminiy DTM bali: ${student.calculatedDtm}`}
              </div>
            )}
          </div>

          <div className="detail-main" style={{ width: '100%', maxWidth: '700px', marginTop: '20px' }}>
            {student.university && (
              <div className="student-stat-card">
                <h4><GraduationCap size={20} color="var(--accent-orange)" /> Qabul qilingan oliygoh</h4>
                <p style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0', color: '#0f172a' }}>{student.university}</p>
                {student.admissionScore && <p style={{ margin: 0, color: '#64748b' }}>Kirish bali: <strong>{student.admissionScore}</strong></p>}
              </div>
            )}

            {student.bio && (
              <div className="student-stat-card">
                <h4><BookOpen size={20} color="var(--accent-orange)" /> Qo'shimcha ma'lumotlar</h4>
                <p style={{ margin: 0, color: '#334155', lineHeight: 1.6 }}>{student.bio}</p>
              </div>
            )}

            {student.certificates && student.certificates.length > 0 && (
              <div className="student-stat-card">
                <h4><BookOpen size={20} color="var(--accent-orange)" /> Sertifikatlar ({student.certificates.length} ta)</h4>
                <div className="student-cert-list">
                  {student.certificates.map((cert: any, i: number) => (
                    <div key={i} className="student-cert-item">
                      <span className="cert-subject">{cert.subject}</span>
                      <span className="cert-score">{cert.score} {cert.percentage ? `(${cert.percentage}%)` : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {student.olympiads && student.olympiads.length > 0 && (
              <div className="student-stat-card">
                <h4><Medal size={20} color="var(--accent-orange)" /> Olimpiada natijalari</h4>
                <div className="student-cert-list">
                  {student.olympiads.map((oly: any, i: number) => (
                    <div key={i} className="student-cert-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                      <span className="cert-subject">{oly.name}</span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', color: '#64748b', fontSize: '14px' }}>
                        <span>Bosqich: {oly.stage}</span>
                        <span>O'rni: <strong>{oly.rank}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
