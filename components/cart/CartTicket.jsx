"use client";

import { Minus, Plus } from "lucide-react";
import { money } from "@/lib/format";

export default function CartTicket({ items, total, orderType, onInc, onDec, onCheckout }) {
  return (
    <div className="bg-stone-50 rounded-2xl overflow-hidden shadow-lg shadow-stone-900/10 border border-stone-200">
      <div className="ticket-edge" />
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl tracking-wide text-stone-800 font-display">COMANDA</h3>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-stone-500 bg-stone-200 px-2 py-1 rounded-full">
            {orderType === "retirada" ? "Retirada" : "Entrega"}
          </span>
        </div>
      </div>

      <div className="px-5 font-mono">
        {items.length === 0 ? (
          <p className="text-sm text-stone-400 py-8 text-center">
            Sua comanda tá vazia. <br /> Escolhe algo gostoso no cardápio.
          </p>
        ) : (
          <div className="divide-y divide-stone-200">
            {items.map((i) => (
              <div key={i.id} className="py-2.5 flex items-center justify-between gap-2 text-sm">
                <div className="flex-1 min-w-0">
                  <p className="text-stone-800 truncate">{i.name}</p>
                  <p className="text-stone-400 text-xs">{money(i.price)} un.</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onDec(i.id)}
                    className="w-6 h-6 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-600"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="w-4 text-center text-xs font-semibold">{i.qty}</span>
                  <button
                    onClick={() => onInc(i.id)}
                    className="w-6 h-6 rounded-full bg-stone-800 text-white flex items-center justify-center"
                  >
                    <Plus size={11} />
                  </button>
                </div>
                <span className="w-16 text-right text-stone-800 font-semibold">{money(i.qty * i.price)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 py-4 mt-1 border-t border-dashed border-stone-300 font-mono">
        <div className="flex justify-between text-sm text-stone-500 mb-1">
          <span>Subtotal</span>
          <span>{money(total)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-stone-800">
          <span>Total</span>
          <span>{money(total)}</span>
        </div>
      </div>

      <div className="px-5 pb-5">
        <button
          disabled={items.length === 0}
          onClick={onCheckout}
          className="w-full bg-red-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors"
        >
          Fechar comanda
        </button>
      </div>
    </div>
  );
}
