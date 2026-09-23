const day = 86400000;
const ago = (d) => new Date(Date.now() - d * day).toISOString();

const base = {
  images: [],
  graphic: false,
  lowStockThreshold: 5,
  outOfStock: false,
  bestSeller: false,
  newArrival: false,
  featured: false,
};

const COTTON_CARE = 'Machine wash cold with similar colours. Do not bleach. Tumble dry low or line dry. Iron on low heat, inside out.';
const FLEECE_CARE = 'Machine wash cold, inside out. Do not bleach or tumble dry on high heat. Iron away from prints and zips.';
const OUTER_CARE = 'Spot clean where possible. Machine wash cold on a gentle cycle, zip closed. Line dry away from direct heat.';

export const SEED_PRODUCTS = [
  {
    ...base, id: 'p-onyx-tee', slug: 'onyx-heavyweight-tee', title: 'Onyx Heavyweight Tee', category: 't-shirts',
    price: 890, compareAt: 1090, art: 'tshirt', color: '#1f1f1f', colorName: 'Onyx',
    description: 'A dense, dark everyday tee with a clean crew neck and a slightly longer body. Holds its shape after repeated washing.',
    fabric: '100% combed cotton jersey, 240 GSM. Pre-shrunk and bio-washed for a soft hand feel.',
    care: COTTON_CARE, stock: { S: 12, M: 20, L: 18, XL: 9, XXL: 4 }, bestSeller: true, featured: true,
    rating: 4.8, reviews: 126, createdAt: ago(60),
  },
  {
    ...base, id: 'p-bone-tee', slug: 'bone-essential-tee', title: 'Bone Essential Tee', category: 't-shirts',
    price: 790, art: 'tshirt', color: '#e8e2d3', colorName: 'Bone',
    description: 'A soft off-white tee that goes with everything. Regular fit, ribbed collar, tagless neck.',
    fabric: '100% combed cotton jersey, 200 GSM.',
    care: COTTON_CARE, stock: { S: 8, M: 14, L: 14, XL: 6, XXL: 0 }, newArrival: true,
    rating: 4.6, reviews: 58, createdAt: ago(6),
  },
  {
    ...base, id: 'p-olive-tee', slug: 'olive-boxy-tee', title: 'Olive Boxy Tee', category: 't-shirts',
    price: 950, art: 'tshirt', color: '#59603f', colorName: 'Olive',
    description: 'A boxy, mid-weight tee in a muted military green. Shorter in the body, wider through the chest.',
    fabric: '100% cotton slub jersey, 220 GSM.',
    care: COTTON_CARE, stock: { S: 5, M: 9, L: 11, XL: 7, XXL: 3 }, bestSeller: true,
    rating: 4.7, reviews: 84, createdAt: ago(40),
  },
  {
    ...base, id: 'p-slate-tee', slug: 'slate-everyday-tee', title: 'Everyday Basic Tee', category: 't-shirts',
    price: 590, art: 'tshirt', color: '#4b5563', colorName: 'Slate',
    description: 'Our entry-level tee for daily rotation. Light, breathable and easy on the budget.',
    fabric: '100% cotton jersey, 170 GSM.',
    care: COTTON_CARE, stock: { S: 25, M: 40, L: 40, XL: 22, XXL: 10 },
    rating: 4.4, reviews: 212, createdAt: ago(120),
  },
  {
    ...base, id: 'p-sand-drop', slug: 'sand-drop-shoulder-tee', title: 'Sand Drop Shoulder Tee', category: 'drop-shoulder',
    price: 1190, art: 'dropshoulder', color: '#c3ad8b', colorName: 'Sand',
    description: 'A relaxed drop-shoulder cut with extra room through the sleeve and body. Styled to be worn loose.',
    fabric: '100% cotton terry-back jersey, 260 GSM.',
    care: COTTON_CARE, stock: { S: 6, M: 10, L: 12, XL: 8, XXL: 5 }, newArrival: true, featured: true,
    rating: 4.9, reviews: 41, createdAt: ago(4),
  },
  {
    ...base, id: 'p-ash-drop', slug: 'ash-oversized-drop-tee', title: 'Ash Oversized Drop Tee', category: 'drop-shoulder',
    price: 1290, compareAt: 1490, art: 'dropshoulder', color: '#9a9a9a', colorName: 'Ash',
    description: 'An oversized drop-shoulder tee in soft heather grey with a heavy drape and a raw-edge feel.',
    fabric: '100% cotton, 260 GSM, garment washed.',
    care: COTTON_CARE, stock: { S: 4, M: 9, L: 10, XL: 3, XXL: 1 }, bestSeller: true,
    rating: 4.7, reviews: 97, createdAt: ago(50),
  },
  {
    ...base, id: 'p-burgundy-drop', slug: 'burgundy-drop-shoulder', title: 'Burgundy Drop Shoulder Tee', category: 'drop-shoulder',
    price: 1250, art: 'dropshoulder', color: '#5a1f2b', colorName: 'Burgundy',
    description: 'A deep wine-red drop-shoulder tee. Dark enough for everyday wear, rich enough to stand alone.',
    fabric: '100% cotton terry-back jersey, 260 GSM.',
    care: COTTON_CARE, stock: { S: 7, M: 8, L: 8, XL: 5, XXL: 2 }, newArrival: true,
    rating: 4.5, reviews: 19, createdAt: ago(9),
  },
  {
    ...base, id: 'p-navy-polo', slug: 'navy-pique-polo', title: 'Navy Piqué Polo', category: 'polos',
    price: 1490, art: 'polo', color: '#1f2a44', colorName: 'Navy',
    description: 'A structured piqué polo with a firm collar, three-button placket and ribbed sleeve cuffs.',
    fabric: '100% cotton piqué, 220 GSM. Reactive dyed for colour retention.',
    care: COTTON_CARE, stock: { S: 10, M: 18, L: 20, XL: 12, XXL: 6 }, bestSeller: true, featured: true,
    rating: 4.8, reviews: 143, createdAt: ago(80),
  },
  {
    ...base, id: 'p-ivory-polo', slug: 'ivory-classic-polo', title: 'Ivory Classic Polo', category: 'polos',
    price: 1390, art: 'polo', color: '#f1ede4', colorName: 'Ivory',
    description: 'A clean ivory polo in a lighter weave, made for warm days and long ones.',
    fabric: '95% cotton, 5% elastane piqué, 200 GSM.',
    care: COTTON_CARE, stock: { S: 6, M: 12, L: 14, XL: 8, XXL: 4 },
    rating: 4.5, reviews: 52, createdAt: ago(70),
  },
  {
    ...base, id: 'p-forest-polo', slug: 'forest-textured-polo', title: 'Forest Textured Polo', category: 'polos',
    price: 1690, art: 'polo', color: '#1f3d2e', colorName: 'Forest',
    description: 'A deep green polo in a textured knit with a soft, structured collar.',
    fabric: 'Cotton-blend textured knit, 240 GSM.',
    care: COTTON_CARE, stock: { S: 3, M: 6, L: 7, XL: 4, XXL: 2 }, newArrival: true,
    rating: 4.9, reviews: 22, createdAt: ago(3),
  },
  {
    ...base, id: 'p-onyx-hoodie', slug: 'onyx-fleece-hoodie', title: 'Onyx Fleece Hoodie', category: 'hoodies',
    price: 2490, compareAt: 2890, art: 'hoodie', color: '#1f1f1f', colorName: 'Onyx',
    description: 'A heavyweight pullover hoodie with a double-lined hood, kangaroo pocket and brushed fleece interior.',
    fabric: '80% cotton, 20% polyester fleece, 340 GSM.',
    care: FLEECE_CARE, stock: { S: 8, M: 16, L: 18, XL: 10, XXL: 5 }, bestSeller: true, featured: true,
    rating: 4.9, reviews: 188, createdAt: ago(90),
  },
  {
    ...base, id: 'p-champagne-hoodie', slug: 'champagne-hoodie', title: 'Champagne Pullover Hoodie', category: 'hoodies',
    price: 2790, art: 'hoodie', color: '#cbb27a', colorName: 'Champagne',
    description: 'Our signature champagne-toned hoodie. Warm, soft and easy to layer under a jacket.',
    fabric: '80% cotton, 20% polyester fleece, 340 GSM.',
    care: FLEECE_CARE, stock: { S: 4, M: 6, L: 7, XL: 3, XXL: 1 }, lowStockThreshold: 25, newArrival: true,
    rating: 4.8, reviews: 30, createdAt: ago(5),
  },
  {
    ...base, id: 'p-slate-hoodie', slug: 'slate-pullover-hoodie', title: 'Slate Pullover Hoodie', category: 'hoodies',
    price: 2290, art: 'hoodie', color: '#4b5563', colorName: 'Slate',
    description: 'A mid-weight slate grey hoodie for cooler evenings. Roomy hood and clean finishing.',
    fabric: '70% cotton, 30% polyester fleece, 300 GSM.',
    care: FLEECE_CARE, stock: { S: 9, M: 12, L: 14, XL: 8, XXL: 4 },
    rating: 4.6, reviews: 71, createdAt: ago(100),
  },
  {
    ...base, id: 'p-rust-coach', slug: 'rust-coach-jacket', title: 'Rust Coach Jacket', category: 'jackets',
    price: 3490, art: 'jacket', color: '#8a4a2b', colorName: 'Rust',
    description: 'A lightweight coach jacket with a stand collar, full zip and two front pockets.',
    fabric: 'Water-resistant nylon shell, polyester mesh lining.',
    care: OUTER_CARE, stock: { S: 3, M: 6, L: 6, XL: 4, XXL: 2 }, newArrival: true, featured: true,
    rating: 4.7, reviews: 16, createdAt: ago(7),
  },
  {
    ...base, id: 'p-navy-bomber', slug: 'navy-bomber-jacket', title: 'Navy Bomber Jacket', category: 'jackets',
    price: 4290, art: 'jacket', color: '#1f2a44', colorName: 'Navy',
    description: 'A classic bomber in deep navy with ribbed cuffs and hem, and a smooth, structured shell.',
    fabric: 'Poly-twill shell, quilted polyester lining.',
    care: OUTER_CARE, stock: { S: 2, M: 4, L: 3, XL: 1, XXL: 0 }, lowStockThreshold: 12, bestSeller: true,
    rating: 4.8, reviews: 64, createdAt: ago(55),
  },
  {
    ...base, id: 'p-onyx-quilted', slug: 'onyx-quilted-jacket', title: 'Onyx Quilted Jacket', category: 'jackets',
    price: 4900, art: 'jacket', color: '#1f1f1f', colorName: 'Onyx',
    description: 'A quilted, lightly padded jacket in black. Warm without the bulk.',
    fabric: 'Nylon shell with polyester padding.',
    care: OUTER_CARE, stock: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 }, outOfStock: true,
    rating: 4.9, reviews: 33, createdAt: ago(75),
  },
  {
    ...base, id: 'p-custom-tee', slug: 'custom-print-tee', title: 'Custom Print Tee', category: 'custom-wear',
    price: 1190, art: 'tshirt', color: '#1f1f1f', colorName: 'Onyx', graphic: true,
    description: 'Our heavyweight tee, printed with your artwork. Send us your logo or design and we will confirm a proof before printing.',
    fabric: '100% combed cotton jersey, 240 GSM. Screen or DTF print depending on artwork.',
    care: 'Wash inside out in cold water. Do not iron directly on the print.',
    stock: { S: 30, M: 30, L: 30, XL: 30, XXL: 30 }, featured: true,
    rating: 4.7, reviews: 38, createdAt: ago(30),
  },
  {
    ...base, id: 'p-custom-polo', slug: 'custom-team-polo', title: 'Custom Team Polo', category: 'custom-wear',
    price: 1590, art: 'polo', color: '#1f2a44', colorName: 'Navy', graphic: true,
    description: 'Structured piqué polos with your team or company logo embroidered on the chest. Ideal for uniforms and events.',
    fabric: '100% cotton piqué, 220 GSM. Embroidered logo.',
    care: COTTON_CARE, stock: { S: 20, M: 20, L: 20, XL: 20, XXL: 20 },
    rating: 4.6, reviews: 12, createdAt: ago(25),
  },
];

const item = (id, title, size, qty, price) => ({ productId: id, title, size, qty, price });

export const SEED_ORDERS = [
  {
    id: 'TW-8K2QA1', createdAt: ago(0.2),
    customer: { name: 'Tasnim Rahman', phone: '01712345678', email: '', address: 'House 12, Road 5, Dhanmondi, Dhaka', note: '' },
    zone: 'inside-dhaka',
    items: [item('p-onyx-hoodie', 'Onyx Fleece Hoodie', 'M', 1, 2490), item('p-onyx-tee', 'Onyx Heavyweight Tee', 'M', 2, 890)],
    subtotal: 4270, deliveryFee: 0, total: 4270,
    payment: { method: 'cod', status: 'cod', trxId: '' }, status: 'new',
  },
  {
    id: 'TW-5M9ZB4', createdAt: ago(1.4),
    customer: { name: 'Arif Hossain', phone: '01898765432', email: 'arif@example.com', address: 'Zindabazar, Sylhet Sadar, Sylhet', note: 'Call before delivery' },
    zone: 'outside-dhaka',
    items: [item('p-navy-polo', 'Navy Piqué Polo', 'L', 1, 1490)],
    subtotal: 1490, deliveryFee: 130, total: 1620,
    payment: { method: 'bkash', status: 'paid', trxId: '9F3K2LM7QA' }, status: 'confirmed',
  },
  {
    id: 'TW-3P7XC8', createdAt: ago(3.1),
    customer: { name: 'Nusrat Jahan', phone: '01611223344', email: '', address: 'Agrabad C/A, Chattogram', note: '' },
    zone: 'outside-dhaka',
    items: [item('p-sand-drop', 'Sand Drop Shoulder Tee', 'S', 1, 1190), item('p-bone-tee', 'Bone Essential Tee', 'S', 1, 790)],
    subtotal: 1980, deliveryFee: 130, total: 2110,
    payment: { method: 'cod', status: 'cod', trxId: '' }, status: 'shipped',
  },
  {
    id: 'TW-2D4YE6', createdAt: ago(6.5),
    customer: { name: 'Sabbir Ahmed', phone: '01511009988', email: '', address: 'Mirpur 10, Dhaka', note: '' },
    zone: 'inside-dhaka',
    items: [item('p-navy-bomber', 'Navy Bomber Jacket', 'M', 1, 4290)],
    subtotal: 4290, deliveryFee: 0, total: 4290,
    payment: { method: 'nagad', status: 'paid', trxId: '7H1N4P0XZ2' }, status: 'delivered',
  },
];

export const SEED_REVIEWS = [
  { name: 'Tasnim R.', city: 'Dhaka', product: 'Onyx Fleece Hoodie', rating: 5, text: 'The fleece is properly thick and the fit is exactly what the size chart said. Wore it through the whole cold snap.' },
  { name: 'Arif H.', city: 'Sylhet', product: 'Navy Piqué Polo', rating: 5, text: 'The collar keeps its shape after multiple washes. Delivery outside Dhaka took four days, and the packaging was tidy.' },
  { name: 'Nusrat J.', city: 'Chattogram', product: 'Sand Drop Shoulder Tee', rating: 4, text: 'Loose and heavy in the right way. I sized down once and it still had plenty of room.' },
  { name: 'Sabbir A.', city: 'Dhaka', product: 'Navy Bomber Jacket', rating: 5, text: 'Looks a lot more expensive than it costs. The ribbing is tight and the zip runs smoothly.' },
  { name: 'Farhana K.', city: 'Rajshahi', product: 'Custom Print Tee', rating: 5, text: 'Sent our club logo, got a proof the same day, and the print matched it. Ordering again for the next batch.' },
  { name: 'Imran M.', city: 'Khulna', product: 'Olive Boxy Tee', rating: 4, text: 'Great colour and a good weight for the price. Would like it in a few more shades.' },
];
