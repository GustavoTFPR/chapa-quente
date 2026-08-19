"use client";

import { X } from "lucide-react";
import Field from "@/components/ui/Field";
import { money } from "@/lib/format";

const PAYMENT_OPTIONS = [
  { id: "pix", label: "Pix" },
  { id: "cartao", label: "Cartão" },
  { id: "dinheiro", label: "Dinheiro" },
];

export default function OrderForm({ form, setForm, orderType, total, onClose, onSubmit }) {
  const canSubmit = form.nome && form.telefone && (orderType !== "entrega" || form.endereco);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-2xl tracking-wide text-stone-800 font-display">FECHAR COMANDA</h3>
        <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
          <X size={22} />
        </button>
      </div>

      <div className="space-y-4">
        <Field label="Nome completo">
          <input
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            placeholder="Como podemos te chamar"
            className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </Field>

        <Field label="Telefone / WhatsApp">
          <input
            value={form.telefone}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            placeholder="(21) 90000-0000"
            className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </Field>

        {orderType === "entrega" && (
          <Field label="Endereço de entrega">
            <input
              value={form.endereco}
              onChange={(e) => setForm({ ...form, endereco: e.target.value })}
              placeholder="Rua, número, bairro"
              className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </Field>
        )}

        <Field label="Forma de pagamento">
          <div className="flex gap-2">
            {PAYMENT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setForm({ ...form, pagamento: opt.id })}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                  form.pagamento === opt.id
                    ? "bg-stone-900 text-white border-stone-900"
                    : "border-stone-300 text-stone-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Field>

        {form.pagamento === "dinheiro" && (
          <Field label="Troco para quanto? (opcional)">
            <input
              value={form.troco}
              onChange={(e) => setForm({ ...form, troco: e.target.value })}
              placeholder="R$ 50,00"
              className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </Field>
        )}

        <div className="pt-2 border-t border-dashed border-stone-300 flex items-center justify-between text-sm">
          <span className="text-stone-500">Total da comanda</span>
          <span className="font-bold text-lg text-stone-800 font-mono">{money(total)}</span>
        </div>

        <button
          disabled={!canSubmit}
          onClick={onSubmit}
          className="w-full bg-amber-500 disabled:bg-stone-200 disabled:text-stone-400 text-stone-900 font-bold py-3 rounded-xl transition-colors"
        >
          Confirmar pedido
        </button>
      </div>
    </div>
  );
}
