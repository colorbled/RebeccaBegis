// src/components/calculator/PricingCard.jsx
import React from 'react';
import { Calculator, Grid3X3 } from 'lucide-react';
import { TIER_STYLES } from '../CalculatorPanel';

export default function PricingCard({
                                        ppi, total, onChangePpi, onChangeTotal, tiers, onApplyTier, onClear
                                    }) {
    return (
        <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 md:p-5">
            <div className="flex items-center gap-2 text-sm text-zinc-300 mb-3">
                <Calculator className="h-4 w-4" />
                Pricing
            </div>

            <div className="space-y-3">
                <label className="block">
                    <span className="block text-xs text-zinc-400 mb-1">Total Price</span>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                        <input
                            inputMode="decimal"
                            value={total}
                            onChange={(e) => onChangeTotal(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/40 pl-7 pr-3 py-2.5 text-zinc-100"
                            aria-label="Total Price"
                        />
                    </div>
                </label>

                <label className="block">
                    <span className="block text-xs text-zinc-400 mb-1">Price per in²</span>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                        <input
                            inputMode="decimal"
                            value={ppi}
                            onChange={(e) => onChangePpi(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/40 pl-7 pr-10 py-2.5 text-zinc-100"
                            aria-label="Price per square inch"
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs inline-flex items-center gap-1">
              <Grid3X3 className="h-3.5 w-3.5 opacity-80" /> /in²
            </span>
                    </div>
                </label>

                {/* Tier shortcuts — compact dark pills */}
                <div className="grid grid-cols-3 gap-2">
                    {(['cheap','medium','expensive']).map((key) => {
                        const val = tiers[key];
                        const styles = TIER_STYLES[key];
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => onApplyTier(val)}
                                className={`rounded-lg border px-2.5 py-2 ${styles.chip} whitespace-nowrap text-left shadow-sm focus:outline-none focus:ring-2`}
                                title={`${key[0].toUpperCase()+key.slice(1)}: $${Number(val).toFixed(2)} / in²`}
                            >
                                <div className={`text-[10px] uppercase tracking-wide ${styles.label}`}>
                                    {key}
                                </div>
                                <div className={`tabular-nums font-medium leading-5 text-xs sm:text-sm ${styles.value}`}>
                                    ${Number(val).toFixed(2)} <span className="text-[10px] sm:text-xs text-zinc-300">/ in²</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Clear */}
                <div className="pt-2">
                    <button
                        onClick={onClear}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </section>
    );
}
