"use client";

import ProductCard from "@/components/ProductCard";

export default function ProductGrid({ products, loading, categoryColor, qtyOf, onInc, onDec }) {
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-stone-200 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          categoryColor={categoryColor}
          qty={qtyOf(p.id)}
          onInc={onInc}
          onDec={onDec}
        />
      ))}
    </div>
  );
}
