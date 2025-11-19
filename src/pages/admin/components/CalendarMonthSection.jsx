// src/components/CalendarMonthSection.jsx
import React from 'react';
import CalendarEventRow from './CalendarEventRow';

export default function CalendarMonthSection({
                                                 label,
                                                 events,
                                                 onEdit,
                                                 onDelete,
                                                 onSync,
                                             }) {
    return (
        <section className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-zinc-950/60 shadow-[0_18px_40px_rgba(0,0,0,0.55)] overflow-hidden">
            <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.03] backdrop-blur-sm">
                <div className="text-sm font-medium text-zinc-100">
                    {label}
                </div>
                <div className="text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
                    Events
                </div>
            </header>

            <ul className="divide-y divide-white/5">
                {events.map((ev) => (
                    <CalendarEventRow
                        key={ev.id}
                        ev={ev}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onSync={onSync}
                    />
                ))}
            </ul>
        </section>
    );
}
