export type StockGestionSummaryAccent = 'carburant' | 'vidange' | 'lavage' | 'total';

export interface StockGestionSummary {
  id: number;
  label: string;
  valueDh: number;
  trendPercent: number;
  accent?: StockGestionSummaryAccent;
}
