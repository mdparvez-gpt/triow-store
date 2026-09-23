export const BRAND = {
  name: 'TrioW',
  tagline: 'Triow On. Style On.',
  email: 'hello@triow.example',
  phone: '+880 1XXX-XXXXXX',
};

export const CATEGORIES = [
  { slug: 't-shirts', label: 'T-Shirts', blurb: 'Heavyweight cotton basics', art: 'tshirt', color: '#e8e2d3' },
  { slug: 'drop-shoulder', label: 'Drop Shoulder', blurb: 'Relaxed, boxy cuts', art: 'dropshoulder', color: '#c3ad8b' },
  { slug: 'polos', label: 'Polos', blurb: 'Structured collars, textured knits', art: 'polo', color: '#1f2a44' },
  { slug: 'hoodies', label: 'Hoodies', blurb: 'Brushed fleece layers', art: 'hoodie', color: '#1f1f1f' },
  { slug: 'jackets', label: 'Jackets', blurb: 'Outerwear for cooler nights', art: 'jacket', color: '#8a4a2b' },
  { slug: 'custom-wear', label: 'Custom Wear', blurb: 'Printed with your design', art: 'tshirt', color: '#1f1f1f', graphic: true },
];

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export const ART_TYPES = [
  { value: 'tshirt', label: 'T-shirt' },
  { value: 'dropshoulder', label: 'Drop shoulder tee' },
  { value: 'polo', label: 'Polo' },
  { value: 'hoodie', label: 'Hoodie' },
  { value: 'jacket', label: 'Jacket' },
];

export const DELIVERY = {
  'inside-dhaka': { label: 'Inside Dhaka', fee: 70, eta: '1-2 working days' },
  'outside-dhaka': { label: 'Outside Dhaka', fee: 130, eta: '3-5 working days' },
};

export const FREE_DELIVERY_THRESHOLD = 4000;

export const BUDGET = { min: 500, max: 5000, step: 50 };

export const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash on delivery', hint: 'Pay when your order arrives', type: 'cod' },
  { value: 'bkash', label: 'bKash', hint: 'Mobile wallet payment', type: 'mfs' },
  { value: 'nagad', label: 'Nagad', hint: 'Mobile wallet payment', type: 'mfs' },
  { value: 'card', label: 'Card', hint: 'Payment gateway placeholder', type: 'card' },
];

export const ORDER_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const PAYMENT_STATUSES = [
  { value: 'cod', label: 'COD pending' },
  { value: 'awaiting', label: 'Awaiting payment' },
  { value: 'paid', label: 'Paid' },
  { value: 'refunded', label: 'Refunded' },
];

// Demo-level gate only. See README for moving this to real auth.
export const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'triow-admin';

export const categoryLabel = (slug) => CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
