// src/components/CalendarEventRow.jsx
import React from 'react';
import { Calendar as CalIcon, Clock, Tag } from 'lucide-react';
import CalendarEventActions from './CalendarEventActions';
import {
    CATEGORY_STYLES,
    CATEGORY_ACCENT,
    formatDateFriendly,
    formatTimeFriendly,
    isEventPast,
} from './calendarUtils';

export default function CalendarEventRow({ ev, onEdit, onDelete, onSync }) {
    const dateStr = formatDateFriendly(ev.event_date);
    const timeStr = formatTimeFriendly(ev.event_time);
    const catStyle = CATEGORY_STYLES[ev.category] || CATEGORY_STYLES['Misc.'];
    const accent = CATEGORY_ACCENT[ev.category] || CATEGORY_ACCENT['Misc.'];
    const past = isEventPast(ev);

    // For date pill
    let dayNum = null;
    let dowShort = null;
    if (ev.event_date) {
        const d = new Date(ev.event_date + 'T00:00:00');
        if (!Number.isNaN(d.getTime())) {
            dayNum = d.getDate();
            dowShort = d.toLocaleDateString('en-US', {
                weekday: 'short',
            });
        }
    }

    return (
        <li
            className={`
        group
        border-l-2 ${accent}
        px-4 py-3 sm:px-5 sm:py-4
        transition
        bg-white/[0.015]
        hover:bg-white/[0.04]
        ${past ? 'opacity-60' : ''}
      `}
        >
            <div className="flex items-start gap-4">
                {/* Date pill */}
                <div className="mt-0.5 hidden sm:flex">
                    <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-zinc-950/70 px-2.5 py-1.5 shadow-inner shadow-black/40 min-w-[3rem]">
                        <div className="text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500">
                            {dowShort || '—'}
                        </div>
                        <div className="text-lg font-semibold text-zinc-100 leading-none mt-0.5">
                            {dayNum || '–'}
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        {/* Title & meta */}
                        <div className="min-w-0">
                            <div
                                className={`font-medium truncate ${
                                    past ? 'text-zinc-300' : 'text-zinc-50'
                                }`}
                            >
                                {ev.title || 'Untitled Event'}
                            </div>

                            {/* Meta row(s) */}
                            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-2 text-[0.78rem] text-zinc-400">
                                <div className="inline-flex items-center gap-1.5">
                                    <CalIcon className="h-3.5 w-3.5 opacity-80" />
                                    <span>{dateStr}</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 opacity-80" />
                                    <span>{timeStr}</span>
                                </div>
                                {ev.category && (
                                    <span
                                        className={`
                      inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.7rem]
                      ${catStyle}
                    `}
                                    >
                    <Tag className="h-3 w-3" />
                                        {ev.category}
                  </span>
                                )}
                                {past && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/70 bg-zinc-900/80 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.18em] text-zinc-300">
                    Past
                  </span>
                                )}
                            </div>

                            {ev.notes && (
                                <div className="mt-2 text-[0.8rem] leading-relaxed text-zinc-300 whitespace-pre-wrap">
                                    {ev.notes}
                                </div>
                            )}
                        </div>

                        <CalendarEventActions
                            ev={ev}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onSync={onSync}
                        />
                    </div>
                </div>
            </div>
        </li>
    );
}
