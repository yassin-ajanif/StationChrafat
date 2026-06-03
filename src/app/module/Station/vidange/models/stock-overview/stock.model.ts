export type ConsumableStockStatus = 'optimal' | 'alerte' | 'critique';

export interface ConsumableStockItem {
  id: number;
  name: string;
  unit: string;
  quantityOnHand: number;
  minThreshold: number;
  status: ConsumableStockStatus;
}

export interface StockOverview {
  sectionTitle: string;
  items: ConsumableStockItem[];
}

export const CONSUMABLE_STOCK_STATUS_LABELS: Record<ConsumableStockStatus, string> = {
  optimal: 'Optimal',
  alerte: 'Alerte',
  critique: 'Critique',
};

export function computeStockFillPercent(item: ConsumableStockItem): number {
  if (item.minThreshold <= 0) {
    return 100;
  }
  return Math.min(100, Math.round((item.quantityOnHand / (item.minThreshold * 2)) * 100));
}

export function stockStatusClass(status: ConsumableStockStatus): string {
  const map: Record<ConsumableStockStatus, string> = {
    optimal: 'bg-success/15 text-success',
    alerte: 'bg-warning-bg text-warning-text',
    critique: 'bg-primary/15 text-primary',
  };
  return map[status];
}
