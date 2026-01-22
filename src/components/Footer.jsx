import React from 'react';

function Footer() {
    return (
        <footer className="mt-20 py-20 border-t border-zinc-800/50 bg-[#080808]">
            <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10">
                <div>
                    <img
                        src="https://ik.imagekit.io/psdoxljjy/logo-removebg-preview.png?updatedAt=1748393870807"
                        alt="KANIME"
                        className="h-12 object-contain mb-6"
                    />
                    <p className="text-zinc-500 text-sm max-w-xs mb-3">The ultimate destination for premium anime discovery. Explore thousands of titles in HD quality for free.</p>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
                        Powered by <a href="https://kazeserenity.com" target="_blank" rel="noopener noreferrer" className="text-[#0084ff] hover:underline">Kaze Serenity</a>
                    </p>
                </div>
                <div className="flex gap-10 text-sm font-medium text-zinc-400">
                    <div className="flex flex-col gap-3">
                        <p className="text-white font-bold mb-1">Company</p>
                        <span className="hover:text-white cursor-pointer transition-colors">About Us</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Terms of Use</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        <p className="text-white font-bold mb-1">Support</p>
                        <span className="hover:text-white cursor-pointer transition-colors">Help Center</span>
                        <a href="https://kazeserenity.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Kaze Serenity</a>
                        <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
                    </div>
                </div>
            </div>
            <p className="text-center mt-20 text-zinc-600 text-xs">© 2026 KAnime Platform. Part of the <a href="https://kazeserenity.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">Kaze Serenity Network</a>.</p>
        </footer>
    );
}

export default Footer;
