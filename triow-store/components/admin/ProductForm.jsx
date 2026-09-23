'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { ART_TYPES, CATEGORIES, SIZES } from '@/lib/config';
import { getProductImages } from '@/lib/garment';
import { useEscape } from '@/hooks/useEscape';
import { useLockBody } from '@/hooks/useLockBody';

const blank = {
  title: '',
  category: CATEGORIES[0].slug,
  price: '',
  compareAt: '',
  colorName: '',
  color: '#1f1f1f',
  art: 'tshirt',
  graphic: false,
  imageUrls: '',
  description: '',
  fabric: '',
  care: '',
  stock: Object.fromEntries(SIZES.map((s) => [s, 0])),
  lowStockThreshold: 5,
  outOfStock: false,
  bestSeller: false,
  newArrival: false,
  featured: false,
};

function toForm(p) {
  return {
    ...blank,
    ...p,
    price: String(p.price ?? ''),
    compareAt: p.compareAt ? String(p.compareAt) : '',
    imageUrls: (p.images || []).join('\n'),
    stock: { ...blank.stock, ...(p.stock || {}) },
  };
}

export default function ProductForm({ product, onClose }) {
  const { addProduct, updateProduct } = useStore();
  const [form, setForm] = useState(product ? toForm(product) : blank);
  const [errors, setErrors] = useState({});

  useEscape(true, onClose);
  useLockBody(true);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const previewImages = getProductImages({
    ...form,
    images: form.imageUrls.split('\n').map((s) => s.trim()).filter(Boolean),
  });

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (form.title.trim().length < 3) err.title = 'Enter a product title.';
    if (!(Number(form.price) > 0)) err.price = 'Enter a price greater than zero.';
    if (form.compareAt && Number(form.compareAt) <= Number(form.price)) err.compareAt = 'Original price must be higher than the price.';
    setErrors(err);
    if (Object.keys(err).length) return;

    const data = {
      title: form.title.trim(),
      category: form.category,
      price: Number(form.price),
      compareAt: form.compareAt ? Number(form.compareAt) : undefined,
      colorName: form.colorName.trim() || 'Default',
      color: form.color,
      art: form.art,
      graphic: form.graphic,
      images: form.imageUrls.split('\n').map((s) => s.trim()).filter(Boolean),
      description: form.description.trim(),
      fabric: form.fabric.trim(),
      care: form.care.trim(),
      stock: Object.fromEntries(SIZES.map((s) => [s, Math.max(0, Math.floor(Number(form.stock[s]) || 0))])),
      lowStockThreshold: Math.max(0, Math.floor(Number(form.lowStockThreshold) || 0)),
      outOfStock: form.outOfStock,
      bestSeller: form.bestSeller,
      newArrival: form.newArrival,
      featured: form.featured,
    };
    if (product) updateProduct(product.id, data);
    else addProduct(data);
    onClose();
  };

  const err = (k) => (errors[k] ? { 'aria-invalid': 'true', 'aria-describedby': `${k}-err` } : {});
  const errText = (k) => errors[k] && <p id={`${k}-err`} role="alert" className="mt-1.5 text-xs text-red-300">{errors[k]}</p>;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm sm:p-8" role="dialog" aria-modal="true" aria-label={product ? 'Edit product' : 'Add product'}>
      <form onSubmit={submit} noValidate className="w-full max-w-3xl rounded-luxe border border-white/10 bg-charcoal">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="text-2xl">{product ? 'Edit product' : 'Add product'}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full text-white/70 hover:text-gold"><X size={20} /></button>
        </div>

        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="f-title" className="label">Title</label>
            <input id="f-title" className="field" value={form.title} onChange={(e) => set('title', e.target.value)} {...err('title')} />
            {errText('title')}
          </div>

          <div>
            <label htmlFor="f-cat" className="label">Category</label>
            <select id="f-cat" className="field" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="f-price" className="label">Price (BDT)</label>
              <input id="f-price" inputMode="numeric" className="field" value={form.price} onChange={(e) => set('price', e.target.value.replace(/[^\d]/g, ''))} {...err('price')} />
              {errText('price')}
            </div>
            <div>
              <label htmlFor="f-cmp" className="label">Original price</label>
              <input id="f-cmp" inputMode="numeric" className="field" placeholder="Optional" value={form.compareAt} onChange={(e) => set('compareAt', e.target.value.replace(/[^\d]/g, ''))} {...err('compareAt')} />
              {errText('compareAt')}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="f-img" className="label">Image URLs (one per line)</label>
            <textarea id="f-img" rows={3} className="field font-mono !text-xs" placeholder="https://your-cdn.com/tee-front.jpg" value={form.imageUrls} onChange={(e) => set('imageUrls', e.target.value)} />
            <p className="mt-1.5 text-xs text-white/50">Leave blank to use the generated studio illustration set below.</p>
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {previewImages.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt={`Preview ${i + 1}`} className="h-24 w-20 shrink-0 rounded-lg border border-white/10 object-cover" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3">
            <div>
              <label htmlFor="f-colorname" className="label">Colour name</label>
              <input id="f-colorname" className="field" value={form.colorName} onChange={(e) => set('colorName', e.target.value)} />
            </div>
            <div>
              <label htmlFor="f-color" className="label">Swatch</label>
              <input id="f-color" type="color" value={form.color} onChange={(e) => set('color', e.target.value)} className="h-[46px] w-14 cursor-pointer rounded-xl border border-white/10 bg-panel p-1" />
            </div>
          </div>
          <div>
            <label htmlFor="f-art" className="label">Illustration style (when no image URL)</label>
            <select id="f-art" className="field" value={form.art} onChange={(e) => set('art', e.target.value)}>
              {ART_TYPES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="f-desc" className="label">Description</label>
            <textarea id="f-desc" rows={3} className="field" value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div>
            <label htmlFor="f-fabric" className="label">Fabric info</label>
            <textarea id="f-fabric" rows={2} className="field" value={form.fabric} onChange={(e) => set('fabric', e.target.value)} />
          </div>
          <div>
            <label htmlFor="f-care" className="label">Care instructions</label>
            <textarea id="f-care" rows={2} className="field" value={form.care} onChange={(e) => set('care', e.target.value)} />
          </div>

          <fieldset className="sm:col-span-2">
            <legend className="label">Stock by size</legend>
            <div className="flex flex-wrap items-end gap-3">
              {SIZES.map((s) => (
                <div key={s}>
                  <label htmlFor={`f-stock-${s}`} className="mb-1 block text-center text-xs text-white/50">{s}</label>
                  <input
                    id={`f-stock-${s}`}
                    type="number"
                    min="0"
                    className="field !w-20 !px-3 text-center"
                    value={form.stock[s]}
                    onChange={(e) => set('stock', { ...form.stock, [s]: e.target.value })}
                  />
                </div>
              ))}
              <div className="ml-auto">
                <label htmlFor="f-low" className="mb-1 block text-xs text-white/50">Low stock at (total units)</label>
                <input id="f-low" type="number" min="0" className="field !w-28 !px-3" value={form.lowStockThreshold} onChange={(e) => set('lowStockThreshold', e.target.value)} />
              </div>
            </div>
          </fieldset>

          <fieldset className="sm:col-span-2">
            <legend className="label">Flags</legend>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/80">
              {[
                ['bestSeller', 'Best seller'],
                ['newArrival', 'New arrival'],
                ['featured', 'Featured'],
                ['outOfStock', 'Mark as sold out'],
                ['graphic', 'Show gold print on illustration'],
              ].map(([key, label]) => (
                <label key={key} className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={!!form[key]} onChange={(e) => set(key, e.target.checked)} className="h-4 w-4 accent-[#D4AF37]" />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button type="button" onClick={onClose} className="btn btn-ghost px-5 py-2.5">Cancel</button>
          <button type="submit" className="btn btn-gold px-6 py-2.5">{product ? 'Save changes' : 'Add product'}</button>
        </div>
      </form>
    </div>
  );
}
