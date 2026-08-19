"use client";

import { X } from "lucide-react";
import CartTicket from "@/components/cart/CartTicket";

export default function CartDrawer({ open, onClose, items, total, orderType, onInc, onDec, onCheckout }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-stone-900/50 fade-in" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 sheet-up max-h-[85vh] overflow-y-auto">
        <div className="bg-stone-900 rounded-t-3xl pt-2 relative">
          <div className="w-10 h-1.5 bg-stone-600 rounded-full mx-auto mb-2" />
          <button onClick={onClose} className="absolute top-3 right-4 text-stone-300">
            <X size={22} />
          </button>
          <div className="px-4 pb-4">
            <CartTicket
              items={items}
              total={total}
              orderType={orderType}
              onInc={onInc}
              onDec={onDec}
              onCheckout={onCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
