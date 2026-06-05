import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { StockOverview, StockGestionSummary, StockGestionTab, StockProduct } from './store';

export const StockActions = createActionGroup({
  source: 'Stock',
  events: {
    'Load': emptyProps(),
    'Load Success': props<{ overview: StockOverview }>(),
    'Load Failure': props<{ error: string }>(),
  },
});

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
