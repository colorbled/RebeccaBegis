import React from 'react';

export function Field({ label, children, required }) {
    return (
        <label className="grid gap-1">
      <span className="text-xs uppercase tracking-wide text-zinc-400">
        {label} {required && <span className="text-rose-400">*</span>}
      </span>
            {children}
        </label>
    );
}

export function TextInput(props) {
    return (
        <input
            {...props}
            className={[
                'w-full rounded-lg bg-white/5 border border-white/10',
                'px-3 py-2 text-sm outline-none focus:border-white/20',
                props.className || '',
            ].join(' ')}
        />
    );
}

export function TextArea(props) {
    return (
        <textarea
            {...props}
            rows={props.rows ?? 4}
            className={[
                'w-full rounded-lg bg-white/5 border border-white/10',
                'px-3 py-2 text-sm outline-none focus:border-white/20',
                props.className || '',
            ].join(' ')}
        />
    );
}
