import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { auth, db } from '../firebase';
import teachersData from '../teachers.json';
import CropModal from './CropModal';
import './AdminPanel.css';

const IMGBB_API_KEY = '3edb9537654629fd39126a0964b78bb9';

const AdminPanel: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('students');
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Modal Media Library
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaCallback, setMediaCallback] = useState<((url: string) => void) | null>(null);

  // News form state
  const [newsTitle, setNewsTitle] = useState('');
  const [newsText, setNewsText] = useState('');
  const [newsSize, setNewsSize] = useState('small');
  const [newsImages, setNewsImages] = useState<string[]>([]);
  const [newsImageFiles, setNewsImageFiles] = useState<File[]>([]);
  const [editNewsId, setEditNewsId] = useState<string | null>(null);

  // Uni form state
  const [uniName, setUniName] = useState('');

  // Olympiad form state
  const [olyTitle, setOlyTitle] = useState('');
  const [olyText, setOlyText] = useState('');
  const [olyStats, setOlyStats] = useState('');
  const [olyImages, setOlyImages] = useState<string[]>([]);
  const [olyImageFiles, setOlyImageFiles] = useState<File[]>([]);
  const [editOlyId, setEditOlyId] = useState<string | null>(null);

  // Teacher form state
  const [teacherFullName, setTeacherFullName] = useState('');
  const [teacherSubject, setTeacherSubject] = useState('Matematika');
  const [teacherExp, setTeacherExp] = useState<number | string>('');
  const [teacherCategory, setTeacherCategory] = useState('Oliy');
  const [teacherCertInput, setTeacherCertInput] = useState('');
  const [teacherImage, setTeacherImage] = useState<string>('');
  const [teacherImageFile, setTeacherImageFile] = useState<File | null>(null);
  const [editTeacherId, setEditTeacherId] = useState<string | null>(null);

  // Lists from DB
  const [students, setStudents] = useState<any[]>([]);
  const [graduates, setGraduates] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [olympiads, setOlympiads] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  // Combined Teachers list (includes default JSON items not yet edited/deleted in Firestore)
  const combinedTeachers = [...teachers.filter(t => !t.isDeleted)];
  (teachersData as any[]).forEach((jsonTeacher, index) => {
    const jsonId = `json-${index}`;
    const exists = teachers.some((t: any) => t.jsonId === jsonId || t.full_name?.trim().toLowerCase() === jsonTeacher.full_name?.trim().toLowerCase());
    if (!exists) {
      combinedTeachers.push({
        id: jsonId,
        jsonId: jsonId,
        ...jsonTeacher,
        isDefaultJson: true
      });
    }
  });

  // Student/Certificate form state
  const [studentName, setStudentName] = useState('');
  const [certSubject, setCertSubject] = useState('IELTS');
  const [certScore, setCertScore] = useState('');
  const [studentImage, setStudentImage] = useState<string>('');
  const [studentImageFile, setStudentImageFile] = useState<File | null>(null);
  
  // Graduate form state
  const [gradName, setGradName] = useState('');
  const [gradUni, setGradUni] = useState('');
  const [gradScore, setGradScore] = useState('');
  const [gradBio, setGradBio] = useState('');
  const [gradImage, setGradImage] = useState<string>('');
  const [gradImageFile, setGradImageFile] = useState<File | null>(null);
  const [gradBadge, setGradBadge] = useState('Grant');
  const [certificates, setCertificates] = useState<any[]>([]);

  // Edit states
  const [editStudentId, setEditStudentId] = useState<string | null>(null);
  const [editGradId, setEditGradId] = useState<string | null>(null);

  // Gallery form state
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);

  // Crop Modal state
  const [cropImageUrl, setCropImageUrl] = useState<string | null>(null);
  const [cropCallback, setCropCallback] = useState<((file: File) => void) | null>(null);

  const handleFileChangeForCrop = (e: React.ChangeEvent<HTMLInputElement>, setFile: (f: File) => void, setPreview: (u: string) => void) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setCropImageUrl(url);
      setCropCallback(() => (croppedFile: File) => {
        setFile(croppedFile);
        setPreview(URL.createObjectURL(croppedFile));
      });
      e.target.value = ''; // Reset input so same file can be selected again
    }
  };

  const startCroppingUrl = (url: string, setFile: (f: File) => void, setPreview: (u: string) => void) => {
    setCropImageUrl(url);
    setCropCallback(() => (croppedFile: File) => {
      setFile(croppedFile);
      setPreview(URL.createObjectURL(croppedFile));
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch data
  useEffect(() => {
    if (!isLoggedIn) return;

    const unsubStudents = onSnapshot(collection(db, 'students'), (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubGrads = onSnapshot(collection(db, 'graduates'), (snapshot) => {
      setGraduates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snapshot) => {
      setGallery(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubUniversities = onSnapshot(collection(db, 'universities'), (snapshot) => {
      setUniversities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubOlympiads = onSnapshot(collection(db, 'olympiads'), (snapshot) => {
      setOlympiads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubNews = onSnapshot(collection(db, 'news'), (snapshot) => {
      setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubTeachers = onSnapshot(collection(db, 'teachers'), (snapshot) => {
      setTeachers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubMessages = onSnapshot(collection(db, 'messages'), (snapshot) => {
      setMessages(
        snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      );
    });

    return () => {
      unsubStudents();
      unsubGrads();
      unsubGallery();
      unsubUniversities();
      unsubOlympiads();
      unsubNews();
      unsubTeachers();
      unsubMessages();
    };
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError("Email yoki parol noto'g'ri. Iltimos tekshirib qayta kiriting.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  const uploadToImgBB = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success) return data.data.url;
    throw new Error("Rasm yuklashda xatolik");
  };

  const handlePublishAll = async () => {
    if (!window.confirm("Barcha o'zgarishlarni ommaga e'lon qilasizmi?")) return;
    setIsPublishing(true);
    try {
      const collections = ['news', 'students', 'graduates', 'olympiads', 'universities', 'gallery', 'teachers'];
      
      for (const col of collections) {
        const q = query(collection(db, col), where("isDraft", "==", true));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const batch = writeBatch(db);
          snapshot.forEach((d) => {
            batch.update(doc(db, col, d.id), { isDraft: false });
          });
          await batch.commit();
        }
      }
      alert("Barcha o'zgarishlar e'lon qilindi!");
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi");
    } finally {
      setIsPublishing(false);
    }
  };

  const openMediaLibrary = (callback: (url: string) => void) => {
    setMediaCallback(() => callback);
    setIsMediaModalOpen(true);
  };

  // Combine all images for media library
  const allImages = Array.from(new Set([
    ...gallery.map(g => g.image),
    ...students.map(s => s.image),
    ...graduates.map(g => g.image),
    ...olympiads.flatMap(o => o.images || [o.image]).filter(Boolean),
    ...teachers.map(t => t.image).filter(Boolean),
    ...news.flatMap(n => n.images || [n.image]).filter(Boolean)
  ])).filter(Boolean);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalImageUrl = studentImage;
    if (studentImageFile) {
      setIsUploading(true);
      try {
        finalImageUrl = await uploadToImgBB(studentImageFile);
      } catch (err) {
        setIsUploading(false);
        return alert("Rasm yuklashda xatolik yuz berdi");
      }
    }
    
    if (!finalImageUrl) {
      alert("Iltimos, sertifikat rasmini tanlang yoki yuklang!");
      return;
    }
    
    setIsUploading(true);
    try {
      const dataToSave = {
        name: studentName,
        certSubject: certSubject,
        certScore: certScore,
        image: finalImageUrl,
        isGraduate: false,
      };

      if (editStudentId) {
        await updateDoc(doc(db, 'students', editStudentId), dataToSave);
        alert("Sertifikat muvaffaqiyatli yangilandi!");
      } else {
        await addDoc(collection(db, 'students'), {
          ...dataToSave,
          isDraft: true,
          createdAt: new Date().toISOString()
        });
        alert("Sertifikat qo'shildi (Qoralama holatida)!");
      }

      setStudentName('');
      setCertSubject('IELTS');
      setCertScore('');
      setStudentImage('');
      setStudentImageFile(null);
      setEditStudentId(null);
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi: " + (err as any).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditStudentClick = (s: any) => {
    setEditStudentId(s.id);
    setStudentName(s.name || '');
    setCertSubject(s.certSubject || 'IELTS');
    setCertScore(s.certScore || s.score || '');
    setStudentImage(s.image || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddGraduate = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalImageUrl = gradImage;
    if (gradImageFile) {
      setIsUploading(true);
      try {
        finalImageUrl = await uploadToImgBB(gradImageFile);
      } catch (err) {
        setIsUploading(false);
        return alert("Rasm yuklashda xatolik yuz berdi");
      }
    }
    
    if (!finalImageUrl) {
      alert("Iltimos, rasmni tanlang yoki yuklang!");
      return;
    }
    
    setIsUploading(true);
    try {
      const dataToSave = {
        name: gradName,
        university: gradUni,
        admissionScore: gradScore,
        bio: gradBio,
        certificates: certificates,
        image: finalImageUrl,
        isGraduate: true,
        badge: gradBadge,
      };

      if (editGradId) {
        await updateDoc(doc(db, 'graduates', editGradId), dataToSave);
        alert("Bitiruvchi muvaffaqiyatli yangilandi!");
      } else {
        await addDoc(collection(db, 'graduates'), {
          ...dataToSave,
          isDraft: true,
          createdAt: new Date().toISOString()
        });
        alert("Bitiruvchi qo'shildi (Qoralama holatida)!");
      }

      setGradName('');
      setGradUni('');
      setGradScore('');
      setGradBio('');
      setCertificates([]);
      setGradImage('');
      setGradImageFile(null);
      setGradBadge('Grant');
      setEditGradId(null);
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi: " + (err as any).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditGradClick = (g: any) => {
    setEditGradId(g.id);
    setGradName(g.name || '');
    setGradUni(g.university || '');
    setGradScore(g.admissionScore || g.score || '');
    setGradBio(g.bio || '');
    setCertificates(g.certificates || []);
    setGradImage(g.image || '');
    setGradBadge(g.badge || 'Grant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (galleryImageFiles.length === 0) {
      alert("Iltimos, kamida bitta rasm tanlang!");
      return;
    }
    
    setIsUploading(true);
    try {
      for (const file of galleryImageFiles) {
        const imageUrl = await uploadToImgBB(file);
        await addDoc(collection(db, 'gallery'), {
          image: imageUrl,
          isDraft: true,
          createdAt: new Date().toISOString()
        });
      }

      alert(`${galleryImageFiles.length} ta rasm muvaffaqiyatli qo'shildi!`);
      setGalleryImageFiles([]);
      const fileInput = document.querySelector('#gallery-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    let uploadedUrls: string[] = [];
    if (newsImageFiles.length > 0) {
      setIsUploading(true);
      try {
        uploadedUrls = await Promise.all(newsImageFiles.map(file => uploadToImgBB(file)));
      } catch (err) {
        setIsUploading(false);
        return alert("Rasm yuklashda xatolik yuz berdi");
      }
    }

    const finalImages = [...newsImages, ...uploadedUrls];
    
    if (finalImages.length === 0) {
      alert("Iltimos, kamida bitta rasm yuklang yoki tanlang!");
      return;
    }

    setIsUploading(true);
    try {
      const dataToSave = {
        title: newsTitle,
        text: newsText,
        size: newsSize,
        images: finalImages,
        image: finalImages[0]
      };

      if (editNewsId) {
        await updateDoc(doc(db, 'news', editNewsId), dataToSave);
        alert("Yangilik muvaffaqiyatli yangilandi!");
      } else {
        await addDoc(collection(db, 'news'), {
          ...dataToSave,
          date: new Date().toLocaleDateString('uz-UZ'),
          isDraft: true,
          createdAt: new Date().toISOString()
        });
        alert("Yangilik qo'shildi (Qoralama)!");
      }
      
      setNewsTitle('');
      setNewsText('');
      setNewsImages([]);
      setNewsImageFiles([]);
      setEditNewsId(null);
    } catch (err: any) {
      alert("Xatolik yuz berdi: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditNewsClick = (item: any) => {
    setEditNewsId(item.id);
    setNewsTitle(item.title);
    setNewsText(item.text || '');
    setNewsSize(item.size || 'small');
    setNewsImages(item.images || [item.image].filter(Boolean));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddUni = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uniName) return;
    try {
      await addDoc(collection(db, 'universities'), {
        name: uniName,
        isDraft: true,
        createdAt: new Date().toISOString()
      });
      alert("Universitet qo'shildi!");
      setUniName('');
    } catch (err) {
      alert("Xato");
    }
  };

  const handleAddOly = async (e: React.FormEvent) => {
    e.preventDefault();
    let uploadedUrls: string[] = [];
    if (olyImageFiles.length > 0) {
      setIsUploading(true);
      try {
        uploadedUrls = await Promise.all(olyImageFiles.map(file => uploadToImgBB(file)));
      } catch (err) {
        setIsUploading(false);
        return alert("Rasm yuklashda xatolik yuz berdi");
      }
    }

    const finalImages = [...olyImages, ...uploadedUrls];

    setIsUploading(true);
    try {
      const statsArray = typeof olyStats === 'string' ? olyStats.split(',').map(s => s.trim()).filter(Boolean) : olyStats;
      const dataToSave = {
        title: olyTitle,
        text: olyText,
        stats: statsArray,
        images: finalImages,
        image: finalImages[0] || ''
      };

      if (editOlyId) {
        await updateDoc(doc(db, 'olympiads', editOlyId), dataToSave);
        alert("Olimpiada ma'lumoti yangilandi!");
      } else {
        await addDoc(collection(db, 'olympiads'), {
          ...dataToSave,
          isDraft: true,
          createdAt: new Date().toISOString()
        });
        alert("Olimpiada ma'lumoti qo'shildi!");
      }
      
      setOlyTitle('');
      setOlyText('');
      setOlyStats('');
      setOlyImages([]);
      setOlyImageFiles([]);
      setEditOlyId(null);
    } catch (err) {
      alert("Xatolik yuz berdi");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditOlyClick = (item: any) => {
    setEditOlyId(item.id);
    setOlyTitle(item.title || '');
    setOlyText(item.text || '');
    setOlyStats(Array.isArray(item.stats) ? item.stats.join(', ') : item.stats || '');
    setOlyImages(item.images || [item.image].filter(Boolean));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalImageUrl = teacherImage;
    if (teacherImageFile) {
      setIsUploading(true);
      try {
        finalImageUrl = await uploadToImgBB(teacherImageFile);
      } catch (err) {
        setIsUploading(false);
        return alert("Rasm yuklashda xatolik yuz berdi");
      }
    }

    setIsUploading(true);
    try {
      const certsArray = teacherCertInput ? teacherCertInput.split(',').map(c => c.trim()).filter(Boolean) : [];
      const dataToSave = {
        full_name: teacherFullName,
        subject: teacherSubject,
        experience_years: Number(teacherExp) || 0,
        qualification_category: teacherCategory,
        certificates: certsArray,
        image: finalImageUrl || ''
      };

      if (editTeacherId && !editTeacherId.startsWith('json-')) {
        await updateDoc(doc(db, 'teachers', editTeacherId), dataToSave);
        alert("Ustoz ma'lumotlari muvaffaqiyatli yangilandi!");
      } else {
        await addDoc(collection(db, 'teachers'), {
          ...dataToSave,
          jsonId: editTeacherId?.startsWith('json-') ? editTeacherId : null,
          isDraft: true,
          createdAt: new Date().toISOString()
        });
        alert(editTeacherId?.startsWith('json-') ? "Ustoz ma'lumotlari yangilandi va bazaga saqlandi!" : "Ustoz ma'lumotlari qo'shildi (Qoralama)!");
      }

      setTeacherFullName('');
      setTeacherSubject('Matematika');
      setTeacherExp('');
      setTeacherCategory('Oliy');
      setTeacherCertInput('');
      setTeacherImage('');
      setTeacherImageFile(null);
      setEditTeacherId(null);
    } catch (err: any) {
      alert("Xatolik yuz berdi: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditTeacherClick = (item: any) => {
    setEditTeacherId(item.id);
    setTeacherFullName(item.full_name || '');
    setTeacherSubject(item.subject || 'Matematika');
    setTeacherExp(item.experience_years || '');
    setTeacherCategory(item.qualification_category || 'Oliy');
    setTeacherCertInput(Array.isArray(item.certificates) ? item.certificates.join(', ') : '');
    setTeacherImage(item.image || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
    try {
      if (collectionName === 'teachers' && id.startsWith('json-')) {
        await addDoc(collection(db, 'teachers'), {
          jsonId: id,
          isDeleted: true,
          createdAt: new Date().toISOString()
        });
      } else {
        await deleteDoc(doc(db, collectionName, id));
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  const handleDeleteAllGallery = async () => {
    if (!window.confirm("Barcha rasmlarni o'chirishni tasdiqlaysizmi?")) return;
    setIsUploading(true);
    try {
      const q = query(collection(db, 'gallery'));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();
      alert("Barcha rasmlar o'chirildi!");
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Yuklanmoqda...</div>;

  if (!isLoggedIn) {
    return (
      <div className="admin-login-wrapper">
        <form className="admin-login-form" onSubmit={handleLogin}>
          <h2>Admin Panel</h2>
          <p>Tizimga kirish uchun ma'lumotlarni kiriting</p>
          {error && <div className="error-msg">{error}</div>}
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Parol" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="submit">Kirish</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li className={activeTab === 'students' ? 'active' : ''} onClick={() => setActiveTab('students')}>
            O'quvchilar
          </li>
          <li className={activeTab === 'graduates' ? 'active' : ''} onClick={() => setActiveTab('graduates')}>
            Bitiruvchilar
          </li>
          <li className={activeTab === 'teachers' ? 'active' : ''} onClick={() => setActiveTab('teachers')}>
            Ustozlar
          </li>
          <li className={activeTab === 'news' ? 'active' : ''} onClick={() => setActiveTab('news')}>
            Yangiliklar
          </li>
          <li className={activeTab === 'gallery' ? 'active' : ''} onClick={() => setActiveTab('gallery')}>
            Galereya
          </li>
          <li className={activeTab === 'universities' ? 'active' : ''} onClick={() => setActiveTab('universities')}>
            Universitetlar
          </li>
          <li className={activeTab === 'olympiads' ? 'active' : ''} onClick={() => setActiveTab('olympiads')}>
            Olimpiada natijalari
          </li>
          <li className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>
            Murojaatlar
          </li>
        </ul>
        <button className="publish-all-btn" onClick={handlePublishAll} disabled={isPublishing}>
          {isPublishing ? "E'lon qilinmoqda..." : "E'lon qilish (Publish)"}
        </button>
        <button className="logout-btn" onClick={handleLogout}>Chiqish</button>
      </div>

      <div className="admin-content">
        {/* STUDENTS (CERTIFICATES) TAB */}
        {activeTab === 'students' && (
          <div>
            <h3>Yangi sertifikat qo'shish</h3>
            <form onSubmit={handleAddStudent} className="admin-form">
              <input type="text" placeholder="F.I.SH." value={studentName} onChange={e => setStudentName(e.target.value)} required />
              <select value={certSubject} onChange={e => setCertSubject(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd3df', width: '100%', marginBottom: '10px' }}>
                {['IELTS', 'CEFR', 'Ona tili', 'Matematika', 'Biologiya', 'Kimyo', 'Tarix', 'Fizika', 'DTM'].map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
              <input type="text" placeholder="Natija yoki Ball (masalan, 8.0 yoki 189)" value={certScore} onChange={e => setCertScore(e.target.value)} required />
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
                {studentImage && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                    <img src={studentImage} alt="Preview" style={{height: '50px', width: '50px', objectFit: 'cover', borderRadius: '5px'}}/>
                    <button type="button" onClick={() => { setStudentImage(''); setStudentImageFile(null); }} style={{ padding: '4px 8px', fontSize: '11px', background: 'red', color: 'white', borderRadius: '4px' }}>O'chirish</button>
                  </div>
                )}
                <button type="button" onClick={() => openMediaLibrary(setStudentImage)}>Bazada bor rasmni tanlash</button>
                <span>yoki yangi sertifikat yuklash:</span>
                <input type="file" accept="image/*" onChange={e => setStudentImageFile(e.target.files ? e.target.files[0] : null)} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" disabled={isUploading}>{isUploading ? 'Yuklanmoqda...' : (editStudentId ? 'Yangilash' : 'Saqlash')}</button>
                {editStudentId && (
                  <button type="button" onClick={() => {
                    setEditStudentId(null);
                    setStudentName('');
                    setCertSubject('IELTS');
                    setCertScore('');
                    setStudentImage('');
                  }} style={{ background: '#64748b' }}>Bekor qilish</button>
                )}
              </div>
            </form>

            <div className="items-list">
              {students.map((student) => (
                <div key={student.id} className="admin-list-item">
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <img src={student.image} alt="pic" style={{width: 50, height: 50, objectFit: 'cover', borderRadius: '5px'}}/>
                    <div>
                      <strong>{student.name}</strong> ({student.certSubject}: {student.certScore})
                      {student.isDraft && <span style={{color: 'red', marginLeft: '10px'}}>(Qoralama)</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEditStudentClick(student)} style={{ background: '#3b82f6', color: 'white', padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Tahrirlash</button>
                    <button onClick={() => handleDelete('students', student.id)} className="delete-btn">O'chirish</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GRADUATES TAB */}
        {activeTab === 'graduates' && (
          <div>
            <h3>Yangi bitiruvchi qo'shish</h3>
            <form onSubmit={handleAddGraduate} className="admin-form">
              <input type="text" placeholder="F.I.SH." value={gradName} onChange={e => setGradName(e.target.value)} required />
              <input type="text" placeholder="Universitet nomi" value={gradUni} onChange={e => setGradUni(e.target.value)} required />
              <input type="text" placeholder="Kirish bali (SAT 1500, IELTS 8.0, va hokazo)" value={gradScore} onChange={e => setGradScore(e.target.value)} required />
              <textarea placeholder="Qisqacha yutuqlari (bio)" value={gradBio} onChange={e => setGradBio(e.target.value)} required />
              
              <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Ta'lim shakli (Grant/Kontrakt):</label>
                <select value={gradBadge} onChange={e => setGradBadge(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '100%' }}>
                  <option value="Grant">Grant (To'liq)</option>
                  <option value="Kontrakt">Kontrakt</option>
                  <option value="100% Grant">100% Grant</option>
                  <option value="50% Grant">50% Grant</option>
                </select>
              </div>

              <div style={{ padding: '10px', background: '#f5f5f5', borderRadius: '8px' }}>
                <h4>Sertifikatlar</h4>
                {certificates.map((cert, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                    <span>{cert.subject} - {cert.score} ({cert.percentage}%)</span>
                    <button type="button" onClick={() => setCertificates(certificates.filter((_, i) => i !== idx))}>x</button>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <input type="text" id="gCertSub" placeholder="Fan nomi (IELTS, Tarix)" />
                  <input type="text" id="gCertScore" placeholder="Natija (8.0, 95)" />
                  <input type="text" id="gCertPerc" placeholder="Foiz (95)" />
                  <button type="button" onClick={() => {
                    const sub = (document.getElementById('gCertSub') as HTMLInputElement).value;
                    const score = (document.getElementById('gCertScore') as HTMLInputElement).value;
                    const perc = (document.getElementById('gCertPerc') as HTMLInputElement).value;
                    if(sub && score) {
                      setCertificates([...certificates, { subject: sub, score, percentage: perc }]);
                      (document.getElementById('gCertSub') as HTMLInputElement).value = '';
                      (document.getElementById('gCertScore') as HTMLInputElement).value = '';
                      (document.getElementById('gCertPerc') as HTMLInputElement).value = '';
                    }
                  }}>Qo'shish</button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
                {gradImage && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                    <img src={gradImage} alt="Preview" style={{height: '50px', width: '50px', objectFit: 'cover', borderRadius: '50%'}}/>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button type="button" onClick={() => startCroppingUrl(gradImage, setGradImageFile, setGradImage)} style={{ padding: '4px 8px', fontSize: '11px', background: '#e2e8f0', color: '#0f172a', borderRadius: '4px' }}>Rasmni qirqish</button>
                      <button type="button" onClick={() => { setGradImage(''); setGradImageFile(null); }} style={{ padding: '4px 8px', fontSize: '11px', background: 'red', color: 'white', borderRadius: '4px' }}>O'chirish</button>
                    </div>
                  </div>
                )}
                <button type="button" onClick={() => openMediaLibrary(setGradImage)}>Bazada bor rasmni tanlash</button>
                <span>yoki yangi yuklash (qirqish bilan):</span>
                <input type="file" accept="image/*" onChange={e => handleFileChangeForCrop(e, setGradImageFile, setGradImage)} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" disabled={isUploading}>{isUploading ? 'Yuklanmoqda...' : (editGradId ? 'Yangilash' : 'Saqlash')}</button>
                {editGradId && (
                  <button type="button" onClick={() => {
                    setEditGradId(null);
                    setGradName('');
                    setGradUni('');
                    setGradScore('');
                    setGradBio('');
                    setCertificates([]);
                    setGradImage('');
                    setGradBadge('Grant');
                  }} style={{ background: '#64748b' }}>Bekor qilish</button>
                )}
              </div>
            </form>

            <div className="items-list">
              {graduates.map((grad) => (
                <div key={grad.id} className="admin-list-item">
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <img src={grad.image} alt="pic" style={{width: 50, height: 50, objectFit: 'cover', borderRadius: '5px'}}/>
                    <div>
                      <strong>{grad.name}</strong> - {grad.university}
                      {grad.isDraft && <span style={{color: 'red', marginLeft: '10px'}}>(Qoralama)</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEditGradClick(grad)} style={{ background: '#3b82f6', color: 'white', padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Tahrirlash</button>
                    <button onClick={() => handleDelete('graduates', grad.id)} className="delete-btn">O'chirish</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEACHERS TAB */}
        {activeTab === 'teachers' && (
          <div>
            <h3>Ustoz ma'lumotlarini qo'shish / tahrirlash</h3>
            <form onSubmit={handleAddTeacher} className="admin-form">
              <input type="text" placeholder="F.I.SH. (masalan, Aliqulov Ma'ruf Javliyevich)" value={teacherFullName} onChange={e => setTeacherFullName(e.target.value)} required />
              <input type="text" placeholder="Fani (masalan, Matematika, Ingliz tili)" value={teacherSubject} onChange={e => setTeacherSubject(e.target.value)} required />
              <input type="number" placeholder="Tajribasi (yillarda, masalan, 15)" value={teacherExp} onChange={e => setTeacherExp(e.target.value)} required />
              
              <select value={teacherCategory} onChange={e => setTeacherCategory(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', marginBottom: '10px' }}>
                <option value="Oliy">Oliy toifa</option>
                <option value="Birinchi">Birinchi toifa</option>
                <option value="Ikkinchi">Ikkinchi toifa</option>
                <option value="Mutaxassis">Mutaxassis</option>
              </select>

              <input type="text" placeholder="Sertifikatlari (vergul bilan ajratilgan: SAT, IELTS, Milliy sertifikat)" value={teacherCertInput} onChange={e => setTeacherCertInput(e.target.value)} />

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
                {teacherImage && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                    <img src={teacherImage} alt="Preview" style={{height: '50px', width: '50px', objectFit: 'cover', borderRadius: '50%'}}/>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button type="button" onClick={() => startCroppingUrl(teacherImage, setTeacherImageFile, setTeacherImage)} style={{ padding: '4px 8px', fontSize: '11px', background: '#e2e8f0', color: '#0f172a', borderRadius: '4px' }}>Rasmni qirqish</button>
                      <button type="button" onClick={() => { setTeacherImage(''); setTeacherImageFile(null); }} style={{ padding: '4px 8px', fontSize: '11px', background: 'red', color: 'white', borderRadius: '4px' }}>O'chirish</button>
                    </div>
                  </div>
                )}
                <button type="button" onClick={() => openMediaLibrary(setTeacherImage)}>Bazada bor rasmni tanlash</button>
                <span>yoki yangi yuklash (qirqish bilan):</span>
                <input type="file" accept="image/*" onChange={e => handleFileChangeForCrop(e, setTeacherImageFile, setTeacherImage)} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button type="submit" disabled={isUploading}>{isUploading ? 'Yuklanmoqda...' : (editTeacherId ? 'Yangilash' : 'Saqlash')}</button>
                {editTeacherId && (
                  <button type="button" onClick={() => {
                    setEditTeacherId(null);
                    setTeacherFullName('');
                    setTeacherSubject('Matematika');
                    setTeacherExp('');
                    setTeacherCategory('Oliy');
                    setTeacherCertInput('');
                    setTeacherImage('');
                    setTeacherImageFile(null);
                  }} style={{ background: '#64748b' }}>Bekor qilish</button>
                )}
              </div>
            </form>

            <div className="items-list">
              {combinedTeachers.map((item) => (
                <div key={item.id} className="admin-list-item">
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <img src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.full_name || 'Ustoz')}&background=random`} alt="pic" style={{width: 50, height: 50, objectFit: 'cover', borderRadius: '50%'}}/>
                    <div>
                      <strong>{item.full_name}</strong> - {item.subject} ({item.qualification_category} toifa, {item.experience_years} yil tajriba)
                      {item.isDefaultJson && <span style={{color: '#64748b', marginLeft: '10px', fontSize: '12px'}}>(Standart)</span>}
                      {item.isDraft && <span style={{color: 'red', marginLeft: '10px'}}>(Qoralama)</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEditTeacherClick(item)} style={{ background: '#3b82f6', color: 'white', padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Tahrirlash</button>
                    <button onClick={() => handleDelete('teachers', item.id)} className="delete-btn">O'chirish</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEWS TAB */}
        {activeTab === 'news' && (
          <div>
            <h3>Yangilik qo'shish</h3>
            <form onSubmit={handleAddNews} className="admin-form">
              <input type="text" placeholder="Sarlavha" value={newsTitle} onChange={e => setNewsTitle(e.target.value)} required />
              <textarea placeholder="Batafsil matni" value={newsText} onChange={e => setNewsText(e.target.value)} required rows={4} />
              
              <select value={newsSize} onChange={e => setNewsSize(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <option value="large">Katta Afisha (Asosiy yangilik)</option>
                <option value="medium">O'rtacha</option>
                <option value="small">Kichik ro'yxat</option>
              </select>

              <div style={{ padding: '10px', background: '#f5f5f5', borderRadius: '8px', marginTop: '10px' }}>
                <h4>Rasmlar (Bir nechta yuklash imkoniyati)</h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  {newsImages.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <img src={img} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                      <button type="button" onClick={() => setNewsImages(newsImages.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', width: '20px', height: '20px', border: 'none', cursor: 'pointer' }}>x</button>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button type="button" onClick={() => openMediaLibrary((url) => setNewsImages([...newsImages, url]))}>Bazada bor rasmni qo'shish</button>
                  <span>yoki yangi rasmlar yuklash (bir nechta):</span>
                  <input type="file" accept="image/*" multiple onChange={e => setNewsImageFiles(e.target.files ? Array.from(e.target.files) : [])} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" disabled={isUploading}>{isUploading ? 'Yuklanmoqda...' : (editNewsId ? 'Yangilash (Save)' : 'Saqlash')}</button>
                {editNewsId && (
                  <button type="button" onClick={() => {
                    setEditNewsId(null);
                    setNewsTitle('');
                    setNewsText('');
                    setNewsImages([]);
                    setNewsImageFiles([]);
                  }} style={{ background: '#64748b' }}>Bekor qilish</button>
                )}
              </div>
            </form>

            <div className="items-list">
              {news.map((item) => (
                <div key={item.id} className="admin-list-item">
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <img src={item.image || (item.images && item.images[0])} alt="pic" style={{width: 50, height: 50, objectFit: 'cover', borderRadius: '5px'}}/>
                    <div>
                      <strong>{item.title}</strong>
                      {item.isDraft && <span style={{color: 'red', marginLeft: '10px'}}>(Qoralama)</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEditNewsClick(item)} style={{ background: '#3b82f6', color: 'white', padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Tahrirlash</button>
                    <button onClick={() => handleDelete('news', item.id)} className="delete-btn">O'chirish</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === 'gallery' && (
          <div>
            <h3>Galereyaga rasm qo'shish</h3>
            <form onSubmit={handleAddGallery} className="admin-form">
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button type="button" onClick={() => openMediaLibrary(async (url) => {
                  setIsUploading(true);
                  try {
                    await addDoc(collection(db, 'gallery'), {
                      image: url,
                      isDraft: true,
                      createdAt: new Date().toISOString()
                    });
                    alert("Rasm galereyaga muvaffaqiyatli qo'shildi!");
                  } catch(e) {
                    alert("Xatolik yuz berdi");
                  } finally {
                    setIsUploading(false);
                  }
                })}>Bazada bor rasmni qo'shish</button>
                <span>yoki yangi yuklash (bir nechta):</span>
                <input id="gallery-file-input" type="file" accept="image/*" multiple onChange={e => setGalleryImageFiles(e.target.files ? Array.from(e.target.files) : [])} />
              </div>
              <button type="submit" disabled={isUploading}>{isUploading ? 'Yuklanmoqda...' : 'Saqlash'}</button>
                <button type="button" onClick={handleDeleteAllGallery} disabled={isUploading}>
                  {isUploading ? "O'chirilmoqda..." : "Barcha rasmlarni o'chirish"}
                </button>
            </form>

            <div className="gallery-grid-admin">
              {gallery.map((item) => (
                <div key={item.id} className="gallery-item-admin">
                  <img src={item.image} alt="gallery" />
                  <button onClick={() => handleDelete('gallery', item.id)} className="delete-btn">O'chirish</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UNIVERSITIES TAB */}
        {activeTab === 'universities' && (
          <div>
            <h3>Universitet qo'shish</h3>
            <form onSubmit={handleAddUni} className="admin-form">
              <input type="text" placeholder="Universitet nomi" value={uniName} onChange={e => setUniName(e.target.value)} required />
              <button type="submit">Qo'shish</button>
            </form>

            <div className="items-list">
              {universities.map((item) => (
                <div key={item.id} className="admin-list-item">
                  <span>{item.name} {item.isDraft && <span style={{color: 'red'}}>(Qoralama)</span>}</span>
                  <button onClick={() => handleDelete('universities', item.id)} className="delete-btn">O'chirish</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OLYMPIADS TAB */}
        {activeTab === 'olympiads' && (
          <div>
            <h3>Olimpiada ma'lumotini qo'shish / tahrirlash</h3>
            <form onSubmit={handleAddOly} className="admin-form">
              <input type="text" placeholder="Sarlavha (masalan, Prezident maktabi olimpiadasi)" value={olyTitle} onChange={e => setOlyTitle(e.target.value)} required />
              <textarea placeholder="Qisqacha matn" value={olyText} onChange={e => setOlyText(e.target.value)} required />
              <input type="text" placeholder="Statistika (masalan: 3 ta oltin medal, 2 ta kumush medal)" value={olyStats} onChange={e => setOlyStats(e.target.value)} required />
              
              <div style={{ padding: '10px', background: '#f5f5f5', borderRadius: '8px', marginTop: '10px' }}>
                <h4>Rasmlar (Bir nechta yuklash imkoniyati)</h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  {olyImages.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <img src={img} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                      <button type="button" onClick={() => setOlyImages(olyImages.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', width: '20px', height: '20px', border: 'none', cursor: 'pointer' }}>x</button>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button type="button" onClick={() => openMediaLibrary((url) => setOlyImages([...olyImages, url]))}>Bazada bor rasmni qo'shish</button>
                  <span>yoki yangi rasmlar yuklash (bir nechta):</span>
                  <input type="file" accept="image/*" multiple onChange={e => setOlyImageFiles(e.target.files ? Array.from(e.target.files) : [])} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button type="submit" disabled={isUploading}>{isUploading ? 'Yuklanmoqda...' : (editOlyId ? 'Yangilash' : 'Saqlash')}</button>
                {editOlyId && (
                  <button type="button" onClick={() => {
                    setEditOlyId(null);
                    setOlyTitle('');
                    setOlyText('');
                    setOlyStats('');
                    setOlyImages([]);
                    setOlyImageFiles([]);
                  }} style={{ background: '#64748b' }}>Bekor qilish</button>
                )}
              </div>
            </form>

            <div className="items-list">
              {olympiads.map((item) => (
                <div key={item.id} className="admin-list-item">
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <img src={item.image || (item.images && item.images[0])} alt="pic" style={{width: 50, height: 50, objectFit: 'cover', borderRadius: '5px'}}/>
                    <div>
                      <strong>{item.title}</strong>
                      {item.isDraft && <span style={{color: 'red', marginLeft: '10px'}}>(Qoralama)</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEditOlyClick(item)} style={{ background: '#3b82f6', color: 'white', padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Tahrirlash</button>
                    <button onClick={() => handleDelete('olympiads', item.id)} className="delete-btn">O'chirish</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div>
            <h3>Murojaatlar va Takliflar</h3>
            <div className="items-list">
              {messages.length === 0 && <p style={{ padding: '20px', color: '#64748b' }}>Hozircha murojaatlar yo'q</p>}
              {messages.map((item) => (
                <div key={item.id} className="admin-list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
                    <strong>{item.name}</strong>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                  <p style={{ margin: 0, color: '#334155', whiteSpace: 'pre-wrap' }}>{item.message}</p>
                  <div style={{ marginTop: '15px' }}>
                    <button onClick={() => handleDelete('messages', item.id)} className="delete-btn">O'chirish</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isMediaModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', width: '80%', height: '80%', borderRadius: '16px', padding: '20px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Rasmlar bazasi</h2>
              <button onClick={() => setIsMediaModalOpen(false)} style={{ background: 'red', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Yopish</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
              {allImages.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    if (mediaCallback) mediaCallback(img);
                    setIsMediaModalOpen(false);
                  }}
                  style={{ cursor: 'pointer', border: '2px solid transparent' }}
                  onMouseEnter={e => e.currentTarget.style.border = '2px solid var(--accent-orange)'}
                  onMouseLeave={e => e.currentTarget.style.border = '2px solid transparent'}
                >
                  <img src={img} alt="media" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                </div>
              ))}
              {allImages.length === 0 && <p>Bazada rasm yo'q.</p>}
            </div>
          </div>
        </div>
      )}

      {cropImageUrl && cropCallback && (
        <CropModal 
          imageUrl={cropImageUrl} 
          onCrop={(cropped) => {
            cropCallback(cropped);
            setCropImageUrl(null);
            setCropCallback(null);
          }} 
          onCancel={() => {
            setCropImageUrl(null);
            setCropCallback(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminPanel;
