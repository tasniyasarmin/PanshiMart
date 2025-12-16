// data/products.js

const products = [
  {
    title: "Men's Casual Cotton T-Shirt",
    price: 25,
    discount: 10,
    stock: 120,
    category: "Clothing",
    colors: [
      { name: "Red", hex: "#FF0000" },
      { name: "Blue", hex: "#0000FF" },
      { name: "Black", hex: "#000000" },
    ],
    sizes: [
      { label: "S", chest: "36 inches" },
      { label: "M", chest: "38 inches" },
      { label: "L", chest: "40 inches" },
    ],
    image1: "https://picsum.photos/id/100/400/400",
    image2: "https://picsum.photos/id/101/400/400",
    image3: "https://picsum.photos/id/102/400/400",
    description:
      "A comfortable and stylish cotton T-shirt perfect for casual wear.",
    reviews: ["64f1c9f1a1f1b2c3d4e5f601", "64f1c9f1a1f1b2c3d4e5f602"],
  },
  {
    title: "Women's Denim Jacket",
    price: 60,
    discount: 15,
    stock: 50,
    category: "Clothing",
    colors: [
      { name: "Blue", hex: "#1E90FF" },
      { name: "Black", hex: "#000000" },
    ],
    sizes: [
      { label: "S", bust: "34 inches" },
      { label: "M", bust: "36 inches" },
      { label: "L", bust: "38 inches" },
    ],
    image1: "https://picsum.photos/id/103/400/400",
    image2: "https://picsum.photos/id/104/400/400",
    image3: "https://picsum.photos/id/105/400/400",
    description:
      "Trendy denim jacket for women. Perfect for casual outings and layering.",
    reviews: ["64f1c9f1a1f1b2c3d4e5f603"],
  },
  {
    title: "Wireless Bluetooth Headphones",
    price: 120,
    discount: 20,
    stock: 30,
    category: "Electronics",
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
    ],
    sizes: [],
    image1: "https://picsum.photos/id/106/400/400",
    image2: "https://picsum.photos/id/107/400/400",
    image3: "https://picsum.photos/id/108/400/400",
    description:
      "High-quality wireless headphones with noise cancellation and long battery life.",
    reviews: ["64f1c9f1a1f1b2c3d4e5f604"],
  },
  {
    title: "Gaming Mouse RGB",
    price: 45,
    discount: 5,
    stock: 100,
    category: "Electronics",
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Gray", hex: "#808080" },
    ],
    sizes: [],
    image1: "https://picsum.photos/id/109/400/400",
    image2: "https://picsum.photos/id/110/400/400",
    image3: "https://picsum.photos/id/111/400/400",
    description:
      "Ergonomic gaming mouse with RGB lighting and adjustable DPI settings.",
    reviews: [],
  },
  {
    title: "Men's Running Shoes",
    price: 80,
    discount: 10,
    stock: 75,
    category: "Footwear",
    colors: [
      { name: "Blue", hex: "#1E90FF" },
      { name: "Gray", hex: "#808080" },
      { name: "Black", hex: "#000000" },
    ],
    sizes: [
      { label: "8", length: "26 cm" },
      { label: "9", length: "27 cm" },
      { label: "10", length: "28 cm" },
    ],
    image1: "https://picsum.photos/id/112/400/400",
    image2: "https://picsum.photos/id/113/400/400",
    image3: "https://picsum.photos/id/114/400/400",
    description:
      "Lightweight running shoes with cushioned sole for maximum comfort during long runs.",
    reviews: ["64f1c9f1a1f1b2c3d4e5f605"],
  },
  {
    title: "Women's Yoga Pants",
    price: 35,
    discount: 5,
    stock: 60,
    category: "Clothing",
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Gray", hex: "#808080" },
    ],
    sizes: [
      { label: "S", waist: "26 inches" },
      { label: "M", waist: "28 inches" },
      { label: "L", waist: "30 inches" },
    ],
    image1: "https://picsum.photos/id/115/400/400",
    image2: "https://picsum.photos/id/116/400/400",
    image3: "https://picsum.photos/id/117/400/400",
    description: "Comfortable yoga pants suitable for all types of exercises.",
    reviews: [],
  },
  {
    title: "Smartwatch Fitness Tracker",
    price: 150,
    discount: 15,
    stock: 40,
    category: "Electronics",
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Silver", hex: "#C0C0C0" },
    ],
    sizes: [],
    image1: "https://picsum.photos/id/118/400/400",
    image2: "https://picsum.photos/id/119/400/400",
    image3: "https://picsum.photos/id/120/400/400",
    description:
      "Smartwatch with heart rate monitor, step tracker, and notifications.",
    reviews: ["64f1c9f1a1f1b2c3d4e5f606"],
  },
  {
    title: "Leather Wallet",
    price: 45,
    discount: 0,
    stock: 80,
    category: "Accessories",
    colors: [
      { name: "Brown", hex: "#8B4513" },
      { name: "Black", hex: "#000000" },
    ],
    sizes: [],
    image1: "https://picsum.photos/id/121/400/400",
    image2: "https://picsum.photos/id/122/400/400",
    image3: "https://picsum.photos/id/123/400/400",
    description:
      "Genuine leather wallet with multiple card slots and compartments.",
    reviews: [],
  },
];

module.exports = products;
