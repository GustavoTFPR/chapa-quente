export default function OrderLoading() {
  return (
    <div className="p-10 flex flex-col items-center justify-center gap-4 text-stone-600">
      <div className="w-10 h-10 border-4 border-stone-200 border-t-amber-500 rounded-full animate-spin" />
      <p className="text-sm">Enviando pedido pra chapa...</p>
    </div>
  );
}
