"use client";
import React, { useState } from 'react';
import { X, User } from 'lucide-react';

export default function TeachersList({ teachers, branding }) {
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teachers.map((teacher, i) => (
                    <div
                        key={i}
                        onClick={() => setSelectedTeacher(teacher)}
                        className="flex flex-col p-8 rounded-[30px] bg-white border border-slate-100 hover:border-blue-200 hover:shadow-2xl transition-all cursor-pointer group"
                    >
                        <div className="w-24 h-24 rounded-3xl bg-slate-50 overflow-hidden mb-6 border-2 border-white shadow-md group-hover:scale-105 transition-transform">
                            {teacher.public_photo_url ? (
                                <img src={teacher.public_photo_url} alt={teacher.nombre} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <User size={40} />
                                </div>
                            )}
                        </div>
                        <h3 className="font-black text-slate-800 text-xl mb-1">{teacher.nombre}</h3>
                        <p className="text-xs font-black uppercase tracking-widest" style={{ color: branding.secondary }}>
                            {teacher.specialty || (
                                teacher.rol === 'admin' ? 'Rectoría / Administración' :
                                    teacher.rol === 'secretary' ? 'Secretaría' :
                                        teacher.rol === 'treasury' || teacher.rol === 'bursar' ? 'Tesorería' :
                                            teacher.rol === 'coordinator' ? 'Coordinación' :
                                                teacher.rol === 'teacher' ? 'Docente' : 'Personal Institucional'
                            )}
                        </p>
                        {teacher.public_bio && (
                            <p className="text-sm text-slate-500 mt-4 line-clamp-2 font-medium leading-relaxed">
                                {teacher.public_bio}
                            </p>
                        )}
                        <button className="mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-institutional-blue transition-colors flex items-center gap-2">
                            Ver perfil completo +
                        </button>
                    </div>
                ))}
            </div>

            {/* Teacher Details Modal */}
            {selectedTeacher && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setSelectedTeacher(null)}
                            className="absolute top-6 right-6 p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors z-10"
                        >
                            <X size={24} className="text-slate-400" />
                        </button>

                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/2 aspect-square md:aspect-auto">
                                {selectedTeacher.public_photo_url ? (
                                    <img src={selectedTeacher.public_photo_url} alt={selectedTeacher.nombre} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                        <User size={80} />
                                    </div>
                                )}
                            </div>
                            <div className="md:w-1/2 p-10 md:p-12 flex flex-col justify-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 block" style={{ color: branding.secondary }}>
                                    Staff Académico
                                </span>
                                <h1 className="text-4xl font-black text-slate-800 mb-2 leading-tight">
                                    {selectedTeacher.nombre}
                                </h1>
                                <p className="text-lg font-bold text-slate-400 mb-8">
                                    {selectedTeacher.specialty || (
                                        selectedTeacher.rol === 'admin' ? 'Rectoría / Administración' :
                                            selectedTeacher.rol === 'secretary' ? 'Secretaría' :
                                                selectedTeacher.rol === 'treasury' || selectedTeacher.rol === 'bursar' ? 'Tesorería' :
                                                    selectedTeacher.rol === 'coordinator' ? 'Coordinación' :
                                                        selectedTeacher.rol === 'teacher' ? 'Docente' : 'Personal Institucional'
                                    )}
                                </p>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 border-b border-slate-100 pb-2">Biografía Profesional</h4>
                                    <p className="text-slate-600 font-medium leading-relaxed">
                                        {selectedTeacher.public_bio || 'Este docente aún no ha completado su biografía pública.'}
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
