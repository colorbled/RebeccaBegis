import React from 'react';
import { Pencil, Trash2, User, Calendar, Tag, ImageOff } from 'lucide-react';
import Money from '../ui/Money';
import ConfirmDialog from '../ui/ConfirmDialog';

/**
 * Try very hard to find a usable URL for a record's image.
 * You can override by passing a `getImage` prop to this component.
 */
function getThumb(rec) {
    if (!rec || typeof rec !== 'object') return null;

    // 1) Direct scalar string fields
    const scalarKeys = [
        'thumbnail', 'thumb', 'thumbUrl', 'preview', 'image', 'imageUrl', 'photo', 'photoUrl', 'url', 'src', 'dataUrl', 'localUrl'
    ];
    for (const k of scalarKeys) {
        const v = rec[k];
        if (typeof v === 'string' && v) return v;
    }

    // 2) Direct nested objects with common url-ish keys
    const objKeys = ['thumbnail', 'thumb', 'image', 'photo', 'cover', 'media', 'receipt', 'file'];
    const urlLikeKeys = ['url', 'src', 'dataUrl', 'localUrl', 'preview'];
    for (const k of objKeys) {
        const v = rec[k];
        if (v && typeof v === 'object') {
            for (const uk of urlLikeKeys) {
                if (typeof v[uk] === 'string' && v[uk]) return v[uk];
            }
        }
    }

    // 3) Arrays that might contain strings or objects ({url|src|dataUrl})
    const arrayKeys = ['photos', 'images', 'files', 'attachments', 'receipts', 'media', 'pictures'];
    for (const a of arrayKeys) {
        const arr = rec[a];
        if (Array.isArray(arr) && arr.length) {
            // prefer objects that have a url-ish key; else fall back to first string
            for (const item of arr) {
                if (item && typeof item === 'object') {
                    for (const uk of urlLikeKeys) {
                        if (typeof item[uk] === 'string' && item[uk]) return item[uk];
                    }
                } else if (typeof item === 'string' && item) {
                    return item;
                }
            }
        }
    }

    // 4) Common upload shapes saved from inputs
    // e.g. { file: { name, type, dataUrl } } OR { fileList: [{ dataUrl }] }
    if (rec.file?.dataUrl) return rec.file.dataUrl;
    if (Array.isArray(rec.fileList) && rec.fileList[0]?.dataUrl) return rec.fileList[0].dataUrl;

    return null;
}

function Empty({ label = 'No sales yet' }) {
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

export default function SoldList({ items = [], onEdit, onDelete, getImage }) {
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
                        id, title, buyer, date, price, size, medium, notes, series, sku,
                    } = it;

                    const thumb = typeof getImage === 'function' ? getImage(it) : getThumb(it);

                    return (
                        <li key={id} className="rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden">
                            {/* Media */}
                            <div className="relative bg-white/[0.02]">
                                {thumb ? (
                                    <img
                                        src={thumb}
                                        alt={title || 'Artwork'}
                                        className="w-full h-40 object-cover"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                ) : (
                                    <div className="h-40 w-full flex items-center justify-center text-zinc-500">
                                        <ImageOff className="h-6 w-6" />
                                    </div>
                                )}
                            </div>

                            {/* Body */}
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="text-base font-medium text-white truncate">
                                            {title || 'Untitled'}
                                        </div>
                                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-zinc-400 text-sm">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-4 w-4 opacity-80" />
                                                <span>{date || '—'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <User className="h-4 w-4 opacity-80" />
                                                <span>{buyer || '—'}</span>
                                            </div>
                                            {series ? (
                                                <div className="flex items-center gap-1.5">
                                                    <Tag className="h-4 w-4 opacity-80" />
                                                    <span>{series}</span>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        <div className="text-lg font-semibold">
                                            <Money value={Number(price || 0)} />
                                        </div>
                                    </div>
                                </div>

                                {(size || medium || sku) ? (
                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        {size && <Field label="Size">{size}</Field>}
                                        {medium && <Field label="Medium">{medium}</Field>}
                                        {sku && <Field label="SKU">{sku}</Field>}
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
                title="Delete this sale?"
                message={
                    pending
                        ? `Title: ${pending.title || 'Untitled'}\nBuyer: ${pending.buyer || '—'}\nDate: ${pending.date || '—'}`
                        : 'This action cannot be undone.'
                }
                confirmText="Delete"
                cancelText="Cancel"
            />
        </>
    );
}
