"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useCart } from "@/hooks/useCart";

import Header from "@/components/Header";
import CategoryTabs from "@/components/CategoryTabs";
import ProductGrid from "@/components/ProductGrid";
import CartTicket from "@/components/cart/CartTicket";
import CartDrawer from "@/components/cart/CartDrawer";
import CheckoutModal from "@/components/checkout/CheckoutModal";

const EMPTY_FORM = { nome: "", telefone: "", endereco: "", pagamento: "pix", troco: "" };

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [activeCat, setActiveCat] = useState("lanches");

  const [orderType, setOrderType] = useState("retirada"); // retirada | entrega
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [cartBump, setCartBump] = useState(false);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("form"); // form | loading | success
  const [orderResult, setOrderResult] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const { cartItems, cartCount, cartTotal, addToCart, decFromCart, qtyOf, resetCart } = useCart(products);

  // Carrega cardápio e categorias da "API" ao montar a página
  useEffect(() => {
    api.categories.list().then((r) => setCategories(r.data));
    api.products.list().then((r) => {
      setProducts(r.data);
      setLoadingMenu(false);
    });
  }, []);

  const handleAdd = (id) => {
    addToCart(id);
    setCartBump(true);
    setTimeout(() => setCartBump(false), 260);
  };

  const resetOrder = () => {
    resetCart();
    setCheckoutOpen(false);
    setCheckoutStep("form");
    setOrderResult(null);
    setCartDrawerOpen(false);
    setForm(EMPTY_FORM);
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
  const activeCategoryColor = categories.find((c) => c.id === activeCat)?.color || "red";

  return (
    <div className="min-h-screen bg-stone-100">
      <Header
        orderType={orderType}
        setOrderType={setOrderType}
        cartCount={cartCount}
        cartTotal={cartTotal}
        cartBump={cartBump}
        onOpenCart={() => setCartDrawerOpen(true)}
      />

      <CategoryTabs categories={categories} activeCat={activeCat} setActiveCat={setActiveCat} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <section>
          <h2 className="text-3xl mb-4 tracking-wide text-stone-800 font-display">
            {categories.find((c) => c.id === activeCat)?.name || ""}
          </h2>

          <ProductGrid
            products={filteredProducts}
            loading={loadingMenu}
            categoryColor={activeCategoryColor}
            qtyOf={qtyOf}
            onInc={handleAdd}
            onDec={decFromCart}
          />
        </section>

        {/* Comanda fixa no desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-[150px]">
            <CartTicket
              items={cartItems}
              total={cartTotal}
              orderType={orderType}
              onInc={handleAdd}
              onDec={decFromCart}
              onCheckout={() => setCheckoutOpen(true)}
            />
          </div>
        </aside>
      </main>

      {/* Gaveta da comanda no mobile */}
      <CartDrawer
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        items={cartItems}
        total={cartTotal}
        orderType={orderType}
        onInc={handleAdd}
        onDec={decFromCart}
        onCheckout={() => {
          setCartDrawerOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        open={checkoutOpen}
        step={checkoutStep}
        form={form}
        setForm={setForm}
        orderType={orderType}
        total={cartTotal}
        orderResult={orderResult}
        onClose={() => setCheckoutOpen(false)}
        onSubmit={submitOrder}
        onReset={resetOrder}
      />
    </div>
  );
}
