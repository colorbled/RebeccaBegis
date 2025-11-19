// src/components/CalendarList.jsx
import React from 'react';
import { groupByMonth } from './calendarUtils';
import CalendarTodayIndicator from './CalendarTodayIndicator';
import CalendarEmptyState from './CalendarEmptyState';
import CalendarMonthSection from './CalendarMonthSection';
import CalendarDeleteModal from './CalendarDeleteModal';

export default function CalendarList({ items = [], onEdit, onDelete, onSync }) {
    /* Live "Today" clock */
    const [now, setNow] = React.useState(new Date());
    React.useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    /* Pending delete for modal */
    const [pendingDelete, setPendingDelete] = React.useState(null);

    function handleConfirmDelete() {
        if (pendingDelete && onDelete) {
            onDelete(pendingDelete.id);
        }
        setPendingDelete(null);
    }

    /* When editing, trigger parent logic then scroll to the form section */
    function handleEdit(ev) {
        onEdit?.(ev);

        if (typeof window === 'undefined') return;

        // Give React a moment to reveal the form before scrolling
        setTimeout(() => {
            const target =
                document.getElementById('calendar-form') ||
                document.getElementById('event-form');

            if (target && typeof target.scrollIntoView === 'function') {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 50);
    }

    const hasItems = items && items.length > 0;
    const months = React.useMemo(
        () => (hasItems ? groupByMonth(items) : []),
        [hasItems, items]
    );

    return (
        <div className="space-y-4">
            <CalendarTodayIndicator now={now} />

            {!hasItems && <CalendarEmptyState />}

            {hasItems && (
                <div className="grid gap-6">
                    {months.map(({ key, label, events }) => (
                        <CalendarMonthSection
                            key={key}
                            label={label}
                            events={events}
                            onEdit={handleEdit}
                            onDelete={(ev) => setPendingDelete(ev)}
                            onSync={onSync}
                        />
                    ))}
                </div>
            )}

            {pendingDelete && (
                <CalendarDeleteModal
                    event={pendingDelete}
                    onCancel={() => setPendingDelete(null)}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
}
