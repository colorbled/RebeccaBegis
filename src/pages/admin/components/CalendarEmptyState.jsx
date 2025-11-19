// src/components/CalendarEmptyState.jsx
import React from 'react';
import { Calendar as CalIcon } from 'lucide-react';

export default function CalendarEmptyState() {
    return (
        <div className="rounded-2xl border border-dashed border-white/10 bg-gradient-to-br from-zinc-900/70 to-zinc-950/80 px-6 py-10 text-center shadow-inner shadow-black/40">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.03] border border-white/10 mb-3">
                <CalIcon className="h-5 w-5 text-zinc-400" />
            </div>
            <div className="text-sm font-medium text-zinc-200">
                No upcoming events
            </div>
            <div className="mt-1 text-xs text-zinc-500">
                Add a new gallery show, meetup, or special date to see it
                appear here.
            </div>
        </div>
    );
}
