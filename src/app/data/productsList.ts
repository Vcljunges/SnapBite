import { Product } from "../types/Product";

export const productsList: Product[] = [
  // HAMBÚRGUERES
  {
    id: "h1",
    name: "Classic Smash",
    category: "burgers",
    description:
      "Dois smash patties, queijo americano, alface, tomate, picles e nosso molho especial.",
    price: 32.9,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    badge: "Mais Pedido",
    available: true,
    tag: "Mais Pedido",
    rating: 4.8,
  },
  {
    id: "h2",
    name: "Bacon Inferno",
    category: "burgers",
    description:
      "Blend de 180g, bacon crocante, queijo cheddar, jalapeño e maionese defumada.",
    price: 42.9,
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop",
    badge: "Novo",
    available: true,
    tag: "",
    rating: 3.8,
  },
  {
    id: "h3",
    name: "Double Truffle",
    category: "burgers",
    description:
      "Dois blends 120g, queijo suíço, cogumelos salteados, rúcula e molho trufado.",
    price: 52.9,
    image:
      "https://images.unsplash.com/photo-1561758033-7e924f619b47?w=400&h=300&fit=crop",
    badge: "Premium",
    available: true,
    tag: "Novidade",
    rating: 4.5,
  },
  {
    id: "h4",
    name: "Veggie Burger",
    category: "burgers",
    description:
      "Hambúrguer de grão-de-bico, queijo vegano, tomate, alface e molho tahine.",
    price: 35.9,
    image:
      "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop",
    badge: "Premium",
    available: true,
    tag: "Novidade",
    rating: 4.9,
  },

  // PIZZAS
  {
    id: "p1",
    name: "Pepperoni Supreme",
    category: "pizzas",
    description:
      "Molho de tomate artesanal, mussarela premium, generoso pepperoni e orégano.",
    price: 54.9,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
    badge: "Favorito",
    available: true,
    tag: "Barato",
    rating: 4.5,
  },
  {
    id: "p2",
    name: "Margherita Classica",
    category: "pizzas",
    description:
      "Molho de tomate San Marzano, mussarela de búfala, folhas de manjericão fresco.",
    price: 48.9,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
    badge: "",
    available: true,
    tag: "Promoção",
    rating: 4.4,
  },
  {
    id: "p3",
    name: "BBQ Chicken",
    category: "pizzas",
    description:
      "Base de molho barbecue, frango grelhado desfiado, cebola roxa, pimentões e mussarela.",
    price: 58.9,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    badge: "Novo",
    available: true,
    tag: "Mais Pedido",
    rating: 4.8,
  },
  {
    id: "p4",
    name: "4 Queijos",
    category: "pizzas",
    description:
      "Mussarela, provolone, gorgonzola e parmesão com geleia de damasco.",
    price: 62.9,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    badge: "Premium",
    available: true,
    tag: "Novidade",
    rating: 4.6,
  },

  // HOT DOGS
  {
    id: "d2",
    name: "Chicago Style",
    category: "hotdogs",
    description:
      "Salsicha defumada, pimentão verde, tomate, picles, cebola, pepperoncini e mostarda amarela.",
    price: 28.9,
    image:
      "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400&h=300&fit=crop",
    badge: "",
    available: true,
    tag: "Novidade",
    rating: 4.1,
  },
  {
    id: "d3",
    name: "Bacon Dog Supremo",
    category: "hotdogs",
    description:
      "Salsicha premium enrolada em bacon, queijo derretido, molho especial e batata palha.",
    price: 34.9,
    image:
      "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=400&h=300&fit=crop",
    badge: "Premium",
    available: true,
    tag: "Mais Pedido",
    rating: 4.8,
  },

  // BEBIDAS
  {
    id: "b1",
    name: "Refrigerante Lata",
    category: "drinks",
    description:
      "Coca-Cola, Pepsi, Guaraná Antarctica ou Sprite. Gelada e refrescante.",
    price: 7.9,
    image:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop",
    badge: "Premium",
    available: true,
    tag: "Lançamento",
    rating: 4.5,
  },
  {
    id: "b2",
    name: "Milkshake Premium",
    category: "drinks",
    description:
      "Chocolate, baunilha ou morango. 400ml cremoso com chantilly e calda.",
    price: 22.9,
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop",
    badge: "Favorito",
    available: true,
    tag: "Mais Pedido",
    rating: 4.8,
  },
  {
    id: "b3",
    name: "Suco Natural",
    category: "drinks",
    description:
      "Laranja, limão, maracujá ou abacaxi. 500ml feito na hora, sem conservantes.",
    price: 14.9,
    image:
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop",
    badge: "",
    available: true,
    tag: "Saudável",
    rating: 4.8,
  },
  {
    id: "b4",
    name: "Água com Gás 500ml",
    category: "drinks",
    description: "Água mineral com gás, gelada e refrescante.",
    price: 5.9,
    image:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop",
    badge: "Premium",
    available: true,
    tag: "Promoção",
    rating: 4.8,
  },
];
