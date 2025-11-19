// src/components/TabNav.jsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function TabNav({ value, onChange, tabs = [] }) {
    const [open, setOpen] = React.useState(false);
    const btnRef = React.useRef(null);
    const menuRef = React.useRef(null);

    const active = tabs.find(t => t.value === value) || tabs[0];

    // Close on outside click
    React.useEffect(() => {
        if (!open) return;
        const onClick = (e) => {
            if (!menuRef.current || !btnRef.current) return;
            if (!menuRef.current.contains(e.target) && !btnRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        const onKey = (e) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const baseTab =
        'px-3 py-2 rounded-md text-sm transition select-none whitespace-nowrap';
    const activeTab =
        'bg-white text-black shadow-sm';
    const idleTab =
        'text-zinc-300 hover:bg-white/10';

    return (
        <div className="w-full">
            {/* Mobile: dropdown trigger */}
            <div className="sm:hidden">
                <button
                    ref={btnRef}
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={open}
                    onClick={() => setOpen(v => !v)}
                    className="w-full inline-flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-zinc-100"
                >
                    <span className="truncate">{active?.label ?? 'Menu'}</span>
                    <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
                </button>

                {/* Mobile: menu sheet */}
                {open && (
                    <div
                        ref={menuRef}
                        role="menu"
                        className="mt-2 rounded-lg border border-white/10 bg-black/70 backdrop-blur p-1"
                    >
                        {tabs.map((t) => {
                            const isActive = t.value === value;
                            return (
                                <button
                                    key={t.value}
                                    role="menuitemradio"
                                    aria-checked={isActive}
                                    onClick={() => {
                                        onChange?.(t.value);
                                        setOpen(false);
                                    }}
                                    className={`w-full text-left ${baseTab} ${isActive ? activeTab : idleTab}`}
                                >
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Desktop: horizontal pills */}
            <div className="hidden sm:flex flex-wrap gap-1">
                {tabs.map((t) => {
                    const isActive = t.value === value;
                    return (
                        <button
                            key={t.value}
                            onClick={() => onChange?.(t.value)}
                            className={`${baseTab} ${isActive ? activeTab : idleTab}`}
                        >
                            {t.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
