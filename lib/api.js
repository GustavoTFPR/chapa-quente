import { CATEGORIES } from "@/data/categories";
import { PRODUCTS } from "@/data/products";

/**
 * Camada de acesso à API REST.
 *
 * Hoje simula uma API real com Promise + setTimeout, pra imitar a latência
 * de rede e deixar o front já preparado pro contrato de dados esperado.
 *
 * Pra plugar num backend de verdade, troque o corpo de cada função por um
 * fetch(), por exemplo:
 *
 *   products: {
 *     list: () => fetch("/api/products").then((r) => r.json()),
 *   },
 *   orders: {
 *     create: (payload) =>
 *       fetch("/api/orders", {
 *         method: "POST",
 *         headers: { "Content-Type": "application/json" },
 *         body: JSON.stringify(payload),
 *       }).then((r) => r.json()),
 *   },
 *
 * O resto do app não precisa mudar nada, pois todos os componentes
 * conversam apenas com este módulo.
 */

const NETWORK_DELAY = 550;

export const api = {
  products: {
    // GET /api/products
    list: () =>
      new Promise((resolve) => setTimeout(() => resolve({ data: PRODUCTS }), NETWORK_DELAY)),
  },
  categories: {
    // GET /api/categories
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
