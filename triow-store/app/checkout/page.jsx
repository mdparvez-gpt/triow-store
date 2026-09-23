'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Lock } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { DELIVERY, PAYMENT_METHODS, FREE_DELIVERY_THRESHOLD } from '@/lib/config';
import { getProductImages } from '@/lib/garment';
import { cn, formatBDT, isValidBDPhone } from '@/lib/utils';

const emptyForm = { name: '', phone: '', email: '', address: '', note: '', trxId: '' };

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-300">{error}</p>}
    </div>
  );
}

export default function CheckoutPage() {
  const { ready, payableLines, subtotal, deliveryFee, total, zone, setZone, placeOrder } = useStore();
  const [form, setForm] = useState(emptyForm);
  const [method, setMethod] = useState('cod');
  const [errors, setErrors] = useState({});
  const [placed, setPlaced] = useState(null);

  const paymentType = PAYMENT_METHODS.find((m) => m.value === method)?.type;
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const err = {};
    if (form.name.trim().length < 2) err.name = 'Enter your full name.';
    if (!isValidBDPhone(form.phone)) err.phone = 'Enter a Bangladesh mobile number, like 01712345678.';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Enter a valid email or leave this blank.';
    if (form.address.trim().length < 10) err.address = 'Add your house, road and area so the courier can find you.';
    if (paymentType === 'mfs' && form.trxId.trim().length < 6) err.trxId = 'Enter the transaction ID from your payment.';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) {
      // Move focus to the first problem for keyboard and screen reader users.
      requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    const order = placeOrder({
      customer: {
        name: form.name.trim(),
        phone: form.phone.replace(/[\s-]/g, ''),
        email: form.email.trim(),
        address: form.address.trim(),
        note: form.note.trim(),
      },
      paymentMethod: method,
      trxId: paymentType === 'mfs' ? form.trxId.trim() : '',
    });
    if (order) {
      setPlaced(order);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!ready) {
    return <div className="container-x py-24 text-center text-white/60">Loading your bag</div>;
  }

  if (placed) {
    const pay = PAYMENT_METHODS.find((m) => m.value === placed.payment.method);
    return (
      <div className="container-x py-16 sm:py-24">
        <div className="glass mx-auto max-w-xl rounded-luxe p-8 text-center sm:p-10">
          <CheckCircle2 className="mx-auto text-gold" size={44} strokeWidth={1.5} />
          <h1 className="mt-5 text-4xl">Order placed</h1>
          <p className="mt-3 text-sm leading-relaxed text-mist/80">
            Thank you, {placed.customer.name.split(' ')[0]}. We’ll call {placed.customer.phone} to confirm your order.
          </p>
          <dl className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 text-left text-sm">
            <div className="flex justify-between px-5 py-3"><dt className="text-white/60">Order number</dt><dd className="font-medium text-white">{placed.id}</dd></div>
            <div className="flex justify-between px-5 py-3"><dt className="text-white/60">Delivery</dt><dd className="text-white">{DELIVERY[placed.zone].label}, {DELIVERY[placed.zone].eta}</dd></div>
            <div className="flex justify-between px-5 py-3"><dt className="text-white/60">Payment</dt><dd className="text-white">{pay?.label}{placed.payment.status === 'awaiting' ? ' (awaiting confirmation)' : ''}</dd></div>
            <div className="flex justify-between px-5 py-3"><dt className="text-white/60">Total</dt><dd className="font-semibold text-gold-light">{formatBDT(placed.total)}</dd></div>
          </dl>
          <Link href="/shop" className="btn btn-gold mt-8">Continue shopping</Link>
        </div>
      </div>
    );
  }

  if (payableLines.length === 0) {
    return (
      <div className="container-x grid min-h-[50vh] place-items-center py-20 text-center">
        <div>
          <h1 className="text-4xl">Your bag is empty</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm text-mist/70">Add something you like, then come back to check out.</p>
          <Link href="/shop" className="btn btn-gold mt-6">Browse the shop</Link>
        </div>
      </div>
    );
  }

  const inputProps = (key) => ({
    id: key,
    className: 'field',
    value: form[key],
    onChange: set(key),
    'aria-invalid': errors[key] ? 'true' : undefined,
    'aria-describedby': errors[key] ? `${key}-error` : undefined,
  });

  return (
    <div className="container-x py-10 sm:py-14">
      <h1 className="text-4xl sm:text-5xl">Checkout</h1>
      <p className="mt-2 text-sm text-white/60">One page, no account needed.</p>

      <form onSubmit={submit} noValidate className="mt-10 grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-14">
        <div className="space-y-10">
          <section aria-labelledby="ship-h">
            <h2 id="ship-h" className="mb-5 text-2xl">Delivery details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="name" label="Full name" error={errors.name}>
                <input {...inputProps('name')} autoComplete="name" />
              </Field>
              <Field id="phone" label="Mobile number" error={errors.phone}>
                <input {...inputProps('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" />
              </Field>
              <div className="sm:col-span-2">
                <Field id="email" label="Email (optional)" error={errors.email}>
                  <input {...inputProps('email')} type="email" autoComplete="email" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="address" label="Full address" error={errors.address}>
                  <textarea {...inputProps('address')} rows={3} autoComplete="street-address" placeholder="House, road, area, district" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="note" label="Note for the courier (optional)">
                  <input {...inputProps('note')} />
                </Field>
              </div>
            </div>

            <fieldset className="mt-6">
              <legend className="label">Delivery area</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(DELIVERY).map(([key, d]) => (
                  <label
                    key={key}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3.5 text-sm transition',
                      zone === key ? 'border-gold bg-gold/10' : 'border-white/10 hover:border-white/30'
                    )}
                  >
                    <input type="radio" name="zone" className="sr-only" checked={zone === key} onChange={() => setZone(key)} />
                    <span>
                      <span className="block font-medium text-white">{d.label}</span>
                      <span className="text-xs text-white/50">{d.eta}</span>
                    </span>
                    <span className="text-white">{subtotal >= FREE_DELIVERY_THRESHOLD ? 'Free' : formatBDT(d.fee)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </section>

          <section aria-labelledby="pay-h">
            <h2 id="pay-h" className="mb-5 text-2xl">Payment</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.value}
                  className={cn(
                    'flex cursor-pointer flex-col rounded-xl border px-4 py-3.5 text-sm transition',
                    method === m.value ? 'border-gold bg-gold/10' : 'border-white/10 hover:border-white/30'
                  )}
                >
                  <input type="radio" name="payment" className="sr-only" checked={method === m.value} onChange={() => setMethod(m.value)} />
                  <span className="font-medium text-white">{m.label}</span>
                  <span className="text-xs text-white/50">{m.hint}</span>
                </label>
              ))}
            </div>

            {paymentType === 'cod' && (
              <p className="mt-4 text-sm text-mist/70">Pay {formatBDT(total)} in cash when the courier hands over your order.</p>
            )}
            {paymentType === 'mfs' && (
              <div className="glass mt-4 rounded-2xl p-5">
                <p className="text-sm leading-relaxed text-mist/80">
                  Send {formatBDT(total)} to our {PAYMENT_METHODS.find((m) => m.value === method)?.label} number{' '}
                  <span className="font-medium text-white">01XXX-XXXXXX</span> (placeholder), then enter the transaction ID below.
                  We’ll confirm once the payment shows up.
                </p>
                <div className="mt-4">
                  <Field id="trxId" label="Transaction ID" error={errors.trxId}>
                    <input {...inputProps('trxId')} autoComplete="off" />
                  </Field>
                </div>
              </div>
            )}
            {paymentType === 'card' && (
              <p className="glass mt-4 rounded-2xl p-5 text-sm leading-relaxed text-mist/80">
                Card payments are not connected yet. Your order will be placed as awaiting payment, and the
                gateway (for example SSLCommerz) can be plugged in at this step.
              </p>
            )}
          </section>
        </div>

        <aside className="h-fit lg:sticky lg:top-28" aria-label="Order summary">
          <div className="card p-6">
            <h2 className="text-2xl">Order summary</h2>
            <ul className="mt-5 divide-y divide-white/[0.07]">
              {payableLines.map((l) => (
                <li key={l.key} className="flex gap-3 py-3.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={getProductImages(l.product)[0]} alt="" className="h-16 w-14 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="truncate font-medium text-white">{l.product.title}</p>
                    <p className="text-xs text-white/50">Size {l.size}, qty {l.qty}</p>
                  </div>
                  <p className="text-sm text-white">{formatBDT(l.product.price * l.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-white/60">Subtotal</dt><dd className="text-white">{formatBDT(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-white/60">Delivery ({DELIVERY[zone].label})</dt><dd className="text-white">{deliveryFee === 0 ? 'Free' : formatBDT(deliveryFee)}</dd></div>
              <div className="flex justify-between border-t border-white/10 pt-3 text-base"><dt className="text-white">Total</dt><dd className="font-semibold text-gold-light">{formatBDT(total)}</dd></div>
            </dl>
            <button type="submit" className="btn btn-gold mt-6 w-full py-3.5">
              <Lock size={15} /> Place order
            </button>
            <p className="mt-3 text-center text-xs text-white/40">
              {method === 'cod' ? 'You pay on delivery.' : 'Your order is held until payment is confirmed.'}
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
