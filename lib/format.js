export const money = (n) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
