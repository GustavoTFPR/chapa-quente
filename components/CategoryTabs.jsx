"use client";

import { COLOR_MAP } from "@/lib/colors";

export default function CategoryTabs({ categories, activeCat, setActiveCat }) {
  return (
    <div className="bg-stone-50 border-b border-stone-200 sticky top-[88px] sm:top-[73px] z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((c) => {
          const active = activeCat === c.id;
          const colors = COLOR_MAP[c.color];
          return (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                active
                  ? `${colors.chip} ${colors.chipText} border-transparent`
                  : "bg-white text-stone-600 border-stone-300 hover:border-stone-400"
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
