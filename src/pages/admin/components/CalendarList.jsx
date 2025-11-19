// src/components/CalendarList.jsx
import React from 'react';
import { createPortal } from 'react-dom';
import {
    Calendar as CalIcon,
    Clock,
    Tag,
    Pencil,
    Trash2,
    Smartphone,
} from 'lucide-react';

/* Category colors for pills / accents */
const CATEGORY_STYLES = {
    Gallery: 'text-sky-300 border-sky-500/30 bg-sky-500/10',
    Meetup:  'text-amber-300 border-amber-500/30 bg-amber-500/10',
    'Misc.': 'text-zinc-300 border-zinc-500/30 bg-zinc-500/10',
};

const CATEGORY_ACCENT = {
    Gallery: 'border-l-sky-400/70',
    Meetup:  'border-l-amber-400/70',
    'Misc.': 'border-l-zinc-500/70',
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

export default function CalendarList({ items = [], onEdit, onDelete, onSync }) {
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

    /* When editing, trigger parent logic then scroll to the form section */
    function handleEdit(ev) {
        onEdit?.(ev);

        if (typeof window === 'undefined') return;

        // Give React a moment to reveal the form before scrolling
        setTimeout(() => {
            const target =
                document.getElementById('calendar-form') ||
                document.getElementById('event-form');

            if (target && typeof target.scrollIntoView === 'function') {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 50);
    }

    const hasItems = items && items.length > 0;
    const months = hasItems ? groupByMonth(items) : [];

    return (
        <div className="space-y-4">
            {/* Today indicator (no "Calendar" subheading) */}
            <div className="flex justify-end items-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 shadow-sm shadow-black/40 backdrop-blur">
                    <CalIcon className="h-3.5 w-3.5 text-zinc-300" />
                    <span className="text-xs font-medium text-zinc-200">
                        Today
                    </span>
                    <span className="text-[0.7rem] text-zinc-400">
                        {formatNow(now)}
                    </span>
                </div>
            </div>

            {!hasItems && (
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
            )}

            {hasItems && (
                <div className="grid gap-6">
                    {months.map(({ key, label, events }) => (
                        <section
                            key={key}
                            className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-zinc-950/60 shadow-[0_18px_40px_rgba(0,0,0,0.55)] overflow-hidden"
                        >
                            <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.03] backdrop-blur-sm">
                                <div className="text-sm font-medium text-zinc-100">
                                    {label}
                                </div>
                                <div className="text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
                                    Events
                                </div>
                            </header>

                            <ul className="divide-y divide-white/5">
                                {events.map((ev) => {
                                    const dateStr = formatDateFriendly(ev.event_date);
                                    const timeStr = formatTimeFriendly(ev.event_time);
                                    const catStyle =
                                        CATEGORY_STYLES[ev.category] ||
                                        CATEGORY_STYLES['Misc.'];
                                    const accent =
                                        CATEGORY_ACCENT[ev.category] ||
                                        CATEGORY_ACCENT['Misc.'];
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
                                            key={ev.id}
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
                                                                    past
                                                                        ? 'text-zinc-300'
                                                                        : 'text-zinc-50'
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

                                                        {/* Desktop actions: icon-only circular buttons */}
                                                        <div className="hidden sm:flex items-center gap-2 shrink-0">
                                                            <button
                                                                onClick={() => handleEdit(ev)}
                                                                type="button"
                                                                title="Edit event"
                                                                aria-label="Edit event"
                                                                className="inline-flex h-9 w-9 items-center justify-center rounded-full !p-0 border border-white/15 bg-white/[0.04] text-zinc-100 hover:bg-white/[0.12] hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </button>

                                                            <button
                                                                onClick={() => setPendingDelete(ev)}
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
                                                    </div>

                                                    {/* Mobile actions: icon-only circular buttons */}
                                                    <div className="mt-3 flex sm:hidden justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(ev)}
                                                            type="button"
                                                            title="Edit event"
                                                            aria-label="Edit event"
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-full !p-0 border border-white/15 bg-white/[0.04] text-zinc-100 hover:bg-white/[0.12] hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>

                                                        <button
                                                            onClick={() => setPendingDelete(ev)}
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
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    ))}
                </div>
            )}

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

/* Sleek confirm modal, rendered via portal and centered in viewport */
function DeleteModal({ event, onCancel, onConfirm }) {
    const dateLabel = event?.event_date
        ? formatDateFriendly(event.event_date)
        : null;

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/95 to-zinc-950/95 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.85)]">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/40">
                        <Trash2 className="h-4 w-4 text-rose-300" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-sm font-semibold text-zinc-50">
                            Delete event?
                        </h2>
                        <p className="mt-1 text-xs text-zinc-300 leading-relaxed">
                            Are you sure you want to delete{' '}
                            <span className="font-medium text-zinc-50">
                                {event?.title || 'this event'}
                            </span>
                            {dateLabel ? (
                                <>
                                    {' '}
                                    scheduled for{' '}
                                    <span className="text-zinc-100">{dateLabel}</span>?
                                </>
                            ) : (
                                '?'
                            )}
                            {' '}This action cannot be undone.
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-zinc-100 hover:bg-white/[0.08] hover:border-white/20 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="inline-flex items-center justify-center rounded-full border border-rose-500/60 bg-rose-600/90 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-rose-500 hover:border-rose-400 transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
