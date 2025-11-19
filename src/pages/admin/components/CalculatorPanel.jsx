// src/components/CalculatorPanel.jsx
import React from 'react';
import { supabase } from '../lib/supabaseClient';
import Money from '../ui/Money';

import DimensionsCard from './calculator/DimensionsCard';
import PricingCard from './calculator/PricingCard';
import SummaryCard from './calculator/SummaryCard';

// ---------- helpers ----------
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const fmtMoney = (n) => (Number.isFinite(n) ? Number(n).toFixed(2) : '0.00');
const fmtPpi   = (n) => (Number.isFinite(n) ? Number(n).toFixed(2) : '0.00');
const fmtInt   = (n) => (Number.isFinite(n) ? String(Math.round(n)) : '0');

// Defaults if user has no saved prefs
const DEFAULT_TIERS = { cheap: 0.5, medium: 1.0, expensive: 1.5 };

// Dark, compact pills that pop on the pricing card
export const TIER_STYLES = {
    cheap: {
        chip:  'border-cyan-400/40 bg-cyan-400/10 hover:bg-cyan-400/15 focus:ring-cyan-300/20',
        label: 'text-cyan-200',
        value: 'text-cyan-100'
    },
    medium: {
        chip:  'border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/15 focus:ring-amber-300/20',
        label: 'text-amber-200',
        value: 'text-amber-100'
    },
    expensive: {
        chip:  'border-emerald-400/40 bg-emerald-400/10 hover:bg-emerald-400/15 focus:ring-emerald-300/20',
        label: 'text-emerald-200',
        value: 'text-emerald-100'
    }
};

export function classifyPpi(ppi, tiers) {
    const p = Number(ppi);
    const c = Number(tiers.cheap);
    const m = Number(tiers.medium);
    const e = Number(tiers.expensive);
    if (!Number.isFinite(p) || p <= 0) return { label: '—', toneText: 'text-zinc-300' };
    const eq = (a, b) => Math.abs(a - b) <= 0.005;
    if (p < c)   return { label: 'Less than Cheap Price',     toneText: 'text-cyan-200' };
    if (eq(p,c)) return { label: 'Cheap price',               toneText: 'text-cyan-200' };
    if (p < m)   return { label: 'Less than Medium Price',    toneText: 'text-amber-200' };
    if (eq(p,m)) return { label: 'Medium price',              toneText: 'text-amber-200' };
    if (p < e)   return { label: 'Less than Expensive Price', toneText: 'text-emerald-200' };
    if (eq(p,e)) return { label: 'Expensive price',           toneText: 'text-emerald-200' };
    return { label: 'Above Expensive Price',                  toneText: 'text-emerald-200' };
}

export default function CalculatorPanel() {
    // ----- state (persisted to session) -----
    const [w, setW]         = React.useState(() => sessionStorage.getItem('calc_w') ?? '');
    const [h, setH]         = React.useState(() => sessionStorage.getItem('calc_h') ?? '');
    const [ppi, setPpi]     = React.useState(() => sessionStorage.getItem('calc_ppi') ?? '');
    const [total, setTotal] = React.useState(() => sessionStorage.getItem('calc_total') ?? '');

    const [tiers, setTiers] = React.useState(DEFAULT_TIERS);

    // Load user tiers from pricing_prefs once
    React.useEffect(() => {
        let mounted = true;
        (async () => {
            const { data: session } = await supabase.auth.getSession();
            const uid = session?.session?.user?.id;
            if (!uid) return;
            const { data } = await supabase
                .from('pricing_prefs')
                .select('cheap_ppi, medium_ppi, expensive_ppi')
                .eq('user_id', uid)
                .limit(1)
                .maybeSingle();
            if (!mounted) return;
            if (data) {
                setTiers({
                    cheap: Number(data.cheap_ppi ?? DEFAULT_TIERS.cheap),
                    medium: Number(data.medium_ppi ?? DEFAULT_TIERS.medium),
                    expensive: Number(data.expensive_ppi ?? DEFAULT_TIERS.expensive),
                });
            }
        })();
        return () => { mounted = false; };
    }, []);

    // Persist to session
    React.useEffect(() => { sessionStorage.setItem('calc_w', String(w)); }, [w]);
    React.useEffect(() => { sessionStorage.setItem('calc_h', String(h)); }, [h]);
    React.useEffect(() => { sessionStorage.setItem('calc_ppi', String(ppi)); }, [ppi]);
    React.useEffect(() => { sessionStorage.setItem('calc_total', String(total)); }, [total]);

    // ----- derived -----
    const width  = num(w);
    const height = num(h);
    const area   = width > 0 && height > 0 ? width * height : 0;

    const displayTotal = fmtMoney(ppi !== '' && area > 0 ? num(ppi) * area : num(total));
    const displayPpi   = fmtPpi(total !== '' && area > 0 ? num(total) / area : num(ppi));
    const displayArea  = fmtInt(area);
    const tierBadge    = classifyPpi(Number(displayPpi), tiers);

    // ----- handlers (sync both inputs) -----
    const onChangePpi = (raw) => {
        const clean = raw.replace(/[^\d.]/g, '');
        setPpi(clean);
        const p = num(clean);
        if (area > 0) setTotal(fmtMoney(p * area));
        else setTotal('');
    };

    const onChangeTotal = (raw) => {
        const clean = raw.replace(/[^\d.]/g, '');
        setTotal(clean);
        const t = num(clean);
        if (area > 0) setPpi(fmtPpi(t / area));
        else setPpi('');
    };

    const onChangeW = (raw) => {
        const clean = raw.replace(/[^\d.]/g, '');
        setW(clean);
        const newW = num(clean);
        const newArea = (newW > 0 && height > 0) ? newW * height : 0;
        if (newArea > 0) {
            if (ppi !== '') setTotal(fmtMoney(num(ppi) * newArea));
            else if (total !== '') setPpi(fmtPpi(num(total) / newArea));
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

    const applyTier = (value) => {
        const v = Number(value) || 0;
        setPpi(fmtPpi(v));
        if (area > 0) setTotal(fmtMoney(v * area));
    };

    const clearAll = () => { setW(''); setH(''); setPpi(''); setTotal(''); };

    // Quick sizes for Dimensions
    const presets = [
        [8,10], [11,14], [12,16], [16,20], [18,24], [24,30], [24,36], [30,40]
    ];

    return (
        <div className="mx-auto w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
            <DimensionsCard
                w={w}
                h={h}
                onChangeW={onChangeW}
                onChangeH={onChangeH}
                presets={presets}
                onApplyPreset={(pw, ph) => {
                    setW(String(pw)); setH(String(ph));
                    const a = pw * ph;
                    if (num(ppi) > 0) setTotal(fmtMoney(num(ppi) * a));
                    else if (num(total) > 0) setPpi(fmtPpi(num(total) / a));
                }}
            />

            <PricingCard
                ppi={ppi}
                total={total}
                onChangePpi={onChangePpi}
                onChangeTotal={onChangeTotal}
                tiers={tiers}
                onApplyTier={applyTier}
                onClear={clearAll}
            />

            <SummaryCard
                width={width}
                height={height}
                areaStr={displayArea}
                totalStr={displayTotal}
                ppiStr={displayPpi}
                tierBadge={tierBadge}
                Money={Money}
            />
        </div>
    );
}
