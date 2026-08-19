# Chapa Quente 🍔

Página de pedidos de uma lanchonete, construída em React (Next.js App Router)
+ Tailwind CSS, consumindo uma camada de API estruturada como REST.

## Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Estrutura de pastas

```
chapa-quente/
├── app/
│   ├── layout.jsx        # Layout raiz, fontes (Anton/DM Sans/JetBrains Mono) e metadata
│   ├── page.jsx          # Página principal — orquestra estado e componentes
│   └── globals.css       # Tailwind + animações (carimbo, gaveta, etc.)
│
├── components/
│   ├── Header.jsx            # Topo: logo, status, toggle retirada/entrega, botão carrinho mobile
│   ├── CategoryTabs.jsx       # Abas de categoria do cardápio
│   ├── ProductGrid.jsx        # Grid de produtos + skeleton de loading
│   ├── ProductCard.jsx        # Card individual de produto
│   ├── cart/
│   │   ├── CartTicket.jsx     # A "comanda" — carrinho estilo cupom de papel
│   │   └── CartDrawer.jsx     # Gaveta do carrinho no mobile
│   ├── checkout/
│   │   ├── CheckoutModal.jsx  # Orquestra as 3 etapas do checkout
│   │   ├── OrderForm.jsx      # Formulário (dados, endereço, pagamento)
│   │   ├── OrderLoading.jsx   # Estado de carregamento ao enviar pedido
│   │   └── OrderSuccess.jsx   # Confirmação com número do pedido e carimbo
│   └── ui/
│       └── Field.jsx          # Wrapper de label + input reutilizável
│
├── hooks/
│   └── useCart.js         # Toda a lógica do carrinho (estado, totais, add/remove)
│
├── lib/
│   ├── api.js              # Camada de API — troque aqui pelos endpoints reais
│   ├── colors.js            # Mapa de cores por categoria
│   └── format.js            # Formatação de moeda (BRL)
│
└── data/
    ├── categories.js        # Categorias do cardápio
    └── products.js          # Produtos do cardápio
```

## Ligando a um backend real

Todo o app conversa apenas com `lib/api.js`. Para trocar a simulação por uma
API real, edite só esse arquivo, por exemplo:

```js
export const api = {
  products: {
    list: () => fetch("/api/products").then((r) => r.json()),
  },
  categories: {
    list: () => fetch("/api/categories").then((r) => r.json()),
  },
  orders: {
    create: (payload) =>
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then((r) => r.json()),
  },
};
```

Nenhum componente precisa mudar — todos recebem os dados via props ou via
o hook `useCart`.

### Contrato esperado dos endpoints

- `GET /api/products` → `{ data: Product[] }`
- `GET /api/categories` → `{ data: Category[] }`
- `POST /api/orders` → recebe `{ items, total, orderType, customer }` e
  devolve `{ data: { id, status, etaMinutes, ...payload } }`
