"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import SchoolNavbar from "@/components/SchoolNavbar";
import ChatIA from "@/components/ChatIA";
import { Shield, FileText, Camera, Scale, Award, ChevronRight, Download } from "lucide-react";

const supabase = createClient();

const SECCIONES = [
    { id: 'habeas-data', label: 'Habeas Data', icon: Shield, color: 'blue' },
    { id: 'privacidad', label: 'Política de Privacidad', icon: FileText, color: 'emerald' },
    { id: 'uso-imagen', label: 'Uso de Imagen', icon: Camera, color: 'purple' },
    { id: 'terminos', label: 'Términos y Condiciones', icon: Scale, color: 'amber' },
    { id: 'certificados', label: 'Certificados y Resoluciones', icon: Award, color: 'rose' },
];

// Default legal templates based on Colombian law for educational institutions
const PLANTILLAS = {
    'habeas-data': `POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES (HABEAS DATA)

En cumplimiento de la Ley 1581 de 2012, el Decreto 1377 de 2013 y demás normas concordantes, el Colegio Latinoamericano, identificado con NIT [NIT DEL COLEGIO], con domicilio en Villavicencio, Meta, Colombia, en calidad de Responsable del Tratamiento de Datos Personales, informa su política de tratamiento de información personal.

1. RESPONSABLE DEL TRATAMIENTO
Colegio Latinoamericano
Dirección: Villavicencio, Meta
Teléfono: 321 280 8022
Correo: [correo institucional]

2. FINALIDAD DEL TRATAMIENTO
Los datos personales recolectados serán utilizados para:
• Gestión académica y administrativa de estudiantes, padres de familia y docentes.
• Registro y control de matrículas, calificaciones y asistencia.
• Comunicación institucional con la comunidad educativa.
• Cumplimiento de obligaciones legales ante el Ministerio de Educación Nacional.
• Envío de circulares, boletines y notificaciones académicas.
• Gestión de pagos y facturación de servicios educativos.

3. DERECHOS DE LOS TITULARES
De acuerdo con el artículo 8 de la Ley 1581 de 2012, los titulares tienen derecho a:
• Conocer, actualizar y rectificar sus datos personales.
• Solicitar prueba de la autorización otorgada.
• Ser informado sobre el uso de sus datos.
• Presentar quejas ante la Superintendencia de Industria y Comercio.
• Revocar la autorización y/o solicitar la supresión de datos.
• Acceder gratuitamente a sus datos personales.

4. AUTORIZACIÓN
La recolección de datos personales requiere autorización previa, expresa e informada del titular o su representante legal (en caso de menores de edad).

5. VIGENCIA
Esta política rige a partir de su publicación y los datos personales serán tratados durante el tiempo que sea necesario para cumplir con las finalidades descritas.`,

    'privacidad': `POLÍTICA DE PRIVACIDAD

El Colegio Latinoamericano se compromete a proteger la privacidad de los datos personales de estudiantes, padres de familia, docentes, personal administrativo y visitantes de nuestro sitio web, en cumplimiento de la Ley 1581 de 2012 y su decreto reglamentario 1377 de 2013.

1. INFORMACIÓN QUE RECOPILAMOS
• Datos de identificación: nombres, apellidos, documento de identidad, fecha de nacimiento.
• Datos de contacto: dirección, teléfono, correo electrónico.
• Datos académicos: calificaciones, asistencia, observaciones disciplinarias.
• Datos de salud: información médica relevante para la atención del estudiante (EPS, alergias, condiciones especiales).
• Datos financieros: información de pagos y estado de cuenta.
• Datos de navegación: cookies y registros de acceso al portal web.

2. USO DE COOKIES
Nuestro sitio web utiliza cookies técnicas necesarias para el funcionamiento de la plataforma educativa. No utilizamos cookies publicitarias ni de rastreo de terceros.

3. SEGURIDAD DE LA INFORMACIÓN
Implementamos medidas de seguridad técnicas, humanas y administrativas para proteger los datos personales contra acceso no autorizado, pérdida, alteración o destrucción.

4. TRANSFERENCIA DE DATOS
No compartimos datos personales con terceros, excepto cuando sea requerido por autoridades competentes o para el cumplimiento de obligaciones legales ante el Ministerio de Educación Nacional, DANE, SIMAT y demás entidades del sector educativo.

5. MENORES DE EDAD
El tratamiento de datos de menores de edad se realiza respetando el interés superior del niño, niña o adolescente, conforme al artículo 7 de la Ley 1581 de 2012 y la Ley 1098 de 2006 (Código de Infancia y Adolescencia).

6. CONTACTO
Para ejercer sus derechos como titular de datos personales, comuníquese con nosotros a través de los canales oficiales de la institución.`,

    'uso-imagen': `POLÍTICA DE USO DE IMAGEN

En cumplimiento del artículo 36 de la Ley 23 de 1982 sobre Derechos de Autor, el artículo 16 de la Ley 1581 de 2012 sobre Protección de Datos Personales, y la Sentencia T-407/12 de la Corte Constitucional, el Colegio Latinoamericano establece la siguiente política de uso de imagen.

1. AUTORIZACIÓN
Al momento de la matrícula, los padres de familia o acudientes firman una autorización expresa para el uso de la imagen (fotografías y videos) de los estudiantes con fines exclusivamente educativos e institucionales.

2. FINALIDADES PERMITIDAS
Las imágenes podrán ser utilizadas para:
• Publicación en la página web institucional.
• Redes sociales oficiales (Facebook, Instagram, TikTok, YouTube).
• Material publicitario y promocional de la institución.
• Anuarios, boletines y circulares institucionales.
• Registro de eventos académicos, deportivos y culturales.

3. DOCENTES Y PERSONAL ADMINISTRATIVO
Los docentes y personal administrativo también autorizan el uso de su imagen en el marco de actividades institucionales, según lo estipulado en su contrato laboral.

4. RESTRICCIONES
• Las imágenes NO serán utilizadas con fines comerciales ajenos a la institución.
• No se publicarán imágenes que atenten contra la dignidad, honra o privacidad de las personas.
• Se respetará el derecho a la revocación de la autorización en cualquier momento.

5. REVOCACIÓN
Para revocar la autorización de uso de imagen, el titular o su representante legal deberá enviar solicitud escrita a la secretaría del colegio. La solicitud será procesada en un plazo máximo de 15 días hábiles.

6. PROTECCIÓN DE MENORES
En todo momento se garantizará la protección especial de los menores de edad conforme a la Ley 1098 de 2006 y la jurisprudencia constitucional vigente.`,

    'terminos': `TÉRMINOS Y CONDICIONES DE USO DEL PORTAL WEB

El presente documento establece los términos y condiciones de uso del portal web del Colegio Latinoamericano, en cumplimiento de la Ley 527 de 1999 sobre comercio electrónico y la Ley 1581 de 2012 sobre protección de datos.

1. ACEPTACIÓN DE TÉRMINOS
Al acceder y utilizar este portal web, el usuario acepta los presentes términos y condiciones. Si no está de acuerdo, debe abstenerse de usar la plataforma.

2. SERVICIOS DEL PORTAL
El portal ofrece:
• Consulta de información académica (calificaciones, asistencia, horarios).
• Acceso al sistema de pagos en línea.
• Comunicación con docentes y directivas.
• Descarga de circulares y documentos institucionales.
• Chat de atención con inteligencia artificial.

3. REGISTRO Y CUENTAS
• Las credenciales de acceso son personales e intransferibles.
• El usuario es responsable de la confidencialidad de su contraseña.
• La institución se reserva el derecho de suspender cuentas que incumplan estas condiciones.

4. PAGOS EN LÍNEA
• Los pagos realizados a través de la pasarela Wompi están sujetos a los términos y condiciones del proveedor.
• La institución no se hace responsable por fallas técnicas del sistema de pagos externo.
• Los comprobantes de pago deben ser conservados por el usuario.

5. PROPIEDAD INTELECTUAL
Todo el contenido del portal (textos, imágenes, logos, diseño) es propiedad del Colegio Latinoamericano y está protegido por la Ley 23 de 1982 de Derechos de Autor.

6. LIMITACIÓN DE RESPONSABILIDAD
La institución no se hace responsable por:
• Interrupciones del servicio por mantenimiento o causas de fuerza mayor.
• Uso indebido de las credenciales de acceso por parte del usuario.
• Contenido publicado por terceros en las plataformas de comunicación.

7. JURISDICCIÓN
Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia será resuelta por los tribunales competentes de Villavicencio, Meta.

8. MODIFICACIONES
La institución se reserva el derecho de modificar estos términos en cualquier momento. Las modificaciones serán publicadas en el portal y entrarán en vigencia desde su publicación.`
};

export default function LegalPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const seccionInicial = searchParams.get('seccion') || 'habeas-data';
    const [activeSection, setActiveSection] = useState(seccionInicial);
    const [school, setSchool] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSchool() {
            const { data } = await supabase
                .from('schools')
                .select('*')
                .eq('slug', params.slug)
                .single();
            setSchool(data);
            setLoading(false);
        }
        fetchSchool();
    }, [params.slug]);

    useEffect(() => {
        const seccion = searchParams.get('seccion');
        if (seccion) setActiveSection(seccion);
    }, [searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!school) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-500 font-bold">Institución no encontrada.</p>
            </div>
        );
    }

    const branding = school.branding_colors || { primary: '#1e3a8a', secondary: '#1e3a8a' };
    const activeSec = SECCIONES.find(s => s.id === activeSection) || SECCIONES[0];
    const ActiveIcon = activeSec.icon;

    // Get content: from DB if available, otherwise use template
    const getContent = (sectionId) => {
        const dbField = `legal_${sectionId.replace('-', '_')}`;
        return school[dbField] || PLANTILLAS[sectionId] || '';
    };

    const certificados = school.legal_certificados || [];

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <SchoolNavbar
                schoolName={school.nombre}
                logoUrl={school.logo_url}
                brandingColors={branding}
                slug={params.slug}
                socialLinks={{
                    facebook: school.facebook_url,
                    instagram: school.instagram_url,
                    tiktok: school.tiktok_url,
                    youtube: school.youtube_url
                }}
            />

            {/* Hero */}
            <div className="relative py-16 text-white text-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${branding.primary}, #1e293b)` }}>
                <div className="container mx-auto px-6 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-white/10 px-6 py-2 rounded-full inline-block mb-6">Marco Legal Institucional</span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Documentos Legales</h1>
                    <p className="text-white/70 text-lg font-medium max-w-2xl mx-auto">
                        Transparencia y cumplimiento normativo — Ley 1581 de 2012 y normatividad colombiana vigente.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:w-80 shrink-0">
                        <div className="bg-white rounded-[30px] shadow-xl shadow-black/5 border border-gray-100 p-6 lg:sticky lg:top-24">
                            <h3 className="font-black text-gray-800 uppercase tracking-widest text-[10px] mb-4 px-2">Secciones</h3>
                            <div className="space-y-2">
                                {SECCIONES.map(sec => {
                                    const Icon = sec.icon;
                                    const isActive = activeSection === sec.id;
                                    return (
                                        <button
                                            key={sec.id}
                                            onClick={() => {
                                                setActiveSection(sec.id);
                                                window.history.replaceState(null, '', `/${params.slug}/legal?seccion=${sec.id}`);
                                            }}
                                            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${isActive
                                                ? 'text-white shadow-lg'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                            style={isActive ? { backgroundColor: branding.primary } : {}}
                                        >
                                            <Icon size={18} />
                                            {sec.label}
                                            {isActive && <ChevronRight size={16} className="ml-auto" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white rounded-[30px] shadow-xl shadow-black/5 border border-gray-100 p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${branding.primary}15` }}>
                                    <ActiveIcon size={24} style={{ color: branding.primary }} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-800">{activeSec.label}</h2>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{school.nombre}</p>
                                </div>
                            </div>

                            {activeSection === 'certificados' ? (
                                <div className="space-y-6">
                                    <p className="text-gray-600 font-medium leading-relaxed">
                                        A continuación se encuentran los certificados, resoluciones y documentos oficiales del Colegio Latinoamericano emitidos por las autoridades educativas competentes.
                                    </p>
                                    {certificados.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {certificados.map((cert, i) => (
                                                <a
                                                    key={i}
                                                    href={cert.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-4 bg-slate-50 hover:bg-slate-100 p-5 rounded-2xl transition-all group border border-slate-100"
                                                >
                                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                        <Download size={20} style={{ color: branding.primary }} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-gray-800 text-sm truncate">{cert.nombre}</p>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Descargar PDF</p>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-center">
                                            <Award size={32} className="text-amber-400 mx-auto mb-3" />
                                            <p className="text-amber-800 font-bold text-sm">Los certificados y resoluciones serán publicados próximamente.</p>
                                            <p className="text-amber-600 text-xs mt-1">El administrador puede subir documentos desde el panel de administración.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="prose prose-gray max-w-none">
                                    <div className="whitespace-pre-wrap text-gray-700 font-medium leading-relaxed text-sm">
                                        {getContent(activeSection)}
                                    </div>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Última actualización: {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })}
                                </p>
                                <a
                                    href={`/${params.slug}/contacto`}
                                    className="text-xs font-black uppercase tracking-widest px-5 py-2 rounded-xl transition-all hover:scale-105"
                                    style={{ color: branding.primary, backgroundColor: `${branding.primary}10` }}
                                >
                                    Contactar para consultas
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ChatIA />
        </div>
    );
}
