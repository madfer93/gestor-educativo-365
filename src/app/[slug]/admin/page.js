"use client";

import React, { useState, useEffect } from "react";
import { mockData } from "@/data/mockData";
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();
import {
    Users, UserPlus, FileText, DollarSign, LayoutDashboard,
    Settings, LogOut, Bell, PlusCircle, Save, X, Clock, Book, GraduationCap,
    Link, Image as ImageIcon, Key, FileCode, Edit, Trash2, Camera, Loader2, Heart, Megaphone
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
    const [wellbeingReports, setWellbeingReports] = useState([]);
    const [grades, setGrades] = useState([]);
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
    const [editingGrade, setEditingGrade] = useState(null);
    const [selectedStudentForGrades, setSelectedStudentForGrades] = useState(null);

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
            const { data } = await supabase.from('school_activities').select(`*, profiles(nombre)`).eq('school_id', school.id).order('created_at', { ascending: false });
            setActivities(data || []);
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
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('rol').eq('id', user.id).single();
                if (profile) setUserRole(profile.rol);
            }
        };
        checkUser();
        fetchTeachers();
        fetchSchoolConfig();
        fetchStats();
        if (activeTab === "students") fetchStudents();
        if (activeTab === "gallery") fetchGallery();
        if (activeTab === "news") fetchNews();
        if (activeTab === "costs") fetchCosts();
        if (activeTab === "circulares") fetchCirculares();
        if (activeTab === "academic") fetchActivities();
        if (activeTab === "wellbeing") fetchWellbeingReports();
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
        return {
            nombre: fd.get('nombre'), email: fd.get('email'), grado: v('grado'), modalidad: v('modalidad'),
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
        const data = collectStudentFormData(e.target);
        const password = new FormData(e.target).get('password') || 'Estudiante2026*';
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
        const data = collectStudentFormData(e.target);
        const password = new FormData(e.target).get('password') || '';
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

        let photoUrl = formData.get('public_photo_url');
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

        const teacherData = {
            nombre: formData.get('nombre'),
            tipo_documento: v('tipo_documento'),
            numero_documento: v('numero_documento'),
            fecha_nacimiento: v('fecha_nacimiento'),
            direccion: v('direccion'),
            specialty: formData.get('specialty'),
            public_bio: v('public_bio'),
            public_photo_url: photoUrl,
            email: formData.get('email'),
            rol: formData.get('rol') || 'teacher',
            acudiente_nombre: v('acudiente_nombre'),
            acudiente_parentesco: v('acudiente_parentesco'),
            acudiente_telefono: v('acudiente_telefono'),
            acudiente_email: v('acudiente_email'),
            grupo_sanguineo: v('grupo_sanguineo'),
            eps_salud: v('eps_salud'),
            alergias: v('alergias'),
            condiciones_medicas: v('condiciones_medicas')
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
        const newsData = {
            school_id: school.id,
            title: formData.get('title'),
            content: formData.get('content'),
            image_url: imageUrl,
            published_at: new Date().toISOString()
        };

        let error;
        if (editingNews) {
            const { error: resError } = await supabase.from('school_news').update(newsData).eq('id', editingNews.id);
            error = resError;
        } else {
            const { error: resError } = await supabase.from('school_news').insert([newsData]);
            error = resError;
        }

        if (error) alert("Error: " + error.message);
        else {
            setIsNewsModalOpen(false);
            setEditingNews(null);
            fetchNews();
        }
        setUploading(false);
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

    const handleDownloadReport = () => {
        alert("Generando reporte PDF consolidado... El archivo se descargará en unos segundos.");
        // Simulación de descarga
        setTimeout(() => {
            alert("Reporte generado con éxito.");
        }, 2000);
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

        let fileUrl = '';
        const file = e.target.file_upload?.files[0];
        if (file) {
            fileUrl = `https://storage.colegiolatinoamericano.com/actividades/${file.name}`;
        }

        const { error } = await supabase.from('school_activities').insert([{
            school_id: school.id,
            title: formData.get('title'),
            description: formData.get('description'),
            grado: formData.get('grado'),
            file_url: fileUrl,
            teacher_id: admin.id // Rector emitiendo
        }]);

        if (error) alert("Error: " + error.message);
        else {
            setIsActivityModalOpen(false);
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
                    <div className="mb-10 bg-blue-900 rounded-[40px] p-12 shadow-[0_20px_50px_-12px_rgba(30,58,138,0.25)] relative overflow-hidden group border border-blue-800">
                        {/* Decoración de fondo */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

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
                                            <button onClick={() => setActiveTab('wellbeing')} className="w-full bg-red-500/30 hover:bg-red-500/40 p-5 rounded-3xl text-left border border-white/20 transition-all backdrop-blur-sm">
                                                <p className="font-black text-sm mb-1 uppercase tracking-tighter text-white">🚨 Reportar Alerta</p>
                                                <p className="text-[10px] opacity-90 text-white">Gestión de ausencias y urgencias</p>
                                            </button>
                                            <button onClick={handleDownloadReport} className="w-full bg-white/20 hover:bg-white/30 p-5 rounded-3xl text-left border border-white/20 transition-all backdrop-blur-sm">
                                                <p className="font-black text-sm mb-1 uppercase tracking-tighter">📋 Reporte Diario</p>
                                                <p className="text-[10px] opacity-70">Resumen de admisiones y pagos</p>
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
                                                    <td className="py-6 px-8">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${teacher.rol === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                            teacher.rol?.includes('coordinator') ? 'bg-blue-100 text-blue-700' :
                                                                teacher.rol === 'secretary' ? 'bg-green-100 text-green-700' :
                                                                    teacher.rol === 'treasury' ? 'bg-amber-100 text-amber-700' :
                                                                        'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {teacher.rol === 'admin' ? 'Rectoría' :
                                                                teacher.rol === 'coordinator_convivencia' ? 'Coord. Convivencia' :
                                                                    teacher.rol === 'coordinator_academic' ? 'Coord. Académico' :
                                                                        teacher.rol === 'coordinator_primary' ? 'Coord. Primaria' :
                                                                            teacher.rol === 'coordinator' ? 'Coordinación' :
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
                                        <form onSubmit={handleSaveTeacher} className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300 overflow-y-auto">
                                            <button type="button" onClick={() => { setIsTeacherModalOpen(false); setEditingTeacher(null); }} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                                <X size={24} className="text-gray-400" />
                                            </button>
                                            <h3 className="text-2xl font-black text-gray-800 mb-8">{editingTeacher ? 'Editar Docente' : 'Nuevo Docente / Administrativo'}</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nombre Completo</label>
                                                        <input name="nombre" defaultValue={editingTeacher?.nombre} required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="Ej. Juan Pérez" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tipo de Documento</label>
                                                            <select name="tipo_documento" defaultValue={editingTeacher?.tipo_documento} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700">
                                                                <option>CC</option>
                                                                <option>CE</option>
                                                                <option>PA</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Número de Documento</label>
                                                            <input name="numero_documento" defaultValue={editingTeacher?.numero_documento} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email (Acceso)</label>
                                                        <input name="email" type="email" defaultValue={editingTeacher?.email} required disabled={editingTeacher} className={`w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 ${editingTeacher ? 'opacity-50' : ''}`} />
                                                    </div>
                                                    {!editingTeacher && (
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contraseña Temporal</label>
                                                            <input name="password" type="password" required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rol Institucional</label>
                                                        <select name="rol" defaultValue={editingTeacher?.rol} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700">
                                                            <option value="teacher">Docente</option>
                                                            <option value="coordinator">Coordinación</option>
                                                            <option value="secretary">Secretaría</option>
                                                            <option value="treasury">Tesorería</option>
                                                            <option value="admin">Rectoría (Admin)</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Especialidad / Cargo</label>
                                                        <input name="specialty" defaultValue={editingTeacher?.specialty} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="Ej. Matemáticas, Coordinador Académico" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Foto</label>
                                                        <input type="file" name="photo_file" className="w-full text-xs" accept="image/*" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-10 flex gap-4">
                                                <button type="button" onClick={() => { setIsTeacherModalOpen(false); setEditingTeacher(null); }} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest">Cancelar</button>
                                                <button type="submit" disabled={uploading} className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${uploading ? 'bg-gray-400' : 'bg-institutional-blue shadow-blue-500/20'}`}>
                                                    {uploading ? 'Guardando...' : editingTeacher ? 'Actualizar Docente' : 'Crear Docente'}
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
                                                        <td className="py-6 px-8 text-right">
                                                            <button onClick={async () => {
                                                                if (confirm('Eliminar actividad?')) {
                                                                    await supabase.from('school_activities').delete().eq('id', activity.id);
                                                                    fetchActivities();
                                                                }
                                                            }} className="text-red-500 hover:bg-red-50 p-2 rounded-xl">
                                                                <Trash2 size={16} />
                                                            </button>
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
                                                Redes y Pagos
                                            </h3>
                                            <button
                                                onClick={async () => {
                                                    setLoading(true);
                                                    const fields = ['facebook_url', 'instagram_url', 'tiktok_url', 'youtube_url', 'wompi_url'];
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
                                            <div className="col-span-full pt-4 border-t border-gray-50">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-green-600 ml-1">Botón de Pago (Wompi)</label>
                                                <input id="wompi_url" type="url" defaultValue={schoolConfig.wompi_url} placeholder="Link de Wompi..." className="w-full bg-institutional-blue/5 border-institutional-blue/10 border rounded-xl p-4 font-bold text-institutional-blue" />
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

                                    {/* 5. Operación: Grados */}
                                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 space-y-8">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                                                <div className="p-2 bg-institutional-blue/10 rounded-xl">
                                                    <GraduationCap className="text-institutional-blue" size={24} />
                                                </div>
                                                Grados y Niveles
                                            </h3>
                                            <button
                                                onClick={async () => {
                                                    setLoading(true);
                                                    const { error } = await supabase.from('schools').update({ grados }).eq('slug', params.slug);
                                                    if (error) alert("Error: " + error.message);
                                                    else { setIsSaved(true); setTimeout(() => setIsSaved(false), 2000); fetchSchoolConfig(); }
                                                    setLoading(false);
                                                }}
                                                className="bg-institutional-blue text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg"
                                            >
                                                <Save size={14} />
                                            </button>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex gap-2">
                                                <input type="text" value={newGrado} onChange={(e) => setNewGrado(e.target.value)} placeholder="Añadir nuevo grado..." className="flex-1 bg-gray-50 border-none rounded-xl p-4 font-bold shadow-inner" />
                                                <button onClick={() => { if (newGrado.trim()) { setGrados([...grados, newGrado.trim()]); setNewGrado(""); } }} className="bg-institutional-blue text-white px-6 rounded-xl font-black shadow-lg">+</button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {grados.map((g, i) => (
                                                    <span key={i} className="bg-white text-institutional-blue px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tight border border-institutional-blue/20 flex items-center gap-2 shadow-sm">
                                                        {g} <X size={12} className="cursor-pointer text-institutional-magenta" onClick={() => setGrados(grados.filter((_, index) => index !== i))} />
                                                    </span>
                                                ))}
                                            </div>
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
                                                        schedule_afternoon: document.getElementById('sh_afternoon').value
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
                                        </div>
                                    </div>

                                    {/* 7. Integraciones Técnicas */}
                                    <div className="col-span-full bg-gray-50 border-2 border-gray-100 rounded-[40px] p-10 space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
                                                <div className="p-2 bg-gray-200 rounded-xl">
                                                    <Key size={20} className="text-gray-600" />
                                                </div>
                                                Integraciones Técnicas (API Keys)
                                            </h3>
                                            <button
                                                onClick={async () => {
                                                    setLoading(true);
                                                    const { error } = await supabase.from('schools').update({
                                                        groq_key: document.getElementById('groq_key').value
                                                    }).eq('slug', params.slug);
                                                    if (error) alert("Error: " + error.message);
                                                    else { setIsSaved(true); setTimeout(() => setIsSaved(false), 2000); fetchSchoolConfig(); }
                                                    setLoading(false);
                                                }}
                                                className="bg-gray-800 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg"
                                            >
                                                <Save size={14} /> Configurar LLM
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 ml-1">
                                                    Groq Cloud API Key <span className="text-[8px] bg-institutional-magenta/10 text-institutional-magenta px-2 py-0.5 rounded-full">Inteligencia Artificial</span>
                                                </label>
                                                <input id="groq_key" type="password" placeholder="gsk_..." className="w-full bg-white border border-gray-200 rounded-xl p-4 font-mono text-xs shadow-sm focus:ring-2 ring-institutional-magenta/20 transition-all" />
                                            </div>
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
                                            {grados.map(g => <option key={g.id} value={g.nombre}>{g.nombre}</option>)}
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
                                                            {['admin', 'secretary', 'coordinator'].includes(userRole) && (
                                                                <button onClick={() => {
                                                                    setEditingStudent(student);
                                                                    setFormModalidad(student.modalidad || '');
                                                                    setIsStudentModalOpen(true);
                                                                }} className="text-blue-500 text-sm font-bold">Editar</button>
                                                            )}
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
                                <form onSubmit={editingStudent ? handleEditStudent : handleCreateStudent} className="bg-white w-full max-w-7xl max-h-[95vh] rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300 overflow-y-auto">
                                    <button type="button" onClick={() => { setIsStudentModalOpen(false); setEditingStudent(null); setLeadToFormalize(null); }} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-xl transition-colors z-10">
                                        <X size={24} className="text-gray-400" />
                                    </button>
                                    <h3 className="text-2xl font-black text-gray-800 mb-1">{editingStudent ? '✏️ Editar Estudiante' : '👤 Nuevo Estudiante'}</h3>
                                    <p className="text-sm text-gray-400 mb-6">Captura completa de datos estudiantiles</p>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* ======= COLUMNA IZQUIERDA ======= */}
                                        <div className="space-y-5">
                                            {/* Datos Personales */}
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-institutional-blue mb-3 flex items-center gap-2"><Users size={14} /> Datos Personales</h4>
                                                <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nombre Completo *</label>
                                                        <input name="nombre" required defaultValue={editingStudent?.nombre || leadToFormalize?.nombre} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" placeholder="Nombres y Apellidos" />
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tipo Doc.</label>
                                                            <select name="tipo_documento" defaultValue={editingStudent?.tipo_documento || ''} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm">
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
                                                            <input name="numero_documento" defaultValue={editingStudent?.numero_documento} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" placeholder="1234567890" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fecha Nac.</label>
                                                            <input name="fecha_nacimiento" type="date" defaultValue={editingStudent?.fecha_nacimiento} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dirección</label>
                                                        <input name="direccion" defaultValue={editingStudent?.direccion} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" placeholder="Calle / Carrera / Barrio" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Datos Académicos */}
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-institutional-blue mb-3 flex items-center gap-2"><GraduationCap size={14} /> Datos Académicos</h4>
                                                <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email *</label>
                                                            <input name="email" type="email" required defaultValue={editingStudent?.email || leadToFormalize?.email || (leadToFormalize ? leadToFormalize.nombre.toLowerCase().replace(/\s/g, '.') + '@colegio.com' : '')} readOnly={!!editingStudent} className={`w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm ${editingStudent ? 'opacity-50' : ''}`} placeholder="estudiante@email.com" />
                                                        </div>
                                                        {!editingStudent ? (
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contraseña *</label>
                                                                <input name="password" type="text" defaultValue={leadToFormalize?.telefono || "Estudiante2026*"} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" />
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nueva Contraseña</label>
                                                                <input name="password" type="text" className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" placeholder="Dejar vacío para no cambiar" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Modalidad *</label>
                                                            <select name="modalidad" required defaultValue={editingStudent?.modalidad || leadToFormalize?.modalidad || ''}
                                                                onChange={(e) => setFormModalidad(e.target.value)}
                                                                className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm">
                                                                <option value="">Seleccionar modalidad</option>
                                                                <option value="Presencial">Presencial</option>
                                                                <option value="Sabatina">Sabatina</option>
                                                                <option value="A Distancia">A Distancia</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Grado *</label>
                                                            <select name="grado" required defaultValue={editingStudent?.grado || leadToFormalize?.grado || ''} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm">
                                                                <option value="">Seleccionar grado</option>
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

                                            {/* Datos Médicos */}
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-institutional-magenta mb-3 flex items-center gap-2">🏥 Datos Médicos</h4>
                                                <div className="bg-pink-50/50 rounded-2xl p-5 space-y-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Grupo Sanguíneo</label>
                                                            <select name="grupo_sanguineo" defaultValue={editingStudent?.grupo_sanguineo || ''} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm">
                                                                <option value="">—</option>
                                                                <option>O+</option><option>O-</option><option>A+</option><option>A-</option>
                                                                <option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">EPS / Salud</label>
                                                            <input name="eps_salud" defaultValue={editingStudent?.eps_salud} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" placeholder="Sanitas, Nueva EPS..." />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Alergias</label>
                                                        <textarea name="alergias" defaultValue={editingStudent?.alergias} rows={2} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" placeholder="Ninguna conocida / Detallar..." />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Condiciones Médicas</label>
                                                        <textarea name="condiciones_medicas" defaultValue={editingStudent?.condiciones_medicas} rows={2} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" placeholder="Asma, diabetes, epilepsia..." />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ======= COLUMNA DERECHA ======= */}
                                        <div className="space-y-5">
                                            {/* Acudiente */}
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-green-600 mb-3 flex items-center gap-2">👨👩👧 Acudiente / Padre</h4>
                                                <div className="bg-green-50/50 rounded-2xl p-5 space-y-3">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <label className="text-sm font-bold text-gray-600">¿Menor de edad?</label>
                                                        <button type="button" onClick={() => setEsMenor(!esMenor)}
                                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${esMenor ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                            {esMenor ? 'Sí — Obligatorio' : 'No — Opcional'}
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nombre Acudiente {esMenor && '*'}</label>
                                                            <input name="acudiente_nombre" required={esMenor} defaultValue={editingStudent?.acudiente_nombre || leadToFormalize?.acudiente_nombre} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" placeholder="Nombre completo" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Parentesco</label>
                                                            <select name="acudiente_parentesco" defaultValue={editingStudent?.acudiente_parentesco || leadToFormalize?.acudiente_parentesco || ''} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm">
                                                                <option value="">—</option>
                                                                <option>Madre</option><option>Padre</option><option>Abuelo/a</option>
                                                                <option>Tío/a</option><option>Hermano/a</option><option>Otro</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Teléfono {esMenor && '*'}</label>
                                                            <input name="acudiente_telefono" required={esMenor} defaultValue={editingStudent?.acudiente_telefono || leadToFormalize?.telefono} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" placeholder="300 123 4567" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Acudiente</label>
                                                            <input name="acudiente_email" type="email" defaultValue={editingStudent?.acudiente_email || leadToFormalize?.email} className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm" placeholder="acudiente@email.com" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Documentos Entregados */}
                                            <div className="mb-6">
                                                <h4 className="text-xs font-black uppercase tracking-widest text-amber-600 mb-3 flex items-center gap-2">📋 Documentos Entregados</h4>
                                                <div className="bg-amber-50/50 rounded-2xl p-5">
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {documentosRequeridos.map(doc => (
                                                            <label key={doc} className="flex items-center gap-3 cursor-pointer group">
                                                                <input type="checkbox" data-doc={doc} defaultChecked={editingStudent?.documentos_entregados?.[doc]} className="w-5 h-5 rounded-lg accent-green-500" />
                                                                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{doc}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Observaciones Administrativas */}
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">📝 Observaciones Administrativas</h4>
                                                <div className="bg-gray-50 rounded-2xl p-5">
                                                    <textarea
                                                        name="observaciones"
                                                        defaultValue={editingStudent?.observaciones}
                                                        rows={4}
                                                        className="w-full bg-white border border-gray-200 rounded-xl p-3 font-bold text-gray-700 text-sm focus:ring-2 focus:ring-institutional-blue outline-none transition-all"
                                                        placeholder="Notas sobre el proceso, convenios, becas o comportamiento..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botones */}
                                    <div className="flex gap-4 mt-6 sticky bottom-0 bg-white pt-4 border-t border-gray-100">
                                        <button type="button" onClick={() => { setIsStudentModalOpen(false); setEditingStudent(null); setLeadToFormalize(null); }} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest">Cancelar</button>
                                        <button type="submit" disabled={loading} className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${loading ? 'bg-gray-400' : 'bg-institutional-blue shadow-blue-500/20'}`}>
                                            {loading ? 'Guardando...' : editingStudent ? 'Actualizar Estudiante' : 'Crear Estudiante'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )
                    }

                    {/* Modal Galería */}
                    {
                        isGalleryModalOpen && (
                            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-institutional-blue/40 backdrop-blur-md animate-in fade-in duration-200">
                                <form onSubmit={handleSaveGallery} className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300">
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
                                <form onSubmit={handleSaveCost} className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300">
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
                                <form onSubmit={handleSaveCircular} className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300">
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
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dirigido a (Categoría)</label>
                                            <select name="target_area" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700">
                                                <option value="Todos">Todos</option>
                                                <option value="Preescolar">Preescolar</option>
                                                <option value="Primaria">Primaria</option>
                                                <option value="Bachillerato">Bachillerato</option>
                                                <option value="Sabatinas">Sabatinas</option>
                                                <option value="A Distancia">A Distancia</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Documento Adjunto (Opcional)</label>
                                            <input type="file" name="file_upload" accept=".pdf,.doc,.docx" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 text-xs" />
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
                                <form onSubmit={handleSaveActivity} className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300">
                                    <button type="button" onClick={() => setIsActivityModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                        <X size={24} className="text-gray-400" />
                                    </button>
                                    <h3 className="text-2xl font-black text-gray-800 mb-2">Asignar Actividad</h3>
                                    <p className="text-xs text-amber-500 font-bold mb-8">Esta actividad se asignará y notificará ÚNICAMENTE a los estudiantes en Modalidad A Distancia.</p>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Título de la Actividad</label>
                                            <input name="title" required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="Ej: Taller 1 - Matemáticas" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Descripción / Instrucciones</label>
                                            <textarea name="description" required rows="4" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700" placeholder="Instrucciones para resolver la guía..."></textarea>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Grado Destino</label>
                                                <select name="grado" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700">
                                                    <option value="">Todos los Grados / Ciclos</option>
                                                    <optgroup label="Ciclos (A Distancia)">
                                                        <option value="Ciclo III">Ciclo III (6° y 7°)</option>
                                                        <option value="Ciclo IV">Ciclo IV (8° y 9°)</option>
                                                        <option value="Ciclo V">Ciclo V (10° y 11°)</option>
                                                    </optgroup>
                                                    <optgroup label="Grados Regulares">
                                                        {schoolConfig?.grados?.map(g => <option key={g} value={g}>{g}</option>)}
                                                    </optgroup>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Documento Guía</label>
                                                <input type="file" name="file_upload" accept=".pdf,.doc,.docx" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-gray-700 text-xs" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-10 flex gap-4">
                                        <button type="button" onClick={() => setIsActivityModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest">Cancelar</button>
                                        <button type="submit" disabled={loading} className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${loading ? 'bg-gray-400' : 'bg-amber-500 shadow-amber-500/20'}`}>
                                            {loading ? 'Asignando...' : 'Asignar a Estudiantes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )
                    }
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
                            <div className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    const data = {
                                        student_id: formData.get('student_id'),
                                        school_id: school.id,
                                        materia: formData.get('materia'),
                                        nota: parseFloat(formData.get('nota')),
                                        periodo: formData.get('periodo'),
                                        observaciones: formData.get('observaciones'),
                                        fecha: new Date().toISOString().split('T')[0]
                                    };

                                    if (editingGrade) {
                                        await supabase.from('calificaciones').update(data).eq('id', editingGrade.id);
                                    } else {
                                        await supabase.from('calificaciones').insert([data]);
                                    }
                                    setIsGradeModalOpen(false);
                                    fetchGrades();
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
                                            <select name="student_id" defaultValue={editingGrade?.student_id} required className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none">
                                                <option value="">Selecciona un estudiante</option>
                                                {students.map(s => <option key={s.id} value={s.id}>{s.nombre} ({s.grado})</option>)}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Materia</label>
                                                <input name="materia" defaultValue={editingGrade?.materia} required placeholder="Ej: Matemáticas" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nota (0.0 - 5.0)</label>
                                                <input name="nota" type="number" step="0.1" min="0" max="5" defaultValue={editingGrade?.nota} required className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none" />
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
