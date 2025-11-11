import React, { useState } from 'react';
import { Calculator as CalcIcon, Ruler } from 'lucide-react';
import Money from '../ui/Money';

export default function CalculatorPanel() {
    const [mode, setMode] = useState('ppsi'); // 'ppsi' | 'total'
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [ppsi, setPpsi] = useState('');   // price per square inch (when mode = 'ppsi')
    const [total, setTotal] = useState(''); // total price (when mode = 'total')

    const w = Number(width);
    const h = Number(height);
    const area = (isFinite(w) && isFinite(h) && w > 0 && h > 0) ? w * h : null;

    const computedTotal = (mode === 'ppsi' && area != null && ppsi !== '' && isFinite(Number(ppsi)))
        ? area * Number(ppsi)
        : null;

    const computedPpsi = (mode === 'total' && area != null && total !== '' && isFinite(Number(total)))
        ? Number(total) / area
        : null;

    return (
        <div className="grid gap-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                        <CalcIcon className="h-5 w-5 opacity-80" />
                        <h2 className="text-base md:text-lg font-semibold">Price Calculator</h2>
                    </div>

                    {/* Mode toggle */}
                    <div className="inline-flex rounded-lg border border-white/10 bg-white/5 p-1">
                        <button
                            className={`px-3 py-1.5 text-sm rounded-md ${mode === 'ppsi' ? 'bg-white text-black' : 'hover:bg-white/10'}`}
                            onClick={() => setMode('ppsi')}
                        >
                            Enter $/in² → Total
                        </button>
                        <button
                            className={`px-3 py-1.5 text-sm rounded-md ${mode === 'total' ? 'bg-white text-black' : 'hover:bg-white/10'}`}
                            onClick={() => setMode('total')}
                        >
                            Enter Total → $/in²
                        </button>
                    </div>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wide text-zinc-400 mb-1">Width (in)</label>
                        <input
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            placeholder="e.g., 16"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wide text-zinc-400 mb-1">Height (in)</label>
                        <input
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="e.g., 20"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                        />
                    </div>

                    {mode === 'ppsi' ? (
                        <div>
                            <label className="block text-xs uppercase tracking-wide text-zinc-400 mb-1">Price per in²</label>
                            <input
                                type="number"
                                inputMode="decimal"
                                step="0.01"
                                value={ppsi}
                                onChange={(e) => setPpsi(e.target.value)}
                                placeholder="e.g., 1.75"
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs uppercase tracking-wide text-zinc-400 mb-1">Total Price</label>
                            <input
                                type="number"
                                inputMode="decimal"
                                step="0.01"
                                value={total}
                                onChange={(e) => setTotal(e.target.value)}
                                placeholder="e.g., 560"
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                            />
                        </div>
                    )}
                </div>

                {/* Results */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <ResultCard
                        icon={Ruler}
                        label="Square Inches"
                        value={area != null ? `${Number.isInteger(area) ? area : Number(area.toFixed(2))} in²` : '—'}
                    />
                    {mode === 'ppsi' ? (
                        <>
                            <ResultCard
                                label="Total Price"
                                value={computedTotal != null ? <Money value={computedTotal} /> : '—'}
                            />
                            <ResultCard
                                label="Price / in²"
                                value={ppsi !== '' && isFinite(Number(ppsi)) ? (<><Money value={Number(ppsi)} /> <span className="text-zinc-400">/ in²</span></>) : '—'}
                            />
                        </>
                    ) : (
                        <>
                            <ResultCard
                                label="Total Price"
                                value={total !== '' && isFinite(Number(total)) ? <Money value={Number(total)} /> : '—'}
                            />
                            <ResultCard
                                label="Price / in²"
                                value={computedPpsi != null ? (<><Money value={computedPpsi} /> <span className="text-zinc-400">/ in²</span></>) : '—'}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function ResultCard({ icon: Icon, label, value }) {
    return (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-xs uppercase tracking-wide text-zinc-400">{label}</div>
                    <div className="mt-1 text-lg font-semibold">{value}</div>
                </div>
                {Icon ? (
                    <div className="shrink-0 rounded-lg border border-white/10 bg-white/10 p-2">
                        <Icon className="h-5 w-5 opacity-80" />
                    </div>
                ) : null}
            </div>
        </div>
    );
}
