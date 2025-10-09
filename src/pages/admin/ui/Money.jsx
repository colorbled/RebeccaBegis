import React from 'react';

export default function Money({ value }) {
    const num = Number(value || 0);
    return (
        <span>${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    );
}
