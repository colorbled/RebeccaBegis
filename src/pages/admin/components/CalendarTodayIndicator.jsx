// src/components/CalendarTodayIndicator.jsx
import React from 'react';
import { Calendar as CalIcon } from 'lucide-react';

function formatNow(d) {
    const datePart = d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
    const timePart = d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
    return `${datePart} — ${timePart}`;
}

export default function CalendarTodayIndicator({ now }) {
    return (
        <div className="flex justify-end items-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 shadow-sm shadow-black/40 backdrop-blur">
                <CalIcon className="h-3.5 w-3.5 text-zinc-300" />
                <span className="text-xs font-medium text-zinc-200">Today</span>
                <span className="text-[0.7rem] text-zinc-400">
          {formatNow(now)}
        </span>
            </div>
        </div>
    );
}
