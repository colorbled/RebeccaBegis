import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Field, TextArea, TextInput } from '../ui/fields';
import ImageUpload from '../ui/ImageUpload';
// import { uid } from '../utils/ids'; // ❌ not needed if DB generates uuid

export default function SoldForm({ onSave, initial }) {
    const [title, setTitle] = useState(initial?.title || '');
    const [price, setPrice] = useState(initial?.price ?? '');
    const [buyer, setBuyer] = useState(initial?.buyer || '');
    const [date, setDate] = useState(initial?.date || new Date().toISOString().slice(0, 10));
    const [notes, setNotes] = useState(initial?.notes || '');
    // accept either 'thumb' (old) or 'image_url' (DB column)
    const [thumb, setThumb] = useState(initial?.image_url || initial?.thumb || null);
    const [err, setErr] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        setErr('');

        if (!title.trim()) return setErr('Title is required.');
        if (price === '' || isNaN(Number(price))) return setErr('Valid price is required.');
        if (!date) return setErr('Date is required.');

        // Build a DB-friendly payload (snake_case, no createdAt)
        const payload = {
            // Only send id when editing; let DB generate id on create
            ...(initial?.id ? { id: initial.id } : {}),
            title: title.trim(),
            price: Number(price),
            buyer: buyer.trim() || null,
            date,
            notes: notes.trim() || null,
            image_url: thumb || null, // ✅ matches Supabase column
        };

        try {
            await onSave?.(payload);
        } catch (e) {
            setErr(e?.message || 'Failed to save.');
        }
    };

    return (
        <form onSubmit={submit} className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Painting Title" required>
                    <TextInput
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Evening Garden"
                    />
                </Field>

                <Field label="Price (USD)" required>
                    <TextInput
                        inputMode="decimal"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g., 650"
                    />
                </Field>

                <Field label="Buyer">
                    <TextInput
                        value={buyer}
                        onChange={(e) => setBuyer(e.target.value)}
                        placeholder="Name or gallery"
                    />
                </Field>

                <Field label="Date Sold" required>
                    <TextInput
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </Field>

                <Field label="Notes">
                    <TextArea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any details…"
                    />
                </Field>

                <Field label="Thumbnail / Photo">
                    <ImageUpload value={thumb} onChange={setThumb} />
                    <span className="text-xs text-zinc-400 mt-1">Images are resized for storage.</span>
                </Field>
            </div>

            {err && <div className="text-sm text-rose-400">{err}</div>}

            <div className="flex justify-end gap-2">
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
