import { createFeature, createReducer, on } from '@ngrx/store';
import { CatalogueCategory, CatalogueItem } from './produits-services.store';
import { ProduitsServicesActions } from './produits-services.actions';

export interface ProduitsServicesState {
  serviceCategories: CatalogueCategory[];
  productCategories: CatalogueCategory[];
  items: CatalogueItem[];
  searchQuery: string;
  selectedCategoryId: number | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initial: ProduitsServicesState = {
  serviceCategories: [],
  productCategories: [],
  items: [],
  searchQuery: '',
  selectedCategoryId: null,
  loading: false,
  saving: false,
  error: null,
};

export const produitsServicesFeature = createFeature({
  name: 'produitsServices',
  reducer: createReducer(
    initial,

    on(ProduitsServicesActions.loadCatalogue, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(
      ProduitsServicesActions.loadCatalogueSuccess,
      (state, { serviceCategories, productCategories, items }) => ({
        ...state,
        loading: false,
        serviceCategories,
        productCategories,
        items,
      }),
    ),
    on(ProduitsServicesActions.loadCatalogueFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    on(ProduitsServicesActions.addItem, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(ProduitsServicesActions.addItemSuccess, (state, { item }) => ({
      ...state,
      saving: false,
      items: [...state.items, item],
    })),
    on(ProduitsServicesActions.addItemFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    on(ProduitsServicesActions.updateItem, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(ProduitsServicesActions.updateItemSuccess, (state, { item }) => ({
      ...state,
      saving: false,
      items: state.items.map((i) => (i.id === item.id ? item : i)),
    })),
    on(ProduitsServicesActions.updateItemFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    on(ProduitsServicesActions.removeItem, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(ProduitsServicesActions.removeItemSuccess, (state, { id }) => ({
      ...state,
      saving: false,
      items: state.items.filter((i) => i.id !== id),
    })),
    on(ProduitsServicesActions.removeItemFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    on(ProduitsServicesActions.addCategory, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(ProduitsServicesActions.addCategorySuccess, (state, { category }) => ({
      ...state,
      saving: false,
      ...(category.kind === 'service'
        ? { serviceCategories: [...state.serviceCategories, category] }
        : { productCategories: [...state.productCategories, category] }),
    })),
    on(ProduitsServicesActions.addCategoryFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    on(ProduitsServicesActions.updateCategory, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(ProduitsServicesActions.updateCategorySuccess, (state, { category }) => {
      const updateList = (list: CatalogueCategory[]) =>
        list.map((c) => (c.id === category.id ? category : c));
      return {
        ...state,
        saving: false,
        ...(category.kind === 'service'
          ? { serviceCategories: updateList(state.serviceCategories) }
          : { productCategories: updateList(state.productCategories) }),
      };
    }),
    on(ProduitsServicesActions.updateCategoryFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    on(ProduitsServicesActions.setSearchQuery, (state, { query }) => ({
      ...state,
      searchQuery: query,
    })),
    on(ProduitsServicesActions.setSelectedCategory, (state, { categoryId }) => ({
      ...state,
      selectedCategoryId: categoryId,
    })),
  ),
});
