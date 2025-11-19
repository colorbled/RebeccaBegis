// src/components/CalendarDeleteModal.jsx
import React from 'react';
import { createPortal } from 'react-dom';
import { Trash2 } from 'lucide-react';
import { formatDateFriendly } from './calendarUtils';

export default function CalendarDeleteModal({ event, onCancel, onConfirm }) {
    const dateLabel = event?.event_date
        ? formatDateFriendly(event.event_date)
        : null;

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/95 to-zinc-950/95 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.85)]">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/40">
                        <Trash2 className="h-4 w-4 text-rose-300" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-sm font-semibold text-zinc-50">
                            Delete event?
                        </h2>
                        <p className="mt-1 text-xs text-zinc-300 leading-relaxed">
                            Are you sure you want to delete{' '}
                            <span className="font-medium text-zinc-50">
                {event?.title || 'this event'}
              </span>
                            {dateLabel ? (
                                <>
                                    {' '}
                                    scheduled for{' '}
                                    <span className="text-zinc-100">{dateLabel}</span>?
                                </>
                            ) : (
                                '?'
                            )}
                            {' '}This action cannot be undone.
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-zinc-100 hover:bg-white/[0.08] hover:border-white/20 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="inline-flex items-center justify-center rounded-full border border-rose-500/60 bg-rose-600/90 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-rose-500 hover:border-rose-400 transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
