import { createFeature, createReducer, on } from '@ngrx/store';
import { StockGestionSummary, StockGestionTab, StockProduct } from '../store';
import { StockGestionActions } from '../actions';

export interface StockGestionState {
  summaries: StockGestionSummary[];
  allProducts: StockProduct[];
  activeTab: StockGestionTab;
  searchQuery: string;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

const initial: StockGestionState = {
  summaries: [],
  allProducts: [],
  activeTab: 'carburant',
  searchQuery: '',
  currentPage: 1,
  pageSize: 6,
  loading: false,
  error: null,
};

export const stockGestionFeature = createFeature({
  name: 'stockGestion',
  reducer: createReducer(
    initial,

    on(StockGestionActions.loadPage, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(StockGestionActions.loadSummarySuccess, (state, { summaries }) => ({
      ...state,
      summaries,
    })),
    on(StockGestionActions.loadProductsSuccess, (state, { products }) => ({
      ...state,
      loading: false,
      allProducts: products,
      currentPage: 1,
    })),
    on(StockGestionActions.loadFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    on(StockGestionActions.setActiveTab, (state, { tab }) => ({
      ...state,
      activeTab: tab,
      currentPage: 1,
    })),
    on(StockGestionActions.setSearchQuery, (state, { query }) => ({
      ...state,
      searchQuery: query,
      currentPage: 1,
    })),
    on(StockGestionActions.setPage, (state, { page }) => ({
      ...state,
      currentPage: page,
    })),
  ),
});
