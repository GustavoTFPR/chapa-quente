"use client";

import { ShoppingBag, Store, Clock } from "lucide-react";
import { money } from "@/lib/format";

function OrderTypeToggle({ orderType, setOrderType, className = "" }) {
  return (
    <div className={`flex bg-stone-800 rounded-full p-1 text-sm ${className}`}>
      <button
        onClick={() => setOrderType("retirada")}
        className={`flex-1 px-3 py-1.5 rounded-full font-medium transition-colors ${
          orderType === "retirada" ? "bg-amber-500 text-stone-900" : "text-stone-300 hover:text-white"
        }`}
      >
        Retirada
      </button>
      <button
        onClick={() => setOrderType("entrega")}
        className={`flex-1 px-3 py-1.5 rounded-full font-medium transition-colors ${
          orderType === "entrega" ? "bg-amber-500 text-stone-900" : "text-stone-300 hover:text-white"
        }`}
      >
        Entrega
      </button>
    </div>
  );
}

export default function Header({ orderType, setOrderType, cartCount, cartTotal, onOpenCart, cartBump }) {
  return (
    <header className="bg-stone-900 text-stone-50 sticky top-0 z-30 shadow-lg shadow-stone-900/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-amber-500 flex items-center justify-center text-xl shrink-0">
            🍔
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl leading-none tracking-wide font-display">
              CHAPA QUENTE
            </h1>
            <p className="text-[11px] sm:text-xs text-stone-400 flex items-center gap-1 mt-0.5">
              <Store size={12} className="text-emerald-400" />
              <span className="text-emerald-400 font-medium">Aberto agora</span>
              <span className="text-stone-600">•</span>
              <Clock size={12} />
              18h às 00h
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <OrderTypeToggle orderType={orderType} setOrderType={setOrderType} className="hidden sm:flex w-auto" />

          <button
            onClick={onOpenCart}
            className={`relative lg:hidden flex items-center gap-2 bg-amber-500 text-stone-900 rounded-full px-4 py-2 font-semibold text-sm ${
              cartBump ? "cart-bump" : ""
            }`}
          >
            <ShoppingBag size={16} />
            {cartCount > 0 ? money(cartTotal) : "Comanda"}
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* toggle retirada/entrega no mobile */}
      <div className="sm:hidden max-w-6xl mx-auto px-4 pb-3">
        <OrderTypeToggle orderType={orderType} setOrderType={setOrderType} />
      </div>
    </header>
  );
}
