"use client";

import OrderForm from "@/components/checkout/OrderForm";
import OrderLoading from "@/components/checkout/OrderLoading";
import OrderSuccess from "@/components/checkout/OrderSuccess";

export default function CheckoutModal({
  open,
  step, // "form" | "loading" | "success"
  form,
  setForm,
  orderType,
  total,
  orderResult,
  onClose,
  onSubmit,
  onReset,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-stone-900/60 fade-in"
        onClick={() => step !== "loading" && onClose()}
      />
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl sheet-up sm:animate-none max-h-[90vh] overflow-y-auto">
        {step === "form" && (
          <OrderForm
            form={form}
            setForm={setForm}
            orderType={orderType}
            total={total}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        )}

        {step === "loading" && <OrderLoading />}

        {step === "success" && orderResult && (
          <OrderSuccess order={orderResult} orderType={orderType} onReset={onReset} />
        )}
      </div>
    </div>
  );
}
