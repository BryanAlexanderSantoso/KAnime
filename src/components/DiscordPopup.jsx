import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const DiscordPopup = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show after a small delay for better UX
        const timer = setTimeout(() => {
            const hasSeen = sessionStorage.getItem('kanime-discord-popup');
            if (!hasSeen) {
                setIsOpen(true);
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const closePopup = () => {
        setIsOpen(false);
        sessionStorage.setItem('kanime-discord-popup', 'true');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 pointer-events-none">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closePopup}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
                    />

                    {/* Content Card */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(88,101,242,0.2)] pointer-events-auto overflow-hidden text-center"
                    >
                        {/* Background Decoration */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5865F2] via-[#0084ff] to-[#5865F2]" />
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#5865F2]/10 rounded-full blur-3xl" />

                        {/* Logo */}
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-3xl mb-6 border border-white/10 shadow-inner overflow-hidden">
                            <img
                                src="https://ik.imagekit.io/psdoxljjy/logo-removebg-preview.png?updatedAt=1748393870807"
                                alt="KANIME"
                                className="w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(0,132,255,0.4)]"
                            />
                        </div>

                        <h3 className="text-3xl font-black mb-4 uppercase italic tracking-tight">Report & <span className="text-[#5865F2]">Feedback</span></h3>
                        <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                            Nemu bug atau ada masalah? Join Discord kami untuk lapor langsung ke tim dan ngobrol santai bareng komunitas!
                        </p>

                        <div className="flex flex-col gap-3">
                            <a
                                href="https://discord.com/invite/4M58BNYJqh"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752c4] text-white py-4 px-6 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-[#5865F2]/20 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <span>Join Now</span>
                                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                            <button
                                onClick={closePopup}
                                className="text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-[0.2em] py-2 transition-colors cursor-pointer"
                            >
                                Maybe Later
                            </button>
                        </div>

                        {/* Close Button X */}
                        <button
                            onClick={closePopup}
                            className="absolute top-6 right-6 p-2 text-zinc-600 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DiscordPopup;
