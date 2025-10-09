import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function ConfirmDialog({
                                          open,
                                          onClose,          // () => void
                                          onConfirm,        // () => void
                                          title = 'Are you sure?',
                                          message = 'This action cannot be undone.',
                                          confirmText = 'Delete',
                                          cancelText = 'Cancel',
                                          tone = 'danger',  // 'danger' | 'default'
                                      }) {
    const dialogRef = React.useRef(null);

    React.useEffect(() => {
        if (!open) return;

        const onKey = (e) => {
            if (e.key === 'Escape') onClose?.();
            if (e.key === 'Tab') {
                // basic focus trap within modal
                const focusable = dialogRef.current?.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (!focusable || !focusable.length) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', onKey);
        };
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
            aria-modal="true"
            role="dialog"
            onMouseDown={(e) => {
                // close on backdrop click (but not when clicking inside the panel)
                if (e.target === e.currentTarget) onClose?.();
            }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Panel */}
            <div
                ref={dialogRef}
                className="relative w-full sm:w-[480px] mx-3 sm:mx-0 rounded-2xl border border-white/10 bg-white/[0.06] shadow-xl"
            >
                <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-10" />
                <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-semibold">{title}</h3>
                            <p className="mt-1 text-sm text-zinc-300">{message}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 p-2"
                            aria-label="Close"
                            autoFocus
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="mt-5 flex flex-col sm:flex-row gap-2 sm:justify-end">
                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm?.();
                                onClose?.();
                            }}
                            className={`w-full sm:w-auto inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium shadow-sm
                ${tone === 'danger'
                                ? 'bg-red-500/90 hover:bg-red-500 text-white'
                                : 'bg-white/90 hover:bg-white text-black'
                            }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
