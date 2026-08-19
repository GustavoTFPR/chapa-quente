"use client";

import { Check } from "lucide-react";
import { money } from "@/lib/format";

export default function OrderSuccess({ order, orderType, onReset }) {
  return (
    <div className="p-8 flex flex-col items-center text-center gap-4">
      <div
        className="stamp-in border-4 border-red-600 text-red-600 rounded-full w-28 h-28 flex flex-col items-center justify-center font-bold"
        style={{ transform: "rotate(-12deg)" }}
      >
        <Check size={28} />
        <span className="text-[11px] tracking-wide mt-0.5">CONFIRMADO</span>
      </div>

      <h3 className="text-2xl tracking-wide text-stone-800 font-display">PEDIDO #{order.id}</h3>

      <p className="text-stone-500 text-sm max-w-xs">
        {orderType === "retirada"
          ? `Fica pronto pra retirada em cerca de ${order.etaMinutes} minutos.`
          : `Chega no seu endereço em cerca de ${order.etaMinutes} minutos.`}
      </p>

      <div className="w-full bg-stone-50 rounded-xl border border-stone-200 p-4 text-left text-sm font-mono">
        {order.items.map((it) => (
          <div key={it.id} className="flex justify-between py-0.5">
            <span className="text-stone-600">
              {it.qty}x {it.name}
            </span>
            <span className="text-stone-800">{money(it.qty * it.price)}</span>
          </div>
        ))}
        <div className="border-t border-dashed border-stone-300 mt-2 pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span>{money(order.total)}</span>
        </div>
      </div>

      <button onClick={onReset} className="w-full bg-stone-900 text-white font-semibold py-3 rounded-xl mt-2">
        Fazer novo pedido
      </button>
    </div>
  );
}
