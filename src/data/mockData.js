export const mockData = {
    colegio: {
        nombre: "Colegio Latinoamericano",
        administracion: "Nueva Administración",
        eslogan: "Educando con amor, vocación, paciencia y firmeza",
        mision: "Brindar una educación integral basada en valores humanos, fomentando la excelencia académica y el desarrollo de competencias para transformar positivamente la sociedad.",
        vision: "Para el año 2030, seremos la institución educativa líder en la formación de ciudadanos críticos, innovadores y con alto sentido de responsabilidad social en Villavicencio.",
        historia: "Fundado con el compromiso de ofrecer una alternativa educativa de calidad, el Colegio Latinoamericano ha evolucionado bajo una nueva administración que prioriza la modernización pedagógica y el bienestar estudiantil.",
        valores: ["Amor", "Vocación", "Paciencia", "Firmeza", "Respeto"],
        actividades: [
            { id: 1, titulo: "Convivencias", desc: "Fortalecemos lazos de compañerismo en entornos naturales." },
            { id: 2, titulo: "Banda de Marcha", desc: "Fomentamos la disciplina y el talento musical institucional." },
            { id: 3, titulo: "Formación en Valores", desc: "Talleres semanales para el desarrollo del ser." }
        ],
        noticias: [
            { id: 1, titulo: "Admisiones 2026 Abiertas", fecha: "2025-10-01", categoria: "Institucional", resumen: "Iniciamos el proceso de inscripción para el nuevo año escolar. Innovación pedagógica para un proceso educativo de excelencia." },
            { id: 2, titulo: "Cronograma de Actividades Académicas", fecha: "2025-09-15", categoria: "Académico", resumen: "Consulta las fechas clave para la entrega de guías y evaluaciones del tercer periodo." },
            { id: 3, titulo: "Izada de Bandera: Valores Latinoamericanos", fecha: "2025-08-20", categoria: "Eventos", resumen: "Reconocimiento a la excelencia académica y el compromiso con los valores institucionales." }
        ],
        logoSolo: "/colegiollatinoamericanologo.jpg",
        logoSlogan: "/colegiollatinoamericano.jpg",
        direccion: "Calle 13 Carrera 14 Esquina Barrio El Estero, Villavicencio",
        telefono: "321 280 8022",
        jornadas: ["Mañana", "Tarde", "Sabatina"],
        costos2026: {
            preescolar: {
                matricula: 350000,
                pension: 220000,
                asopadres: 60000
            },
            primaria: {
                matricula: 310000,
                pension: 200000,
                asopadres: 60000
            },
            bachillerato: {
                matricula: 310000,
                pension: 200000,
                asopadres: 60000
            },
            seguroEstudiantil: 30000
        },
        requisitos: [
            "Carpeta amarilla colgante oficio (libre de ácidos con gancho legajador)",
            "Certificados originales de años anteriores",
            "Tres fotos 3x4 fondo azul",
            "Fotocopia documento de identidad estudiante",
            "Fotocopia C.C. de los acudientes (150%)",
            "Registro civil",
            "Retiro del SIMAT",
            "Copia del recibo de servicio público",
            "Copia seguro de salud",
            "Diagnóstico médico (a quien se requiera) o Carné de vacunas"
        ],
        banners: {
            galeria: {
                imagen: "https://images.unsplash.com/photo-1523050335392-938511794244?q=80&w=2070&auto=format&fit=crop",
                titulo: "Nuestra Infraestructura",
                link: "/galeria"
            },
            oferta: {
                imagen: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2104&auto=format&fit=crop",
                titulo: "Excelencia Académica",
                link: "/institucion#oferta"
            }
        },
        apisConfig: {
            groq: "",
            imgbb: "",
            ilovepdf: ""
        }
    },
    estudiante: {
        nombre: "Juan Pérez",
        grado: "Bachillerato",
        estadoAdmision: {
            checklist: [
                { id: 1, label: "Carpeta amarilla", completado: true },
                { id: 2, label: "SIMAT", completado: false },
                { id: 3, label: "Certificados históricos", completado: false },
                { id: 4, label: "Fotos 3x4", completado: true }
            ],
            pagoRealizado: false
        },
        tareas: [
            { id: 1, titulo: "Ensayo sobre Valores", materia: "Ética", estado: "Pendiente", fechaLimite: "2026-02-15" },
            { id: 2, titulo: "Taller de Matemáticas", materia: "Matemáticas", estado: "Entregado", archivo: "taller1.pdf", fechaEntrega: "2026-01-25" }
        ]
    },
    superadmin: {
        nombre: "Manuel Fernando Madrid Rueda",
        empresa: "Gestor Educativo 365",
        email: "madfer1993@gmail.com",
        contacto: "3045788873"
    },
    admin: {
        nombre: "Rectoría Latinoamericana",
        leads: [
            { id: 1, nombre: "Carlos Rodriguez", telefono: "3101234567", interes: "Bachillerato", fecha: "2026-01-28" },
            { id: 2, nombre: "Martha Lucía", telefono: "3209876543", interes: "Primaria", fecha: "2026-01-29" }
        ],
        estudiantes: [
            {
                id: 1,
                nombre: "Juan Pérez",
                grado: "11°",
                estado: "Matriculado",
                pago: "Al día",
                trazabilidad: [
                    { fecha: "2026-01-20", accion: "Pago Matrícula verificado" },
                    { fecha: "2026-01-25", accion: "Entrega Taller de Matemáticas" },
                    { fecha: "2026-01-28", accion: "Carga de Fotos 3x4 completa" }
                ],
                tareas: [
                    { id: 1, titulo: "Ensayo sobre Valores", estado: "Pendiente" },
                    { id: 2, titulo: "Taller de Matemáticas", estado: "Entregado" }
                ]
            },
            { id: 2, nombre: "Sofía Castro", grado: "10°", estado: "Pendiente Doc", pago: "Pendiente", trazabilidad: [], tareas: [] }
        ]
    }
};
