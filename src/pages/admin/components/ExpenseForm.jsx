import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Field, TextArea, TextInput } from '../ui/fields';
import ImageUpload from '../ui/ImageUpload';
// import { uid } from '../utils/ids'; // ❌ let the DB generate id for new rows

export default function ExpenseForm({ onSave, initial }) {
    // Prefer new schema fields, fall back to older names so editing works
    const [item, setItem] = useState(initial?.description || initial?.item || '');
    const [category, setCategory] = useState(initial?.category || 'Paint');
    const [vendor, setVendor] = useState(initial?.vendor || '');
    const [amount, setAmount] = useState(initial?.amount ?? '');
    const [date, setDate] = useState(initial?.date || new Date().toISOString().slice(0, 10));
    const [notes, setNotes] = useState(initial?.notes || '');
    const [receipt, setReceipt] = useState(
        initial?.image_url || initial?.receipt || null   // ✅ stop depending on receipt_url
    );
    const [err, setErr] = useState('');

    const submit = async (e) => {
        e.preventDefault();
        setErr('');

        if (!item.trim()) return setErr('Item/description is required.');
        if (amount === '' || isNaN(Number(amount))) return setErr('Valid amount is required.');
        if (!date) return setErr('Date is required.');

        // Build a DB-friendly payload (snake_case, only known columns)
        const payload = {
            // Only send id when editing an existing row; let DB generate new ids
            ...(initial?.id ? { id: initial.id } : {}),
            description: item.trim(),
            category: category.trim() || null,
            vendor: vendor.trim() || null,
            amount: Number(amount),
            date,
            notes: notes.trim() || null,
            image_url: receipt || null,   // ✅ keep only image_url
            // No createdAt; DB default created_at handles timestamps
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
                <Field label="Item / Description" required>
                    <TextInput
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                        placeholder="e.g., Titanium White"
                    />
                </Field>

                <Field label="Category">
                    <TextInput
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Paint / Canvas / Frame…"
                    />
                </Field>

                <Field label="Vendor">
                    <TextInput
                        value={vendor}
                        onChange={(e) => setVendor(e.target.value)}
                        placeholder="e.g., Blick"
                    />
                </Field>

                <Field label="Amount (USD)" required>
                    <TextInput
                        inputMode="decimal"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="e.g., 24.99"
                    />
                </Field>

                <Field label="Date" required>
                    <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </Field>

                <Field label="Notes">
                    <TextArea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any details…"
                    />
                </Field>

                <Field label="Receipt / Photo (optional)">
                    <ImageUpload value={receipt} onChange={setReceipt} label="Upload Receipt" />
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
