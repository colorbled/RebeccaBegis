// src/components/calculator/SummaryCard.jsx
import React from 'react';
import { ListChecks, MoveHorizontal, MoveVertical, Grid3X3 } from 'lucide-react';

export default function SummaryCard({
                                        width, height, areaStr, totalStr, ppiStr, tierBadge, Money
                                    }) {
    return (
        <section className="md:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
            <div className="flex items-center gap-2 text-sm text-zinc-300 mb-3">
                <ListChecks className="h-4 w-4" />
                Summary
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-3 py-2">
          <span className="inline-flex items-center gap-2 text-zinc-300">
            <MoveHorizontal className="h-4 w-4 opacity-80" /> Width
          </span>
                    <span className="tabular-nums text-white">{Math.round(width)} in</span>
                </div>

                <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-3 py-2">
          <span className="inline-flex items-center gap-2 text-zinc-300">
            <MoveVertical className="h-4 w-4 opacity-80" /> Height
          </span>
                    <span className="tabular-nums text-white">{Math.round(height)} in</span>
                </div>

                <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-3 py-2">
          <span className="inline-flex items-center gap-2 text-zinc-300">
            <Grid3X3 className="h-4 w-4 opacity-80" /> Square Inches
          </span>
                    <span className="tabular-nums text-white">{areaStr} in²</span>
                </div>

                <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-3 py-2">
          <span className="inline-flex items-center gap-2 text-emerald-300">
            Total (calculated)
          </span>
                    <span className="tabular-nums text-emerald-100 font-semibold">
            <Money value={Number(totalStr)} />
          </span>
                </div>

                <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-3 py-2">
          <span className="inline-flex items-center gap-2 text-cyan-300">
            <Grid3X3 className="h-4 w-4 opacity-80" /> Price per in² (calculated)
          </span>
                    <span className="tabular-nums text-cyan-100 font-semibold">${ppiStr}</span>
                </div>

                <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-3 py-2">
                    <span className="text-zinc-300">Tier</span>
                    <span className={`${tierBadge.toneText} font-medium`}>{tierBadge.label}</span>
                </div>
            </div>
        </section>
    );
}
