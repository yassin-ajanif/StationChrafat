import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { StockGestionSummary } from '../models/stock-gestion-summary.model';
import { StockGestionTab } from '../models/stock-gestion-tab.model';
import { StockProduct } from '../models/stock-product.model';

export const StockGestionActions = createActionGroup({
  source: 'StockGestion',
  events: {
    'Load Page': emptyProps(),
    'Load Summary Success': props<{ summaries: StockGestionSummary[] }>(),
    'Load Products Success': props<{ products: StockProduct[] }>(),
    'Load Failure': props<{ error: string }>(),
    'Set Active Tab': props<{ tab: StockGestionTab }>(),
    'Set Search Query': props<{ query: string }>(),
    'Set Page': props<{ page: number }>(),
  },
});
