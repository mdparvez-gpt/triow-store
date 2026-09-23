/**
 * Mock database.
 *
 * Everything the store persists goes through this file, and only this file.
 * To move to Supabase, replace the bodies of these functions with supabase-js calls
 * (make them async and await them in context/StoreContext.jsx). Nothing else needs to change.
 */
import { SEED_PRODUCTS, SEED_ORDERS } from '@/lib/seed';

export const KEYS = {
  products: 'triow:products:v1',
  orders: 'triow:orders:v1',
  cart: 'triow:cart:v1',
  wishlist: 'triow:wishlist:v1',
  zone: 'triow:zone:v1',
};

const isBrowser = () => typeof window !== 'undefined';

function read(key, fallback) {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked: the app keeps working in memory */
  }
}

export const db = {
  loadProducts() {
    const saved = read(KEYS.products, null);
    if (Array.isArray(saved)) return saved;
    write(KEYS.products, SEED_PRODUCTS);
    return SEED_PRODUCTS;
  },
  saveProducts: (products) => write(KEYS.products, products),

  loadOrders() {
    const saved = read(KEYS.orders, null);
    if (Array.isArray(saved)) return saved;
    write(KEYS.orders, SEED_ORDERS);
    return SEED_ORDERS;
  },
  saveOrders: (orders) => write(KEYS.orders, orders),

  loadCart: () => read(KEYS.cart, []),
  saveCart: (cart) => write(KEYS.cart, cart),

  loadWishlist: () => read(KEYS.wishlist, []),
  saveWishlist: (ids) => write(KEYS.wishlist, ids),

  loadZone: () => read(KEYS.zone, 'inside-dhaka'),
  saveZone: (zone) => write(KEYS.zone, zone),

  reset() {
    write(KEYS.products, SEED_PRODUCTS);
    write(KEYS.orders, SEED_ORDERS);
    return { products: SEED_PRODUCTS, orders: SEED_ORDERS };
  },
};
