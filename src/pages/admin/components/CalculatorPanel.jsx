// src/components/CalculatorPanel.jsx
import React from 'react';
import { Calculator, Ruler, Square, ArrowLeftRight, RefreshCw } from 'lucide-react';
import Money from '../ui/Money';

function num(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}

export default function CalculatorPanel() {
    const [mode, setMode] = React.useState('ppi'); // 'ppi' -> enter price per in²; 'total' -> enter total price
    const [w, setW] = React.useState('');
    const [h, setH] = React.useState('');
    const [pricePerIn, setPricePerIn] = React.useState(''); // used in 'ppi' mode
    const [totalPrice, setTotalPrice] = React.useState(''); // used in 'total' mode

    const width = num(w);
    const height = num(h);
    const squareInches = width > 0 && height > 0 ? width * height : 0;

    // Derived values
    const computedTotal =
        mode === 'ppi' && squareInches > 0 && num(pricePerIn) >= 0
            ? squareInches * num(pricePerIn)
            : 0;

    const computedPricePerIn =
        mode === 'total' && squareInches > 0 && num(totalPrice) >= 0
            ? num(totalPrice) / squareInches
            : 0;

    const clearAll = () => {
        setW('');
        setH('');
        setPricePerIn('');
        setTotalPrice('');
    };

    const swapDims = () => {
        setW(h);
        setH(w);
    };

    // Display helpers
    const fmtInches = (n) => (Number.isFinite(n) ? String(n).replace(/\.0+$/,'') : '0');
    const fmtNum = (n, digits = 2) =>
        Number.isFinite(n) ? Number(n).toFixed(digits).replace(/\.00$/, '') : '0';

    // Quick size chips
    const presets = [
        [8,10], [11,14], [12,12], [12,16], [16,20], [18,24], [24,30], [24,36], [30,40]
    ];

    return (
        <div className="mx-auto w-full max-w-3xl">
            {/* Calculator chrome */}
            <div className="rounded-[1.25rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.03] shadow-lg overflow-hidden">
                {/* Top bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/30 backdrop-blur">
                    <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <Calculator className="h-4 w-4" />
                        Painting Price Calculator
                    </div>
                    <button
                        onClick={clearAll}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs"
                        title="Clear"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Clear
                    </button>
                </div>

                {/* Display */}
                <div className="px-5 pt-5">
                    <div className="rounded-xl bg-black/40 border border-white/10 p-4 md:p-5">
                        <div className="text-[11px] uppercase tracking-wide text-zinc-400 mb-1">
                            {mode === 'ppi' ? 'Total (calculated)' : 'Price per in² (calculated)'}
                        </div>

                        <div className="text-3xl md:text-4xl font-semibold tabular-nums text-white">
                            {mode === 'ppi' ? (
                                <Money value={computedTotal || 0} />
                            ) : (
                                <>
                                    ${fmtNum(computedPricePerIn, 4)}
                                    <span className="ml-1 text-base text-zinc-400">/in²</span>
                                </>
                            )}
                        </div>

                        {/* Sub-display */}
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                            <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 flex items-center justify-between">
                                <span className="text-zinc-400">Width</span>
                                <span className="tabular-nums text-zinc-100">{fmtInches(width)} in</span>
                            </div>
                            <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 flex items-center justify-between">
                                <span className="text-zinc-400">Height</span>
                                <span className="tabular-nums text-zinc-100">{fmtInches(height)} in</span>
                            </div>
                            <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 flex items-center justify-between col-span-2 md:col-span-1">
                                <span className="text-zinc-400">Square Inches</span>
                                <span className="tabular-nums text-zinc-100">{fmtInches(squareInches)} in²</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mode Switch */}
                <div className="px-5 pt-4">
                    <div className="inline-grid grid-cols-2 rounded-lg border border-white/10 bg-white/[0.04] p-1">
                        <button
                            className={`px-3 py-2 text-sm rounded-md transition ${
                                mode === 'ppi'
                                    ? 'bg-white text-black'
                                    : 'text-zinc-300 hover:bg-white/10'
                            }`}
                            onClick={() => setMode('ppi')}
                        >
                            Enter $ / in²
                        </button>
                        <button
                            className={`px-3 py-2 text-sm rounded-md transition ${
                                mode === 'total'
                                    ? 'bg-white text-black'
                                    : 'text-zinc-300 hover:bg-white/10'
                            }`}
                            onClick={() => setMode('total')}
                        >
                            Enter Total $
                        </button>
                    </div>
                </div>

                {/* Inputs + keypad-ish controls */}
                <div className="px-5 py-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Dimensions card */}
                    <div className="md:col-span-2 rounded-xl border border-white/10 bg-white/[0.035] p-4">
                        <div className="flex items-center gap-2 text-sm text-zinc-300 mb-3">
                            <Ruler className="h-4 w-4" />
                            Dimensions (inches)
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <input
                                inputMode="decimal"
                                placeholder="Width"
                                value={w}
                                onChange={(e) => setW(e.target.value.replace(/[^\d.]/g, ''))}
                                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-zinc-100 placeholder:text-zinc-500"
                            />
                            <input
                                inputMode="decimal"
                                placeholder="Height"
                                value={h}
                                onChange={(e) => setH(e.target.value.replace(/[^\d.]/g, ''))}
                                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-zinc-100 placeholder:text-zinc-500"
                            />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <button
                                onClick={swapDims}
                                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs"
                                title="Swap Width/Height"
                            >
                                <ArrowLeftRight className="h-4 w-4" />
                                Swap
                            </button>

                            {/* Quick presets */}
                            <div className="flex flex-wrap gap-2">
                                {presets.map(([pw, ph]) => (
                                    <button
                                        key={`${pw}x${ph}`}
                                        onClick={() => { setW(String(pw)); setH(String(ph)); }}
                                        className="rounded-md border border-white/10 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 text-xs text-zinc-200"
                                        title={`${pw}×${ph} in`}
                                    >
                                        {pw}×{ph}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Price card */}
                    <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                        <div className="flex items-center gap-2 text-sm text-zinc-300 mb-3">
                            <Square className="h-4 w-4" />
                            {mode === 'ppi' ? 'Price per in²' : 'Total Price'}
                        </div>

                        {mode === 'ppi' ? (
                            <div className="space-y-3">
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                                    <input
                                        inputMode="decimal"
                                        placeholder="e.g. 1.25"
                                        value={pricePerIn}
                                        onChange={(e) => setPricePerIn(e.target.value.replace(/[^\d.]/g, ''))}
                                        className="w-full rounded-lg border border-white/10 bg-black/40 pl-7 pr-3 py-2 text-zinc-100 placeholder:text-zinc-500"
                                    />
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">/in²</span>
                                </div>

                                <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm flex items-center justify-between">
                                    <span className="text-zinc-400">Total</span>
                                    <span className="font-medium text-zinc-100">
                    <Money value={computedTotal || 0} />
                  </span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                                    <input
                                        inputMode="decimal"
                                        placeholder="e.g. 400"
                                        value={totalPrice}
                                        onChange={(e) => setTotalPrice(e.target.value.replace(/[^\d.]/g, ''))}
                                        className="w-full rounded-lg border border-white/10 bg-black/40 pl-7 pr-3 py-2 text-zinc-100 placeholder:text-zinc-500"
                                    />
                                </div>

                                <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm flex items-center justify-between">
                                    <span className="text-zinc-400">Price per in²</span>
                                    <span className="font-medium text-zinc-100">
                    ${fmtNum(computedPricePerIn, 4)}
                  </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer bar */}
                <div className="px-5 pb-5">
                    <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-xs text-zinc-400 flex items-center justify-between">
                        <span>Tip: set dimensions, then switch modes to compare strategies.</span>
                        <span className="hidden sm:block">Values are not saved — this is a sandbox.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
