import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { StockOverview } from '../models/stock.model';

export const StockActions = createActionGroup({
  source: 'Stock',
  events: {
    'Load': emptyProps(),
    'Load Success': props<{ overview: StockOverview }>(),
    'Load Failure': props<{ error: string }>(),
  },
});
