import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { fileToDataURL } from '../utils/images';

export default function ImageUpload({ value, onChange, label = 'Upload' }) {
    const [busy, setBusy] = useState(false);

    const handleFile = async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setBusy(true);
        try {
            const dataUrl = await fileToDataURL(f);
            onChange?.(dataUrl);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer">
                <ImageIcon className="w-4 h-4" />
                <span className="text-sm">{label}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
            {busy && <span className="text-xs text-zinc-400">Processing…</span>}
            {value && (
                <img src={value} alt="preview" className="h-12 w-12 rounded-md object-cover border border-white/10" />
            )}
        </div>
    );
}
