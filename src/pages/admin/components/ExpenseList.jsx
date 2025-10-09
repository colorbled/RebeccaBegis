// components/ExpenseList.jsx
import React from 'react';
import { Pencil, Trash2, Store, Calendar, Folder, CreditCard, ImageOff } from 'lucide-react';
import Money from '../ui/Money';
import ConfirmDialog from '../ui/ConfirmDialog';

// --- ultra-robust image resolver --------------------------------------------

function isImageish(str) {
    if (typeof str !== 'string') return false;
    const s = str.trim();
    if (/^data:image\//i.test(s)) return true;
    if (/^blob:/i.test(s)) return true;
    // http(s) or relative paths that end with common image extensions
    if (/^https?:\/\//i.test(s) || s.startsWith('/')) {
        if (/\.(png|jpe?g|webp|gif|bmp|svg|heic)(\?|#|$)/i.test(s)) return true;
    }
    // Some apps store full data URLs or custom strings containing 'image' + 'base64'
    if (s.includes('base64') && /image/i.test(s)) return true;
    return false;
}

function deepFindImageUrl(value, depth = 0, seen = new Set()) {
    if (!value || depth > 4) return null;
    const t = typeof value;
    if (t === 'string') return isImageish(value) ? value : null;
    if (t !== 'object') return null;
    if (seen.has(value)) return null;
    seen.add(value);

    // Prefer common image/receipt/media-ish keys first
    const priorityKeys = [
        'receipt', 'receiptUrl', 'receiptImage', 'receipts', 'image', 'imageUrl', 'photo', 'photoUrl',
        'thumbnail', 'thumb', 'thumbUrl', 'preview', 'media', 'file', 'files', 'photos', 'images',
        'attachments', 'document', 'documents', 'picture', 'pictures', 'cover',
    ];

    const keys = Array.isArray(value)
        ? value.keys?.() ? Array.from(value.keys()) : value
        : Object.keys(value);

    // 1) Check direct string children on priority keys first
    if (!Array.isArray(value)) {
        for (const k of priorityKeys) {
            if (!(k in value)) continue;
            const v = value[k];
            if (typeof v === 'string' && isImageish(v)) return v;
            if (v && typeof v === 'object') {
                // nested object with url-ish props
                const urlLike = ['url', 'src', 'dataUrl', 'localUrl', 'preview', 'previewUrl', 'dataURL'];
                for (const uk of urlLike) {
                    const s = v?.[uk];
                    if (typeof s === 'string' && isImageish(s)) return s;
                }
            }
            if (Array.isArray(v)) {
                for (const item of v) {
                    // array item can be string or object
                    if (typeof item === 'string' && isImageish(item)) return item;
                    if (item && typeof item === 'object') {
                        const urlLike = ['url', 'src', 'dataUrl', 'localUrl', 'preview', 'previewUrl', 'dataURL'];
                        for (const uk of urlLike) {
                            const s = item?.[uk];
                            if (typeof s === 'string' && isImageish(s)) return s;
                        }
                        const nested = deepFindImageUrl(item, depth + 1, seen);
                        if (nested) return nested;
                    }
                }
            }
        }
    }

    // 2) General scan: strings first, then dive into objects/arrays
    if (Array.isArray(value)) {
        for (const item of value) {
            const r = deepFindImageUrl(item, depth + 1, seen);
            if (r) return r;
        }
    } else {
        for (const k of keys) {
            const v = value[k];
            if (typeof v === 'string' && isImageish(v)) return v;
        }
        for (const k of keys) {
            const v = value[k];
            if (v && typeof v === 'object') {
                const r = deepFindImageUrl(v, depth + 1, seen);
                if (r) return r;
            }
        }
    }

    return null;
}

function resolveExpenseImage(rec) {
    // Try explicit, receipt-first keys quickly
    const quick =
        rec?.receiptUrl ||
        rec?.receiptImage ||
        rec?.receipt?.dataUrl ||
        rec?.receipt?.url ||
        rec?.imageUrl ||
        rec?.photoUrl ||
        rec?.thumbnail ||
        null;

    if (isImageish(quick)) return quick;

    // Then do a deep search across the object
    const found = deepFindImageUrl(rec);
    // Optional: debug missing images in console
    if (!found && typeof window !== 'undefined') {
        // console.debug('[ExpenseList] No image found for expense:', rec);
    }
    return found;
}

// Fallback <img> wrapper with graceful onError -> placeholder
function CardImage({ src, alt }) {
    const [ok, setOk] = React.useState(!!src);
    React.useEffect(() => setOk(!!src), [src]);
    if (!ok) {
        return (
            <div className="h-40 w-full flex items-center justify-center text-zinc-500 bg-white/[0.02]">
                <ImageOff className="h-6 w-6" />
            </div>
        );
    }
    return (
        <img
            src={src}
            alt={alt || ''}
            className="w-full h-40 object-cover"
            loading="lazy"
            decoding="async"
            onError={() => setOk(false)}
        />
    );
}

// --- UI ----------------------------------------------------------------------

function Empty({ label = 'No expenses recorded' }) {
    return (
        <div className="text-center text-sm text-zinc-400 py-8 border border-dashed border-white/10 rounded-xl">
            {label}
        </div>
    );
}

const Field = ({ label, children }) => (
    <div className="text-sm">
        <span className="text-zinc-500">{label}: </span>
        <span className="text-zinc-200">{children ?? '—'}</span>
    </div>
);

export default function ExpenseList({ items = [], onEdit, onDelete }) {
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [pending, setPending] = React.useState(null);

    const openConfirm = (rec) => {
        setPending(rec);
        setConfirmOpen(true);
    };
    const doDelete = () => {
        if (pending) onDelete?.(pending.id);
    };

    if (!items.length) return <Empty />;

    return (
        <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((it) => {
                    const {
                        id, vendor, category, date, amount, description, paymentMethod, receiptId, notes,
                    } = it;

                    const thumb = resolveExpenseImage(it);

                    return (
                        <li key={id} className="rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden">
                            {/* Media */}
                            <CardImage src={thumb} alt={description || vendor || 'Expense'} />

                            {/* Body */}
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="text-base font-medium text-white truncate">
                                            {description || vendor || 'Expense'}
                                        </div>
                                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-zinc-400 text-sm">
                                            <div className="flex items-center gap-1.5">
                                                <Store className="h-4 w-4 opacity-80" />
                                                <span>{vendor || '—'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Folder className="h-4 w-4 opacity-80" />
                                                <span>{category || '—'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-4 w-4 opacity-80" />
                                                <span>{date || '—'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        <div className="text-lg font-semibold">
                                            <Money value={Number(amount || 0)} />
                                        </div>
                                    </div>
                                </div>

                                {(paymentMethod || receiptId) ? (
                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        {paymentMethod && (
                                            <Field label="Paid with">
                        <span className="inline-flex items-center gap-1.5">
                          <CreditCard className="h-4 w-4 opacity-80" />
                            {paymentMethod}
                        </span>
                                            </Field>
                                        )}
                                        {receiptId && <Field label="Receipt">{receiptId}</Field>}
                                    </div>
                                ) : null}

                                {notes ? <div className="mt-3 text-sm text-zinc-300">{notes}</div> : null}

                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => onEdit?.(it)}
                                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => openConfirm(it)}
                                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm text-red-300"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {/* Confirm Deletion Dialog */}
            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={doDelete}
                tone="danger"
                title="Delete this expense?"
                message={
                    pending
                        ? `Description: ${pending.description || pending.vendor || 'Expense'}\nAmount: $${Number(pending.amount || 0).toFixed(2)}\nDate: ${pending.date || '—'}`
                        : 'This action cannot be undone.'
                }
                confirmText="Delete"
                cancelText="Cancel"
            />
        </>
    );
}
