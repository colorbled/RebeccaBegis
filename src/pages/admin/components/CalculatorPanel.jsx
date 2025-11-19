// src/components/CalculatorPanel.jsx
import React from 'react';
import { Calculator, Ruler, Grid3X3, Maximize2, Maximize } from 'lucide-react';
import Money from '../ui/Money';
import { supabase } from '../lib/supabaseClient';

// numeric helper
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

// simple rounding helpers
const fmtMoney = (n) => (Number.isFinite(n) ? Number(n).toFixed(2) : '0.00');
const fmtPpi   = (n) => (Number.isFinite(n) ? Number(n).toFixed(2) : '0.00');
const fmtInt   = (n) => (Number.isFinite(n) ? String(Math.round(n)) : '0');

// default tiers if none saved
const DEFAULT_TIERS = { cheap: 0.5, medium: 1.0, expensive: 1.5 };

// color styling to match your Prices panel
const TIER_STYLES = {
    cheap:     { chip: 'bg-cyan-500/15 text-cyan-200 border-cyan-300/20 hover:bg-cyan-500/20',     label: 'text-cyan-300' },
    medium:    { chip: 'bg-amber-500/15 text-amber-200 border-amber-300/20 hover:bg-amber-500/20', label: 'text-amber-300' },
    expensive: { chip: 'bg-emerald-500/15 text-emerald-200 border-emerald-300/20 hover:bg-emerald-500/20', label: 'text-emerald-300' },
};

export default function CalculatorPanel() {
    // session-persisted calculator state
    const [w, setW] = React.useState(() => sessionStorage.getItem('calc_w') ?? '');
    const [h, setH] = React.useState(() => sessionStorage.getItem('calc_h') ?? '');
    const [ppi, setPpi] = React.useState(() => sessionStorage.getItem('calc_ppi') ?? '');
    const [total, setTotal] = React.useState(() => sessionStorage.getItem('calc_total') ?? '');

    // tiers (from DB or defaults)
    const [tiers, setTiers] = React.useState(DEFAULT_TIERS);

    // load tiers once
    React.useEffect(() => {
        let mounted = true;
        (async () => {
            const { data: session } = await supabase.auth.getSession();
            const uid = session?.session?.user?.id;
            if (!uid) return;
            const { data, error } = await supabase
                .from('pricing_prefs')
                .select('cheap_ppi, medium_ppi, expensive_ppi')
                .eq('user_id', uid)
                .limit(1)
                .maybeSingle();
            if (!mounted) return;
            if (!error && data) {
                setTiers({
                    cheap:     Number(data.cheap_ppi ?? DEFAULT_TIERS.cheap),
                    medium:    Number(data.medium_ppi ?? DEFAULT_TIERS.medium),
                    expensive: Number(data.expensive_ppi ?? DEFAULT_TIERS.expensive),
                });
            }
        })();
        return () => { mounted = false; };
    }, []);

    // persist calc fields to session
    React.useEffect(() => { sessionStorage.setItem('calc_w', String(w)); }, [w]);
    React.useEffect(() => { sessionStorage.setItem('calc_h', String(h)); }, [h]);
    React.useEffect(() => { sessionStorage.setItem('calc_ppi', String(ppi)); }, [ppi]);
    React.useEffect(() => { sessionStorage.setItem('calc_total', String(total)); }, [total]);

    // numbers
    const width  = num(w);
    const height = num(h);
    const area   = width > 0 && height > 0 ? width * height : 0;

    // sync logic (two-way): update derived when user changes either input
    // price per in² input change
    const onChangePpi = (raw) => {
        const clean = raw.replace(/[^\d.]/g, '');
        setPpi(clean);
        const p = num(clean);
        if (area > 0) setTotal(fmtMoney(p * area));
        else setTotal('');
    };
    // total price input change
    const onChangeTotal = (raw) => {
        const clean = raw.replace(/[^\d.]/g, '');
        setTotal(clean);
        const t = num(clean);
        if (area > 0) setPpi(fmtPpi(t / area));
        else setPpi('');
    };
    // dimension changes -> keep both derived fields consistent
    const onChangeW = (raw) => {
        const clean = raw.replace(/[^\d.]/g, '');
        setW(clean);
        const newW = num(clean);
        const newArea = (newW > 0 && height > 0) ? newW * height : 0;
        if (newArea > 0) {
            if (ppi !== '') setTotal(fmtMoney(num(ppi) * newArea));
            else if (total !== '') setPpi(fmtPpi(num(total) / newArea));
        } else {
            // if area collapses, keep raw inputs but no forced sync
        }
    };
    const onChangeH = (raw) => {
        const clean = raw.replace(/[^\d.]/g, '');
        setH(clean);
        const newH = num(clean);
        const newArea = (width > 0 && newH > 0) ? width * newH : 0;
        if (newArea > 0) {
            if (ppi !== '') setTotal(fmtMoney(num(ppi) * newArea));
            else if (total !== '') setPpi(fmtPpi(num(total) / newArea));
        }
    };

    // computed (pretty) displays
    const displayTotal = fmtMoney(ppi !== '' && area > 0 ? num(ppi) * area : num(total));
    const displayPpi   = fmtPpi(total !== '' && area > 0 ? num(total) / area : num(ppi));
    const displayArea  = fmtInt(area);

    // apply tier shortcut to price-per-in²
    const applyTier = (value) => {
        const v = Number(value) || 0;
        setPpi(fmtPpi(v));
        if (area > 0) setTotal(fmtMoney(v * area));
    };

    // quick presets
    const presets = [
        [8,10], [11,14], [12,16], [16,20], [18,24], [24,30], [24,36], [30,40]
    ];

    return (
        <div className="mx-auto w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Dimensions block (subtle variation) */}
            <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-sm text-zinc-300 mb-3">
                    <Ruler className="h-4 w-4" />
                    Dimensions (inches)
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <Maximize2 className="h-4 w-4" />
            </span>
                        <input
                            inputMode="decimal"
                            placeholder=""
                            value={w}
                            onChange={(e) => onChangeW(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/40 pl-9 pr-3 py-2 text-zinc-100 placeholder:text-zinc-500"
                            aria-label="Width (inches)"
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">in</span>
                    </div>

                    <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <Maximize className="h-4 w-4 -rotate-90" />
            </span>
                        <input
                            inputMode="decimal"
                            placeholder=""
                            value={h}
                            onChange={(e) => onChangeH(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/40 pl-9 pr-3 py-2 text-zinc-100 placeholder:text-zinc-500"
                            aria-label="Height (inches)"
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">in</span>
                    </div>
                </div>

                {/* Quick presets */}
                <div className="mt-3 flex flex-wrap gap-2">
                    {presets.map(([pw, ph]) => (
                        <button
                            key={`${pw}x${ph}`}
                            onClick={() => { setW(String(pw)); setH(String(ph)); if (num(ppi) > 0) setTotal(fmtMoney(num(ppi)*pw*ph)); else if (num(total)>0) setPpi(fmtPpi(num(total)/(pw*ph))); }}
                            className="rounded-md border border-white/10 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 text-xs text-zinc-200"
                            title={`${pw}×${ph} in`}
                        >
                            {pw}×{ph}
                        </button>
                    ))}
                </div>

                {/* Dimension summary (grouped/clear) */}
                <div className="mt-4 rounded-lg border border-white/10 bg-black/35 p-3 space-y-2">
                    <div className="text-xs uppercase tracking-wide text-zinc-400">Dimensions Summary</div>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-3 py-2">
              <span className="inline-flex items-center gap-2 text-zinc-400">
                <Maximize2 className="h-4 w-4" /> Width
              </span>
                            <span className="tabular-nums text-zinc-100">{fmtInt(width)} in</span>
                        </div>
                        <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-3 py-2">
              <span className="inline-flex items-center gap-2 text-zinc-400">
                <Maximize className="h-4 w-4 -rotate-90" /> Height
              </span>
                            <span className="tabular-nums text-zinc-100">{fmtInt(height)} in</span>
                        </div>
                        <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-3 py-2">
              <span className="inline-flex items-center gap-2 text-zinc-400">
                <Grid3X3 className="h-4 w-4" /> Square Inches
              </span>
                            <span className="tabular-nums text-zinc-100">{displayArea} in²</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing block */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-center gap-2 text-sm text-zinc-300 mb-3">
                    <Calculator className="h-4 w-4" />
                    Pricing
                </div>

                {/* Inputs at the top */}
                <div className="space-y-3">
                    {/* Total Price */}
                    <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                        <input
                            inputMode="decimal"
                            value={total}
                            onChange={(e) => onChangeTotal(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/40 pl-7 pr-3 py-2 text-zinc-100"
                            aria-label="Total Price"
                        />
                    </div>

                    {/* Price per in² */}
                    <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                        <input
                            inputMode="decimal"
                            value={ppi}
                            onChange={(e) => onChangePpi(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/40 pl-7 pr-10 py-2 text-zinc-100"
                            aria-label="Price per square inch"
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs inline-flex items-center gap-1">
              <Grid3X3 className="h-3.5 w-3.5 opacity-80" /> /in²
            </span>
                    </div>

                    {/* NEW: Tier shortcuts */}
                    <div className="grid grid-cols-3 gap-2">
                        {(['cheap','medium','expensive']).map((key) => {
                            const val = tiers[key];
                            const styles = TIER_STYLES[key];
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => applyTier(val)}
                                    className={`rounded-lg border px-3 py-2 text-sm tabular-nums ${styles.chip}`}
                                    title={`${key[0].toUpperCase()+key.slice(1)}: $${fmtPpi(val)} / in²`}
                                >
                                    <div className={`text-[11px] uppercase tracking-wide ${styles.label}`}>{key}</div>
                                    <div>${fmtPpi(val)} / in²</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Calculated first (highlight) */}
                <div className="mt-5 grid gap-2">
                    <div className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm flex items-center justify-between">
                        <span className="text-emerald-300">Total (calculated)</span>
                        <span className="font-semibold text-emerald-100">
              <Money value={Number(displayTotal)} />
            </span>
                    </div>
                    <div className="rounded-lg border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm flex items-center justify-between">
            <span className="text-cyan-300 inline-flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" /> Price per in² (calculated)
            </span>
                        <span className="font-semibold text-cyan-100">${displayPpi}</span>
                    </div>
                </div>

                {/* Clear button at the bottom of pricing */}
                <div className="mt-4">
                    <button
                        onClick={() => { setW(''); setH(''); setPpi(''); setTotal(''); }}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm"
                    >
                        Clear
                    </button>
                </div>
            </section>
        </div>
    );
}
