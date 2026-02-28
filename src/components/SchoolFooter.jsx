import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

const TikTokIcon = ({ size = 20 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
);

export default function SchoolFooter({ schoolName, logoUrl, primaryColor, socialLinks }) {
    return (
        <footer className="py-16 text-center border-t border-white/10" style={{ backgroundColor: primaryColor || '#1e3a8a' }}>
            <div className="container mx-auto px-6">
                {/* Logo in Circle */}
                <div className="bg-white w-24 h-24 rounded-full p-2 mx-auto mb-10 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white/10 overflow-hidden group">
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain transition-transform group-hover:scale-110" />
                </div>

                {/* Social Networks */}
                {socialLinks && (
                    <div className="flex justify-center gap-6 mb-10">
                        {socialLinks.facebook && (
                            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                <Facebook size={24} />
                            </a>
                        )}
                        {socialLinks.instagram && (
                            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                <Instagram size={24} />
                            </a>
                        )}
                        {socialLinks.tiktok && (
                            <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                <TikTokIcon size={24} />
                            </a>
                        )}
                        {socialLinks.youtube && (
                            <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                <Youtube size={24} />
                            </a>
                        )}
                    </div>
                )}

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
