import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Field, TextArea, TextInput } from '../ui/fields';
import ImageUpload from '../ui/ImageUpload';
import { uid } from '../utils/ids';

export default function ExpenseForm({ onSave, initial }) {
    const [item, setItem] = useState(initial?.item || '');
    const [category, setCategory] = useState(initial?.category || 'Paint');
    const [vendor, setVendor] = useState(initial?.vendor || '');
    const [amount, setAmount] = useState(initial?.amount ?? '');
    const [date, setDate] = useState(initial?.date || new Date().toISOString().slice(0, 10));
    const [notes, setNotes] = useState(initial?.notes || '');
    const [receipt, setReceipt] = useState(initial?.receipt || null);
    const [err, setErr] = useState('');

    const submit = (e) => {
        e.preventDefault();
        setErr('');
        if (!item.trim()) return setErr('Item name is required.');
        if (amount === '' || isNaN(Number(amount))) return setErr('Valid amount is required.');
        if (!date) return setErr('Date is required.');
        onSave({
            id: initial?.id || uid(),
            item: item.trim(),
            category: category.trim(),
            vendor: vendor.trim(),
            amount: Number(amount),
            date,
            notes: notes.trim(),
            receipt: receipt || null,
            createdAt: initial?.createdAt || Date.now(),
        });
    };

    return (
        <form onSubmit={submit} className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Item" required>
                    <TextInput value={item} onChange={(e) => setItem(e.target.value)} placeholder="e.g., Titanium White" />
                </Field>
                <Field label="Category">
                    <TextInput value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Paint / Canvas / Frame…" />
                </Field>
                <Field label="Vendor">
                    <TextInput value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="e.g., Blick" />
                </Field>
                <Field label="Amount (USD)" required>
                    <TextInput inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 24.99" />
                </Field>
                <Field label="Date" required>
                    <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </Field>
                <Field label="Notes">
                    <TextArea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any details…" />
                </Field>
                <Field label="Receipt (optional)">
                    <ImageUpload value={receipt} onChange={setReceipt} label="Upload Receipt" />
                </Field>
            </div>
            {err && <div className="text-sm text-rose-400">{err}</div>}
            <div className="flex justify-end gap-2">
                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 border border-white/10">
                    <Check className="w-4 h-4" />
                    Save
                </button>
            </div>
        </form>
    );
}
