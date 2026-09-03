import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Star, Award } from 'lucide-react';
import './AllPages.css';
import './Teachers.css';

const sampleTeachers = [
  {
    id: '1',
    name: "Javlonbek Xoliqulov",
    subject: "Informatika va IT",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=720&q=80",
    experience: "5 yil",
    bio: "Dasturlash va axborot texnologiyalari bo'yicha mutaxassis. O'quvchilarni zamonaviy texnologiyalarga yo'naltiradi.",
    achievements: ["IT Park rezidenti", "Olimpiada tayyorgarligi"]
  },
  {
    id: '2',
    name: "Nodira Karimova",
    subject: "Matematika",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=720&q=80",
    experience: "12 yil",
    bio: "Oliy toifali matematika o'qituvchisi. Ko'plab olimpiada g'oliblari va talabalar ustozi.",
    achievements: ["Xalq ta'limi a'lochisi", "10+ Respublika g'oliblari"]
  },
  {
    id: '3',
    name: "Dilshod Rahmonov",
    subject: "Ingliz tili",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=720&q=80",
    experience: "8 yil",
    bio: "IELTS 8.5 sohibi. O'quvchilarni xalqaro sertifikatlarga qisqa muddatda tayyorlash bo'yicha katta tajribaga ega.",
    achievements: ["IELTS 8.5", "TESOL sertifikati"]
  },
  {
    id: '4',
    name: "Malika Yusupova",
    subject: "Ona tili va Adabiyot",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=720&q=80",
    experience: "15 yil",
    bio: "O'zbek tili va adabiyotini sevib o'rgatuvchi, chuqur bilim va keng dunyoqarashga ega ustoz.",
    achievements: ["Oliy toifa", "Eng yaxshi ustoz - 2022"]
  },
  {
    id: '5',
    name: "Azizbek Toshev",
    subject: "Fizika",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=720&q=80",
    experience: "7 yil",
    bio: "Aniq fanlar yo'nalishida iqtidorli yoshlarni kashf etish va ularni xalqaro darajaga olib chiqish bo'yicha yetakchi.",
    achievements: ["Xalqaro olimpiada hakam", "Yilning eng faol o'qituvchisi"]
  },
  {
    id: '6',
    name: "Shahnoza Umarova",
    subject: "Kimyo va Biologiya",
    image: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&w=720&q=80",
    experience: "10 yil",
    bio: "Tabiiy fanlarni amaliyot va tajribalar orqali tushuntiradigan tajribali ustoz.",
    achievements: ["Oliy toifa", "Tibbiyot yo'nalishi eksperti"]
  }
];

const Teachers: React.FC = () => {
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
          {sampleTeachers.map(teacher => (
            <div className="teacher-card" key={teacher.id}>
              <div className="teacher-image-wrapper">
                <img src={teacher.image} alt={teacher.name} />
                <div className="teacher-subject-badge">
                  <BookOpen size={14} /> {teacher.subject}
                </div>
              </div>
              <div className="teacher-info">
                <h3>{teacher.name}</h3>
                <div className="teacher-meta">
                  <span><Star size={14} className="meta-icon" /> {teacher.experience} tajriba</span>
                </div>
                <p className="teacher-bio">{teacher.bio}</p>
                
                <div className="teacher-achievements">
                  {teacher.achievements.map((ach, idx) => (
                    <span key={idx} className="achievement-tag"><Award size={12} /> {ach}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Teachers;
