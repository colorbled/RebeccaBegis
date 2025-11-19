// src/components/CalculatorPanel.jsx
import React from 'react';
import { Calculator, Ruler, RefreshCw } from 'lucide-react';
import Money from '../ui/Money';

function num(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}
const sanitize = (s) => s.replace(/[^\d.]/g, '');

export default function CalculatorPanel() {
    const [w, setW] = React.useState('');
    const [h, setH] = React.useState('');
    const [pricePerIn, setPricePerIn] = React.useState(''); // editable
    const [totalPrice, setTotalPrice] = React.useState(''); // editable
    const [lastEdited, setLastEdited] = React.useState(null); // 'ppi' | 'total' | null

    const width = num(w);
    const height = num(h);
    const squareInches = width > 0 && height > 0 ? width * height : 0;

    // Recompute the counterpart whenever dimensions change
    React.useEffect(() => {
        if (!squareInches) return;
        if (lastEdited === 'ppi' && pricePerIn !== '') {
            const t = squareInches * num(pricePerIn);
            setTotalPrice(t ? String(t) : '');
        } else if (lastEdited === 'total' && totalPrice !== '') {
            const p = num(totalPrice) / squareInches;
            setPricePerIn(Number.isFinite(p) ? String(p) : '');
        }
    }, [squareInches]); // eslint-disable-line react-hooks/exhaustive-deps

    const onChangePpi = (s) => {
        const v = sanitize(s);
        setPricePerIn(v);
        setLastEdited('ppi');
        if (squareInches) {
            const t = squareInches * num(v);
            setTotalPrice(v === '' ? '' : String(t));
        }
    };

    const onChangeTotal = (s) => {
        const v = sanitize(s);
        setTotalPrice(v);
        setLastEdited('total');
        if (squareInches) {
            const p = num(v) / squareInches;
            setPricePerIn(v === '' ? '' : (Number.isFinite(p) ? String(p) : ''));
        }
    };

    const onChangeW = (s) => setW(sanitize(s));
    const onChangeH = (s) => setH(sanitize(s));

    const clearAll = () => {
        setW(''); setH(''); setPricePerIn(''); setTotalPrice(''); setLastEdited(null);
    };

    // Formatting (rounded like bottom fields)
    const fmtNum = (n, digits = 2) =>
        Number.isFinite(n) ? Number(n).toFixed(digits).replace(/\.?0+$/, '') : '0';
    const fmtPpi = (n) => fmtNum(n, 4);

    const presets = [
        [8,10], [11,14], [12,12], [12,16], [16,20], [18,24], [24,30], [24,36], [30,40]
    ];

    const primaryTotal = num(totalPrice) || (squareInches * num(pricePerIn));
    const primaryPpi   = num(pricePerIn) || (squareInches ? num(totalPrice) / squareInches : 0);

    return (
        <div className="mx-auto w-full max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Dimensions */}
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
                            onChange={(e) => onChangeW(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-zinc-100 placeholder:text-zinc-500"
                        />
                        <input
                            inputMode="decimal"
                            placeholder="Height"
                            value={h}
                            onChange={(e) => onChangeH(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-zinc-100 placeholder:text-zinc-500"
                        />
                    </div>

                    {/* Quick presets */}
                    <div className="mt-3 flex flex-wrap gap-2">
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

                {/* Pricing */}
                <div className="md:col-span-1 rounded-xl border border-white/10 bg-white/[0.035] p-4">
                    <div className="flex items-center gap-2 text-sm text-zinc-300 mb-3">
                        <Calculator className="h-4 w-4" />
                        Pricing
                    </div>

                    {/* TWO EDITABLE INPUTS, STACKED */}
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs uppercase tracking-wide text-zinc-400">Total Price</label>
                            <div className="relative mt-1">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                                <input
                                    inputMode="decimal"
                                    placeholder="e.g. 400"
                                    value={totalPrice}
                                    onChange={(e) => onChangeTotal(e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-black/40 pl-7 pr-3 py-2 text-zinc-100 placeholder:text-zinc-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-wide text-zinc-400">Price per in²</label>
                            <div className="relative mt-1">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                                <input
                                    inputMode="decimal"
                                    placeholder="e.g. 1.25"
                                    value={pricePerIn}
                                    onChange={(e) => onChangePpi(e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-black/40 pl-7 pr-3 py-2 text-zinc-100 placeholder:text-zinc-500"
                                />
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">/in²</span>
                            </div>
                        </div>
                    </div>

                    {/* ⬆️ MOVED ABOVE: CALCULATED SUMMARY (with subtle emphasis) */}
                    <div className="mt-4 space-y-2">
                        <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/[0.08] px-3 py-2 text-sm flex items-center justify-between">
                            <span className="text-emerald-200/90">Total (calculated)</span>
                            <span className="font-semibold text-emerald-100">
                <Money value={primaryTotal || 0} />
              </span>
                        </div>
                        <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/[0.08] px-3 py-2 text-sm flex items-center justify-between">
                            <span className="text-cyan-200/90">Price per in² (calculated)</span>
                            <span className="font-semibold text-cyan-100">
                ${fmtPpi(primaryPpi)}
              </span>
                        </div>
                    </div>

                    {/* DIMENSIONS SUMMARY (rounded like below) */}
                    <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3">
                        <div className="text-[11px] uppercase tracking-wide text-zinc-400 mb-2">
                            Dimensions Summary
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 flex items-center justify-between">
                                <span className="text-zinc-400">Width</span>
                                <span className="tabular-nums text-zinc-100">{fmtNum(width, 2)} in</span>
                            </div>
                            <div className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 flex items-center justify-between">
                                <span className="text-zinc-400">Height</span>
                                <span className="tabular-nums text-zinc-100">{fmtNum(height, 2)} in</span>
                            </div>
                            <div className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 flex items-center justify-between col-span-2">
                                <span className="text-zinc-400">Square Inches</span>
                                <span className="tabular-nums text-zinc-100">{fmtNum(squareInches, 2)} in²</span>
                            </div>
                        </div>
                    </div>

                    {/* CLEAR */}
                    <div className="mt-3">
                        <button
                            onClick={clearAll}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm"
                            title="Clear"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
