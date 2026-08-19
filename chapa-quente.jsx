import React, { useState, useMemo, useRef, useEffect } from "react";
import { ShoppingBag, Plus, Minus, X, Check, Clock, Store, ChevronDown } from "lucide-react";

/* =========================================================================
   CAMADA DE "API REST" (simulada)
   Em produção, troque o corpo destas funções por fetch() reais, por ex.:
     GET  /api/products
     GET  /api/categories
     POST /api/orders
   O front-end abaixo já consome estas funções como se fossem a API —
   a troca é transparente para o resto do app.
   ========================================================================= */
const NETWORK_DELAY = 550;

const CATEGORIES = [
  { id: "lanches", name: "Lanches", color: "red" },
  { id: "porcoes", name: "Porções", color: "amber" },
  { id: "bebidas", name: "Bebidas", color: "emerald" },
  { id: "sobremesas", name: "Sobremesas", color: "orange" },
];

const PRODUCTS = [
  { id: 1, cat: "lanches", name: "X-Tudo", desc: "Hambúrguer 180g, bacon, ovo, presunto, queijo, alface e tomate", price: 26.9, emoji: "🍔" },
  { id: 2, cat: "lanches", name: "X-Salada", desc: "Hambúrguer, queijo, alface, tomate e maionese da casa", price: 18.9, emoji: "🍔" },
  { id: 3, cat: "lanches", name: "X-Bacon", desc: "Hambúrguer, queijo e bacon crocante na chapa", price: 21.9, emoji: "🥓" },
  { id: 4, cat: "lanches", name: "Cachorro-Quente Completo", desc: "Salsicha, molho da casa, milho, batata palha e purê", price: 14.9, emoji: "🌭" },
  { id: 5, cat: "lanches", name: "Misto Quente", desc: "Presunto e queijo prensados na chapa", price: 10.9, emoji: "🥪" },
  { id: 6, cat: "lanches", name: "Pastel de Carne", desc: "Massa crocante com recheio de carne moída temperada", price: 9.9, emoji: "🥟" },
  { id: 7, cat: "porcoes", name: "Batata Frita Grande", desc: "Porção para dividir, crocante por fora e macia por dentro", price: 19.9, emoji: "🍟" },
  { id: 8, cat: "porcoes", name: "Calabresa Acebolada", desc: "Calabresa fatiada e grelhada na chapa com cebola", price: 22.9, emoji: "🌭" },
  { id: 9, cat: "porcoes", name: "Anéis de Cebola", desc: "Empanados e fritos, acompanha molho barbecue", price: 17.9, emoji: "🧅" },
  { id: 10, cat: "porcoes", name: "Aipim Frito", desc: "Porção crocante com molho de alho da casa", price: 15.9, emoji: "🍠" },
  { id: 11, cat: "bebidas", name: "Guaraná Lata", desc: "350ml, bem gelado", price: 6.0, emoji: "🥤" },
  { id: 12, cat: "bebidas", name: "Coca-Cola Lata", desc: "350ml, bem gelado", price: 6.0, emoji: "🥤" },
  { id: 13, cat: "bebidas", name: "Suco Natural de Laranja", desc: "500ml, feito na hora", price: 9.0, emoji: "🍊" },
  { id: 14, cat: "bebidas", name: "Milkshake de Chocolate", desc: "400ml, cremoso, cobertura de calda", price: 15.0, emoji: "🍫" },
  { id: 15, cat: "sobremesas", name: "Pudim de Leite", desc: "Fatia generosa com calda de caramelo", price: 10.0, emoji: "🍮" },
  { id: 16, cat: "sobremesas", name: "Brownie com Sorvete", desc: "Brownie quente com bola de sorvete de creme", price: 16.0, emoji: "🍫" },
  { id: 17, cat: "sobremesas", name: "Açaí na Tigela", desc: "300ml com granola e banana", price: 18.0, emoji: "🍨" },
];

const api = {
  products: {
    list: () =>
      new Promise((resolve) => setTimeout(() => resolve({ data: PRODUCTS }), NETWORK_DELAY)),
  },
  categories: {
    list: () =>
      new Promise((resolve) => setTimeout(() => resolve({ data: CATEGORIES }), NETWORK_DELAY / 2)),
  },
  orders: {
    // POST /api/orders
    create: (payload) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              id: Math.floor(1000 + Math.random() * 9000),
              status: "confirmado",
              etaMinutes: 20 + Math.floor(Math.random() * 16),
              ...payload,
            },
          });
        }, NETWORK_DELAY + 400);
      }),
  },
};

/* ========================================================================= */

const COLOR_MAP = {
  red: { chip: "bg-red-600", chipText: "text-white", bar: "bg-red-600", soft: "bg-red-50", text: "text-red-700", ring: "ring-red-600", border: "border-red-600" },
  amber: { chip: "bg-amber-500", chipText: "text-stone-900", bar: "bg-amber-500", soft: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-500", border: "border-amber-500" },
  emerald: { chip: "bg-emerald-600", chipText: "text-white", bar: "bg-emerald-600", soft: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-600", border: "border-emerald-600" },
  orange: { chip: "bg-orange-500", chipText: "text-white", bar: "bg-orange-500", soft: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-500", border: "border-orange-500" },
};

const money = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const FONT_DISPLAY = "'Anton', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";
const FONT_BODY = "'DM Sans', sans-serif";

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [activeCat, setActiveCat] = useState("lanches");
  const [cart, setCart] = useState({}); // { productId: qty }
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [orderType, setOrderType] = useState("retirada"); // retirada | entrega
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("form"); // form | loading | success
  const [orderResult, setOrderResult] = useState(null);
  const [bump, setBump] = useState(false);
  const [form, setForm] = useState({ nome: "", telefone: "", endereco: "", pagamento: "pix", troco: "" });

  useEffect(() => {
    api.categories.list().then((r) => setCategories(r.data));
    api.products.list().then((r) => {
      setProducts(r.data);
      setLoadingMenu(false);
    });
  }, []);

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => ({ ...products.find((p) => p.id === Number(id)), qty }))
      .filter((i) => i.id);
  }, [cart, products]);

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.qty * i.price, 0);

  const addToCart = (id) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
    setBump(true);
    setTimeout(() => setBump(false), 260);
  };
  const decFromCart = (id) => {
    setCart((c) => {
      const next = { ...c, [id]: Math.max(0, (c[id] || 0) - 1) };
      return next;
    });
  };
  const qtyOf = (id) => cart[id] || 0;

  const resetOrder = () => {
    setCart({});
    setCheckoutOpen(false);
    setCheckoutStep("form");
    setOrderResult(null);
    setCartDrawerOpen(false);
    setForm({ nome: "", telefone: "", endereco: "", pagamento: "pix", troco: "" });
  };

  const submitOrder = async () => {
    setCheckoutStep("loading");
    const payload = {
      items: cartItems.map((i) => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
      total: cartTotal,
      orderType,
      customer: form,
    };
    const res = await api.orders.create(payload);
    setOrderResult(res.data);
    setCheckoutStep("success");
  };

  const filteredProducts = products.filter((p) => p.cat === activeCat);

  return (
    <div className="min-h-screen bg-stone-100" style={{ fontFamily: FONT_BODY }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes stampIn {
          0% { opacity: 0; transform: scale(2.2) rotate(-12deg); }
          60% { opacity: 1; transform: scale(0.9) rotate(-12deg); }
          100% { opacity: 1; transform: scale(1) rotate(-12deg); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes bumpCart {
          0% { transform: scale(1); }
          40% { transform: scale(1.18); }
          100% { transform: scale(1); }
        }
        .stamp-in { animation: stampIn 0.5s cubic-bezier(.2,1.4,.4,1) both; }
        .sheet-up { animation: slideUp 0.28s ease-out both; }
        .fade-in { animation: fadeIn 0.2s ease-out both; }
        .cart-bump { animation: bumpCart 0.26s ease-out; }
        .ticket-edge {
          background-image: linear-gradient(135deg, #f5f5f4 25%, transparent 25%), linear-gradient(-135deg, #f5f5f4 25%, transparent 25%);
          background-size: 16px 16px;
          background-position: 0 0;
          height: 10px;
        }
        .ticket-edge-dark {
          background-image: linear-gradient(135deg, #1c1917 25%, transparent 25%), linear-gradient(-135deg, #1c1917 25%, transparent 25%);
          background-size: 16px 16px;
          background-position: 0 0;
          height: 10px;
        }
      `}</style>

      {/* ================= HEADER ================= */}
      <header className="bg-stone-900 text-stone-50 sticky top-0 z-30 shadow-lg shadow-stone-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-amber-500 flex items-center justify-center text-xl shrink-0">
              🍔
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl leading-none tracking-wide" style={{ fontFamily: FONT_DISPLAY }}>
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
            <div className="hidden sm:flex bg-stone-800 rounded-full p-1 text-sm">
              <button
                onClick={() => setOrderType("retirada")}
                className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                  orderType === "retirada" ? "bg-amber-500 text-stone-900" : "text-stone-300 hover:text-white"
                }`}
              >
                Retirada
              </button>
              <button
                onClick={() => setOrderType("entrega")}
                className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                  orderType === "entrega" ? "bg-amber-500 text-stone-900" : "text-stone-300 hover:text-white"
                }`}
              >
                Entrega
              </button>
            </div>

            <button
              onClick={() => setCartDrawerOpen(true)}
              className={`relative lg:hidden flex items-center gap-2 bg-amber-500 text-stone-900 rounded-full px-4 py-2 font-semibold text-sm ${bump ? "cart-bump" : ""}`}
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

        {/* toggle retirada/entrega mobile */}
        <div className="sm:hidden max-w-6xl mx-auto px-4 pb-3">
          <div className="flex bg-stone-800 rounded-full p-1 text-sm w-full">
            <button
              onClick={() => setOrderType("retirada")}
              className={`flex-1 px-3 py-1.5 rounded-full font-medium transition-colors ${
                orderType === "retirada" ? "bg-amber-500 text-stone-900" : "text-stone-300"
              }`}
            >
              Retirada
            </button>
            <button
              onClick={() => setOrderType("entrega")}
              className={`flex-1 px-3 py-1.5 rounded-full font-medium transition-colors ${
                orderType === "entrega" ? "bg-amber-500 text-stone-900" : "text-stone-300"
              }`}
            >
              Entrega
            </button>
          </div>
        </div>
      </header>

      {/* ================= CATEGORY TABS ================= */}
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
                  active ? `${colors.chip} ${colors.chipText} border-transparent` : "bg-white text-stone-600 border-stone-300 hover:border-stone-400"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* PRODUTOS */}
        <section>
          <h2 className="text-3xl mb-4 tracking-wide text-stone-800" style={{ fontFamily: FONT_DISPLAY }}>
            {categories.find((c) => c.id === activeCat)?.name || ""}
          </h2>

          {loadingMenu ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-stone-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredProducts.map((p) => {
                const colors = COLOR_MAP[categories.find((c) => c.id === p.cat)?.color || "red"];
                const qty = qtyOf(p.id);
                return (
                  <div key={p.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
                    <div className={`h-1.5 ${colors.bar}`} />
                    <div className="p-4 flex gap-3 flex-1">
                      <div className={`w-14 h-14 rounded-xl ${colors.soft} flex items-center justify-center text-2xl shrink-0`}>
                        {p.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-stone-800 leading-tight">{p.name}</h3>
                        <p className="text-xs text-stone-500 mt-1 leading-snug">{p.desc}</p>
                      </div>
                    </div>
                    <div className="px-4 pb-4 flex items-center justify-between">
                      <span className="font-bold text-stone-800" style={{ fontFamily: FONT_MONO }}>
                        {money(p.price)}
                      </span>
                      {qty === 0 ? (
                        <button
                          onClick={() => addToCart(p.id)}
                          className={`text-sm font-semibold px-3 py-1.5 rounded-full ${colors.chip} ${colors.chipText} hover:opacity-90 transition-opacity`}
                        >
                          Adicionar
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-stone-100 rounded-full px-1 py-1">
                          <button onClick={() => decFromCart(p.id)} className="w-7 h-7 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-600">
                            <Minus size={13} />
                          </button>
                          <span className="w-5 text-center text-sm font-semibold text-stone-800">{qty}</span>
                          <button onClick={() => addToCart(p.id)} className={`w-7 h-7 rounded-full ${colors.chip} ${colors.chipText} flex items-center justify-center`}>
                            <Plus size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* COMANDA - DESKTOP */}
        <aside className="hidden lg:block">
          <div className="sticky top-[150px]">
            <CartTicket
              items={cartItems}
              total={cartTotal}
              orderType={orderType}
              onInc={addToCart}
              onDec={decFromCart}
              onCheckout={() => setCheckoutOpen(true)}
            />
          </div>
        </aside>
      </main>

      {/* ================= DRAWER MOBILE ================= */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-stone-900/50 fade-in" onClick={() => setCartDrawerOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 sheet-up max-h-[85vh] overflow-y-auto">
            <div className="bg-stone-900 rounded-t-3xl pt-2">
              <div className="w-10 h-1.5 bg-stone-600 rounded-full mx-auto mb-2" />
              <button onClick={() => setCartDrawerOpen(false)} className="absolute top-3 right-4 text-stone-300">
                <X size={22} />
              </button>
              <div className="px-4 pb-4">
                <CartTicket
                  items={cartItems}
                  total={cartTotal}
                  orderType={orderType}
                  onInc={addToCart}
                  onDec={decFromCart}
                  onCheckout={() => {
                    setCartDrawerOpen(false);
                    setCheckoutOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= CHECKOUT MODAL ================= */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-stone-900/60 fade-in" onClick={() => checkoutStep !== "loading" && setCheckoutOpen(false)} />
          <div className="relative bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl sheet-up sm:animate-none max-h-[90vh] overflow-y-auto">
            {checkoutStep === "form" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-2xl tracking-wide text-stone-800" style={{ fontFamily: FONT_DISPLAY }}>
                    FECHAR COMANDA
                  </h3>
                  <button onClick={() => setCheckoutOpen(false)} className="text-stone-400 hover:text-stone-700">
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
                      {[
                        { id: "pix", label: "Pix" },
                        { id: "cartao", label: "Cartão" },
                        { id: "dinheiro", label: "Dinheiro" },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setForm({ ...form, pagamento: opt.id })}
                          className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                            form.pagamento === opt.id ? "bg-stone-900 text-white border-stone-900" : "border-stone-300 text-stone-600"
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
                    <span className="font-bold text-lg text-stone-800" style={{ fontFamily: FONT_MONO }}>
                      {money(cartTotal)}
                    </span>
                  </div>

                  <button
                    disabled={!form.nome || !form.telefone || (orderType === "entrega" && !form.endereco)}
                    onClick={submitOrder}
                    className="w-full bg-amber-500 disabled:bg-stone-200 disabled:text-stone-400 text-stone-900 font-bold py-3 rounded-xl transition-colors"
                  >
                    Confirmar pedido
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === "loading" && (
              <div className="p-10 flex flex-col items-center justify-center gap-4 text-stone-600">
                <div className="w-10 h-10 border-4 border-stone-200 border-t-amber-500 rounded-full animate-spin" />
                <p className="text-sm">Enviando pedido pra chapa...</p>
              </div>
            )}

            {checkoutStep === "success" && orderResult && (
              <div className="p-8 flex flex-col items-center text-center gap-4">
                <div
                  className="stamp-in border-4 border-red-600 text-red-600 rounded-full w-28 h-28 flex flex-col items-center justify-center font-bold"
                  style={{ transform: "rotate(-12deg)" }}
                >
                  <Check size={28} />
                  <span className="text-[11px] tracking-wide mt-0.5">CONFIRMADO</span>
                </div>
                <h3 className="text-2xl tracking-wide text-stone-800" style={{ fontFamily: FONT_DISPLAY }}>
                  PEDIDO #{orderResult.id}
                </h3>
                <p className="text-stone-500 text-sm max-w-xs">
                  {orderType === "retirada"
                    ? `Fica pronto pra retirada em cerca de ${orderResult.etaMinutes} minutos.`
                    : `Chega no seu endereço em cerca de ${orderResult.etaMinutes} minutos.`}
                </p>
                <div className="w-full bg-stone-50 rounded-xl border border-stone-200 p-4 text-left text-sm" style={{ fontFamily: FONT_MONO }}>
                  {orderResult.items.map((it) => (
                    <div key={it.id} className="flex justify-between py-0.5">
                      <span className="text-stone-600">{it.qty}x {it.name}</span>
                      <span className="text-stone-800">{money(it.qty * it.price)}</span>
                    </div>
                  ))}
                  <div className="border-t border-dashed border-stone-300 mt-2 pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>{money(orderResult.total)}</span>
                  </div>
                </div>
                <button onClick={resetOrder} className="w-full bg-stone-900 text-white font-semibold py-3 rounded-xl mt-2">
                  Fazer novo pedido
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function CartTicket({ items, total, orderType, onInc, onDec, onCheckout }) {
  return (
    <div className="bg-stone-50 rounded-2xl overflow-hidden shadow-lg shadow-stone-900/10 border border-stone-200">
      <div className="ticket-edge" />
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl tracking-wide text-stone-800" style={{ fontFamily: FONT_DISPLAY }}>
            COMANDA
          </h3>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-stone-500 bg-stone-200 px-2 py-1 rounded-full">
            {orderType === "retirada" ? "Retirada" : "Entrega"}
          </span>
        </div>
      </div>

      <div className="px-5" style={{ fontFamily: FONT_MONO }}>
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
                  <button onClick={() => onDec(i.id)} className="w-6 h-6 rounded-full bg-white border border-stone-300 flex items-center justify-center text-stone-600">
                    <Minus size={11} />
                  </button>
                  <span className="w-4 text-center text-xs font-semibold">{i.qty}</span>
                  <button onClick={() => onInc(i.id)} className="w-6 h-6 rounded-full bg-stone-800 text-white flex items-center justify-center">
                    <Plus size={11} />
                  </button>
                </div>
                <span className="w-16 text-right text-stone-800 font-semibold">{money(i.qty * i.price)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 py-4 mt-1 border-t border-dashed border-stone-300" style={{ fontFamily: FONT_MONO }}>
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
