import { createFeature, createReducer, on } from '@ngrx/store';
import { StockOverview } from '../store';
import { StockActions } from '../actions';

export interface StockState {
  overview: StockOverview | null;
  loading: boolean;
  error: string | null;
}

const initialStockState: StockState = {
  overview: null,
  loading: false,
  error: null,
};

export const stockFeature = createFeature({
  name: 'Stock',
  reducer: createReducer(
    initialStockState,
    on(StockActions.load, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(StockActions.loadSuccess, (state, { overview }) => ({
      ...state,
      loading: false,
      overview,
    })),
    on(StockActions.loadFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
  ),
});
