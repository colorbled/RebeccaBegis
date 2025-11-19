// src/components/calendarUtils.js

/* Category colors for pills / accents */
export const CATEGORY_STYLES = {
    Gallery: 'text-sky-300 border-sky-500/30 bg-sky-500/10',
    Meetup: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
    'Misc.': 'text-zinc-300 border-zinc-500/30 bg-zinc-500/10',
};

export const CATEGORY_ACCENT = {
    Gallery: 'border-l-sky-400/70',
    Meetup: 'border-l-amber-400/70',
    'Misc.': 'border-l-zinc-500/70',
};

/* Ordinal suffix for day numbers */
function ordinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/* Date like "November 22nd, 2025" */
export function formatDateFriendly(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    if (Number.isNaN(d.getTime())) return '—';
    const month = d.toLocaleString('en-US', { month: 'long' });
    const day = ordinal(d.getDate());
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
}

/* Time like "8:30 PM" (no seconds) */
export function formatTimeFriendly(timeStr) {
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
export function isEventPast(ev) {
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
export function groupByMonth(items) {
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
