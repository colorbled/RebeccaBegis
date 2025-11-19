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

/* ---------------- ICS helpers for iOS / calendar sync ---------------- */

function pad(n) {
    return String(n).padStart(2, '0');
}

/** Convert date+time to local ICS datetime like 20251122T203000 */
function toICSDateTime(dateStr, timeStr = '00:00') {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split('-').map(Number);
    const [hh, mm] = (timeStr || '00:00').split(':').map(Number);

    const dt = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0);

    return (
        dt.getFullYear().toString() +
        pad(dt.getMonth() + 1) +
        pad(dt.getDate()) +
        'T' +
        pad(dt.getHours()) +
        pad(dt.getMinutes()) +
        '00'
    );
}

/** Simple text escaper for ICS (commas, semicolons, newlines) */
function escapeICS(text = '') {
    return String(text)
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\r?\n/g, '\\n');
}

/** Build ICS content string for a single event */
export function buildICSForEvent(ev) {
    if (!ev?.event_date) {
        return '';
    }

    const start = toICSDateTime(ev.event_date, ev.event_time || '00:00');

    // Default: 1 hour duration
    let end = start;
    if (start) {
        const [y, m, d, h, min] = [
            Number(start.slice(0, 4)),
            Number(start.slice(4, 6)),
            Number(start.slice(6, 8)),
            Number(start.slice(9, 11)),
            Number(start.slice(11, 13)),
        ];
        const dt = new Date(y, m - 1, d, h, min, 0);
        const dtEnd = new Date(dt.getTime() + 60 * 60 * 1000); // +1 hour
        end =
            dtEnd.getFullYear().toString() +
            pad(dtEnd.getMonth() + 1) +
            pad(dtEnd.getDate()) +
            'T' +
            pad(dtEnd.getHours()) +
            pad(dtEnd.getMinutes()) +
            '00';
    }

    const now = new Date();
    const dtStamp =
        now.getFullYear().toString() +
        pad(now.getMonth() + 1) +
        pad(now.getDate()) +
        'T' +
        pad(now.getHours()) +
        pad(now.getMinutes()) +
        pad(now.getSeconds());

    const uidBase = ev.id || `${ev.event_date}-${ev.event_time || '0000'}`;
    const uid = `${uidBase}@art-portfolio-calendar`;

    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Art Portfolio Calendar//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtStamp}`,
        start ? `DTSTART:${start}` : null,
        end ? `DTEND:${end}` : null,
        `SUMMARY:${escapeICS(ev.title || 'Untitled Event')}`,
        ev.notes ? `DESCRIPTION:${escapeICS(ev.notes)}` : null,
        'END:VEVENT',
        'END:VCALENDAR',
    ].filter(Boolean);

    // ICS prefers CRLF
    return lines.join('\r\n');
}
