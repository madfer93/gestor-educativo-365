import React from 'react';

export default function SchoolFooter({ schoolName, logoUrl, primaryColor }) {
    return (
        <footer className="py-16 text-center border-t border-white/10" style={{ backgroundColor: primaryColor || '#1e3a8a' }}>
            <div className="container mx-auto px-6">
                {/* Logo in Square */}
                <div className="bg-white w-20 h-20 rounded-2xl p-3 mx-auto mb-8 flex items-center justify-center shadow-2xl">
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>

                {/* Copyright & Resolution */}
                <div className="space-y-2 mb-12">
                    <p className="text-white font-bold text-lg">© {new Date().getFullYear()} {schoolName}</p>
                    <p className="text-white/40 text-xs font-medium uppercase tracking-[0.1em]">
                        Resolución de Aprobación No. 1205 de Noviembre 2000
                    </p>
                </div>

                {/* Powered by */}
                <div className="pt-8 border-t border-white/5">
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">
                        Powered by Variedades JyM SaaS
                    </p>
                </div>
            </div>
        </footer>
    );
}
