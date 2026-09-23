import { STATUS_META, stockStatus, totalStock } from '@/lib/stock';
import { cn } from '@/lib/utils';

export default function StockBadge({ product, showCount = false, className }) {
  const status = stockStatus(product);
  const meta = STATUS_META[status];
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm', meta.text, className)}>
      <span className={cn('h-2 w-2 rounded-full', meta.dot)} aria-hidden="true" />
      {status === 'low' && showCount ? `Only ${totalStock(product)} left` : meta.label}
    </span>
  );
}
