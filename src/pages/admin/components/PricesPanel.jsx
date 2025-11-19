// src/components/PricesPanel.jsx
import React from 'react';
import { Grid3X3 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export const TIER_COLORS = {
    cheap:     { name: 'Cheap',     text: 'text-cyan-300',     chip: 'bg-cyan-500/15 text-cyan-200 border-cyan-300/20',     ring: 'ring-cyan-400/40' },
    medium:    { name: 'Medium',    text: 'text-amber-300',    chip: 'bg-amber-500/15 text-amber-200 border-amber-300/20',   ring: 'ring-amber-400/40' },
    expensive: { name: 'Expensive', text: 'text-emerald-300',  chip: 'bg-emerald-500/15 text-emerald-200 border-emerald-300/20', ring: 'ring-emerald-400/40' },
};

const DEFAULTS = { cheap_ppi: 0.5, medium_ppi: 1.0, expensive_ppi: 1.5 };
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

function TierCard({ label, color, value, onChange }) {
    return (
        <div className={`rounded-xl border border-white/10 bg-white/[0.04] p-4 focus-within:ring-2 ${color.ring}`}>
            <div className="flex items-center justify-between">
                <div className={`text-sm font-medium ${color.text}`}>{label}</div>
                <span className={`text-xs px-2 py-1 rounded-md border ${color.chip}`}>${num(value).toFixed(2)} / in²</span>
            </div>

            <div className="mt-3 relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                <input
                    inputMode="decimal"
                    value={value}
                    onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ''))}
                    placeholder=""
                    className="w-full rounded-lg border border-white/10 bg-black/40 pl-7 pr-10 py-2 text-zinc-100 placeholder:text-zinc-500"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs inline-flex items-center gap-1">
          <Grid3X3 className="h-3.5 w-3.5 opacity-80" /> /in²
        </span>
            </div>
        </div>
    );
}

export default function PricesPanel() {
    // 👇 uses pricing_prefs now
    const TABLE = 'pricing_prefs';

    const [cheap, setCheap] = React.useState(String(DEFAULTS.cheap_ppi));
    const [medium, setMedium] = React.useState(String(DEFAULTS.medium_ppi));
    const [expensive, setExpensive] = React.useState(String(DEFAULTS.expensive_ppi));
    const [saving, setSaving] = React.useState(false);
    const [msg, setMsg] = React.useState('');
    const [err, setErr] = React.useState('');

    React.useEffect(() => {
        let mounted = true;
        (async () => {
            setErr('');
            const { data: session } = await supabase.auth.getSession();
            const uid = session?.session?.user?.id;
            if (!uid) return;

            const { data, error } = await supabase
                .from(TABLE)
                .select('*')
                .eq('user_id', uid)
                .limit(1)
                .maybeSingle();

            if (error) { console.warn(`[${TABLE}] load (maybe empty):`, error); return; }
            if (mounted && data) {
                if (data.cheap_ppi != null) setCheap(String(data.cheap_ppi));
                if (data.medium_ppi != null) setMedium(String(data.medium_ppi));
                if (data.expensive_ppi != null) setExpensive(String(data.expensive_ppi));
            }
        })();
        return () => { mounted = false; };
    }, []);

    const save = async () => {
        setMsg(''); setErr(''); setSaving(true);
        try {
            const { data: session } = await supabase.auth.getSession();
            const uid = session?.session?.user?.id;
            if (!uid) throw new Error('Not signed in');

            const payload = {
                user_id: uid,
                cheap_ppi: num(cheap),
                medium_ppi: num(medium),
                expensive_ppi: num(expensive),
            };

            // upsert on unique user_id
            const { error } = await supabase
                .from(TABLE)
                .upsert(payload, { onConflict: 'user_id' });
            if (error) throw error;

            setMsg('Saved.');
        } catch (e) {
            setErr(e?.message || 'Failed to save.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TierCard label="Cheap"     color={TIER_COLORS.cheap}     value={cheap}     onChange={setCheap} />
                <TierCard label="Medium"    color={TIER_COLORS.medium}    value={medium}    onChange={setMedium} />
                <TierCard label="Expensive" color={TIER_COLORS.expensive} value={expensive} onChange={setExpensive} />
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={save}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-white/90 text-black hover:bg-white px-3 py-2 text-sm font-medium shadow-sm disabled:opacity-60"
                >
                    Save Prices
                </button>
                {msg && <span className="text-sm text-emerald-300">{msg}</span>}
                {err && <span className="text-sm text-rose-300">{err}</span>}
            </div>

            {/* Stacked summary */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300 space-y-2">
                <div className="flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4 opacity-80" />
                    <span className={`${TIER_COLORS.cheap.text} font-medium`}>Cheap:</span>
                    <span>${num(cheap).toFixed(2)} / in²</span>
                </div>
                <div className="flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4 opacity-80" />
                    <span className={`${TIER_COLORS.medium.text} font-medium`}>Medium:</span>
                    <span>${num(medium).toFixed(2)} / in²</span>
                </div>
                <div className="flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4 opacity-80" />
                    <span className={`${TIER_COLORS.expensive.text} font-medium`}>Expensive:</span>
                    <span>${num(expensive).toFixed(2)} / in²</span>
                </div>
            </div>
        </div>
    );
}
