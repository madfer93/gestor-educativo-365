"use client";

import React, { useState, useEffect } from "react";
import { mockData } from "@/data/mockData";
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();
import {
    Users, UserPlus, FileText, DollarSign, LayoutDashboard,
    Settings, LogOut, Bell, PlusCircle, Save, X, Clock, Book, GraduationCap,
    Link, Image as ImageIcon, Key, FileCode, Edit, Trash2, Camera, Loader2, Heart, Megaphone,
    Eye, EyeOff, ClipboardList, Award, Star, FolderCheck, User
} from "lucide-react";
import { uploadImage } from "@/lib/imgbb";

export default function AdminDashboard({ params }) {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isCostModalOpen, setIsCostModalOpen] = useState(false);
    const [editingCost, setEditingCost] = useState(null);
    const [grados, setGrados] = useState([]);
    const [newGrado, setNewGrado] = useState("");
    const [bannerPreview, setBannerPreview] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [bannerGalleryPreview, setBannerGalleryPreview] = useState(null);
    const [bannerGalleryFile, setBannerGalleryFile] = useState(null);
    const [bannerOfferPreview, setBannerOfferPreview] = useState(null);
    const [bannerOfferFile, setBannerOfferFile] = useState(null);
    const [bankAccounts, setBankAccounts] = useState([]);

    // Estados para Modales faltantes
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
    const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
    const [editingNews, setEditingNews] = useState(null);
    const [isCircularModalOpen, setIsCircularModalOpen] = useState(false);
    const [circulares, setCirculares] = useState([]);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [activities, setActivities] = useState([]);
    const [activityFile, setActivityFile] = useState(null);
    const [activityFilePreview, setActivityFilePreview] = useState(null);
    const [selectedActivityForSubmissions, setSelectedActivityForSubmissions] = useState(null);
    const [submissionFilterStudentId, setSubmissionFilterStudentId] = useState(null);
    const [activitySubmissions, setActivitySubmissions] = useState([]);
    const [wellbeingReports, setWellbeingReports] = useState([]);
    const [grades, setGrades] = useState([]);
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
    const [editingGrade, setEditingGrade] = useState(null);
    const [selectedStudentForGrades, setSelectedStudentForGrades] = useState(null);
    const [gradeActivityTitle, setGradeActivityTitle] = useState('');
    const [pendingActivities, setPendingActivities] = useState([]);
    const [isPendingDropdownOpen, setIsPendingDropdownOpen] = useState(false);

    // Estados para Estudiantes y Modalidad
    const [students, setStudents] = useState([]);
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [leadToFormalize, setLeadToFormalize] = useState(null);
    const [esMenor, setEsMenor] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterGrado, setFilterGrado] = useState('');
    const [formModalidad, setFormModalidad] = useState('');
    const [filterModalidad, setFilterModalidad] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [circularCategory, setCircularCategory] = useState('Todos');
    const [viewingStudentDetails, setViewingStudentDetails] = useState(null);
    const [studentObservaciones, setStudentObservaciones] = useState([]);
    const [newObservacion, setNewObservacion] = useState('');

    const documentosRequeridos = [
        'Carpeta amarilla colgante oficio', 'Certificados años anteriores', 'Tres fotos 3x4 fondo azul',
        'Fotocopia documento identidad', 'Fotocopia C.C. acudientes', 'Registro civil',
        'Retiro del SIMAT', 'Copia recibo servicio público', 'Copia seguro de salud',
        'Diagnóstico médico', 'Carné de vacunas'
    ];

    // Estados para Galería, Noticias y Costos
    const [gallery, setGallery] = useState([]);
    const [news, setNews] = useState([]);
    const [costs, setCosts] = useState([]);
    const [schoolConfig, setSchoolConfig] = useState(null);
    const [school, setSchool] = React.useState(null);

    React.useEffect(() => {
        const fetchSchool = async () => {
            if (params.slug) {
                const { data } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
                setSchool(data);
            }
        };
        fetchSchool();
    }, [params.slug]);

    const [userRole, setUserRole] = useState(null);
    const [leads, setLeads] = useState([]);
    const [stats, setStats] = useState({
        leads: 0,
        students: 0,
        teachers: 0,
        pendingDocs: 23, // Placeholder por ahora
        revenue: "48.2M" // Placeholder por ahora
    });

    const { admin, colegio } = mockData;

    const fetchTeachers = async () => {
        setLoading(true);
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('school_id', school.id)
                .neq('rol', 'student');
            setTeachers(data || []);
        }
        setLoading(false);
    };

    const fetchGallery = async () => {
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            const { data } = await supabase.from('school_gallery').select('*').eq('school_id', school.id).order('created_at', { ascending: false });
            setGallery(data || []);
        }
    };

    const fetchNews = async () => {
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            const { data } = await supabase.from('school_news').select('*').eq('school_id', school.id).order('published_at', { ascending: false });
            setNews(data || []);
        }
    };

    const fetchCosts = async () => {
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            const { data } = await supabase.from('school_costs').select('*').eq('school_id', school.id).order('display_order', { ascending: true });
            setCosts(data || []);
        }
    };

    const fetchSchoolConfig = async () => {
        const { data } = await supabase
            .from('schools')
            .select('*')
            .eq('slug', params.slug)
            .single();
        if (data) {
            setSchoolConfig(data);
            setGrados(data.grados || []);
            setBankAccounts(data.bank_accounts || (data.bank_info ? [data.bank_info.bank1, data.bank_info.bank2].filter(b => b?.nombre) : []));
        }
    };

    const fetchStats = async () => {
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            // Contar Leads
            const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('school_id', school.id);
            // Contar Estudiantes (profiles con rol 'student')
            const { count: studentsCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('school_id', school.id).eq('rol', 'student');
            // Contar Staff Completo
            const { count: teachersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('school_id', school.id).neq('rol', 'student');

            // Obtener últimos leads para la tabla
            const { data: latestLeads } = await supabase.from('leads').select('*').eq('school_id', school.id).order('created_at', { ascending: false }).limit(5);

            setStats(prev => ({
                ...prev,
                leads: leadsCount || 0,
                students: studentsCount || 0,
                teachers: teachersCount || 0
            }));
            setLeads(latestLeads || []);
        }
    };

    const fetchStudents = async () => {
        setLoading(true);
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            const { data } = await supabase.from('profiles').select('*').eq('school_id', school.id).eq('rol', 'student').order('nombre', { ascending: true });
            setStudents(data || []);
        }
        setLoading(false);
    };

    const fetchCirculares = async () => {
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            const { data } = await supabase.from('school_circulars').select('*').eq('school_id', school.id).order('published_at', { ascending: false });
            setCirculares(data || []);
        }
    };

    const fetchWellbeingReports = async () => {
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            const { data } = await supabase.from('wellbeing_alerts')
                .select('*, profiles:student_id(nombre, grado)')
                .eq('school_id', school.id)
                .order('created_at', { ascending: false });
            setWellbeingReports(data || []);
        }
    };

    const handleUpdateReportStatus = async (reportId, newStatus) => {
        const { error } = await supabase.from('wellbeing_alerts').update({ status: newStatus }).eq('id', reportId);
        if (error) alert(error.message);
        else fetchWellbeingReports();
    };

    const fetchActivities = async () => {
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            const { data } = await supabase.from('school_activities').select('*').eq('school_id', school.id).order('created_at', { ascending: false });
            setActivities(data || []);
        }
    };

    const fetchGrades = async () => {
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            const { data } = await supabase.from('calificaciones')
                .select('*, profiles:student_id(nombre, grado)')
                .eq('school_id', school.id)
                .order('fecha', { ascending: false });
            setGrades(data || []);
        }
    };

    const fetchSubmissions = async (activityId) => {
        setSelectedActivityForSubmissions(activityId);
        setActivitySubmissions([]); // clear previous
        const { data } = await supabase.from('submissions')
            .select('*, profiles:estudiante_id(nombre, grado)')
            .eq('tarea_id', activityId)
            .order('created_at', { ascending: false });
        setActivitySubmissions(data || []);
    };

    const fetchPendingActivities = async () => {
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (school) {
            const { data: acts } = await supabase.from('school_activities').select('id, title').eq('school_id', school.id);
            if (acts && acts.length > 0) {
                const actIds = acts.map(a => a.id);
                // Fetch latest 10 submissions that don't have grades (in this system, grade is a separate table, but we can just show latest 10 submissions as 'notifications' of new activities)
                const { data } = await supabase.from('submissions')
                    .select('*, profiles:estudiante_id(nombre, grado)')
                    .in('tarea_id', actIds)
                    .order('created_at', { ascending: false })
                    .limit(10);

                const subsWithTitles = (data || []).map(s => ({
                    ...s,
                    activity_title: acts.find(a => a.id === s.tarea_id)?.title || 'Actividad'
                }));
                setPendingActivities(subsWithTitles);
            }
        }
    };

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerFile(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        const initDashboard = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: profile, error: profError } = await supabase.from('profiles').select('rol').eq('id', user.id).single();
                    if (profError) throw profError;
                    if (profile) setUserRole(profile.rol);
                }

                await Promise.all([
                    fetchTeachers(),
                    fetchSchoolConfig(),
                    fetchStats(),
                    fetchPendingActivities()
                ]);
            } catch (err) {
                console.error("Dashboard initial load error:", err);
                // Si falla la obtención de stats críticos, no bloqueamos todo, pero informamos
            }
        };

        if (params.slug) {
            initDashboard();
        }

        if (activeTab === "students" || activeTab === "calificaciones" || activeTab === "academic") fetchStudents().catch(console.error);
        if (activeTab === "gallery") fetchGallery().catch(console.error);
        if (activeTab === "news") fetchNews().catch(console.error);
        if (activeTab === "costs") fetchCosts().catch(console.error);
        if (activeTab === "circulares") fetchCirculares().catch(console.error);
        if (activeTab === "academic") fetchActivities().catch(console.error);
        if (activeTab === "wellbeing") fetchWellbeingReports().catch(console.error);
        if (activeTab === "calificaciones") fetchGrades().catch(console.error);
    }, [params.slug, activeTab]);

    const handleFormalizeStudent = (lead) => {
        if (!confirm(`¿Deseas formalizar la matrícula de ${lead.nombre}? Se abrirá el formulario para completar Modalidad y Grado.`)) return;
        setLeadToFormalize(lead);
        setEditingStudent(null);
        setIsStudentModalOpen(true);
    };

    const collectStudentFormData = (form) => {
        const fd = new FormData(form);
        const docs = {};
        documentosRequeridos.forEach(d => { docs[d] = form.querySelector(`[data-doc="${d}"]`)?.checked || false; });
        const v = (key) => { const val = fd.get(key); return val === '' || val === null ? null : val; };
        // Preserve existing email when editing (disabled fields don't send values)
        const emailValue = fd.get('email') || (editingStudent ? editingStudent.email : null);
        return {
            nombre: fd.get('nombre'), email: emailValue, grado: v('grado'), modalidad: v('modalidad'),
            fecha_nacimiento: v('fecha_nacimiento'), tipo_documento: v('tipo_documento'),
            numero_documento: v('numero_documento'), direccion: v('direccion'),
            grupo_sanguineo: v('grupo_sanguineo'), alergias: v('alergias'),
            condiciones_medicas: v('condiciones_medicas'), eps_salud: v('eps_salud'),
            es_menor_edad: esMenor, acudiente_nombre: v('acudiente_nombre'),
            acudiente_telefono: v('acudiente_telefono'), acudiente_email: v('acudiente_email'),
            acudiente_parentesco: v('acudiente_parentesco'),
            documentos_entregados: docs,
            observaciones: fd.get('observaciones')
        };
    };

    const handleCreateStudent = async (e) => {
        e.preventDefault();
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        if (!school) return alert('Error: ID de colegio no encontrado.');

        setLoading(true);
        const formData = new FormData(e.target);
        const photoFile = e.target.photo_file?.files[0];
        let photoUrl = null;

        if (photoFile) {
            try {
                photoUrl = await uploadImage(photoFile);
            } catch (error) {
                alert("Error al subir la imagen: " + error.message);
                setLoading(false);
                return;
            }
        }

        const data = collectStudentFormData(e.target);
        if (photoUrl) data.public_photo_url = photoUrl;

        const password = formData.get('password') || 'Estudiante2026*';
        try {
            const response = await fetch('/api/auth/manage-user', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email, password, name: data.nombre, school_id: school.id, rol: 'student', metadata: data })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Error al crear estudiante');

            if (leadToFormalize) {
                await supabase.from('leads').update({ estado: 'Matriculado' }).eq('id', leadToFormalize.id);
            }

            alert(`¡Estudiante creado!\nEmail: ${data.email}\nClave: ${password}`);
            setIsStudentModalOpen(false); setEditingStudent(null); setLeadToFormalize(null); fetchStudents(); fetchStats();
        } catch (err) { alert('Error: ' + err.message); }
        finally { setLoading(false); }
    };

    const handleEditStudent = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const photoFile = e.target.photo_file?.files[0];
        let photoUrl = editingStudent?.public_photo_url;

        if (photoFile) {
            try {
                photoUrl = await uploadImage(photoFile);
            } catch (error) {
                alert("Error al subir la imagen: " + error.message);
                setLoading(false);
                return;
            }
        }

        const data = collectStudentFormData(e.target);
        data.public_photo_url = photoUrl;

        const password = formData.get('password') || '';
        try {
            const response = await fetch('/api/auth/manage-user', {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingStudent.id, ...(password ? { password } : {}), ...data })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Error al actualizar');
            alert('Estudiante actualizado correctamente.');
            setIsStudentModalOpen(false); setEditingStudent(null); fetchStudents();
        } catch (err) { alert('Error: ' + err.message); }
        finally { setLoading(false); }
    };

    const handleSaveTeacher = async (e) => {
        e.preventDefault();
        setUploading(true);
        const formData = new FormData(e.target);

        let photoUrl = formData.get('public_photo_url') || (editingTeacher ? editingTeacher.public_photo_url : null);
        const photoFile = e.target.photo_file?.files[0];

        if (photoFile) {
            try {
                photoUrl = await uploadImage(photoFile);
            } catch (error) {
                alert("Error al subir la imagen: " + error.message);
                setUploading(false);
                return;
            }
        }

        const v = (key) => { const val = formData.get(key); return val === '' || val === null ? null : val; };

        let finalRol = formData.get('rol') || 'teacher';
        const rawSpecialty = formData.get('specialty') || '';

        const teacherData = {
            nombre: formData.get('nombre'),
            tipo_documento: v('tipo_documento'),
            numero_documento: v('numero_documento'),
            fecha_nacimiento: v('fecha_nacimiento'),
            direccion: v('direccion'),
            specialty: rawSpecialty,
            public_bio: v('public_bio'),
            public_photo_url: photoUrl,
            email: formData.get('email'),
            rol: finalRol,
            acudiente_nombre: v('acudiente_nombre'),
            acudiente_parentesco: v('acudiente_parentesco'),
            acudiente_telefono: v('acudiente_telefono'),
            acudiente_email: v('acudiente_email'),
            grupo_sanguineo: v('grupo_sanguineo'),
            eps_salud: v('eps_salud'),
            alergias: v('alergias'),
            condiciones_medicas: v('condiciones_medicas'),
            facebook_url: v('facebook_url'),
            instagram_url: v('instagram_url'),
            linkedin_url: v('linkedin_url'),
            twitter_url: v('twitter_url')
        };
        const teacherPassword = formData.get('password');

        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();

        let error;
        if (editingTeacher) {
            // Usamos la API con Service Role para bypass de RLS
            try {
                const response = await fetch('/api/auth/manage-user', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: editingTeacher.id,
                        password: teacherPassword, // Solo se actualiza si no es vacío
                        nombre: teacherData.nombre,
                        tipo_documento: teacherData.tipo_documento,
                        numero_documento: teacherData.numero_documento,
                        fecha_nacimiento: teacherData.fecha_nacimiento,
                        direccion: teacherData.direccion,
                        specialty: teacherData.specialty,
                        public_bio: teacherData.public_bio,
                        public_photo_url: teacherData.public_photo_url,
                        rol: teacherData.rol,
                        acudiente_nombre: teacherData.acudiente_nombre,
                        acudiente_parentesco: teacherData.acudiente_parentesco,
                        acudiente_telefono: teacherData.acudiente_telefono,
                        acudiente_email: teacherData.acudiente_email,
                        grupo_sanguineo: teacherData.grupo_sanguineo,
                        eps_salud: teacherData.eps_salud,
                        alergias: teacherData.alergias,
                        condiciones_medicas: teacherData.condiciones_medicas
                    })
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || 'Error al actualizar perfil');
                error = null;
            } catch (err) {
                error = err;
            }
        } else {
            // USAMOS EL API PARA CREAR USUARIO OFICIAL EN AUTH + PROFILE
            try {
                const response = await fetch('/api/auth/manage-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: teacherData.email,
                        password: teacherPassword,
                        name: teacherData.nombre,
                        school_id: school.id,
                        rol: teacherData.rol,
                        metadata: {
                            tipo_documento: teacherData.tipo_documento,
                            numero_documento: teacherData.numero_documento,
                            fecha_nacimiento: teacherData.fecha_nacimiento,
                            direccion: teacherData.direccion,
                            specialty: teacherData.specialty,
                            public_bio: teacherData.public_bio,
                            public_photo_url: teacherData.public_photo_url,
                            acudiente_nombre: teacherData.acudiente_nombre,
                            acudiente_parentesco: teacherData.acudiente_parentesco,
                            acudiente_telefono: teacherData.acudiente_telefono,
                            acudiente_email: teacherData.acudiente_email,
                            grupo_sanguineo: teacherData.grupo_sanguineo,
                            eps_salud: teacherData.eps_salud,
                            alergias: teacherData.alergias,
                            condiciones_medicas: teacherData.condiciones_medicas
                        }
                    })
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.error || 'Error al crear usuario');

                error = null; // Éxito
            } catch (err) {
                error = err;
            }
        }

        if (error) alert("Error: " + (error.message || error));
        else {
            setIsTeacherModalOpen(false);
            setEditingTeacher(null);
            fetchTeachers();
        }
        setUploading(false);
    };

    const handleDeleteTeacher = async (id) => {
        if (confirm('¿Estás seguro de eliminar a este docente?')) {
            await supabase.from('profiles').delete().eq('id', id);
            fetchTeachers();
        }
    };
    const handleSaveGallery = async (e) => {
        e.preventDefault();
        setUploading(true);
        const formData = new FormData(e.target);
        const photoFile = e.target.photo_file?.files[0];

        let imageUrl = '';
        if (photoFile) {
            try {
                imageUrl = await uploadImage(photoFile);
            } catch (error) {
                alert("Error al subir la imagen: " + error.message);
                setUploading(false);
                return;
            }
        }

        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        const { error } = await supabase.from('school_gallery').insert([{
            school_id: school.id,
            image_url: imageUrl,
            title: formData.get('title') || 'Foto de Galería'
        }]);

        if (error) alert("Error: " + error.message);
        else {
            setIsGalleryModalOpen(false);
            fetchGallery();
        }
        setUploading(false);
    };

    const handleSaveNews = async (e) => {
        e.preventDefault();
        setUploading(true);
        const formData = new FormData(e.target);
        const photoFile = e.target.photo_file?.files[0];

        let imageUrl = editingNews?.image_url || '';
        if (photoFile) {
            try {
                imageUrl = await uploadImage(photoFile);
            } catch (error) {
                alert("Error al subir la imagen: " + error.message);
                setUploading(false);
                return;
            }
        }

        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();
        const newsTitle = formData.get('title');
        const newsSlug = newsTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
        const newsData = {
            school_id: school.id,
            title: newsTitle,
            slug: newsSlug,
            content: formData.get('content'),
            image_url: imageUrl,
            published_at: new Date().toISOString()
        };

        let error;
        try {
            if (editingNews) {
                const { error: resError } = await supabase.from('school_news').update(newsData).eq('id', editingNews.id);
                error = resError;
            } else {
                const { error: resError } = await supabase.from('school_news').insert([newsData]);
                error = resError;
            }

            if (error) throw error;

            setIsNewsModalOpen(false);
            setEditingNews(null);
            fetchNews();
            alert("Noticia guardada con éxito");
        } catch (err) {
            alert("Error al guardar noticia: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);

        let bannerUrl = schoolConfig?.banner_url;
        if (bannerFile) {
            try { bannerUrl = await uploadImage(bannerFile); }
            catch (error) { alert("Error al subir el banner: " + error.message); setLoading(false); return; }
        }

        let bannerGalleryUrl = schoolConfig?.banner_gallery_url;
        if (bannerGalleryFile) {
            try { bannerGalleryUrl = await uploadImage(bannerGalleryFile); }
            catch (error) { alert("Error al subir el banner de galería: " + error.message); setLoading(false); return; }
        }

        let bannerOfferUrl = schoolConfig?.banner_offer_url;
        if (bannerOfferFile) {
            try { bannerOfferUrl = await uploadImage(bannerOfferFile); }
            catch (error) { alert("Error al subir el banner de oferta: " + error.message); setLoading(false); return; }
        }

        const generalConfig = {
            grados: grados,
            slogan: formData.get('slogan'),
            telefono: formData.get('telefono'),
            mision: formData.get('mision'),
            vision: formData.get('vision'),
            facebook_url: formData.get('facebook_url'),
            instagram_url: formData.get('instagram_url'),
            tiktok_url: formData.get('tiktok_url'),
            youtube_url: formData.get('youtube_url'),
            wompi_url: formData.get('wompi_url'),
            schedule_morning: formData.get('schedule_morning'),
            schedule_afternoon: formData.get('schedule_afternoon')
        };

        const bannerConfig = {
            banner_url: bannerUrl,
            banner_gallery_url: bannerGalleryUrl,
            banner_offer_url: bannerOfferUrl
        };

        // Guardar configuración general
        const { error: genError } = await supabase
            .from('schools')
            .update(generalConfig)
            .eq('slug', params.slug);

        if (genError) {
            alert('Error en configuración general: ' + genError.message);
        }

        // Guardar banners por separado para evitar el error de "schema cache" si la columna falla
        const { error: banError } = await supabase
            .from('schools')
            .update(bannerConfig)
            .eq('slug', params.slug);

        if (banError) {
            console.error("Error al guardar banners:", banError);
            if (banError.message.includes("banner_url")) {
                alert("Nota: El sistema no pudo guardar los banners debido a un error de esquema en la base de datos, pero el resto de la información se guardó correctamente.");
            } else {
                alert("Error al guardar banners: " + banError.message);
            }
        }

        if (!genError) {
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
            setBannerFile(null);
        }

        setLoading(false);
        fetchSchoolConfig();
    };

    const handleDeleteGallery = async (id) => {
        if (confirm("¿Estás seguro de eliminar esta foto?")) {
            const { error } = await supabase.from('school_gallery').delete().eq('id', id);
            if (error) alert("Error: " + error.message);
            else fetchGallery();
        }
    };

    const handleDeleteNews = async (id) => {
        if (confirm("¿Estás seguro de eliminar esta noticia?")) {
            const { error } = await supabase.from('school_news').delete().eq('id', id);
            if (error) alert("Error: " + error.message);
            else fetchNews();
        }
    };

    const handleDownloadReport = async () => {
        setLoading(true);
        try {
            const today = new Date();
            const dateStr = today.toLocaleDateString('es-CO', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' });
            const startOfDay = new Date(today.toLocaleString('en-US', { timeZone: 'America/Bogota' }));
            startOfDay.setHours(0, 0, 0, 0);
            const isoStart = startOfDay.toISOString();

            // Fetch today's leads
            const { data: todayLeads } = await supabase
                .from('leads')
                .select('*')
                .eq('school_id', schoolConfig.id)
                .gte('created_at', isoStart)
                .order('created_at', { ascending: false });

            // Fetch today's payments
            const { data: todayPayments } = await supabase
                .from('pagos_estudiantes')
                .select('*, profiles:student_id(nombre, grado)')
                .eq('school_id', schoolConfig.id)
                .gte('created_at', isoStart)
                .order('created_at', { ascending: false });

            // Initialize XLSX workbook
            const XLSX = await import('xlsx');
            const wb = XLSX.utils.book_new();

            // 1. Resumen Tab
            const totalPagos = (todayPayments || []).filter(p => p.estado === 'aprobado').reduce((sum, p) => sum + (p.monto || 0), 0);
            const resumenData = [
                ['REPORTE DIARIO', schoolConfig.nombre || 'Colegio Latinoamericano'],
                ['Fecha', dateStr],
                [],
                ['TOTAL RECAUDADO HOY', `$${totalPagos.toLocaleString('es-CO')}`],
                ['Total admisiones', (todayLeads || []).length],
                ['Total pagos registrados', (todayPayments || []).length]
            ];
            const wsResumen = XLSX.utils.aoa_to_sheet(resumenData);
            XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen");

            // 2. Admisiones Tab
            const leadsData = [
                ['Nombre', 'Teléfono', 'Email', 'Grado Interés', 'Estado', 'Hora']
            ];
            (todayLeads || []).forEach(l => {
                const hora = new Date(l.created_at).toLocaleTimeString('es-CO', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit' });
                leadsData.push([l.nombre_estudiante || l.nombre || '', l.telefono || '', l.email || '', l.grado_interes || '', l.estado || 'nuevo', hora]);
            });
            const wsLeads = XLSX.utils.aoa_to_sheet(leadsData);
            // Auto width columns
            wsLeads['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 10 }];
            XLSX.utils.book_append_sheet(wb, wsLeads, "Admisiones");

            // 3. Pagos Tab
            const pagosData = [
                ['Estudiante', 'Grado', 'Concepto', 'Monto', 'Método', 'Estado', 'Hora']
            ];
            (todayPayments || []).forEach(p => {
                const hora = new Date(p.created_at).toLocaleTimeString('es-CO', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit' });
                const nombre = p.profiles?.nombre || 'N/A';
                const grado = p.profiles?.grado || '';
                pagosData.push([nombre, grado, p.concepto || '', `$${(p.monto || 0).toLocaleString('es-CO')}`, p.metodo_pago || '', p.estado || '', hora]);
            });
            const wsPagos = XLSX.utils.aoa_to_sheet(pagosData);
            wsPagos['!cols'] = [{ wch: 30 }, { wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 10 }];
            XLSX.utils.book_append_sheet(wb, wsPagos, "Pagos");

            // Download File
            XLSX.writeFile(wb, `reporte_diario_${today.toISOString().split('T')[0]}.xlsx`);

        } catch (err) {
            alert('Error generando reporte: ' + err.message);
        }
        setLoading(false);
    };

    const handleSaveCost = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);

        const costData = {
            category: formData.get('category'),
            concept: formData.get('concept'),
            value: formData.get('value'),
            description: formData.get('description'),
            display_order: parseInt(formData.get('display_order')) || 0
        };

        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();

        let error;
        if (editingCost) {
            const { error: resError } = await supabase.from('school_costs').update(costData).eq('id', editingCost.id);
            error = resError;
        } else {
            const { error: resError } = await supabase.from('school_costs').insert([{ ...costData, school_id: school.id }]);
            error = resError;
        }

        if (error) alert("Error: " + error.message);
        else {
            setIsCostModalOpen(false);
            setEditingCost(null);
            fetchCosts();
        }
        setLoading(false);
    };

    const handleDeleteCost = async (id) => {
        if (confirm('¿Estás seguro de eliminar este concepto de costo?')) {
            await supabase.from('school_costs').delete().eq('id', id);
            fetchCosts();
        }
    };

    const handleSaveCircular = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();

        let fileUrl = '';
        const file = e.target.file_upload?.files[0];
        if (file) {
            // Mock de subida de PDF
            fileUrl = `https://storage.colegiolatinoamericano.com/circulares/${file.name}`;
        }

        const { error } = await supabase.from('school_circulars').insert([{
            school_id: school.id,
            title: formData.get('title'),
            content: formData.get('content'),
            target_area: formData.get('target_area') || 'Todos',
            file_url: fileUrl,
            published_at: new Date().toISOString()
        }]);

        if (error) alert("Error: " + error.message);
        else {
            setIsCircularModalOpen(false);
            fetchCirculares();
            alert("Circular publicada para toda la comunidad.");
        }
        setLoading(false);
    };

    const handleSaveActivity = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const { data: school } = await supabase.from('schools').select('id').eq('slug', params.slug).single();

        // Obtener el usuario actual para created_by
        const { data: { user: currentUser } } = await supabase.auth.getUser();

        // Subir imagen si hay archivo seleccionado
        let fileUrl = null;
        if (activityFile) {
            try {
                fileUrl = await uploadImage(activityFile);
            } catch (uploadErr) {
                alert('Error al subir la imagen: ' + uploadErr.message);
                setLoading(false);
                return;
            }
        }

        const gradoVal = formData.get('grado');
        const insertData = {
            school_id: school.id,
            title: formData.get('title'),
            description: formData.get('description'),
            grado: gradoVal || 'General',
            created_by: currentUser?.id || null,
            due_date: formData.get('due_date') || null
        };
        // Solo incluir file_url si se subió un archivo (requiere columna en Supabase)
        if (fileUrl) insertData.file_url = fileUrl;

        const { error } = await supabase.from('school_activities').insert([insertData]);

        if (error) alert("Error: " + error.message);
        else {
            setIsActivityModalOpen(false);
            setActivityFile(null);
            setActivityFilePreview(null);
            fetchActivities();
            alert("Actividad asignada exitosamente a los estudiantes en modalidad A Distancia.");
        }
        setLoading(false);
    };

    // Funcionalidad de SIMAT reemplazada por Reporte de Alertas / Emergencias

    const menuItems = [
        { id: "dashboard", label: "Panel de Control", icon: LayoutDashboard },
        { id: "leads", label: "Interesados", icon: UserPlus },
        { id: "students", label: "Gestión Estudiantil", icon: Users },
        { id: "staff", label: "Personal", icon: GraduationCap },
        { id: "academic", label: "Académico", icon: Book },
        { id: "wellbeing", label: "Bienestar", icon: Heart },
        { id: "circulares", label: "Circulares", icon: Megaphone },
        { id: "gallery", label: "Galería", icon: ImageIcon },
        { id: "news", label: "Noticias", icon: FileText },
        { id: "costs", label: "Costos", icon: DollarSign },
        { id: "calificaciones", label: "Calificaciones", icon: ClipboardList },
        { id: "settings", label: "Identidad", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-blue-100 shadow-xl relative z-50">
                <div className="p-10 flex flex-col items-center gap-6">
                    <div className="relative group shrink-0">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-white p-2 rounded-full border border-blue-50 shadow-sm">
                            {schoolConfig?.logo_url ? (
                                <img src={schoolConfig.logo_url} className="w-16 h-16 object-contain" alt="Logo" />
                            ) : (
                                <div className="w-16 h-16 flex items-center justify-center text-blue-900 font-black text-2xl">
                                    {params.slug.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-sm font-black text-blue-900 uppercase tracking-tighter line-clamp-1">{schoolConfig?.nombre || params.slug}</h1>
                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1">Panel de Control</p>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === item.id
                                ? "bg-blue-900 text-white shadow-lg shadow-blue-900/20"
                                : "text-blue-400 hover:bg-blue-50 hover:text-blue-900"
                                }`}
                        >
                            <item.icon size={20} className={activeTab === item.id ? "text-white" : "text-blue-300"} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-blue-50 mt-auto bg-blue-50/30 backdrop-blur-sm">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-blue-50 shadow-sm">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl flex items-center justify-center text-white font-black shadow-lg">R</div>
                        <div className="overflow-hidden text-left">
                            <p className="text-xs font-black text-blue-900 line-clamp-1">Administrador</p>
                            <p className="text-[9px] text-blue-400 font-bold uppercase">Rectoría</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="lg:hidden bg-institutional-blue text-white p-4 flex justify-between items-center z-50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-institutional-blue font-black text-sm">
                            {params.slug.substring(0, 2).toUpperCase()}
                        </div>
                        <h1 className="text-sm font-black uppercase">{schoolConfig?.nombre || params.slug}</h1>
                    </div>
                    <button className="p-2 bg-white/10 rounded-lg">
                        <Bell size={20} />
                    </button>
                </header>

                {/* Mobile Sub-Nav */}
                <nav className="lg:hidden bg-white border-b border-gray-100 flex overflow-x-auto p-2 gap-2 no-scrollbar">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${activeTab === item.id
                                ? "bg-institutional-blue text-white"
                                : "bg-gray-50 text-gray-400"
                                }`}
                        >
                            <item.icon size={14} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Main Content Scroll Area */}
                <main className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
                    {/* Top Stats Bar / Title */}
                    <div className="mb-10 bg-blue-900 rounded-[40px] p-12 shadow-[0_20px_50px_-12px_rgba(30,58,138,0.25)] relative group border border-blue-800">
                        {/* Decoración de fondo */}
                        <div className="absolute inset-0 rounded-[40px] overflow-hidden pointer-events-none">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
                        </div>

                        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="space-y-2">
                                <h2 className="text-7xl font-black text-white tracking-tighter drop-shadow-sm">
                                    {menuItems.find(i => i.id === activeTab)?.label}
                                </h2>
                                <div className="text-blue-200 font-bold text-xl mt-4 flex items-center gap-3">
                                    <div className="w-8 h-1 bg-blue-400 rounded-full"></div>
                                    Gestión Académica e Institucional
                                </div>
                            </div>

                            <div className="flex items-center gap-4 shrink-0">
                                {/* Notifications Dropdown */}
                                <div className="relative z-50">
                                    <button
                                        onClick={() => setIsPendingDropdownOpen(!isPendingDropdownOpen)}
                                        className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/10 shadow-xl hover:bg-white/20 transition-all text-white relative"
                                    >
                                        <Bell size={24} />
                                        {pendingActivities.length > 0 && (
                                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-blue-900 animate-pulse"></span>
                                        )}
                                    </button>

                                    {isPendingDropdownOpen && (
                                        <div className="absolute right-0 top-full mt-4 z-[200]">
                                            <div className="w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-4 origin-top-right relative">
                                                <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                                    <h4 className="font-black text-gray-800 text-sm">Nuevas Entregas</h4>
                                                    <span className="text-xs font-bold text-gray-400">{pendingActivities.length} pendientes</span>
                                                </div>
                                                <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
                                                    {pendingActivities.length === 0 ? (
                                                        <div className="p-6 text-center text-gray-400 font-medium text-xs">No hay entregas nuevas</div>
                                                    ) : (
                                                        pendingActivities.map((sub, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={async () => {
                                                                    setIsPendingDropdownOpen(false);
                                                                    if (activeTab !== 'academic') {
                                                                        setActiveTab('academic');
                                                                        // allow simple render cycle
                                                                        await new Promise(r => setTimeout(r, 100));
                                                                    }
                                                                    setSubmissionFilterStudentId(sub.estudiante_id);
                                                                    fetchSubmissions(sub.tarea_id);
                                                                }}
                                                                className="w-full text-left p-3 hover:bg-blue-50 rounded-2xl transition-all border border-transparent hover:border-blue-100 flex items-start gap-3"
                                                            >
                                                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                                                                    <FileText size={16} />
                                                                </div>
                                                                <div className="flex-1 min-w-0 text-left">
                                                                    <p className="text-sm font-bold text-gray-800 truncate">{sub.profiles?.nombre}</p>
                                                                    <p className="text-xs text-gray-500 truncate">{sub.activity_title}</p>
                                                                    <p className="text-[10px] text-blue-500 font-black mt-1 uppercase tracking-widest">{sub.profiles?.grado}</p>
                                                                </div>
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {activeTab === 'dashboard' && (
                                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-[30px] border border-white/10 shadow-xl flex items-center gap-4 hover:bg-white/20 transition-all cursor-default">
                                        <div className="w-12 h-12 bg-white text-institutional-blue rounded-2xl flex items-center justify-center font-black shadow-lg">
                                            <Users size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Estudiantes</p>
                                            <p className="text-2xl font-black text-white leading-none">{stats.students}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {activeTab === "dashboard" && (
                        <>
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex items-center gap-6">
                                    <h2 className="text-4xl font-black text-gray-800 tracking-tight">Consola de Rectoría</h2>
                                    <span className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 animate-pulse">
                                        {wellbeingReports.filter(r => r.type === 'Urgencia' && r.status === 'Pendiente').length} Nueva Urgencia
                                    </span>
                                </div>
                                <button onClick={() => setActiveTab("leads")} className="bg-institutional-blue text-white px-6 py-3 rounded-2xl font-black text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                                    <PlusCircle size={20} /> Nueva Matrícula
                                </button>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Nuevos Interesados Capturados</p>
                                    <p className="text-4xl font-black text-institutional-magenta">+{stats.leads}</p>
                                    <div className="mt-4 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="w-2/3 h-full bg-institutional-magenta"></div>
                                    </div>
                                </div>
                                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Total Estudiantes</p>
                                    <p className="text-4xl font-black text-institutional-blue">{stats.students}</p>
                                    <p className="text-xs text-green-500 font-bold mt-2">Población Activa</p>
                                </div>
                                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Planta Docente</p>
                                    <p className="text-4xl font-black text-amber-500">{stats.teachers}</p>
                                    <p className="text-xs text-gray-400 font-bold mt-2">Profesionales</p>
                                </div>
                                <div className="bg-institutional-blue p-8 rounded-[40px] shadow-xl text-white">
                                    <p className="text-xs opacity-60 font-bold uppercase tracking-widest mb-2">Recaudo Estimado</p>
                                    <p className="text-3xl font-black font-mono">${stats.revenue}</p>
                                    <p className="text-xs opacity-60 font-bold mt-2 tracking-tighter">Ciclo Escolar 2026</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Leads Table */}
                                <div className="lg:col-span-2 bg-white rounded-[40px] shadow-sm border border-gray-100 p-10">
                                    <div className="flex justify-between items-center mb-10">
                                        <h3 className="text-2xl font-black text-gray-800">Nuevos Interesados capturados por IA</h3>
                                        <button
                                            onClick={() => setActiveTab('leads')}
                                            className="text-blue-600 font-bold text-sm hover:underline"
                                        >
                                            Ver reporte completo
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {leads.map(lead => (
                                            <div key={lead.id} className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-3xl hover:bg-blue-50/50 transition-all border border-transparent hover:border-blue-100/50">
                                                <div className="flex items-center gap-6 mb-4 sm:mb-0">
                                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-institutional-blue font-black text-xl">
                                                        {lead.nombre ? lead.nombre[0] : 'L'}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900 text-lg">{lead.nombre || lead.telefono}</p>
                                                        <div className="flex gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                            <span>{lead.telefono}</span>
                                                            <span>•</span>
                                                            <span>{lead.interes || 'Información General'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="bg-institutional-magenta text-white px-6 py-2 rounded-xl text-xs font-black shadow-lg shadow-magenta-500/20">Llamar</button>
                                                    <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-xs font-black">Historial</button>
                                                </div>
                                            </div>
                                        ))}
                                        {leads.length === 0 && (
                                            <div className="text-center py-10 text-gray-400 font-medium">No hay interesados recientes.</div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Actions and Wellbeing Alerts */}
                                <div className="space-y-8">
                                    <div className="bg-institutional-magenta text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                                        <PlusCircle className="absolute -top-10 -right-10 opacity-10" size={200} />
                                        <h3 className="text-2xl font-black mb-6 relative z-10">Acciones Directas</h3>
                                        <div className="space-y-4 relative z-10">
                                            <button onClick={handleDownloadReport} className="w-full bg-white/20 hover:bg-white/30 p-5 rounded-3xl text-left border border-white/20 transition-all backdrop-blur-sm">
                                                <p className="font-black text-sm mb-1 uppercase tracking-tighter">📋 Reporte Diario (Excel)</p>
                                                <p className="text-[10px] opacity-70">Resumen detallado de admisiones y pagos</p>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Canal de Urgencias Replicado en Dashboard */}
                                    <div className="bg-white rounded-[40px] shadow-sm border border-red-100 p-8">
                                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-6">Canal de Urgencias</h3>
                                        <div className="space-y-4">
                                            {wellbeingReports.filter(r => r.type === 'Urgencia').map((report) => (
                                                <div key={report.id} className="bg-red-50 p-6 rounded-3xl border border-red-100 border-l-8 border-l-red-500">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full uppercase">ALERTA {report.profiles?.grado}</span>
                                                        <span className="text-[10px] text-red-400 font-bold">{new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <p className="font-black text-red-900 leading-tight">
                                                        {report.profiles?.nombre}: {report.description}
                                                    </p>
                                                </div>
                                            ))}
                                            {wellbeingReports.filter(r => r.type === 'Urgencia').length === 0 && (
                                                <div className="text-center py-10">
                                                    <p className="text-gray-400 text-sm font-medium">Sin urgencias activas.</p>
                                                </div>
                                            )}
                                            <button className="w-full py-4 bg-gray-50 hover:bg-gray-100 rounded-2xl text-xs font-black text-gray-400 uppercase tracking-widest transition-all">Histórico de Incidentes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {
                        activeTab === "staff" && (
                            <div className="space-y-10">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-4xl font-black text-gray-800 tracking-tight">Personal Institucional</h2>
                                        <p className="text-gray-500 font-medium">Administra la planta de docentes, administrativos y directivos.</p>
                                    </div>
                                    <button
                                        onClick={() => { setEditingTeacher(null); setIsTeacherModalOpen(true); }}
                                        className="bg-institutional-blue text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                                    >
                                        <PlusCircle size={20} /> Agregar Integrante
                                    </button>
                                </div>

                                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr className="text-xs font-black uppercase tracking-widest text-gray-400">
                                                <th className="py-6 px-8">Nombre / Cargo</th>
                                                <th className="py-6 px-8">Área / Especialidad</th>
                                                <th className="py-6 px-8">Rol de Acceso</th>
                                                <th className="py-6 px-8 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {teachers.map(teacher => (
                                                <tr key={teacher.id} className="hover:bg-blue-50/30 transition-colors">
                                                    <td className="py-6 px-8">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-gray-100 rounded-2xl overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                                                                {teacher.public_photo_url ? (
                                                                    <img src={teacher.public_photo_url} alt={teacher.nombre} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                        <GraduationCap size={24} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-gray-800">{teacher.nombre}</p>
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{teacher.specialty || 'Administrativo'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-6 px-8 font-bold text-gray-500">{teacher.specialty || 'General'}</td>
                                                    <td className="py-6 px-8 text-center sm:text-left">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest block sm:inline-block w-full sm:w-auto mt-2 sm:mt-0 ${teacher.rol === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                            teacher.rol === 'superadmin' ? 'bg-indigo-100 text-indigo-700' :
                                                                teacher.rol?.includes('coordinador') ? 'bg-blue-100 text-blue-700' :
                                                                    teacher.rol === 'secretary' ? 'bg-green-100 text-green-700' :
                                                                        teacher.rol === 'treasury' ? 'bg-amber-100 text-amber-700' :
                                                                            'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {teacher.rol === 'admin' ? 'Rectoría' :
                                                                teacher.rol === 'superadmin' ? 'Desarrollador' :
                                                                    teacher.rol === 'coordinador_convivencia' ? 'Coord. Convivencia' :
                                                                        teacher.rol === 'coordinador_academico' ? 'Coord. Académico' :
                                                                                    teacher.rol === 'secretary' ? 'Secretaría' :
                                                                                        teacher.rol === 'treasury' ? 'Tesorería' :
                                                                                            'Docente'}
                                                        </span>
                                                    </td>
                                                    <td className="py-6 px-8 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => { setEditingTeacher(teacher); setIsTeacherModalOpen(true); }}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                                            >
                                                                <Edit size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteTeacher(teacher.id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {teachers.length === 0 && !loading && (
                                        <div className="p-20 text-center text-gray-400 font-medium">
                                            No hay docentes registrados aún.
                                        </div>
                                    )}
                                </div>

                                {isTeacherModalOpen && (
                                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-institutional-blue/40 backdrop-blur-md animate-in fade-in duration-200">
                                        <form onSubmit={handleSaveTeacher} className="bg-white w-full max-w-[95vw] lg:max-w-7xl max-h-[90vh] rounded-[40px] shadow-2xl p-8 lg:p-10 relative animate-in zoom-in-95 duration-300 overflow-y-auto flex flex-col">
                                            <button type="button" onClick={() => { setIsTeacherModalOpen(false); setEditingTeacher(null); }} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                                <X size={24} className="text-gray-400" />
                                            </button>
                                            <div className="mb-8">
                                                <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                                                    <UserPlus size={28} className="text-institutional-blue" />
                                                    {editingTeacher ? 'Editar Personal' : 'Nuevo Docente / Administrativo'}
                                                </h3>
                                                <p className="text-sm text-gray-500 font-medium mt-1">Captura de información institucional, médica y de contacto</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
                                                {/* COLUMNA 1: DATOS PERSONALES + ACCESO AL SISTEMA */}
                                                <div className="space-y-5">
                                                    <div>
                                                        <h4 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3 flex items-center gap-2">👤 Datos Personales</h4>
                                                        <div className="bg-blue-50/50 rounded-2xl p-5 space-y-3">
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nombre Completo *</label>
                                                                <input name="nombre" defaultValue={editingTeacher?.nombre} required className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ej. Juan Pérez" />
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tipo Doc.</label>
                                                                    <select name="tipo_documento" defaultValue={editingTeacher?.tipo_documento} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                                                        <option>CC</option><option>CE</option><option>PA</option>
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">N° Documento</label>
                                                                    <input name="numero_documento" defaultValue={editingTeacher?.numero_documento} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nacimiento</label>
                                                                    <input type="date" name="fecha_nacimiento" defaultValue={editingTeacher?.fecha_nacimiento} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dirección</label>
                                                                    <input name="direccion" defaultValue={editingTeacher?.direccion} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Calle 123" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-xs font-black uppercase tracking-widest text-purple-600 mb-3 flex items-center gap-2">🔐 Acceso al Sistema</h4>
                                                        <div className="bg-purple-50/50 rounded-2xl p-5 space-y-3">
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Académico *</label>
                                                                <input name="email" type="email" defaultValue={editingTeacher?.email} required disabled={editingTeacher} className={`w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-purple-500 outline-none ${editingTeacher ? 'opacity-50 cursor-not-allowed' : ''}`} placeholder="docente@colegio.edu.co" />
                                                            </div>
                                                            {!editingTeacher && (
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contraseña Temporal *</label>
                                                                    <div className="relative">
                                                                        <input name="password" type={showPassword ? 'text' : 'password'} required className="w-full bg-white border border-gray-200 rounded-xl p-3 pr-12 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
                                                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* COLUMNA 2: ROL INSTITUCIONAL + REDES SOCIALES */}
                                                <div className="space-y-5">
                                                    <div>
                                                        <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-3 flex items-center gap-2">🏫 Rol Institucional</h4>
                                                        <div className="bg-indigo-50/50 rounded-2xl p-5 space-y-3">
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Permisos de Sistema</label>
                                                                <select name="rol" defaultValue={editingTeacher?.rol} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                                                    <option value="teacher">Docente</option>
                                                                    <option value="coordinador_convivencia">Coordinación Convivencia</option>
                                                                    <option value="coordinador_academico">Coordinación Académica</option>
                                                                    <option value="secretary">Secretaría</option>
                                                                    <option value="treasury">Tesorería</option>
                                                                    <option value="admin">Rectoría (Admin)</option>
                                                                    <option value="superadmin">Desarrollador (Superadmin)</option>
                                                                </select>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cargo / Especialidad</label>
                                                                <input name="specialty" defaultValue={editingTeacher?.specialty} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej. Matemáticas" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Foto de Perfil</label>
                                                                <input type="file" name="photo_file" className="w-full text-xs bg-white border border-gray-200 rounded-xl p-2 focus:ring-2 focus:ring-indigo-500 outline-none" accept="image/*" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-xs font-black uppercase tracking-widest text-teal-600 mb-3 flex items-center gap-2">🌐 Redes Sociales (Opcional)</h4>
                                                        <div className="bg-teal-50/50 rounded-2xl p-5 space-y-3">
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Facebook</label>
                                                                    <input name="facebook_url" type="url" defaultValue={editingTeacher?.facebook_url} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-xs placeholder-gray-300 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="https://fb.com/..." />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Instagram</label>
                                                                    <input name="instagram_url" type="url" defaultValue={editingTeacher?.instagram_url} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-xs placeholder-gray-300 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="https://ig.com/..." />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">LinkedIn</label>
                                                                    <input name="linkedin_url" type="url" defaultValue={editingTeacher?.linkedin_url} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-xs placeholder-gray-300 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="https://linkedin.com/..." />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Twitter / X</label>
                                                                    <input name="twitter_url" type="url" defaultValue={editingTeacher?.twitter_url} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-xs placeholder-gray-300 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="https://x.com/..." />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* COLUMNA 3: DATOS MÉDICOS + CONTACTO DE EMERGENCIA */}
                                                <div className="space-y-5">
                                                    <div>
                                                        <h4 className="text-xs font-black uppercase tracking-widest text-rose-600 mb-3 flex items-center gap-2">⚕️ Datos Médicos</h4>
                                                        <div className="bg-rose-50/50 rounded-2xl p-5 space-y-3">
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Grupo Sanguíneo</label>
                                                                    <input name="grupo_sanguineo" defaultValue={editingTeacher?.grupo_sanguineo} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-rose-500 outline-none" placeholder="Ej. O+" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">EPS / Seguro</label>
                                                                    <input name="eps_salud" defaultValue={editingTeacher?.eps_salud} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-rose-500 outline-none" placeholder="Sanitas..." />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Alergias</label>
                                                                <textarea name="alergias" defaultValue={editingTeacher?.alergias} rows={2} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-rose-500 outline-none" placeholder="Ninguna conocida" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Condiciones Médicas</label>
                                                                <textarea name="condiciones_medicas" defaultValue={editingTeacher?.condiciones_medicas} rows={2} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-rose-500 outline-none" placeholder="Ninguna" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-xs font-black uppercase tracking-widest text-amber-600 mb-3 flex items-center gap-2">🚨 Contacto de Emergencia</h4>
                                                        <div className="bg-amber-50/50 rounded-2xl p-5 space-y-3">
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nombre del Contacto</label>
                                                                <input name="acudiente_nombre" defaultValue={editingTeacher?.acudiente_nombre} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Nombre completo" />
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Parentesco</label>
                                                                    <input name="acudiente_parentesco" defaultValue={editingTeacher?.acudiente_parentesco} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Madre..." />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Teléfono</label>
                                                                    <input name="acudiente_telefono" type="tel" defaultValue={editingTeacher?.acudiente_telefono} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* SECCIÓN FULL-WIDTH ABAJO: BIOGRAFÍA PROFESIONAL */}
                                            <div className="mt-6">
                                                <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-2">📝 Biografía Profesional</h4>
                                                <div className="bg-emerald-50/50 rounded-2xl p-5 space-y-3">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Presentación Pública</label>
                                                        <textarea name="public_bio" defaultValue={editingTeacher?.public_bio} rows={3} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none" placeholder="Escribe un resumen profesional: formación académica, experiencia, logros y pasión por la educación..." />
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 font-medium">Esta biografía será visible en la página pública del colegio para estudiantes y padres de familia.</p>
                                                </div>
                                            </div>

                                            {/* Botones */}
                                            <div className="flex gap-4 mt-6 sticky bottom-0 bg-white pt-4 border-t border-gray-100">
                                                <button type="button" onClick={() => { setIsTeacherModalOpen(false); setEditingTeacher(null); }} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors hover:bg-gray-200">Cancelar</button>
                                                <button type="submit" disabled={uploading} className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${uploading ? 'bg-gray-400' : 'bg-institutional-blue shadow-blue-500/20 hover:scale-[1.02]'}`}>
                                                    {uploading ? 'Guardando...' : editingTeacher ? 'Actualizar Personal' : 'Crear Registro'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        )
                    }

                    {
                        activeTab === "wellbeing" && (
                            <div className="space-y-10">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-4xl font-black text-gray-800 tracking-tight">Bienestar Estudiantil</h2>
                                        <p className="text-gray-500 font-medium">Gestión de ausencias, excusas médicas y urgencias.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={fetchWellbeingReports} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-400 hover:text-institutional-blue transition-colors">
                                            <Loader2 size={24} className={loading ? "animate-spin" : ""} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-10">
                                    {/* Urgencias */}
                                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="p-8 border-b border-red-50 bg-red-50/10 flex justify-between items-center">
                                            <h3 className="font-black text-red-600 uppercase tracking-tighter flex items-center gap-2">
                                                <Bell size={20} /> Urgencias Activas
                                            </h3>
                                            <span className="text-[10px] font-black bg-red-100 text-red-600 px-3 py-1 rounded-full uppercase">Atención Prioritaria</span>
                                        </div>
                                        <div className="divide-y divide-gray-50">
                                            {wellbeingReports.filter(r => r.type === 'Urgencia').map(report => (
                                                <div key={report.id} className="p-8 hover:bg-red-50/10 transition-colors flex justify-between items-center">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center font-black text-2xl animate-pulse">
                                                            !
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-gray-900 text-xl">{report.profiles?.nombre}</p>
                                                            <div className="flex gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                                <span>{report.profiles?.grado}</span>
                                                                <span>•</span>
                                                                <span className="text-red-500">{new Date(report.created_at).toLocaleString()}</span>
                                                            </div>
                                                            <p className="mt-2 text-gray-600 font-bold italic">{report.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2 items-end">
                                                        <select
                                                            value={report.status}
                                                            onChange={(e) => handleUpdateReportStatus(report.id, e.target.value)}
                                                            className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl border-none shadow-sm ${report.status === 'Pendiente' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                                                                }`}
                                                        >
                                                            <option value="Pendiente">Pendiente</option>
                                                            <option value="Atendido">Atendido</option>
                                                            <option value="Resuelto">Resuelto</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}
                                            {wellbeingReports.filter(r => r.type === 'Urgencia').length === 0 && (
                                                <div className="p-10 text-center text-gray-400 font-medium italic">No hay urgencias reportadas en este momento.</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Ausencias y Excusas */}
                                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                            <h3 className="font-black text-gray-800 uppercase tracking-tighter">Ausencias y Excusas Médicas</h3>
                                            <span className="text-[10px] font-black bg-blue-50 text-institutional-blue px-3 py-1 rounded-full uppercase">Control de Asistencia</span>
                                        </div>
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 border-b border-gray-100">
                                                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                    <th className="py-6 px-8">Estudiante</th>
                                                    <th className="py-6 px-8">Fecha Reporte</th>
                                                    <th className="py-6 px-8">Evidencia / Detalle</th>
                                                    <th className="py-6 px-8">Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {wellbeingReports.filter(r => r.type === 'Ausencia').map(report => (
                                                    <tr key={report.id} className="hover:bg-blue-50/20 transition-colors">
                                                        <td className="py-6 px-8">
                                                            <p className="font-black text-gray-800">{report.profiles?.nombre}</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{report.profiles?.grado}</p>
                                                        </td>
                                                        <td className="py-6 px-8 text-xs font-bold text-gray-500 uppercase">
                                                            {new Date(report.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="py-6 px-8">
                                                            <div className="flex flex-col gap-1">
                                                                <p className="text-xs text-gray-600 font-medium line-clamp-1 italic">"{report.description}"</p>
                                                                {report.evidence_url && (
                                                                    <a href={report.evidence_url} target="_blank" className="text-[10px] font-black text-institutional-blue hover:underline uppercase flex items-center gap-1">
                                                                        <FileText size={12} /> Ver Evidencia Adjunta
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-6 px-8">
                                                            <select
                                                                value={report.status}
                                                                onChange={(e) => handleUpdateReportStatus(report.id, e.target.value)}
                                                                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-none shadow-sm ${report.status === 'Pendiente' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                                                                    }`}
                                                            >
                                                                <option value="Pendiente">Pendiente</option>
                                                                <option value="Justificado">Justificado</option>
                                                                <option value="Rechazado">Rechazado</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {wellbeingReports.filter(r => r.type === 'Ausencia').length === 0 && (
                                                    <tr>
                                                        <td colSpan="4" className="py-20 text-center text-gray-400 font-medium">No hay reportes de ausencia registrados.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {
                        activeTab === "circulares" && (
                            <div className="space-y-10">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-4xl font-black text-gray-800 tracking-tight">Circulares Institucionales</h2>
                                        <p className="text-gray-500 font-medium">Publica información masiva para todos los estudiantes.</p>
                                    </div>
                                    <button onClick={() => setIsCircularModalOpen(true)} className="bg-institutional-blue text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                        <PlusCircle size={20} /> Nueva Circular
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-8">
                                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 border-b border-gray-100">
                                                <tr className="text-xs font-black uppercase tracking-widest text-gray-400">
                                                    <th className="py-6 px-8">Título / Fecha</th>
                                                    <th className="py-6 px-8 text-right">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {circulares.map((circular) => (
                                                    <tr key={circular.id} className="hover:bg-blue-50/20 transition-colors">
                                                        <td className="py-6 px-8">
                                                            <div className="flex items-center gap-4">
                                                                <Megaphone className="text-institutional-blue" size={24} />
                                                                <div>
                                                                    <p className="font-black text-gray-800">{circular.title}</p>
                                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(circular.published_at).toLocaleDateString()}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-6 px-8 text-right">
                                                            <button onClick={async () => {
                                                                if (confirm('Eliminar circular?')) {
                                                                    await supabase.from('school_circulars').delete().eq('id', circular.id);
                                                                    fetchCirculares();
                                                                }
                                                            }} className="text-red-500 hover:bg-red-50 p-2 rounded-xl">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {circulares.length === 0 && (
                                                    <tr>
                                                        <td colSpan="2" className="py-10 text-center text-gray-400 font-medium">No hay circulares publicadas.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {
                        activeTab === "gallery" && (
                            <div className="space-y-10">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-4xl font-black text-gray-800 tracking-tight">Galería Institucional</h2>
                                        <p className="text-gray-500 font-medium">Gestiona las fotos que se muestran en la sección pública.</p>
                                    </div>
                                    <button onClick={() => setIsGalleryModalOpen(true)} className="bg-institutional-blue text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                        <PlusCircle size={20} /> Añadir Foto
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {gallery.map((photo) => (
                                        <div key={photo.id} className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden group">
                                            <div className="aspect-video relative overflow-hidden">
                                                <img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                    <button onClick={() => handleDeleteGallery(photo.id)} className="p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors">
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h4 className="font-black text-gray-800 text-lg line-clamp-1">{photo.title}</h4>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{new Date(photo.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {gallery.length === 0 && (
                                        <div className="col-span-full py-20 text-center text-gray-400 font-medium">No hay fotos en la galería aún.</div>
                                    )}
                                </div>
                            </div>
                        )
                    }

                    {
                        activeTab === "news" && (
                            <div className="space-y-10">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-4xl font-black text-gray-800 tracking-tight">Noticias y Eventos</h2>
                                        <p className="text-gray-500 font-medium">Mantén informada a la comunidad sobre los últimos sucesos.</p>
                                    </div>
                                    <button onClick={() => { setEditingNews(null); setIsNewsModalOpen(true); }} className="bg-institutional-magenta text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                        <PlusCircle size={20} /> Nueva Noticia
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 gap-8">
                                    {news.map((item) => (
                                        <div key={item.id} className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row gap-8 hover:shadow-md transition-shadow">
                                            {item.image_url && (
                                                <div className="w-full md:w-64 h-48 rounded-3xl overflow-hidden flex-shrink-0">
                                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="flex-1 space-y-4">
                                                <div>
                                                    <h4 className="text-2xl font-black text-gray-800">{item.title}</h4>
                                                    <p className="text-[10px] text-institutional-magenta font-black uppercase tracking-widest mt-1">Publicado el {new Date(item.published_at).toLocaleDateString()}</p>
                                                </div>
                                                <p className="text-gray-600 font-medium line-clamp-3 leading-relaxed">{item.content}</p>
                                                <div className="flex gap-4 pt-2">
                                                    <button onClick={() => { setEditingNews(item); setIsNewsModalOpen(true); }} className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-2">
                                                        <Edit size={14} /> Editar
                                                    </button>
                                                    <button onClick={() => handleDeleteNews(item.id)} className="px-6 py-2.5 bg-red-50 text-red-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center gap-2">
                                                        <Trash2 size={14} /> Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {news.length === 0 && (
                                        <div className="py-20 text-center text-gray-400 font-medium">No hay noticias publicadas aún.</div>
                                    )}
                                </div>
                            </div>
                        )
                    }

                    {
                        activeTab === "academic" && (
                            <div className="space-y-10">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-4xl font-black text-gray-800 tracking-tight">Supervisión Académica</h2>
                                        <p className="text-gray-500 font-medium">Monitorea el material subido por docentes y publica documentos oficiales.</p>
                                    </div>
                                    <button onClick={() => setIsActivityModalOpen(true)} className="bg-institutional-blue text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                        <PlusCircle size={20} /> Asignar Actividad a A Distancia
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-8">
                                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                            <h3 className="font-black text-gray-800 uppercase tracking-tighter">Material Reciente Asignado</h3>
                                            <span className="text-[10px] font-black bg-blue-50 text-institutional-blue px-3 py-1 rounded-full">VISTA DE RECTORÍA</span>
                                        </div>
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 border-b border-gray-100">
                                                <tr className="text-xs font-black uppercase tracking-widest text-gray-400">
                                                    <th className="py-6 px-8">Actividad / Título</th>
                                                    <th className="py-6 px-8">Grado</th>
                                                    <th className="py-6 px-8">Fecha Límite</th>
                                                    <th className="py-6 px-8 text-right">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50 text-sm">
                                                {activities.map((activity) => (
                                                    <tr key={activity.id} className="hover:bg-blue-50/20 transition-colors">
                                                        <td className="py-6 px-8">
                                                            <div className="flex items-center gap-3">
                                                                <FileCode className="text-institutional-blue" size={20} />
                                                                <div>
                                                                    <p className="font-black text-gray-800">{activity.title}</p>
                                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(activity.created_at).toLocaleDateString()}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-6 px-8 font-bold text-gray-500 text-xs">{activity.grado || 'Todos'}</td>
                                                        <td className="py-6 px-8">
                                                            {activity.due_date ? (
                                                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${new Date(activity.due_date) < new Date() ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                                    {new Date(activity.due_date).toLocaleDateString('es-CO')}
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs text-gray-300">Sin límite</span>
                                                            )}
                                                        </td>
                                                        <td className="py-6 px-8 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button onClick={() => {
                                                                    fetchSubmissions(activity.id);
                                                                }} className="text-purple-600 hover:bg-purple-50 px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1">
                                                                    <FolderCheck size={14} /> Entregas
                                                                </button>
                                                                <button onClick={() => {
                                                                    setEditingGrade(null);
                                                                    setGradeActivityTitle(activity.title);
                                                                    setIsGradeModalOpen(true);
                                                                }} className="text-institutional-blue hover:bg-blue-50 px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1">
                                                                    <Star size={14} /> Calificar
                                                                </button>
                                                                <button onClick={async () => {
                                                                    if (confirm('Eliminar actividad?')) {
                                                                        await supabase.from('school_activities').delete().eq('id', activity.id);
                                                                        fetchActivities();
                                                                    }
                                                                }} className="text-red-500 hover:bg-red-50 p-2 rounded-xl">
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {activities.length === 0 && (
                                                    <tr>
                                                        <td colSpan="3" className="py-10 text-center text-gray-400 font-medium">No hay actividades publicadas.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {
                        activeTab === "leads" && (
                            <div className="space-y-10">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-4xl font-black text-gray-800 tracking-tight">Estudiantes Interesados</h2>
                                        <p className="text-gray-500 font-medium">Gestiona los interesados que la IA ha capturado en el sitio web.</p>
                                    </div>
                                    <button onClick={() => { setEditingStudent(null); setIsStudentModalOpen(true); }} className="bg-institutional-blue text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                        <PlusCircle size={20} /> Registrar Estudiante Manual
                                    </button>
                                </div>

                                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr className="text-xs font-black uppercase tracking-widest text-gray-400">
                                                <th className="py-6 px-8">Interesado</th>
                                                <th className="py-6 px-8">Contacto</th>
                                                <th className="py-6 px-8">Interés Detallado</th>
                                                <th className="py-6 px-8">Fecha</th>
                                                <th className="py-6 px-8 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {leads.map(lead => (
                                                <tr key={lead.id} className="hover:bg-blue-50/20 transition-colors">
                                                    <td className="py-6 px-8 font-black text-gray-800">{lead.nombre || 'Interesado Anónimo'}</td>
                                                    <td className="py-6 px-8 font-bold text-gray-500">{lead.telefono}</td>
                                                    <td className="py-6 px-8 font-medium text-gray-600 italic">"{lead.interes}"</td>
                                                    <td className="py-6 px-8 text-xs font-bold text-gray-400 uppercase">{new Date(lead.created_at).toLocaleDateString()}</td>
                                                    <td className="py-6 px-8 text-right flex gap-2 justify-end items-center">
                                                        {lead.estado !== 'Matriculado' ? (
                                                            ['admin', 'secretary', 'coordinator'].includes(userRole) && (
                                                                <button
                                                                    className="bg-institutional-blue text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-1"
                                                                    onClick={() => handleFormalizeStudent(lead)}
                                                                >
                                                                    <PlusCircle size={14} /> Matricular
                                                                </button>
                                                            )
                                                        ) : (
                                                            <span className="text-[10px] bg-gray-100 text-gray-500 font-black px-3 py-1 rounded-full uppercase">Completado</span>
                                                        )}
                                                        <a
                                                            href={`https://wa.me/57${lead.telefono?.replace(/\s/g, "")}`}
                                                            target="_blank"
                                                            className="bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-green-500/20 hover:scale-105 transition-all inline-block"
                                                        >
                                                            WhatsApp
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {leads.length === 0 && <div className="p-20 text-center text-gray-400 font-medium">No hay estudiantes interesados registrados aún.</div>}
                                </div>
                            </div>
                        )
                    }

                    {
                        activeTab === "costs" && (
                            <div className="space-y-10">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-4xl font-black text-gray-800 tracking-tight">Tarifas y Costos</h2>
                                        <p className="text-gray-500 font-medium">Gestiona los valores oficiales que se muestran en el sitio público.</p>
                                    </div>
                                    <button
                                        onClick={() => { setEditingCost(null); setIsCostModalOpen(true); }}
                                        className="bg-institutional-blue text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                                    >
                                        <PlusCircle size={20} /> Agregar Tarifa
                                    </button>
                                </div>

                                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr className="text-xs font-black uppercase tracking-widest text-gray-400">
                                                <th className="py-6 px-8">Categoría</th>
                                                <th className="py-6 px-8">Concepto</th>
                                                <th className="py-6 px-8">Valor</th>
                                                <th className="py-6 px-8 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {costs.map(cost => (
                                                <tr key={cost.id} className="hover:bg-blue-50/20 transition-colors">
                                                    <td className="py-6 px-8">
                                                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                            {cost.category}
                                                        </span>
                                                    </td>
                                                    <td className="py-6 px-8">
                                                        <p className="font-black text-gray-800">{cost.concept}</p>
                                                        {cost.description && <p className="text-[10px] text-gray-400 font-bold uppercase">{cost.description}</p>}
                                                    </td>
                                                    <td className="py-6 px-8 font-black text-institutional-magenta text-lg">{cost.value}</td>
                                                    <td className="py-6 px-8 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => { setEditingCost(cost); setIsCostModalOpen(true); }}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                                            >
                                                                <Edit size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteCost(cost.id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {costs.length === 0 && <div className="p-20 text-center text-gray-400 font-medium">No hay tarifas registradas.</div>}
                                </div>
                            </div>
                        )
                    }

                    {
                        activeTab === "settings" && schoolConfig && (
                            <div className="max-w-6xl mx-auto py-10 space-y-12">
                                {/* Encabezado de la Sección */}
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                    <div>
                                        <h2 className="text-5xl font-black text-gray-800 tracking-tighter">Configuración Institucional</h2>
                                        <p className="text-gray-500 font-medium text-lg mt-2 italic shadow-institutional-magenta/10">Personaliza la identidad, contactos y operación de tu colegio.</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-institutional-blue/5 px-6 py-3 rounded-3xl border border-institutional-blue/10">
                                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-xs font-black uppercase tracking-widest text-institutional-blue">Edición en Tiempo Real</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                                    {/* 1. Identidad y Filosofía */}
                                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 space-y-8 flex flex-col h-full">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                                                <div className="p-2 bg-institutional-magenta/10 rounded-xl">
                                                    <LayoutDashboard className="text-institutional-magenta" size={24} />
                                                </div>
                                                Filosofía e Identidad
                                            </h3>
                                            <button
                                                onClick={async () => {
                                                    setLoading(true);
                                                    const { error } = await supabase.from('schools').update({
                                                        slogan: document.getElementById('slogan').value,
                                                        telefono: document.getElementById('telefono').value,
                                                        mision: document.getElementById('mision').value,
                                                        vision: document.getElementById('vision').value
                                                    }).eq('slug', params.slug);
                                                    if (error) alert("Error: " + error.message);
                                                    else { setIsSaved(true); setTimeout(() => setIsSaved(false), 2000); fetchSchoolConfig(); }
                                                    setLoading(false);
                                                }}
                                                className="bg-institutional-blue text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                                            >
                                                <Save size={14} /> Guardar
                                            </button>
                                        </div>
                                        <div className="space-y-6 flex-1">
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Eslogan Principal</label>
                                                    <input id="slogan" type="text" defaultValue={schoolConfig.slogan} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 ring-institutional-magenta/30 outline-none" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Teléfono Institucional</label>
                                                    <input id="telefono" type="text" defaultValue={schoolConfig.telefono} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 ring-institutional-magenta/30 outline-none" />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Misión</label>
                                                    <textarea id="mision" rows={3} defaultValue={schoolConfig.mision} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 ring-institutional-magenta/30 outline-none resize-none" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Visión</label>
                                                    <textarea id="vision" rows={3} defaultValue={schoolConfig.vision} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 ring-institutional-magenta/30 outline-none resize-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Imágenes y Banners */}
                                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 space-y-8 flex flex-col h-full">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                                                <div className="p-2 bg-institutional-blue/10 rounded-xl">
                                                    <ImageIcon className="text-institutional-blue" size={24} />
                                                </div>
                                                Imagen Institucional
                                            </h3>
                                            <button
                                                onClick={async () => {
                                                    if (!bannerFile) return alert("Seleccione una imagen primero");
                                                    setLoading(true);
                                                    try {
                                                        const publicUrl = await uploadImage(bannerFile);
                                                        const { error: updateError } = await supabase.from('schools').update({ banner_url: publicUrl }).eq('slug', params.slug);
                                                        if (updateError) alert("Error DB: " + updateError.message);
                                                        else { setIsSaved(true); setTimeout(() => setIsSaved(false), 2000); setBannerFile(null); fetchSchoolConfig(); }
                                                    } catch (error) {
                                                        alert("Error subiendo: " + error.message);
                                                    }
                                                    setLoading(false);
                                                }}
                                                className="bg-institutional-magenta text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                                            >
                                                <Camera size={14} /> {bannerFile ? 'Subir Banner' : 'Cambiar'}
                                            </button>
                                        </div>
                                        <div className="space-y-6 flex-1 flex flex-col justify-center">
                                            <div className="relative group overflow-hidden rounded-[30px] bg-gray-100 aspect-video border-4 border-white shadow-xl">
                                                <img
                                                    src={bannerPreview || schoolConfig.banner_url || "/placeholder-banner.jpg"}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    alt="Vista previa banner"
                                                />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleBannerChange}
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                />
                                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                    <Camera className="text-white mb-2" size={32} />
                                                    <span className="text-white text-xs font-black uppercase tracking-widest">Click para Seleccionar</span>
                                                </div>
                                            </div>
                                            <div className="pt-4">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Formato recomendado: 1920x600px • Max 5MB</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. Redes Sociales */}
                                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 space-y-8">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                                                <div className="p-2 bg-institutional-blue/10 rounded-xl">
                                                    <Link className="text-institutional-blue" size={24} />
                                                </div>
                                                Redes Sociales
                                            </h3>
                                            <button
                                                onClick={async () => {
                                                    setLoading(true);
                                                    const fields = ['facebook_url', 'instagram_url', 'tiktok_url', 'youtube_url'];
                                                    for (const field of fields) {
                                                        const val = document.getElementById(field).value;
                                                        await supabase.from('schools').update({ [field]: val }).eq('slug', params.slug);
                                                    }
                                                    setIsSaved(true); setTimeout(() => setIsSaved(false), 2000); fetchSchoolConfig();
                                                    setLoading(false);
                                                }}
                                                className="bg-institutional-blue text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                                            >
                                                <Save size={14} /> Guardar Links
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 ml-1">Facebook</label>
                                                <input id="facebook_url" type="url" defaultValue={schoolConfig.facebook_url} placeholder="https://..." className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold text-gray-700" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-pink-600 ml-1">Instagram</label>
                                                <input id="instagram_url" type="url" defaultValue={schoolConfig.instagram_url} placeholder="https://..." className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold text-gray-700" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-800 ml-1">TikTok</label>
                                                <input id="tiktok_url" type="url" defaultValue={schoolConfig.tiktok_url} placeholder="https://..." className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold text-gray-700" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-red-600 ml-1">YouTube</label>
                                                <input id="youtube_url" type="url" defaultValue={schoolConfig.youtube_url} placeholder="https://..." className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold text-gray-700" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4. Cuentas Bancarias */}
                                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 space-y-8">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                                                <div className="p-2 bg-institutional-blue/10 rounded-xl">
                                                    <DollarSign className="text-institutional-blue" size={24} />
                                                </div>
                                                Información Bancaria
                                            </h3>
                                            <div className="flex gap-2">
                                                <button onClick={() => setBankAccounts([...bankAccounts, { nombre: '', numero: '', tipo: 'Ahorros' }])} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200">
                                                    + Añadir
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        setLoading(true);
                                                        const { error } = await supabase.from('schools').update({ bank_accounts: bankAccounts }).eq('slug', params.slug);
                                                        if (error) alert("Error: " + error.message);
                                                        else { setIsSaved(true); setTimeout(() => setIsSaved(false), 2000); fetchSchoolConfig(); }
                                                        setLoading(false);
                                                    }}
                                                    className="bg-institutional-blue text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                                                >
                                                    <Save size={14} /> Guardar
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                            {bankAccounts.map((account, index) => (
                                                <div key={index} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative group">
                                                    <button onClick={() => setBankAccounts(bankAccounts.filter((_, i) => i !== index))} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <input value={account.nombre} onChange={(e) => { const n = [...bankAccounts]; n[index].nombre = e.target.value; setBankAccounts(n); }} placeholder="Banco" className="bg-white border-none rounded-xl p-3 text-sm font-bold shadow-sm" />
                                                        <input value={account.numero} onChange={(e) => { const n = [...bankAccounts]; n[index].numero = e.target.value; setBankAccounts(n); }} placeholder="Número" className="bg-white border-none rounded-xl p-3 text-sm font-bold shadow-sm" />
                                                        <select value={account.tipo} onChange={(e) => { const n = [...bankAccounts]; n[index].tipo = e.target.value; setBankAccounts(n); }} className="bg-white border-none rounded-xl p-3 text-sm font-bold shadow-sm">
                                                            <option>Ahorros</option><option>Corriente</option><option>Nequi</option><option>Daviplata</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}
                                            {bankAccounts.length === 0 && <div className="text-center py-6 text-gray-400 font-medium italic bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">No hay cuentas.</div>}
                                        </div>
                                    </div>


                                    {/* 6. Operación: Horarios */}
                                    <div className="bg-institutional-blue rounded-[40px] shadow-xl p-10 space-y-8 text-white">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-2xl font-black flex items-center gap-3">
                                                <div className="p-2 bg-white/10 rounded-xl">
                                                    <Clock className="text-institutional-magenta" size={24} />
                                                </div>
                                                Horarios de Clases
                                            </h3>
                                            <button
                                                onClick={async () => {
                                                    setLoading(true);
                                                    const { error } = await supabase.from('schools').update({
                                                        schedule_morning: document.getElementById('sh_morning').value,
                                                        schedule_afternoon: document.getElementById('sh_afternoon').value,
                                                        schedule_saturday: document.getElementById('sh_saturday').value
                                                    }).eq('slug', params.slug);
                                                    if (error) alert("Error: " + error.message);
                                                    else { setIsSaved(true); setTimeout(() => setIsSaved(false), 2000); fetchSchoolConfig(); }
                                                    setLoading(false);
                                                }}
                                                className="bg-white text-institutional-blue px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
                                            >
                                                <Save size={14} />
                                            </button>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Jornada Mañana</label>
                                                <input id="sh_morning" type="text" defaultValue={schoolConfig.schedule_morning} className="w-full bg-white/10 border-none rounded-xl p-4 font-bold text-white placeholder:text-white/20 focus:ring-2 ring-white/30 outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Jornada Tarde</label>
                                                <input id="sh_afternoon" type="text" defaultValue={schoolConfig.schedule_afternoon} className="w-full bg-white/10 border-none rounded-xl p-4 font-bold text-white placeholder:text-white/20 focus:ring-2 ring-white/30 outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Jornada Sabatina</label>
                                                <input id="sh_saturday" type="text" defaultValue={schoolConfig.schedule_saturday} placeholder="Ej: Sábados 8:00 AM - 12:00 PM" className="w-full bg-white/10 border-none rounded-xl p-4 font-bold text-white placeholder:text-white/20 focus:ring-2 ring-white/30 outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 6.5 Información de Contacto */}
                                    <div className="col-span-full bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
                                                <div className="p-2 bg-cyan-100 rounded-xl">
                                                    <FileCode size={20} className="text-cyan-600" />
                                                </div>
                                                Información de Contacto
                                            </h3>
                                            <button
                                                onClick={async () => {
                                                    setLoading(true);
                                                    const { error } = await supabase.from('schools').update({
                                                        correo_institucional: document.getElementById('correo_inst').value,
                                                        telefono_secundario: document.getElementById('tel_secundario').value,
                                                        direccion: document.getElementById('direccion_inst').value
                                                    }).eq('slug', params.slug);
                                                    if (error) alert("Error: " + error.message);
                                                    else { setIsSaved(true); setTimeout(() => setIsSaved(false), 2000); fetchSchoolConfig(); }
                                                    setLoading(false);
                                                }}
                                                className="bg-cyan-600 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                                            >
                                                <Save size={14} /> Guardar Contacto
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-400 font-medium -mt-2">Estos datos se mostrarán en la página de <strong>Contacto</strong> del sitio web.</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Correo Institucional</label>
                                                <input id="correo_inst" type="email" defaultValue={schoolConfig.correo_institucional || ''} placeholder="info@colegio.edu.co" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 ring-cyan-200 outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Teléfono / WhatsApp Secretaría</label>
                                                <input id="tel_secundario" type="text" defaultValue={schoolConfig.telefono_secundario || ''} placeholder="321 280 8022" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 ring-cyan-200 outline-none" />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Dirección Física</label>
                                                <input id="direccion_inst" type="text" defaultValue={schoolConfig.direccion || ''} placeholder="Calle X # Y - Z, Villavicencio, Meta" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 focus:ring-2 ring-cyan-200 outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 7. Configuración de Wompi y Webhook */}
                                    <div className="col-span-full bg-gray-50 border-2 border-gray-100 rounded-[40px] p-10 space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
                                                <div className="p-2 bg-green-100 rounded-xl">
                                                    <Key size={20} className="text-green-600" />
                                                </div>
                                                Integración Wompi (Pagos en Línea)
                                            </h3>
                                            <button
                                                onClick={async () => {
                                                    setLoading(true);
                                                    const { error } = await supabase.from('schools').update({
                                                        wompi_webhook_url: document.getElementById('wompi_webhook_url').value,
                                                        wompi_webhook_secret: document.getElementById('wompi_webhook_secret').value,
                                                        wompi_url: document.getElementById('wompi_url_integration').value,
                                                        wompi_test_url: document.getElementById('wompi_test_url_integration').value
                                                    }).eq('slug', params.slug);
                                                    if (error) alert("Error: " + error.message);
                                                    else { setIsSaved(true); setTimeout(() => setIsSaved(false), 2000); fetchSchoolConfig(); }
                                                    setLoading(false);
                                                }}
                                                className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg"
                                            >
                                                <Save size={14} /> Guardar Wompi
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                                                <span className="text-blue-500 shrink-0">ℹ️</span>
                                                <p className="text-xs text-blue-800 font-medium leading-relaxed">
                                                    Copia esta URL y pégala en la configuración de <strong>Eventos/Webhooks</strong> de tu panel de Wompi. Así los pagos se registrarán automáticamente en Tesorería.
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 ml-1">
                                                    URL Webhook (para pegar en Wompi) <span className="text-[8px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Pagos Automáticos</span>
                                                </label>
                                                <div className="flex gap-2">
                                                    <input
                                                        id="wompi_webhook_url"
                                                        type="text"
                                                        readOnly
                                                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/wompi`}
                                                        className="flex-1 bg-white border border-gray-200 rounded-xl p-4 font-mono text-xs shadow-sm"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(`${window.location.origin}/api/webhooks/wompi`);
                                                            alert('URL copiada al portapapeles');
                                                        }}
                                                        className="bg-gray-800 text-white px-4 rounded-xl font-black text-xs uppercase tracking-widest"
                                                    >
                                                        Copiar
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 ml-1">
                                                    Secreto de Webhook (Events Secret de Wompi) <span className="text-[8px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Seguridad</span>
                                                </label>
                                                <input id="wompi_webhook_secret" type="password" defaultValue={schoolConfig.wompi_webhook_secret || ''} placeholder="test_events_..." className="w-full bg-white border border-gray-200 rounded-xl p-4 font-mono text-xs shadow-sm focus:ring-2 ring-green-200 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 ml-1">
                                                    Enlace / Botón de Pago Wompi <span className="text-[8px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Público (Producción)</span>
                                                </label>
                                                <input id="wompi_url_integration" type="url" defaultValue={schoolConfig.wompi_url || ''} placeholder="Ej: https://checkout.wompi.co/l/..." className="w-full bg-white border border-gray-200 rounded-xl p-4 font-mono text-xs shadow-sm focus:ring-2 ring-green-200 transition-all font-bold text-gray-800" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 ml-1">
                                                    Enlace / Botón de Pago Wompi de Prueba <span className="text-[8px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Test / Pruebas</span>
                                                </label>
                                                <input id="wompi_test_url_integration" type="url" defaultValue={schoolConfig.wompi_test_url || ''} placeholder="Ej: https://checkout.wompi.co/l/test_..." className="w-full bg-white border border-gray-200 rounded-xl p-4 font-mono text-xs shadow-sm focus:ring-2 ring-amber-200 transition-all font-bold text-gray-800" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 8. Configuración de Grados y Niveles */}
                                    <div className="col-span-full bg-white border-2 border-gray-100 rounded-[40px] p-10 space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
                                                <div className="p-2 bg-purple-100 rounded-xl">
                                                    <GraduationCap size={20} className="text-purple-600" />
                                                </div>
                                                Grados y Niveles Académicos
                                            </h3>
                                            <button
                                                onClick={async () => {
                                                    setLoading(true);
                                                    const gradesText = document.getElementById('school_grades').value;
                                                    const gradesArray = gradesText.split('\n').map(g => g.trim()).filter(Boolean);
                                                    const { error } = await supabase.from('schools').update({
                                                        grados_config: gradesArray
                                                    }).eq('slug', params.slug);
                                                    if (error) alert("Error: " + error.message);
                                                    else { setIsSaved(true); setTimeout(() => setIsSaved(false), 2000); fetchSchoolConfig(); }
                                                    setLoading(false);
                                                }}
                                                className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg"
                                            >
                                                <Save size={14} /> Guardar Grados
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex gap-3">
                                                <span className="text-purple-500 shrink-0">📋</span>
                                                <p className="text-xs text-purple-800 font-medium leading-relaxed">
                                                    Escribe un grado por línea. Estos grados estarán disponibles al registrar estudiantes, asignar actividades y en los filtros de circulares.
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Listado de Grados (uno por línea)</label>
                                                <textarea
                                                    id="school_grades"
                                                    rows={12}
                                                    defaultValue={(schoolConfig.grados_config || [
                                                        'Prejardín', 'Jardín', 'Transición',
                                                        'Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto',
                                                        'Sexto', 'Séptimo', 'Octavo', 'Noveno',
                                                        'Décimo', 'Once'
                                                    ]).join('\n')}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 font-bold text-sm text-gray-700 focus:ring-2 ring-purple-200 transition-all leading-relaxed"
                                                    placeholder="Prejardín&#10;Transición&#10;Primero&#10;Segundo..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 9. Contenido Legal */}
                                    <div className="col-span-full bg-gradient-to-br from-slate-50 to-white border-2 border-gray-100 rounded-[40px] p-10 space-y-8">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
                                                <div className="p-2 bg-rose-100 rounded-xl">
                                                    <FileText size={20} className="text-rose-600" />
                                                </div>
                                                Documentos Legales
                                            </h3>
                                            <button
                                                onClick={async () => {
                                                    setLoading(true);
                                                    const updates = {};
                                                    const habeas = document.getElementById('legal_habeas');
                                                    const priv = document.getElementById('legal_privacidad');
                                                    const imagen = document.getElementById('legal_imagen');
                                                    const terminos = document.getElementById('legal_terminos');
                                                    if (habeas) updates.legal_habeas_data = habeas.value;
                                                    if (priv) updates.legal_privacidad = priv.value;
                                                    if (imagen) updates.legal_uso_imagen = imagen.value;
                                                    if (terminos) updates.legal_terminos = terminos.value;
                                                    const { error } = await supabase.from('schools').update(updates).eq('slug', params.slug);
                                                    if (error) alert("Error: " + error.message);
                                                    else { setIsSaved(true); setTimeout(() => setIsSaved(false), 2000); fetchSchoolConfig(); }
                                                    setLoading(false);
                                                }}
                                                className="bg-rose-600 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2"
                                            >
                                                <Save size={14} /> Guardar Legal
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-400 font-medium -mt-4">Edita el contenido que se muestra en la página <strong>/legal</strong>. Se incluyen plantillas por defecto basadas en la ley colombiana.</p>

                                        <div className="space-y-6">
                                            <details className="group">
                                                <summary className="cursor-pointer font-black text-sm text-gray-700 flex items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all">
                                                    🛡️ Habeas Data <span className="text-[10px] font-bold text-blue-500 ml-auto group-open:hidden">Expandir</span>
                                                </summary>
                                                <textarea id="legal_habeas" rows={10} defaultValue={schoolConfig.legal_habeas_data || ''} placeholder="Deja vacío para usar la plantilla por defecto..." className="w-full mt-3 bg-white border border-gray-200 rounded-xl p-4 text-xs text-gray-600 font-medium focus:ring-2 ring-blue-200 transition-all leading-relaxed" />
                                            </details>

                                            <details className="group">
                                                <summary className="cursor-pointer font-black text-sm text-gray-700 flex items-center gap-2 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all">
                                                    📋 Política de Privacidad <span className="text-[10px] font-bold text-emerald-500 ml-auto group-open:hidden">Expandir</span>
                                                </summary>
                                                <textarea id="legal_privacidad" rows={10} defaultValue={schoolConfig.legal_privacidad || ''} placeholder="Deja vacío para usar la plantilla por defecto..." className="w-full mt-3 bg-white border border-gray-200 rounded-xl p-4 text-xs text-gray-600 font-medium focus:ring-2 ring-emerald-200 transition-all leading-relaxed" />
                                            </details>

                                            <details className="group">
                                                <summary className="cursor-pointer font-black text-sm text-gray-700 flex items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all">
                                                    📸 Uso de Imagen <span className="text-[10px] font-bold text-purple-500 ml-auto group-open:hidden">Expandir</span>
                                                </summary>
                                                <textarea id="legal_imagen" rows={10} defaultValue={schoolConfig.legal_uso_imagen || ''} placeholder="Deja vacío para usar la plantilla por defecto..." className="w-full mt-3 bg-white border border-gray-200 rounded-xl p-4 text-xs text-gray-600 font-medium focus:ring-2 ring-purple-200 transition-all leading-relaxed" />
                                            </details>

                                            <details className="group">
                                                <summary className="cursor-pointer font-black text-sm text-gray-700 flex items-center gap-2 p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all">
                                                    ⚖️ Términos y Condiciones <span className="text-[10px] font-bold text-amber-500 ml-auto group-open:hidden">Expandir</span>
                                                </summary>
                                                <textarea id="legal_terminos" rows={10} defaultValue={schoolConfig.legal_terminos || ''} placeholder="Deja vacío para usar la plantilla por defecto..." className="w-full mt-3 bg-white border border-gray-200 rounded-xl p-4 text-xs text-gray-600 font-medium focus:ring-2 ring-amber-200 transition-all leading-relaxed" />
                                            </details>

                                            <details className="group">
                                                <summary className="cursor-pointer font-black text-sm text-gray-700 flex items-center gap-2 p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition-all">
                                                    🏆 Certificados y Resoluciones <span className="text-[10px] font-bold text-rose-500 ml-auto group-open:hidden">Expandir</span>
                                                </summary>
                                                <div className="mt-3 space-y-4">
                                                    <p className="text-xs text-gray-500 font-medium">Sube archivos PDF (resoluciones, certificados). Aparecerán en la página <strong>/legal</strong> para descarga.</p>
                                                    <div className="flex gap-2">
                                                        <input id="cert_nombre" type="text" placeholder="Nombre del certificado..." className="flex-1 bg-white border border-gray-200 rounded-xl p-3 text-xs font-bold focus:ring-2 ring-rose-200" />
                                                        <input id="cert_url" type="text" placeholder="URL del archivo PDF..." className="flex-1 bg-white border border-gray-200 rounded-xl p-3 text-xs font-bold focus:ring-2 ring-rose-200" />
                                                        <button
                                                            onClick={async () => {
                                                                const nombre = document.getElementById('cert_nombre').value.trim();
                                                                const url = document.getElementById('cert_url').value.trim();
                                                                if (!nombre || !url) return alert('Completa nombre y URL del certificado');
                                                                const updated = [...(schoolConfig.legal_certificados || []), { nombre, url }];
                                                                const { error } = await supabase.from('schools').update({ legal_certificados: updated }).eq('slug', params.slug);
                                                                if (error) alert('Error: ' + error.message);
                                                                else { document.getElementById('cert_nombre').value = ''; document.getElementById('cert_url').value = ''; setIsSaved(true); setTimeout(() => setIsSaved(false), 2000); fetchSchoolConfig(); }
                                                            }}
                                                            className="bg-rose-600 text-white px-4 rounded-xl font-black text-xs"
                                                        >+</button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {(schoolConfig.legal_certificados || []).map((cert, i) => (
                                                            <div key={i} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-3">
                                                                <div className="flex items-center gap-3">
                                                                    <Award size={16} className="text-rose-500" />
                                                                    <div>
                                                                        <p className="text-xs font-bold text-gray-800">{cert.nombre}</p>
                                                                        <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{cert.url}</p>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={async () => {
                                                                        const updated = (schoolConfig.legal_certificados || []).filter((_, idx) => idx !== i);
                                                                        await supabase.from('schools').update({ legal_certificados: updated }).eq('slug', params.slug);
                                                                        fetchSchoolConfig();
                                                                    }}
                                                                    className="text-red-400 hover:text-red-600"
                                                                ><Trash2 size={14} /></button>
                                                            </div>
                                                        ))}
                                                        {(!schoolConfig.legal_certificados || schoolConfig.legal_certificados.length === 0) && (
                                                            <p className="text-xs text-gray-400 italic text-center py-4">No hay certificados aún. Agrega el primero arriba.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </details>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* ==================== ESTUDIANTES ==================== */}
                    {
                        activeTab === "students" && (
                            <div className="space-y-10">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-4xl font-black text-gray-800 tracking-tight">Gestión Estudiantil</h2>
                                        <p className="text-gray-500 font-medium">{students.length} estudiantes registrados</p>
                                    </div>
                                    <div></div>
                                </div>
                                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8">
                                    <div className="flex flex-col md:flex-row gap-6 mb-10">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Buscar por nombre o documento..."
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <select
                                            className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={filterGrado}
                                            onChange={(e) => setFilterGrado(e.target.value)}
                                        >
                                            <option value="">Todos los Grados</option>
                                            {/* Grados únicos extraídos de los estudiantes reales */}
                                            {[...new Set(students.map(s => s.grado).filter(Boolean))].sort().map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                        <select
                                            className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={filterModalidad}
                                            onChange={(e) => setFilterModalidad(e.target.value)}
                                        >
                                            <option value="">Todas las Modalidades</option>
                                            <option value="Presencial">Presencial</option>
                                            <option value="A Distancia">A Distancia</option>
                                            <option value="Sabatina">Sabatina</option>
                                        </select>
                                    </div>

                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                                                <th className="pb-6 px-4">Estudiante</th>
                                                <th className="pb-6 px-4">Email</th>
                                                <th className="pb-6 px-4">Modalidad</th>
                                                <th className="pb-6 px-4">Grado</th>
                                                <th className="pb-6 px-4">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students
                                                .filter(s =>
                                                    (s.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) || s.numero_documento?.includes(searchQuery)) &&
                                                    (filterGrado === '' || s.grado === filterGrado) &&
                                                    (filterModalidad === '' || s.modalidad === filterModalidad)
                                                )
                                                .map(student => (
                                                    <tr key={student.id} className="border-b border-gray-50">
                                                        <td className="py-4 px-4 font-bold">{student.nombre}</td>
                                                        <td className="py-4 px-4 text-gray-500 text-sm">{student.email}</td>
                                                        <td className="py-4 px-4">
                                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${student.modalidad === 'Presencial' ? 'bg-blue-50 text-blue-600' :
                                                                student.modalidad === 'A Distancia' ? 'bg-institutional-magenta/10 text-institutional-magenta' :
                                                                    'bg-amber-50 text-amber-600'
                                                                }`}>
                                                                {student.modalidad || 'N/A'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 text-sm font-bold text-gray-600">{student.grado}</td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex gap-3">
                                                                <button onClick={() => {
                                                                    setViewingStudentDetails(student);
                                                                    setStudentObservaciones([]);
                                                                    // Cargar observaciones del estudiante
                                                                    (async () => {
                                                                        const { data } = await supabase
                                                                            .from('student_observations')
                                                                            .select('*, profiles:created_by(nombre, rol)')
                                                                            .eq('student_id', student.id)
                                                                            .order('created_at', { ascending: false });
                                                                        setStudentObservaciones(data || []);
                                                                    })();
                                                                }} className="text-amber-600 text-sm font-bold flex items-center gap-1 hover:text-amber-700 transition-colors">
                                                                    <ClipboardList size={14} /> Detalles
                                                                </button>
                                                                {['admin', 'secretary', 'coordinator', 'coordinador_academico', 'superadmin', 'bursar'].includes(userRole) && (
                                                                    <button onClick={() => {
                                                                        setEditingStudent(student);
                                                                        setFormModalidad(student.modalidad || '');
                                                                        setIsStudentModalOpen(true);
                                                                    }} className="text-blue-500 text-sm font-bold hover:text-blue-700 transition-colors">Editar</button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                    {students.length === 0 && <div className="text-center py-10 text-gray-400 font-medium">No hay estudiantes.</div>}
                                </div>
                            </div>
                        )
                    }

                    {/* Modal: Estudiante - Captura Completa */}
                    {
                        isStudentModalOpen && (
                            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-institutional-blue/40 backdrop-blur-md animate-in fade-in duration-200">
                                <form onSubmit={editingStudent ? handleEditStudent : handleCreateStudent} className="bg-white w-full max-w-[95vw] lg:max-w-7xl max-h-[90vh] rounded-[40px] shadow-2xl p-8 lg:p-10 relative animate-in zoom-in-95 duration-300 overflow-y-auto flex flex-col">
                                    <button type="button" onClick={() => { setIsStudentModalOpen(false); setEditingStudent(null); setLeadToFormalize(null); }} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-xl transition-colors z-10 w-10 h-10 flex items-center justify-center">
                                        <X size={24} className="text-gray-400" />
                                    </button>
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                                            <Users size={28} className="text-institutional-blue" />
                                            {editingStudent ? 'Editar Estudiante' : 'Nuevo Estudiante'}
                                        </h3>
                                        <p className="text-sm text-gray-500 font-medium mt-1">Captura completa de datos estudiantiles, médicos y acudiente</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
                                        {/* ======= COLUMNA 1: PERSONALES Y ACADEMICOS ======= */}
                                        <div className="space-y-5">
                                            {/* Datos Personales */}
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3 flex items-center gap-2">👤 Datos Personales</h4>
                                                <div className="bg-blue-50/50 rounded-2xl p-5 space-y-3">
                                                    {/* Foto de Perfil */}
                                                    <div className="flex justify-center mb-4">
                                                        <div className="relative group">
                                                            <div className="w-24 h-24 rounded-full bg-white border-4 border-blue-100 shadow-md overflow-hidden flex items-center justify-center">
                                                                {editingStudent?.public_photo_url ? (
                                                                    <img src={editingStudent.public_photo_url} className="w-full h-full object-cover" alt="Perfil" />
                                                                ) : (
                                                                    <User size={40} className="text-gray-300" />
                                                                )}
                                                            </div>
                                                            <input
                                                                type="file"
                                                                name="photo_file"
                                                                id="student_photo_input"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(e) => {
                                                                    if (e.target.files[0]) {
                                                                        const reader = new FileReader();
                                                                        reader.onload = (event) => {
                                                                            const img = e.target.parentElement.querySelector('img') || document.createElement('img');
                                                                            img.src = event.target.result;
                                                                            img.className = "w-full h-full object-cover";
                                                                            if (!e.target.parentElement.querySelector('img')) {
                                                                                e.target.parentElement.querySelector('.lucide-user').replaceWith(img);
                                                                            }
                                                                        };
                                                                        reader.readAsDataURL(e.target.files[0]);
                                                                    }
                                                                }}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => document.getElementById('student_photo_input').click()}
                                                                className="absolute bottom-0 right-0 bg-institutional-blue text-white p-2 rounded-full shadow-lg hover:scale-110 transition-all border-2 border-white"
                                                            >
                                                                <Camera size={14} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nombre Completo *</label>
                                                        <input name="nombre" required defaultValue={editingStudent?.nombre || leadToFormalize?.nombre} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nombres y Apellidos" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tipo Doc.</label>
                                                            <select name="tipo_documento" defaultValue={editingStudent?.tipo_documento || ''} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                                                <option value="">—</option>
                                                                <option value="TI">T.I.</option>
                                                                <option value="CC">C.C.</option>
                                                                <option value="CE">C.E.</option>
                                                                <option value="RC">R.C.</option>
                                                                <option value="PA">Pasaporte</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">N° Documento</label>
                                                            <input name="numero_documento" defaultValue={editingStudent?.numero_documento} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="1234567890" />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fecha Nac.</label>
                                                            <input name="fecha_nacimiento" type="date" defaultValue={editingStudent?.fecha_nacimiento} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dirección</label>
                                                            <input name="direccion" defaultValue={editingStudent?.direccion} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Calle / Barrio" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Datos Académicos */}
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-purple-600 mb-3 flex items-center gap-2">🎓 Datos Académicos</h4>
                                                <div className="bg-purple-50/50 rounded-2xl p-5 space-y-3">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Académico *</label>
                                                        <input name="email" type="email" required={!editingStudent} readOnly={!!editingStudent} defaultValue={editingStudent?.email || leadToFormalize?.email || (leadToFormalize ? leadToFormalize.nombre.toLowerCase().replace(/\s/g, '.') + '@colegio.com' : '')} className={`w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-purple-500 outline-none ${editingStudent ? 'bg-gray-50 text-gray-500' : ''}`} placeholder="estudiante@colegio.edu.co" />
                                                    </div>
                                                    {!editingStudent && (
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contraseña *</label>
                                                            <div className="relative">
                                                                <input name="password" type={showPassword ? 'text' : 'password'} defaultValue={leadToFormalize?.telefono || "Estudiante2026*"} className="w-full bg-white border border-gray-200 rounded-xl p-3 pr-12 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
                                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Modalidad *</label>
                                                            <select name="modalidad" required defaultValue={editingStudent?.modalidad || leadToFormalize?.modalidad || ''}
                                                                onChange={(e) => setFormModalidad(e.target.value)}
                                                                className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-purple-500 outline-none">
                                                                <option value="">Seleccionar...</option>
                                                                <option value="Presencial">Presencial</option>
                                                                <option value="Sabatina">Sabatina</option>
                                                                <option value="A Distancia">A Distancia</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Grado *</label>
                                                            <select name="grado" required defaultValue={editingStudent?.grado || leadToFormalize?.grado || ''} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-purple-500 outline-none">
                                                                <option value="">Seleccionar...</option>
                                                                {(formModalidad === 'Sabatina' || formModalidad === 'A Distancia' || (editingStudent?.modalidad === 'Sabatina' || editingStudent?.modalidad === 'A Distancia' && !formModalidad)) ? (
                                                                    <>
                                                                        <option value="6-7">6-7</option>
                                                                        <option value="8-9">8-9</option>
                                                                        <option value="10-11">10-11</option>
                                                                    </>
                                                                ) : (
                                                                    (schoolConfig?.grados?.length > 0 ? schoolConfig.grados : ['Pre-jardín', 'Jardín', 'Transición', '1°', '2°', '3°', '4°', '5°', '6°', '7°', '8°', '9°', '10°', '11°']).map(g => (
                                                                        <option key={g} value={g}>{g}</option>
                                                                    ))
                                                                )}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ======= COLUMNA 2: MEDICOS Y ACUDIENTE ======= */}
                                        <div className="space-y-5">
                                            {/* Datos Médicos */}
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-rose-600 mb-3 flex items-center gap-2">⚕️ Datos Médicos</h4>
                                                <div className="bg-rose-50/50 rounded-2xl p-5 space-y-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Grupo Sanguíneo</label>
                                                            <select name="grupo_sanguineo" defaultValue={editingStudent?.grupo_sanguineo || ''} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-rose-500 outline-none">
                                                                <option value="">—</option>
                                                                <option>O+</option><option>O-</option><option>A+</option><option>A-</option>
                                                                <option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">EPS / Salud</label>
                                                            <input name="eps_salud" defaultValue={editingStudent?.eps_salud} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-rose-500 outline-none" placeholder="Sanitas..." />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Alergias</label>
                                                        <textarea name="alergias" defaultValue={editingStudent?.alergias} rows={2} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-rose-500 outline-none" placeholder="Ninguna..." />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Condiciones Médicas</label>
                                                        <textarea name="condiciones_medicas" defaultValue={editingStudent?.condiciones_medicas} rows={2} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-rose-500 outline-none" placeholder="Asma..." />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Acudiente */}
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-2">👨‍👩‍👧 Acudiente / Familia</h4>
                                                <div className="bg-emerald-50/50 rounded-2xl p-5 space-y-3">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">¿Menor de edad?</label>
                                                        <button type="button" onClick={() => setEsMenor(!esMenor)}
                                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${esMenor ? 'bg-emerald-500 text-white' : 'bg-white border border-gray-200 text-gray-500'}`}>
                                                            {esMenor ? 'Sí — Obligatorio' : 'No — Opcional'}
                                                        </button>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nombre Acudiente {esMenor && '*'}</label>
                                                        <input name="acudiente_nombre" required={esMenor} defaultValue={editingStudent?.acudiente_nombre || leadToFormalize?.acudiente_nombre} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Nombre completo" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Parentesco</label>
                                                            <select name="acudiente_parentesco" defaultValue={editingStudent?.acudiente_parentesco || leadToFormalize?.acudiente_parentesco || ''} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                                                                <option value="">—</option>
                                                                <option>Madre</option><option>Padre</option><option>Abuelo/a</option>
                                                                <option>Tío/a</option><option>Hermano/a</option><option>Otro</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Teléfono {esMenor && '*'}</label>
                                                            <input type="tel" name="acudiente_telefono" required={esMenor} defaultValue={editingStudent?.acudiente_telefono || leadToFormalize?.telefono} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="300 123 4567" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Acudiente</label>
                                                        <input name="acudiente_email" type="email" defaultValue={editingStudent?.acudiente_email || leadToFormalize?.email} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="acudiente@email.com" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ======= COLUMNA 3: DOCUMENTOS Y OBS ======= */}
                                        <div className="space-y-5">
                                            {/* Documentos Entregados */}
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-amber-600 mb-3 flex items-center gap-2">📋 Documentación</h4>
                                                <div className="bg-amber-50/50 rounded-2xl p-5">
                                                    <div className="grid grid-cols-1 gap-2.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                                        {documentosRequeridos.map(doc => (
                                                            <label key={doc} className="flex items-start gap-3 cursor-pointer group">
                                                                <input type="checkbox" data-doc={doc} defaultChecked={editingStudent?.documentos_entregados?.[doc]} className="w-4 h-4 mt-0.5 rounded border-gray-300 text-amber-500 focus:ring-amber-500 shadow-sm" />
                                                                <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 transition-colors leading-tight">{doc}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Observaciones Administrativas */}
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">📝 Notas Privadas</h4>
                                                <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-5">
                                                    <textarea
                                                        name="observaciones"
                                                        defaultValue={editingStudent?.observaciones}
                                                        rows={5}
                                                        className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-gray-300 outline-none transition-all resize-none"
                                                        placeholder="Notas sobre el proceso de matrícula, convenios comerciales, descuentos o reportes generales..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botones */}
                                    <div className="flex gap-4 mt-6 sticky bottom-0 bg-white pt-4 border-t border-gray-100">
                                        <button type="button" onClick={() => { setIsStudentModalOpen(false); setEditingStudent(null); setLeadToFormalize(null); }} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">Cancelar</button>
                                        <button type="submit" disabled={loading} className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${loading ? 'bg-gray-400' : 'bg-institutional-blue shadow-blue-500/20 hover:scale-[1.02]'}`}>
                                            {loading ? 'Guardando...' : editingStudent ? 'Actualizar Estudiante' : 'Crear Estudiante'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )
                    }

                    {/* Modal: Detalles del Estudiante / Libro de Observaciones */}
                    {
                        viewingStudentDetails && (
                            <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-institutional-blue/40 backdrop-blur-md animate-in fade-in duration-200">
                                <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-[40px] shadow-2xl relative animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col">
                                    {/* Header */}
                                    <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-institutional-blue/5 to-institutional-magenta/5 flex-shrink-0">
                                        <button type="button" onClick={() => setViewingStudentDetails(null)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-xl transition-colors z-10">
                                            <X size={24} className="text-gray-400" />
                                        </button>
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-institutional-blue/10 rounded-3xl flex items-center justify-center text-institutional-blue font-black text-2xl overflow-hidden">
                                                {viewingStudentDetails.public_photo_url ? (
                                                    <img src={viewingStudentDetails.public_photo_url} className="w-full h-full object-cover" alt="Perfil" />
                                                ) : (
                                                    viewingStudentDetails.nombre?.[0] || 'E'
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-800">{viewingStudentDetails.nombre}</h3>
                                                <div className="flex gap-3 mt-1">
                                                    <span className="text-[10px] font-black bg-institutional-blue/10 text-institutional-blue px-3 py-1 rounded-full uppercase tracking-widest">{viewingStudentDetails.grado}</span>
                                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${viewingStudentDetails.modalidad === 'Presencial' ? 'bg-blue-50 text-blue-600' : viewingStudentDetails.modalidad === 'A Distancia' ? 'bg-institutional-magenta/10 text-institutional-magenta' : 'bg-amber-50 text-amber-600'}`}>{viewingStudentDetails.modalidad || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info rápida */}
                                    <div className="px-8 pt-6 pb-2 grid grid-cols-3 gap-4 flex-shrink-0">
                                        <div className="bg-gray-50 rounded-2xl p-4 text-center">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email</p>
                                            <p className="text-xs font-bold text-gray-600 mt-1 truncate">{viewingStudentDetails.email}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-2xl p-4 text-center">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Documento</p>
                                            <p className="text-xs font-bold text-gray-600 mt-1">{viewingStudentDetails.tipo_documento} {viewingStudentDetails.numero_documento || 'N/A'}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-2xl p-4 text-center">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Acudiente</p>
                                            <p className="text-xs font-bold text-gray-600 mt-1 truncate">{viewingStudentDetails.acudiente_nombre || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Observaciones Administrativas (campo existente) */}
                                    {viewingStudentDetails.observaciones && (
                                        <div className="px-8 py-3 flex-shrink-0">
                                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">📝 Observación Administrativa</p>
                                                <p className="text-sm font-medium text-amber-800">{viewingStudentDetails.observaciones}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Libro de Observaciones */}
                                    <div className="px-8 py-4 flex-shrink-0">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-800 flex items-center gap-2 mb-4">
                                            <ClipboardList size={16} className="text-institutional-magenta" /> Libro de Observaciones
                                        </h4>
                                    </div>

                                    {/* Nueva Observación (solo admin/secretary/coordinator) */}
                                    {['admin', 'secretary', 'coordinator', 'teacher'].includes(userRole) && (
                                        <div className="px-8 pb-4 flex-shrink-0">
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    value={newObservacion}
                                                    onChange={(e) => setNewObservacion(e.target.value)}
                                                    placeholder="Escribir nueva observación..."
                                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 font-bold text-sm focus:ring-2 focus:ring-institutional-blue outline-none transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        if (!newObservacion.trim()) return;
                                                        const { data: { user: currentUser } } = await supabase.auth.getUser();
                                                        const { error } = await supabase.from('student_observations').insert([{
                                                            student_id: viewingStudentDetails.id,
                                                            school_id: school?.id,
                                                            content: newObservacion,
                                                            created_by: currentUser?.id
                                                        }]);
                                                        if (error) {
                                                            alert('Error: ' + error.message);
                                                        } else {
                                                            setNewObservacion('');
                                                            // Recargar observaciones
                                                            const { data } = await supabase
                                                                .from('student_observations')
                                                                .select('*, profiles:created_by(nombre, rol)')
                                                                .eq('student_id', viewingStudentDetails.id)
                                                                .order('created_at', { ascending: false });
                                                            setStudentObservaciones(data || []);
                                                        }
                                                    }}
                                                    className="bg-institutional-blue text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
                                                >
                                                    Agregar
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Lista de Observaciones */}
                                    <div className="px-8 pb-8 overflow-y-auto flex-1">
                                        <div className="space-y-3">
                                            {studentObservaciones.map((obs) => (
                                                <div key={obs.id} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${obs.profiles?.rol === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                                obs.profiles?.rol === 'teacher' ? 'bg-blue-100 text-blue-700' :
                                                                    obs.profiles?.rol === 'secretary' ? 'bg-green-100 text-green-700' :
                                                                        'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                {obs.profiles?.rol === 'admin' ? 'Rectoría' :
                                                                    obs.profiles?.rol === 'teacher' ? 'Docente' :
                                                                        obs.profiles?.rol === 'secretary' ? 'Secretaría' :
                                                                            obs.profiles?.rol || 'Sistema'}
                                                            </span>
                                                            <span className="text-xs font-bold text-gray-600">{obs.profiles?.nombre || 'Desconocido'}</span>
                                                        </div>
                                                        <span className="text-[10px] text-gray-400 font-bold">{new Date(obs.created_at).toLocaleDateString()} {new Date(obs.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-700 leading-relaxed">{obs.content}</p>
                                                    {obs.student_reply && (
                                                        <div className="mt-3 bg-blue-50 rounded-xl p-3 border border-blue-100">
                                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Respuesta del estudiante:</p>
                                                            <p className="text-sm font-medium text-blue-800">{obs.student_reply}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {studentObservaciones.length === 0 && (
                                                <div className="py-10 text-center text-gray-400 font-medium">
                                                    No hay observaciones registradas para este estudiante.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* Modal Galería */}
                    {
                        isGalleryModalOpen && (
                            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-institutional-blue/40 backdrop-blur-md animate-in fade-in duration-200">
                                <form onSubmit={handleSaveGallery} className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300">
                                    <button type="button" onClick={() => setIsGalleryModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                        <X size={24} className="text-gray-400" />
                                    </button>
                                    <h3 className="text-2xl font-black text-gray-800 mb-8">Subir Foto a Galería</h3>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Título de la Foto</label>
                                            <input name="title" required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="Ej. Bazar de Verano 2025" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Archivo de Imagen</label>
                                            <div className="flex gap-4">
                                                <input type="file" name="photo_file" id="gallery_photo" className="hidden" accept="image/*" required />
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('gallery_photo').click()}
                                                    className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-all group"
                                                >
                                                    <Camera size={32} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
                                                    <p className="text-xs font-bold text-gray-400 group-hover:text-blue-500 uppercase tracking-widest">Seleccionar Imagen</p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-10 flex gap-4">
                                        <button type="button" onClick={() => setIsGalleryModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest">Cancelar</button>
                                        <button type="submit" disabled={uploading} className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${uploading ? 'bg-gray-400' : 'bg-institutional-blue shadow-blue-500/20'}`}>
                                            {uploading ? 'Subiendo...' : 'Publicar en Galería'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )
                    }

                    {/* Modal Noticias */}
                    {
                        isNewsModalOpen && (
                            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-institutional-blue/40 backdrop-blur-md animate-in fade-in duration-200">
                                <form onSubmit={handleSaveNews} className="bg-white w-full max-w-2xl h-[90vh] rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300 overflow-y-auto">
                                    <button type="button" onClick={() => setIsNewsModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                        <X size={24} className="text-gray-400" />
                                    </button>
                                    <h3 className="text-2xl font-black text-gray-800 mb-8">{editingNews ? 'Editar Noticia' : 'Nueva Noticia Institucional'}</h3>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Título de la Noticia</label>
                                            <input name="title" defaultValue={editingNews?.title} required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="Ej. Gran Feria de las Ciencias" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contenido</label>
                                            <textarea name="content" defaultValue={editingNews?.content} rows="6" required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium text-gray-700" placeholder="Escribe aquí el detalle de la noticia..."></textarea>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Imagen Destacada</label>
                                            <div className="flex gap-4">
                                                <input type="file" name="photo_file" id="news_photo" className="hidden" accept="image/*" />
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('news_photo').click()}
                                                    className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center gap-2 hover:bg-magenta-50 hover:border-institutional-magenta/20 transition-all group"
                                                >
                                                    <ImageIcon size={32} className="text-gray-300 group-hover:text-institutional-magenta transition-colors" />
                                                    <p className="text-xs font-bold text-gray-400 group-hover:text-institutional-magenta uppercase tracking-widest">Cambiar o Subir Imagen</p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-10 flex gap-4">
                                        <button type="button" onClick={() => setIsNewsModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest">Cancelar</button>
                                        <button type="submit" disabled={uploading} className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${uploading ? 'bg-gray-400' : 'bg-institutional-magenta shadow-magenta-500/20'}`}>
                                            {uploading ? 'Publicando...' : (editingNews ? 'Guardar Cambios' : 'Publicar Noticia')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )
                    }

                    {/* Modal Costos */}
                    {
                        isCostModalOpen && (
                            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-institutional-blue/40 backdrop-blur-md animate-in fade-in duration-200">
                                <form onSubmit={handleSaveCost} className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300">
                                    <button type="button" onClick={() => setIsCostModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                        <X size={24} className="text-gray-400" />
                                    </button>
                                    <h3 className="text-2xl font-black text-gray-800 mb-8">{editingCost ? 'Editar Tarifa' : 'Nueva Tarifa Institucional'}</h3>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Categoría (Ej: Tarifas: Jornada Mañana)</label>
                                            <input name="category" defaultValue={editingCost?.category} required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="Tarifas: Preescolar" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Concepto</label>
                                                <input name="concept" defaultValue={editingCost?.concept} required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="Pensión" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Valor (Con símbolo)</label>
                                                <input name="value" defaultValue={editingCost?.value} required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="$ 480.000" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Descripción (Opcional)</label>
                                            <input name="description" defaultValue={editingCost?.description} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="Pago mensual por 10 meses" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Orden de Visualización</label>
                                            <input name="display_order" type="number" defaultValue={editingCost?.display_order || 0} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" />
                                        </div>
                                    </div>
                                    <div className="mt-10 flex gap-4">
                                        <button type="button" onClick={() => setIsCostModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest">Cancelar</button>
                                        <button type="submit" disabled={loading} className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${loading ? 'bg-gray-400' : 'bg-institutional-blue shadow-blue-500/20'}`}>
                                            {loading ? 'Guardando...' : 'Guardar Tarifa'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )
                    }

                    {/* Modal Circulares */}
                    {
                        isCircularModalOpen && (
                            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-institutional-blue/40 backdrop-blur-md animate-in fade-in duration-200">
                                <form onSubmit={handleSaveCircular} className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300">
                                    <button type="button" onClick={() => setIsCircularModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                        <X size={24} className="text-gray-400" />
                                    </button>
                                    <h3 className="text-2xl font-black text-gray-800 mb-2">Nueva Circular</h3>
                                    <p className="text-xs text-institutional-blue font-bold mb-8">Esta circular será visible por TODOS los estudiantes (Todas las modalidades).</p>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Título de Circular</label>
                                            <input name="title" required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="Ej: Invitación a Reunión de Padres" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contenido</label>
                                            <textarea name="content" required rows="4" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="Escriba aquí los detalles..."></textarea>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dirigido a (Categoría)</label>
                                                <select name="target_area" value={circularCategory} onChange={(e) => setCircularCategory(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700">
                                                    <option value="Todos">Todos</option>
                                                    <option value="Preescolar">Preescolar</option>
                                                    <option value="Primaria">Primaria</option>
                                                    <option value="Bachillerato">Bachillerato</option>
                                                    <option value="Sabatinas">Sabatinas</option>
                                                    <option value="A Distancia">A Distancia</option>
                                                </select>
                                            </div>
                                            {circularCategory !== 'Todos' && (
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Grado Específico</label>
                                                    <select name="target_grado" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700">
                                                        <option value="">Todos los grados de {circularCategory}</option>
                                                        {circularCategory === 'Preescolar' && (
                                                            <>{['Pre-jardín', 'Jardín', 'Transición'].map(g => <option key={g} value={g}>{g}</option>)}</>
                                                        )}
                                                        {circularCategory === 'Primaria' && (
                                                            <>{['1°', '2°', '3°', '4°', '5°'].map(g => <option key={g} value={g}>{g}</option>)}</>
                                                        )}
                                                        {circularCategory === 'Bachillerato' && (
                                                            <>{['6°', '7°', '8°', '9°', '10°', '11°'].map(g => <option key={g} value={g}>{g}</option>)}</>
                                                        )}
                                                        {circularCategory === 'Sabatinas' && (
                                                            <>{['6-7', '8-9', '10-11'].map(g => <option key={g} value={g}>{g}</option>)}</>
                                                        )}
                                                        {circularCategory === 'A Distancia' && (
                                                            <>{['Ciclo III', 'Ciclo IV', 'Ciclo V'].map(g => <option key={g} value={g}>{g}</option>)}</>
                                                        )}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Documento Adjunto (Opcional)</label>
                                            <input type="file" name="file_upload" accept=".pdf,.doc,.docx,.jpg,.png" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 text-xs" />
                                        </div>
                                    </div>
                                    <div className="mt-10 flex gap-4">
                                        <button type="button" onClick={() => setIsCircularModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest">Cancelar</button>
                                        <button type="submit" disabled={loading} className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${loading ? 'bg-gray-400' : 'bg-institutional-blue shadow-blue-500/20'}`}>
                                            {loading ? 'Publicando...' : 'Publicar a Todos'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )
                    }

                    {/* Modal Actividades A Distancia */}
                    {
                        isActivityModalOpen && (
                            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-institutional-blue/40 backdrop-blur-md animate-in fade-in duration-200">
                                <form onSubmit={handleSaveActivity} className="bg-white w-full max-w-[95vw] lg:max-w-7xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300">
                                    <button type="button" onClick={() => setIsActivityModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-xl transition-colors z-10">
                                        <X size={24} className="text-gray-400" />
                                    </button>
                                    <h3 className="text-2xl font-black text-gray-800 mb-1">Asignar Actividad</h3>
                                    <p className="text-xs text-amber-500 font-bold mb-6">Modalidad A Distancia</p>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Left Column (Spans 2) */}
                                        <div className="space-y-5 lg:col-span-2">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Título</label>
                                                <input name="title" required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="Ej: Taller 1 - Matemáticas" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Descripción / Instrucciones</label>
                                                <textarea name="description" required rows="3" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="Instrucciones para resolver la guía..."></textarea>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Grado</label>
                                                    <select name="grado" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 text-xs text-ellipsis pr-8 focus:ring-2 focus:ring-amber-200 outline-none">
                                                        <option value="">Todos (Toda la institución)</option>
                                                        <optgroup label="Sabatinas">
                                                            <option value="6-7">Grados 6-7</option>
                                                            <option value="8-9">Grados 8-9</option>
                                                            <option value="10-11">Grados 10-11</option>
                                                        </optgroup>
                                                        <optgroup label="A Distancia">
                                                            <option value="Ciclo III">Ciclo III</option>
                                                            <option value="Ciclo IV">Ciclo IV</option>
                                                            <option value="Ciclo V">Ciclo V</option>
                                                        </optgroup>
                                                        <optgroup label="Preescolar (Presencial)">
                                                            {['Pre-jardín', 'Jardín', 'Transición'].map(g => <option key={g} value={g}>{g}</option>)}
                                                        </optgroup>
                                                        <optgroup label="Primaria (Presencial)">
                                                            {['1°', '2°', '3°', '4°', '5°'].map(g => <option key={g} value={g}>{g}</option>)}
                                                        </optgroup>
                                                        <optgroup label="Bachillerato (Presencial)">
                                                            {['6°', '7°', '8°', '9°', '10°', '11°'].map(g => <option key={g} value={g}>{g}</option>)}
                                                        </optgroup>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fecha Límite</label>
                                                    <input name="due_date" type="date" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 text-xs" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Asignación</label>
                                                    <input type="date" disabled value={new Date().toISOString().split('T')[0]} className="w-full bg-gray-100 border-none rounded-2xl p-4 font-bold text-gray-400 text-xs" />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Right Column — Image */}
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Imagen / Guía / PDF</label>
                                            <input type="file" id="activity_file_input" className="hidden" accept="image/*,.pdf" onChange={(e) => {
                                                const f = e.target.files[0];
                                                if (f) { setActivityFile(f); setActivityFilePreview(f.type === 'application/pdf' ? 'PDF' : URL.createObjectURL(f)); }
                                            }} />
                                            <div
                                                onClick={() => document.getElementById('activity_file_input').click()}
                                                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-amber-500', 'bg-amber-50'); }}
                                                onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-amber-500', 'bg-amber-50'); }}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    e.currentTarget.classList.remove('border-amber-500', 'bg-amber-50');
                                                    const f = e.dataTransfer.files[0];
                                                    if (f && (f.type.startsWith('image/') || f.type === 'application/pdf')) {
                                                        setActivityFile(f);
                                                        setActivityFilePreview(f.type === 'application/pdf' ? 'PDF' : URL.createObjectURL(f));
                                                    } else {
                                                        alert('Solo se permiten imágenes o PDF.');
                                                    }
                                                }}
                                                className="w-full h-full min-h-[200px] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-amber-50/50 hover:border-amber-400 transition-all cursor-pointer group"
                                            >
                                                {activityFilePreview ? (
                                                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                                                        {activityFilePreview === 'PDF' ? (
                                                            <div className="bg-red-50 text-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-2">
                                                                <FileText size={32} />
                                                            </div>
                                                        ) : (
                                                            <img src={activityFilePreview} alt="Preview" className="w-full max-h-52 object-contain rounded-xl" />
                                                        )}
                                                        <button type="button" onClick={(e) => { e.stopPropagation(); setActivityFile(null); setActivityFilePreview(null); }}
                                                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg">
                                                            <X size={16} />
                                                        </button>
                                                        <p className="text-[10px] font-bold text-amber-600 text-center mt-2 uppercase tracking-widest truncate w-full px-4">{activityFile?.name}</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <ImageIcon size={40} className="text-gray-300 group-hover:text-amber-500 transition-colors" />
                                                        <p className="text-xs font-bold text-gray-400 group-hover:text-amber-600 uppercase tracking-widest text-center">Arrastra o haz clic</p>
                                                        <p className="text-[10px] text-gray-300 font-medium">JPG, PNG o PDF — máx. 32MB</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex gap-4">
                                        <button type="button" onClick={() => setIsActivityModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest">Cancelar</button>
                                        <button type="submit" disabled={loading} className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${loading ? 'bg-gray-400' : 'bg-amber-500 shadow-amber-500/20'}`}>
                                            {loading ? 'Asignando...' : 'Asignar a Estudiantes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )
                    }

                    {/* Modal Entregas de Actividad */}
                    {selectedActivityForSubmissions && (
                        <div className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                            <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
                                <button
                                    onClick={() => {
                                        setSelectedActivityForSubmissions(null);
                                        setSubmissionFilterStudentId(null);
                                    }}
                                    className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-400 hover:text-gray-800 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
                                >
                                    <X size={20} />
                                </button>

                                <div className="p-8 sm:p-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                                            <FolderCheck size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-gray-800">Entregas de Estudiantes</h2>
                                            <p className="text-sm text-gray-500 font-medium">Revisa la evidencia enviada para esta actividad</p>
                                        </div>
                                    </div>

                                    {(() => {
                                        const displayedSubmissions = submissionFilterStudentId
                                            ? activitySubmissions.filter(s => s.estudiante_id === submissionFilterStudentId)
                                            : activitySubmissions;

                                        return displayedSubmissions.length > 0 ? (
                                            <div className="space-y-4">
                                                {displayedSubmissions.map((sub) => (
                                                    <div key={sub.id} className="p-5 rounded-[24px] bg-gray-50 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400">
                                                                <User size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-800">{sub.profiles?.nombre || 'Estudiante Desconocido'}</p>
                                                                <div className="flex items-center gap-2 mt-1 -ml-1">
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-institutional-blue bg-blue-50 px-2 py-0.5 rounded-lg">{sub.profiles?.grado || 'N/A'}</span>
                                                                    <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                                                                        <Clock size={10} /> {new Date(sub.created_at).toLocaleString('es-CO')}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row gap-2">
                                                            <a
                                                                href={sub.archivo_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-purple-600/20 transition-all"
                                                            >
                                                                {sub.archivo_url.toLowerCase().includes('.pdf') ? <FileText size={16} /> : <ImageIcon size={16} />}
                                                                Ver Evidencia
                                                            </a>
                                                            <button
                                                                onClick={() => {
                                                                    const act = activities.find(a => a.id === selectedActivityForSubmissions);
                                                                    setEditingGrade(null);
                                                                    setSelectedStudentForGrades(sub.estudiante_id);
                                                                    setGradeActivityTitle(act ? act.title : '');
                                                                    setSelectedActivityForSubmissions(null);
                                                                    setSubmissionFilterStudentId(null);
                                                                    setActiveTab('calificaciones');
                                                                    setIsGradeModalOpen(true);
                                                                }}
                                                                className="flex items-center justify-center gap-2 bg-institutional-blue hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 transition-all"
                                                            >
                                                                <Star size={16} /> Calificar
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-16 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
                                                <FolderCheck size={48} className="mx-auto text-gray-300 mb-4" />
                                                <p className="text-lg font-bold text-gray-500">No hay entregas aún</p>
                                                <p className="text-sm text-gray-400 mt-2">Los estudiantes no han subido evidencia para esta actividad.</p>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* ===================== TAB: CALIFICACIONES ===================== */}
                    {activeTab === 'calificaciones' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-800">Gestión de Calificaciones</h2>
                                    <p className="text-gray-500 font-medium">Administra el rendimiento académico de los estudiantes</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingGrade(null);
                                        setGradeActivityTitle('');
                                        setSelectedStudentForGrades(null);
                                        setIsGradeModalOpen(true);
                                    }}
                                    className="bg-institutional-blue text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
                                >
                                    <PlusCircle size={20} /> Nueva Calificación
                                </button>
                            </div>

                            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Estudiante</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Materia</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Nota</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Periodo</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Fecha</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {grades.map((grade) => (
                                            <tr key={grade.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="p-6">
                                                    <p className="font-black text-gray-800">{grade.profiles?.nombre}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{grade.profiles?.grado}</p>
                                                </td>
                                                <td className="p-6">
                                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                        {grade.materia}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <span className={`text-lg font-black ${grade.nota >= 3.0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {grade.nota.toFixed(1)}
                                                    </span>
                                                </td>
                                                <td className="p-6">
                                                    <p className="text-sm font-bold text-gray-600">{grade.periodo}</p>
                                                </td>
                                                <td className="p-6 text-gray-500 text-sm font-medium">
                                                    {new Date(grade.fecha).toLocaleDateString()}
                                                </td>
                                                <td className="p-6 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => {
                                                                setEditingGrade(grade);
                                                                setIsGradeModalOpen(true);
                                                            }}
                                                            className="p-2 text-gray-400 hover:text-institutional-blue transition-colors"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                if (confirm('¿Eliminar esta calificación?')) {
                                                                    await supabase.from('calificaciones').delete().eq('id', grade.id);
                                                                    fetchGrades();
                                                                }
                                                            }}
                                                            className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Modal para Crear/Editar Calificación */}
                    {isGradeModalOpen && (
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                            <div className="bg-white rounded-[40px] w-full max-w-5xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    const data = {
                                        student_id: formData.get('student_id'),
                                        school_id: schoolConfig?.id,
                                        materia: formData.get('materia'),
                                        nota: parseFloat(formData.get('nota')),
                                        periodo: formData.get('periodo'),
                                        observaciones: formData.get('observaciones'),
                                        fecha: new Date().toISOString().split('T')[0]
                                    };

                                    try {
                                        if (editingGrade) {
                                            const { error } = await supabase.from('calificaciones').update(data).eq('id', editingGrade.id);
                                            if (error) throw error;
                                        } else {
                                            const { error } = await supabase.from('calificaciones').insert([data]);
                                            if (error) throw error;
                                        }
                                        setGradeActivityTitle('');
                                        setSelectedStudentForGrades(null);
                                        setIsGradeModalOpen(false);
                                        fetchGrades();
                                        alert("Calificación guardada con éxito");
                                    } catch (err) {
                                        alert("Error al guardar calificación: " + err.message);
                                    }
                                }}>
                                    <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                        <div>
                                            <h3 className="text-xl font-black text-gray-800">{editingGrade ? 'Editar Nota' : 'Nueva Calificación'}</h3>
                                            <p className="text-xs text-gray-400 font-medium">Registra el desempeño del estudiante</p>
                                        </div>
                                        <button type="button" onClick={() => setIsGradeModalOpen(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 shadow-sm">
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="p-8 space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Estudiante</label>
                                            <select name="student_id" defaultValue={selectedStudentForGrades || editingGrade?.student_id} required className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none">
                                                <option value="">Selecciona un estudiante</option>
                                                {students.map(s => <option key={s.id} value={s.id}>{s.nombre} ({s.grado})</option>)}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Materia / Actividad</label>
                                                <input name="materia" defaultValue={gradeActivityTitle || editingGrade?.materia} required placeholder="Ej: Matemáticas" className={`w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none ${gradeActivityTitle ? 'bg-blue-50 text-institutional-blue' : ''}`} readOnly={!!gradeActivityTitle} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nota (0.0 - 10.0)</label>
                                                <input name="nota" type="number" step="0.1" min="0" max="10" defaultValue={editingGrade?.nota} required className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Periodo</label>
                                            <select name="periodo" defaultValue={editingGrade?.periodo} required className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none">
                                                <option value="Periodo 1">Periodo 1</option>
                                                <option value="Periodo 2">Periodo 2</option>
                                                <option value="Periodo 3">Periodo 3</option>
                                                <option value="Periodo 4">Periodo 4</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Observaciones</label>
                                            <textarea name="observaciones" defaultValue={editingGrade?.observaciones} rows="3" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none" />
                                        </div>
                                    </div>

                                    <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex gap-4">
                                        <button type="button" onClick={() => setIsGradeModalOpen(false)} className="flex-1 bg-white text-gray-500 font-black py-4 rounded-2xl shadow-sm hover:bg-gray-50 transition-all border border-gray-100">
                                            Cancelar
                                        </button>
                                        <button type="submit" className="flex-1 bg-institutional-blue text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all">
                                            {editingGrade ? 'Actualizar' : 'Guardar Calificación'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
