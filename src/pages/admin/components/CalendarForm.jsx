import React from 'react';
import { Check } from 'lucide-react';

const CATEGORIES = ['Gallery','Meetup','Misc.'];

/** Lightweight field wrapper to replace ./ui/fields */
function FormField({ label, required = false, children }) {
    return (
        <label className="block">
      <span className="block text-xs font-medium text-zinc-400 mb-1">
        {label}{required ? ' *' : ''}
      </span>
            {children}
        </label>
    );
}

/** Inputs styled like the rest of your admin UI */
function TextInput(props) {
    return (
        <input
            {...props}
            className={
                'w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-zinc-100 ' +
                'placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/10 ' +
                (props.className || '')
            }
        />
    );
}

function TextArea(props) {
    return (
        <textarea
            {...props}
            className={
                'w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-zinc-100 ' +
                'placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/10 ' +
                (props.className || '')
            }
            rows={props.rows ?? 3}
        />
    );
}

export default function CalendarForm({ initial, onSave }) {
    const [title, setTitle] = React.useState(initial?.title || '');
    const [date, setDate] = React.useState(
        initial?.event_date || new Date().toISOString().slice(0,10)
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
        <form onSubmit={submit} className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Event Title" required>
                    <TextInput
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                        placeholder="e.g., Opening at East Hall"
                    />
                </FormField>

                <FormField label="Date" required>
                    <TextInput
                        type="date"
                        value={date}
                        onChange={(e)=>setDate(e.target.value)}
                    />
                </FormField>

                <FormField label="Time" required>
                    <TextInput
                        type="time"
                        value={time}
                        onChange={(e)=>setTime(e.target.value)}
                    />
                </FormField>

                <FormField label="Category" required>
                    <select
                        value={category}
                        onChange={(e)=>setCategory(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-white/10"
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </FormField>

                <div className="md:col-span-3">
                    <FormField label="Notes">
                        <TextArea
                            value={notes}
                            onChange={(e)=>setNotes(e.target.value)}
                            placeholder="Optional details…"
                        />
                    </FormField>
                </div>
            </div>

            {err && <div className="text-sm text-rose-400">{err}</div>}

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 border border-white/10"
                >
                    <Check className="w-4 h-4" />
                    Save
                </button>
            </div>
        </form>
    );
}
