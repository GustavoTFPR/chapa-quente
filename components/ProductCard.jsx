"use client";

import { Minus, Plus } from "lucide-react";
import { COLOR_MAP } from "@/lib/colors";
import { money } from "@/lib/format";

export default function ProductCard({ product, categoryColor, qty, onInc, onDec }) {
  const colors = COLOR_MAP[categoryColor];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
      <div className={`h-1.5 ${colors.bar}`} />
      <div className="p-4 flex gap-3 flex-1">
        <div className={`w-14 h-14 rounded-xl ${colors.soft} flex items-center justify-center text-2xl shrink-0`}>
          {product.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-stone-800 leading-tight">{product.name}</h3>
          <p className="text-xs text-stone-500 mt-1 leading-snug">{product.desc}</p>
        </div>
      </div>
      <div className="px-4 pb-4 flex items-center justify-between">
        <span className="font-bold text-stone-800 font-mono">{money(product.price)}</span>
        {qty === 0 ? (
          <button
            onClick={() => onInc(product.id)}
            className={`text-sm font-semibold px-3 py-1.5 rounded-full ${colors.chip} ${colors.chipText} hover:opacity-90 transition-opacity`}
          >
            Adicionar
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-stone-100 rounded-full px-1 py-1">
            <button
              onClick={() => onDec(product.id)}
              className="w-7 h-7 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-600"
            >
              <Minus size={13} />
            </button>
            <span className="w-5 text-center text-sm font-semibold text-stone-800">{qty}</span>
            <button
              onClick={() => onInc(product.id)}
              className={`w-7 h-7 rounded-full ${colors.chip} ${colors.chipText} flex items-center justify-center`}
            >
              <Plus size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
