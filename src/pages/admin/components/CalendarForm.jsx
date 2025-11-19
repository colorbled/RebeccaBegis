import React from 'react';
import { Check, Calendar as CalIcon } from 'lucide-react';

const CATEGORIES = ['Gallery', 'Meetup', 'Misc.'];

/** Lightweight field wrapper */
function FormField({ label, required = false, children }) {
    return (
        <div className="space-y-1">
            <span className="block text-xs font-medium tracking-wide text-zinc-400">
                {label}
                {required ? ' *' : ''}
            </span>
            {children}
        </div>
    );
}

/** Standard text input */
function TextInput(props) {
    const { className = '', ...rest } = props;
    return (
        <input
            {...rest}
            className={
                'w-full rounded-lg border border-white/12 bg-black/40 px-3 py-2 text-sm text-zinc-100 ' +
                'focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/25 ' +
                'transition-colors ' +
                className
            }
        />
    );
}

/**
 * Fully native, mobile-friendly date picker:
 * - Real <input type="date"> covers the whole area (transparent)
 * - Custom "button" underneath for visual styling
 */
function DatePickerButton({ value, onChange }) {
    let display = 'Select date';
    if (value) {
        const d = new Date(value + 'T00:00:00');
        if (!Number.isNaN(d.getTime())) {
            const month = d.toLocaleString('en-US', { month: 'short' });
            const day = d.getDate();
            const year = d.getFullYear();
            display = `${month} ${day}, ${year}`;
        }
    }

    return (
        <div className="relative">
            {/* Visual layer */}
            <div className="flex w-full items-center justify-between rounded-lg border border-white/12 bg-black/40 px-3 py-2 text-sm transition-colors hover:border-white/25 hover:bg-black/50">
                <span className={value ? 'text-zinc-100' : 'text-zinc-500'}>
                    {display}
                </span>
                <CalIcon className="h-4 w-4 text-zinc-400 shrink-0" />
            </div>

            {/* Actual interactive input */}
            <input
                type="date"
                value={value}
                onChange={onChange}
                className="
                    absolute inset-0
                    opacity-0
                    cursor-pointer
                "
            />
        </div>
    );
}

function TextArea(props) {
    const { className = '', rows, ...rest } = props;
    return (
        <textarea
            {...rest}
            rows={rows ?? 3}
            className={
                'w-full rounded-lg border border-white/12 bg-black/40 px-3 py-2 text-sm text-zinc-100 ' +
                'focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/25 ' +
                'transition-colors ' +
                className
            }
        />
    );
}

/** Clean, professional category pill buttons */
function CategoryButtons({ value, onChange }) {
    const base =
        'inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors';

    const styles = {
        'Gallery': {
            dot: 'bg-sky-400',
            active: 'border-sky-400/80 bg-sky-500/15 text-sky-100',
        },
        'Meetup': {
            dot: 'bg-amber-400',
            active: 'border-amber-400/80 bg-amber-500/15 text-amber-50',
        },
        'Misc.': {
            dot: 'bg-zinc-400',
            active: 'border-zinc-400/80 bg-zinc-700/40 text-zinc-50',
        },
    };

    return (
        <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
                const isActive = value === cat;
                const style = styles[cat];
                return (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => onChange(cat)}
                        className={
                            base +
                            ' ' +
                            (isActive
                                ? style.active
                                : 'border-white/12 bg-white/[0.03] text-zinc-300 hover:border-white/25 hover:bg-white/[0.07]')
                        }
                    >
                        <span
                            className={
                                'h-2 w-2 rounded-full ' +
                                style.dot +
                                (isActive ? '' : ' opacity-75')
                            }
                        />
                        <span>{cat}</span>
                    </button>
                );
            })}
        </div>
    );
}

export default function CalendarForm({ initial, onSave }) {
    const [title, setTitle] = React.useState(initial?.title || '');
    const [date, setDate] = React.useState(
        initial?.event_date || new Date().toISOString().slice(0, 10)
    );
    const [time, setTime] = React.useState(initial?.event_time || '12:00');
    const [category, setCategory] = React.useState(initial?.category || 'Gallery');
    const [notes, setNotes] = React.useState(initial?.notes || '');
    const [err, setErr] = React.useState('');

    const submit = async (e) => {
        e.preventDefault();
        setErr('');

        if (!title.trim()) return setErr('Title is required.');
        if (!date) return setErr('Date is required.');
        if (!time) return setErr('Time is required.');

        const payload = {
            ...(initial?.id ? { id: initial.id } : {}),
            title: title.trim(),
            event_date: date,
            event_time: time,
            category,
            notes: notes.trim() || null,
        };

        try {
            await onSave?.(payload);
        } catch (e) {
            setErr(e?.message || 'Failed to save event.');
        }
    };

    return (
        <section id="calendar-form" className="scroll-mt-24">
            <form onSubmit={submit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="Event Title" required>
                        <TextInput
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </FormField>

                    <FormField label="Date" required>
                        <DatePickerButton
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </FormField>

                    <FormField label="Time" required>
                        <TextInput
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </FormField>

                    <div className="md:col-span-3">
                        <FormField label="Category" required>
                            <CategoryButtons value={category} onChange={setCategory} />
                        </FormField>
                    </div>

                    <div className="md:col-span-3">
                        <FormField label="Notes">
                            <TextArea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </FormField>
                    </div>
                </div>

                {err && (
                    <div className="text-sm text-rose-400 border border-rose-500/40 bg-rose-500/5 rounded-lg px-3 py-2">
                        {err}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/15 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-white/25 hover:border-white/25 transition-colors"
                    >
                        <Check className="w-4 h-4" />
                        Save Event
                    </button>
                </div>
            </form>
        </section>
    );
}
