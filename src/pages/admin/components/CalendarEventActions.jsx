// src/components/CalendarEventActions.jsx
import React from 'react';
import { Pencil, Trash2, Smartphone } from 'lucide-react';

export default function CalendarEventActions({ ev, onEdit, onDelete, onSync }) {
    return (
        <>
            {/* Desktop actions */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
                <button
                    onClick={() => onEdit(ev)}
                    type="button"
                    title="Edit event"
                    aria-label="Edit event"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full !p-0 border border-white/15 bg-white/[0.04] text-zinc-100 hover:bg-white/[0.12] hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                >
                    <Pencil className="h-4 w-4" />
                </button>

                <button
                    onClick={() => onDelete(ev)}
                    type="button"
                    title="Delete event"
                    aria-label="Delete event"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full !p-0 border border-rose-500/50 bg-rose-600/20 text-rose-100 hover:bg-rose-600/35 hover:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/60"
                >
                    <Trash2 className="h-4 w-4" />
                </button>

                <button
                    onClick={() => onSync?.(ev)}
                    type="button"
                    title="Sync to iOS calendar"
                    aria-label="Sync to iOS calendar"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full !p-0 border border-emerald-500/50 bg-emerald-600/20 text-emerald-100 hover:bg-emerald-600/35 hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                >
                    <Smartphone className="h-4 w-4" />
                </button>
            </div>

            {/* Mobile actions */}
            <div className="mt-3 flex sm:hidden justify-end gap-2">
                <button
                    onClick={() => onEdit(ev)}
                    type="button"
                    title="Edit event"
                    aria-label="Edit event"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full !p-0 border border-white/15 bg-white/[0.04] text-zinc-100 hover:bg-white/[0.12] hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                >
                    <Pencil className="h-4 w-4" />
                </button>

                <button
                    onClick={() => onDelete(ev)}
                    type="button"
                    title="Delete event"
                    aria-label="Delete event"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full !p-0 border border-rose-500/50 bg-rose-600/20 text-rose-100 hover:bg-rose-600/35 hover:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/60"
                >
                    <Trash2 className="h-4 w-4" />
                </button>

                <button
                    onClick={() => onSync?.(ev)}
                    type="button"
                    title="Sync to iOS calendar"
                    aria-label="Sync to iOS calendar"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full !p-0 border border-emerald-500/50 bg-emerald-600/20 text-emerald-100 hover:bg-emerald-600/35 hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                >
                    <Smartphone className="h-4 w-4" />
                </button>
            </div>
        </>
    );
}
