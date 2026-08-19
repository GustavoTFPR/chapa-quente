"use client";

import { useMemo, useState } from "react";

/**
 * Encapsula todo o estado e as operações do carrinho (comanda).
 * Recebe a lista de produtos carregada da API e devolve tudo que os
 * componentes de carrinho/checkout precisam.
 */
export function useCart(products) {
  const [cart, setCart] = useState({}); // { [productId]: quantidade }

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => ({ ...products.find((p) => p.id === Number(id)), qty }))
      .filter((item) => item.id);
  }, [cart, products]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.qty * item.price, 0);

  const addToCart = (id) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  };

  const decFromCart = (id) => {
    setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] || 0) - 1) }));
  };

  const qtyOf = (id) => cart[id] || 0;

  const resetCart = () => setCart({});

  return { cartItems, cartCount, cartTotal, addToCart, decFromCart, qtyOf, resetCart };
}
