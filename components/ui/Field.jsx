export default function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
