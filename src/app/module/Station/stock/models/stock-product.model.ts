import { StockGestionTab } from './stock-gestion-tab.model';

export type StockProductStatus = 'optimal' | 'critique';

export interface StockProduct {
  id: number;
  name: string;
  subtitle: string;
  categoryLabel: string;
  currentStock: number;
  unit: string;
  threshold: number;
  stockStatus: StockProductStatus;
  tab: StockGestionTab;
}
