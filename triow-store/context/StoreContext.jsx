'use client';

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { db, KEYS } from '@/lib/db';
import { DELIVERY, FREE_DELIVERY_THRESHOLD, SIZES } from '@/lib/config';
import { sizeStock } from '@/lib/stock';
import { makeOrderId, slugify, uid } from '@/lib/utils';

export const StoreContext = createContext(null);

const emptyStock = () => Object.fromEntries(SIZES.map((s) => [s, 0]));

function uniqueSlug(title, products, ignoreId) {
  const base = slugify(title) || 'product';
  let slug = base;
  let n = 2;
  while (products.some((p) => p.slug === slug && p.id !== ignoreId)) slug = `${base}-${n++}`;
  return slug;
}

export function StoreProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [zone, setZone] = useState('inside-dhaka');
  const [cartOpen, setCartOpen] = useState(false);

  /* ---------- load once, then keep tabs in sync ---------- */
  useEffect(() => {
    setProducts(db.loadProducts());
    setOrders(db.loadOrders());
    setCart(db.loadCart());
    setWishlist(db.loadWishlist());
    setZone(db.loadZone());
    setReady(true);
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEYS.products) setProducts(db.loadProducts());
      else if (e.key === KEYS.orders) setOrders(db.loadOrders());
      else if (e.key === KEYS.cart) setCart(db.loadCart());
      else if (e.key === KEYS.wishlist) setWishlist(db.loadWishlist());
      else if (e.key === KEYS.zone) setZone(db.loadZone());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  /* ---------- persist ---------- */
  useEffect(() => { if (ready) db.saveProducts(products); }, [ready, products]);
  useEffect(() => { if (ready) db.saveOrders(orders); }, [ready, orders]);
  useEffect(() => { if (ready) db.saveCart(cart); }, [ready, cart]);
  useEffect(() => { if (ready) db.saveWishlist(wishlist); }, [ready, wishlist]);
  useEffect(() => { if (ready) db.saveZone(zone); }, [ready, zone]);

  /* ---------- cart ---------- */
  const cartLines = useMemo(
    () =>
      cart
        .map((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product) return null;
          const max = sizeStock(product, item.size);
          return {
            ...item,
            key: `${item.productId}:${item.size}`,
            product,
            max,
            qty: Math.max(1, Math.min(item.qty, Math.max(max, 1))),
            unavailable: max <= 0,
          };
        })
        .filter(Boolean),
    [cart, products]
  );

  const payableLines = useMemo(() => cartLines.filter((l) => !l.unavailable), [cartLines]);
  const cartCount = payableLines.reduce((n, l) => n + l.qty, 0);
  const subtotal = payableLines.reduce((n, l) => n + l.qty * l.product.price, 0);
  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY[zone].fee;
  const total = subtotal + deliveryFee;

  const addToCart = useCallback(
    (productId, size, qty = 1) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return false;
      const max = sizeStock(product, size);
      if (max <= 0) return false;
      setCart((prev) => {
        const existing = prev.find((i) => i.productId === productId && i.size === size);
        if (existing) {
          return prev.map((i) => (i === existing ? { ...i, qty: Math.min(i.qty + qty, max) } : i));
        }
        return [...prev, { productId, size, qty: Math.min(qty, max) }];
      });
      setCartOpen(true);
      return true;
    },
    [products]
  );

  const setLineQty = useCallback((key, qty) => {
    setCart((prev) =>
      prev
        .map((i) => (`${i.productId}:${i.size}` === key ? { ...i, qty } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const removeLine = useCallback((key) => {
    setCart((prev) => prev.filter((i) => `${i.productId}:${i.size}` !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  /* ---------- wishlist ---------- */
  const toggleWishlist = useCallback((id) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  /* ---------- orders ---------- */
  const placeOrder = useCallback(
    ({ customer, paymentMethod, trxId = '' }) => {
      if (!payableLines.length) return null;
      const items = payableLines.map((l) => ({
        productId: l.productId,
        title: l.product.title,
        size: l.size,
        qty: l.qty,
        price: l.product.price,
      }));
      const order = {
        id: makeOrderId(),
        createdAt: new Date().toISOString(),
        customer,
        zone,
        items,
        subtotal,
        deliveryFee,
        total,
        payment: { method: paymentMethod, status: paymentMethod === 'cod' ? 'cod' : 'awaiting', trxId },
        status: 'new',
      };
      // Reserve stock immediately so the storefront reflects it.
      setProducts((prev) =>
        prev.map((p) => {
          const mine = items.filter((i) => i.productId === p.id);
          if (!mine.length) return p;
          const stock = { ...p.stock };
          mine.forEach((i) => {
            stock[i.size] = Math.max(0, (Number(stock[i.size]) || 0) - i.qty);
          });
          return { ...p, stock };
        })
      );
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      return order;
    },
    [payableLines, subtotal, deliveryFee, total, zone]
  );

  const updateOrder = useCallback(
    (id, patch) => {
      const current = orders.find((o) => o.id === id);
      if (!current) return;
      if (patch.status === 'cancelled' && current.status !== 'cancelled') {
        // Cancelling releases the reserved stock.
        setProducts((prev) =>
          prev.map((p) => {
            const mine = current.items.filter((i) => i.productId === p.id);
            if (!mine.length) return p;
            const stock = { ...p.stock };
            mine.forEach((i) => {
              stock[i.size] = (Number(stock[i.size]) || 0) + i.qty;
            });
            return { ...p, stock };
          })
        );
      }
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? { ...o, ...(patch.status ? { status: patch.status } : {}), payment: { ...o.payment, ...(patch.payment || {}) } }
            : o
        )
      );
    },
    [orders]
  );

  /* ---------- admin: products ---------- */
  const addProduct = useCallback((data) => {
    setProducts((prev) => {
      const product = {
        images: [],
        graphic: false,
        lowStockThreshold: 5,
        outOfStock: false,
        bestSeller: false,
        newArrival: false,
        featured: false,
        rating: 4.5,
        reviews: 0,
        stock: emptyStock(),
        ...data,
        id: uid('p'),
        slug: uniqueSlug(data.title, prev),
        createdAt: new Date().toISOString(),
      };
      return [product, ...prev];
    });
  }, []);

  const updateProduct = useCallback((id, patch) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next = { ...p, ...patch };
        if (patch.title && patch.title !== p.title) next.slug = uniqueSlug(patch.title, prev, id);
        return next;
      })
    );
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setWishlist((prev) => prev.filter((x) => x !== id));
  }, []);

  const setSizeStock = useCallback((id, size, value) => {
    const n = Math.max(0, Math.floor(Number(value) || 0));
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: { ...p.stock, [size]: n } } : p)));
  }, []);

  const toggleOutOfStock = useCallback((id) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, outOfStock: !p.outOfStock } : p)));
  }, []);

  const resetDemoData = useCallback(() => {
    const fresh = db.reset();
    setProducts(fresh.products);
    setOrders(fresh.orders);
    setCart([]);
    setWishlist([]);
  }, []);

  const value = useMemo(
    () => ({
      ready, products, orders,
      cartLines, payableLines, cartCount, subtotal, deliveryFee, total,
      cartOpen, openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false),
      zone, setZone,
      addToCart, setLineQty, removeLine, clearCart,
      wishlist, toggleWishlist,
      placeOrder, updateOrder,
      addProduct, updateProduct, deleteProduct, setSizeStock, toggleOutOfStock, resetDemoData,
    }),
    [
      ready, products, orders, cartLines, payableLines, cartCount, subtotal, deliveryFee, total,
      cartOpen, zone, addToCart, setLineQty, removeLine, clearCart, wishlist, toggleWishlist,
      placeOrder, updateOrder, addProduct, updateProduct, deleteProduct, setSizeStock,
      toggleOutOfStock, resetDemoData,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
