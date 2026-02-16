"use client";
import React from 'react';
import { BookOpen, Calendar, CheckSquare, PlusCircle, Users, Clock, FileText, BarChart2, Heart } from 'lucide-react';
import WellbeingModule from "@/components/WellbeingModule";

export default function ProfesoresDashboard() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            <aside className="bg-white w-full md:w-20 lg:w-64 p-4 lg:p-6 border-r border-gray-100 flex flex-col items-center lg:items-start shrink-0">
                <div className="w-10 h-10 lg:w-auto lg:h-auto bg-institutional-blue text-white p-2 rounded-xl mb-10 flex items-center justify-center lg:justify-start gap-3">
                    <BookOpen size={24} />
                    <span className="hidden lg:inline font-black tracking-tighter">DOCENTE</span>
                </div>

                <nav className="space-y-4 w-full">
                    <button className="w-full bg-institutional-blue text-white p-3 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center lg:justify-start gap-3 transition-transform hover:scale-105">
                        <BookOpen size={20} /> <span className="hidden lg:inline font-bold">Mis Cursos</span>
                    </button>
                    <button className="w-full text-gray-400 hover:bg-gray-100 p-3 rounded-xl flex items-center justify-center lg:justify-start gap-3 transition-colors">
                        <CheckSquare size={20} /> <span className="hidden lg:inline font-bold">Calificaciones</span>
                    </button>
                    <button className="w-full text-gray-400 hover:bg-gray-100 p-3 rounded-xl flex items-center justify-center lg:justify-start gap-3 transition-colors">
                        <Calendar size={20} /> <span className="hidden lg:inline font-bold">Calendario</span>
                    </button>
                </nav>
            </aside>

            <main className="flex-1 p-6 md:p-10">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-gray-800">Hola, Profesor Demo</h1>
                        <p className="text-gray-400 font-medium">Tienes <strong className="text-institutional-magenta">3 entregas</strong> pendientes por revisar hoy.</p>
                    </div>
                    <button className="bg-institutional-magenta text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-magenta-500/20 hover:scale-105 transition-transform flex items-center gap-2">
                        <PlusCircle size={20} /> Crear Tarea
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Course Card 1 */}
                    <div className="bg-white p-6 rounded-[30px] border border-gray-100 hover:shadow-xl transition-shadow group cursor-pointer">
                        <div className="flex justify-between items-start mb-6">
                            <div className="bg-orange-50 text-orange-500 p-3 rounded-2xl">
                                <BarChart2 size={24} />
                            </div>
                            <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">Grado 11°</span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 mb-2 group-hover:text-institutional-blue transition-colors">Matemáticas</h3>
                        <p className="text-gray-400 text-sm mb-6">Álgebra Lineal y Estadística</p>

                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                                <Users size={16} /> 24 Estudiantes
                            </div>
                            <div className="flex items-center gap-2 text-institutional-magenta text-xs font-black uppercase">
                                Ver Aula <PlusCircle size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Course Card 2 */}
                    <div className="bg-white p-6 rounded-[30px] border border-gray-100 hover:shadow-xl transition-shadow group cursor-pointer">
                        <div className="flex justify-between items-start mb-6">
                            <div className="bg-green-50 text-green-500 p-3 rounded-2xl">
                                <FileText size={24} />
                            </div>
                            <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">Grado 10°</span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 mb-2 group-hover:text-institutional-blue transition-colors">Física</h3>
                        <p className="text-gray-400 text-sm mb-6">Mecánica Clásica</p>

                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                                <Users size={16} /> 28 Estudiantes
                            </div>
                            <div className="flex items-center gap-2 text-institutional-magenta text-xs font-black uppercase">
                                Ver Aula <PlusCircle size={16} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
                        <Clock size={20} className="text-gray-400" /> Actividad Reciente
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between font-sans">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-institutional-magenta"></div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">Juan Pérez entregó "Taller Vectores"</p>
                                        <p className="text-xs text-gray-400">Hace {i * 5} minutos • Grado 11°</p>
                                    </div>
                                </div>
                                <button className="text-institutional-blue font-black text-xs hover:underline uppercase tracking-widest">Calificar</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12">
                    <WellbeingModule />
                </div>
            </main>
        </div>
    );
}
