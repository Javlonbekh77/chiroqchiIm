import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Star, Award, Shield } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import './AllPages.css';
import './Teachers.css';
import teachersData from '../teachers.json';

interface TeacherData {
  id?: string;
  jsonId?: string;
  full_name: string;
  subject: string;
  experience_years: number;
  qualification_category: string;
  certificates: string[];
  image?: string;
  isDeleted?: boolean;
}

const defaultTeachers = teachersData as TeacherData[];

const Teachers: React.FC = () => {
  const [dbTeachers, setDbTeachers] = useState<TeacherData[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'teachers'), (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as TeacherData & { isDraft?: boolean }))
        .filter((doc) => !doc.isDraft);
      setDbTeachers(data);
    });
    return () => unsub();
  }, []);

  // Merge dbTeachers with defaultTeachers (excluding deleted items)
  const activeDbTeachers = dbTeachers.filter(t => !t.isDeleted);
  const combinedTeachers: TeacherData[] = [...activeDbTeachers];

  defaultTeachers.forEach((jsonT, idx) => {
    const jsonId = `json-${idx}`;
    const isDeletedInDb = dbTeachers.some(t => t.jsonId === jsonId && t.isDeleted);
    const isAlreadyInDb = dbTeachers.some(t => t.jsonId === jsonId || t.full_name?.trim().toLowerCase() === jsonT.full_name?.trim().toLowerCase());
    
    if (!isDeletedInDb && !isAlreadyInDb) {
      combinedTeachers.push({
        id: jsonId,
        ...jsonT
      });
    }
  });

  // Sorting priority:
  // 1. Has photo (image exists and not empty)
  // 2. Category: Oliy (4) > Birinchi (3) > Ikkinchi (2) > Mutaxassis (1)
  // 3. Experience years descending
  const categoryRank = (cat: string) => {
    const lower = (cat || '').toLowerCase();
    if (lower.includes('oliy')) return 4;
    if (lower.includes('birinchi')) return 3;
    if (lower.includes('ikkinchi')) return 2;
    if (lower.includes('mutaxassis')) return 1;
    return 0;
  };

  const teachersList = combinedTeachers.sort((a, b) => {
    const hasPhotoA = a.image && a.image.trim().length > 0 ? 1 : 0;
    const hasPhotoB = b.image && b.image.trim().length > 0 ? 1 : 0;
    if (hasPhotoA !== hasPhotoB) return hasPhotoB - hasPhotoA;

    const rankA = categoryRank(a.qualification_category);
    const rankB = categoryRank(b.qualification_category);
    if (rankA !== rankB) return rankB - rankA;

    return (Number(b.experience_years) || 0) - (Number(a.experience_years) || 0);
  });

  return (
    <div className="page-container" style={{ background: '#f7f9fc' }}>
      <div className="container">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} /> Asosiy sahifaga
        </Link>

        <div className="teachers-header">
          <h1 className="page-title" style={{ marginBottom: '15px' }}>Maktabimiz Faxri - <span>Ustozlar</span></h1>
          <p className="teachers-subtitle">Ta'lim dargohimizning yorqin yulduzlari, o'z kasbining fidoyilari bo'lgan ustozlarimiz bilan tanishing.</p>
        </div>

        <div className="teachers-grid">
          {teachersList.map((teacher, index) => {
            const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.full_name || 'Ustoz')}&background=random&color=fff&size=512&bold=true`;
            const avatarUrl = teacher.image || fallbackAvatar;

            return (
              <div className="teacher-card" key={teacher.id || index}>
                <div className="teacher-image-wrapper">
                  <img src={avatarUrl} alt={teacher.full_name} style={{ objectFit: 'cover' }} />
                  <div className="teacher-subject-badge">
                    <BookOpen size={14} /> {(teacher.subject || '').charAt(0).toUpperCase() + (teacher.subject || '').slice(1)}
                  </div>
                </div>
                <div className="teacher-info">
                  <h3>{teacher.full_name}</h3>
                  <div className="teacher-meta">
                    <span><Star size={14} className="meta-icon" /> {teacher.experience_years} yil tajriba</span>
                    <span><Shield size={14} className="meta-icon" style={{marginLeft: '10px'}} /> {teacher.qualification_category} toifa</span>
                  </div>
                  <p className="teacher-bio">
                    {teacher.qualification_category} toifali {teacher.subject} fani o'qituvchisi. O'quvchilarga chuqur bilim berish bo'yicha {teacher.experience_years} yillik pedagogik tajribaga ega.
                  </p>
                  
                  <div className="teacher-achievements">
                    {teacher.certificates && teacher.certificates.length > 0 ? (
                      teacher.certificates.map((cert, idx) => (
                        <span key={idx} className="achievement-tag"><Award size={12} /> {cert}</span>
                      ))
                    ) : (
                      <span className="achievement-tag" style={{ opacity: 0.6 }}><Award size={12} /> Umumiy</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Teachers;
