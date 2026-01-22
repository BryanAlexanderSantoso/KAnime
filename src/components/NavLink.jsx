import React from 'react';

function NavLink({ icon, label, active }) {
    return (
        <div className={`flex items-center gap-2 text-sm font-medium cursor-pointer transition-all duration-300 py-1.5 px-3 rounded-lg ${active ? 'text-white bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
            <span className={active ? 'text-[#0084ff]' : ''}>{icon}</span>
            {label}
        </div>
    );
}

export default NavLink;
