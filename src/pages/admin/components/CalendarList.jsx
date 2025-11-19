// src/components/CalendarList.jsx
import React from 'react';
import { Calendar as CalIcon, Clock, Tag, Pencil, Trash2 } from 'lucide-react';

/* Category colors */
const CATEGORY_STYLES = {
    Gallery: 'text-sky-300 border-sky-500/30 bg-sky-500/10',
    Meetup:  'text-amber-300 border-amber-500/30 bg-amber-500/10',
    'Misc.': 'text-zinc-300 border-zinc-500/30 bg-zinc-500/10',
};

/* Ordinal suffix for day numbers */
function ordinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/* Date like "November 22nd, 2025" */
function formatDateFriendly(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    if (Number.isNaN(d.getTime())) return '—';
    const month = d.toLocaleString('en-US', { month: 'long' });
    const day = ordinal(d.getDate());
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
}

/* Time like "8:30 PM" (no seconds) */
function formatTimeFriendly(timeStr) {
    if (!timeStr) return '—';
    const d = new Date(`1970-01-01T${timeStr}`);
    if (Number.isNaN(d.getTime())) return timeStr;
    return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

/* Is this event in the past? */
function isEventPast(ev) {
    if (!ev?.event_date) return false;
    const timePart =
        ev.event_time && /^\d{2}:\d{2}/.test(ev.event_time)
            ? ev.event_time
            : '00:00';
    const dt = new Date(`${ev.event_date}T${timePart}`);
    if (Number.isNaN(dt.getTime())) return false;
    return dt.getTime() < Date.now();
}

/* Group events by YYYY-MM */
function groupByMonth(items) {
    const groups = new Map();
    for (const ev of items) {
        const key = (ev.event_date || '').slice(0, 7);
        if (!key) continue;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(ev);
    }
    return Array.from(groups.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, list]) => {
            const [y, m] = key.split('-').map(Number);
            const label = new Date(y, (m || 1) - 1, 1).toLocaleString('en-US', {
                month: 'long',
                year: 'numeric',
            });
            const sorted = [...list].sort((e1, e2) => {
                const dt1 = new Date(
                    `${e1.event_date}T${e1.event_time || '00:00'}`
                ).getTime();
                const dt2 = new Date(
                    `${e2.event_date}T${e2.event_time || '00:00'}`
                ).getTime();
                return dt1 - dt2;
            });
            return { key, label, events: sorted };
        });
}

export default function CalendarList({ items = [], onEdit, onDelete }) {
    /* Live "Today" clock */
    const [now, setNow] = React.useState(new Date());
    React.useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    /* Pending delete for modal */
    const [pendingDelete, setPendingDelete] = React.useState(null);

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

    function handleConfirmDelete() {
        if (pendingDelete && onDelete) {
            onDelete(pendingDelete.id);
        }
        setPendingDelete(null);
    }

    if (!items.length) {
        return (
            <div>
                <div className="flex justify-end text-sm text-zinc-400 mb-2 pr-1">
                    <span className="px-3 py-1 rounded-md border border-white/10 bg-white/5">
                        Today: {formatNow(now)}
                    </span>
                </div>
                <div className="text-center text-sm text-zinc-400 py-8 border border-dashed border-white/10 rounded-xl">
                    No upcoming events
                </div>

                {/* Delete confirm modal (will never show here, but keep structure consistent) */}
                {pendingDelete && (
                    <DeleteModal
                        event={pendingDelete}
                        onCancel={() => setPendingDelete(null)}
                        onConfirm={handleConfirmDelete}
                    />
                )}
            </div>
        );
    }

    const months = groupByMonth(items);

    return (
        <div>
            {/* Today indicator */}
            <div className="flex justify-end text-sm text-zinc-400 mb-2 pr-1">
                <span className="px-3 py-1 rounded-md border border-white/10 bg-white/5">
                    Today: {formatNow(now)}
                </span>
            </div>

            <div className="grid gap-6">
                {months.map(({ key, label, events }) => (
                    <section
                        key={key}
                        className="rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden"
                    >
                        <header className="px-4 py-2 border-b border-white/10 text-sm text-zinc-300">
                            {label}
                        </header>

                        <ul className="divide-y divide-white/10">
                            {events.map((ev) => {
                                const dateStr = formatDateFriendly(ev.event_date);
                                const timeStr = formatTimeFriendly(ev.event_time);
                                const catStyle =
                                    CATEGORY_STYLES[ev.category] ||
                                    CATEGORY_STYLES['Misc.'];
                                const past = isEventPast(ev);

                                return (
                                    <li
                                        key={ev.id}
                                        className={`p-4 transition-opacity ${
                                            past ? 'opacity-60' : ''
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div
                                                    className={`font-medium truncate ${
                                                        past ? 'text-zinc-300' : 'text-white'
                                                    }`}
                                                >
                                                    {ev.title || 'Untitled Event'}
                                                </div>

                                                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-400">
                                                    <div className="inline-flex items-center gap-1.5">
                                                        <CalIcon className="h-4 w-4 opacity-80" />
                                                        <span>{dateStr}</span>
                                                    </div>
                                                    <div className="inline-flex items-center gap-1.5">
                                                        <Clock className="h-4 w-4 opacity-80" />
                                                        <span>{timeStr}</span>
                                                    </div>

                                                    {ev.category && (
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs ${catStyle}`}
                                                        >
                                                            <Tag className="h-3.5 w-3.5" />
                                                            {ev.category}
                                                        </span>
                                                    )}

                                                    {past && (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-600/60 bg-zinc-900/70 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-zinc-300">
                                                            Past event
                                                        </span>
                                                    )}
                                                </div>

                                                {ev.notes && (
                                                    <div className="mt-2 text-sm text-zinc-300 whitespace-pre-wrap">
                                                        {ev.notes}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Desktop actions */}
                                            <div className="hidden sm:flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => onEdit?.(ev)}
                                                    className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 px-2 py-1 text-xs"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => setPendingDelete(ev)}
                                                    className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-rose-600/20 px-2 py-1 text-xs text-rose-300"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        {/* Mobile actions */}
                                        <div className="mt-3 flex sm:hidden gap-2">
                                            <button
                                                onClick={() => onEdit?.(ev)}
                                                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs w-full"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => setPendingDelete(ev)}
                                                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-rose-600/20 px-3 py-1.5 text-xs text-rose-300 w-full"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                ))}
            </div>

            {/* Delete confirmation modal */}
            {pendingDelete && (
                <DeleteModal
                    event={pendingDelete}
                    onCancel={() => setPendingDelete(null)}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
}

/* Simple inline modal component */
function DeleteModal({ event, onCancel, onConfirm }) {
    const dateLabel = event?.event_date
        ? formatDateFriendly(event.event_date)
        : null;

    return (
        <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-sm rounded-xl border border-white/10 bg-zinc-900/95 p-4 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-semibold text-zinc-100">
                        Delete event?
                    </h2>
                </div>

                <p className="text-sm text-zinc-300">
                    Are you sure you want to delete{' '}
                    <span className="font-medium text-white">
                        {event?.title || 'this event'}
                    </span>
                    {dateLabel ? (
                        <>
                            {' '}
                            scheduled for{' '}
                            <span className="text-zinc-200">{dateLabel}</span>?
                        </>
                    ) : (
                        '?'
                    )}
                </p>

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs text-zinc-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="inline-flex items-center justify-center rounded-md border border-rose-500/70 bg-rose-600/80 hover:bg-rose-500 px-3 py-1.5 text-xs text-white"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
