"use client";
import React, { useState } from "react";
import { Book, FileUp, CheckCircle, Clock, X } from "lucide-react";

export default function AssignmentsModule({ assignments }) {
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openUploader = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-magenta-50 text-institutional-magenta rounded-2xl flex items-center justify-center font-black">
                    <Book size={24} />
                </div>
                <h3 className="text-2xl font-black text-institutional-blue">Tareas y Actividades</h3>
            </div>

            <div className="space-y-4">
                {assignments.map((task) => (
                    <div key={task.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-3xl bg-gray-50 border border-transparent hover:border-gray-200 transition-all">
                        <div className="flex items-center gap-4 mb-4 sm:mb-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${task.estado === 'Entregado' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                {task.estado === 'Entregado' ? <CheckCircle size={20} /> : <Clock size={20} />}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{task.titulo}</p>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">{task.materia} • {task.estado === 'Entregado' ? `Entregado el ${task.fechaEntrega}` : `Límite: ${task.fechaLimite}`}</p>
                            </div>
                        </div>

                        {task.estado !== 'Entregado' ? (
                            <button
                                onClick={() => openUploader(task)}
                                className="bg-institutional-blue text-white px-6 py-2 rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform"
                            >
                                Subir Trabajo
                            </button>
                        ) : (
                            <span className="text-xs font-black text-green-600 uppercase tracking-widest">Recibido</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Upload Modal */}
            {isModalOpen && selectedTask && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-institutional-blue/20 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-10 relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <X size={20} className="text-gray-400" />
                        </button>

                        <div className="mb-8">
                            <span className="bg-blue-50 text-institutional-blue text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3 inline-block">
                                Subir Actividad
                            </span>
                            <h4 className="text-2xl font-black text-gray-800">{selectedTask.titulo}</h4>
                            <p className="text-gray-500 font-medium">{selectedTask.materia}</p>
                        </div>

                        <div className="border-4 border-dashed border-gray-100 rounded-[32px] p-12 text-center hover:border-institutional-blue/30 transition-colors cursor-pointer group">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mx-auto mb-4 group-hover:bg-blue-50 group-hover:text-institutional-blue transition-all">
                                <FileUp size={32} />
                            </div>
                            <p className="font-bold text-gray-700 mb-1">Haz clic para seleccionar</p>
                            <p className="text-xs text-gray-400">PDF, DOCX o Imágenes (Máx 10MB)</p>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black text-sm hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    alert("Trabajo subido con éxito (Simulación)");
                                    setIsModalOpen(false);
                                }}
                                className="flex-1 bg-institutional-magenta text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-magenta-500/20 hover:scale-105 transition-all"
                            >
                                Enviar Trabajo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
