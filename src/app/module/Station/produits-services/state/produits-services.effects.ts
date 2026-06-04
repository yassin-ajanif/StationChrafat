import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { ProduitsServicesApi } from '../data-access/produits-services.api';
import { ProduitsServicesActions } from './produits-services.actions';

@Injectable()
export class ProduitsServicesEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ProduitsServicesApi);

  loadCatalogue$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProduitsServicesActions.loadCatalogue),
      switchMap(() =>
        this.api.getCategories().pipe(
          switchMap((categories) =>
            this.api.getItems().pipe(
              map((items) => {
                const serviceCategories = categories.filter((c) => c.kind === 'service');
                const productCategories = categories.filter((c) => c.kind === 'product');
                return ProduitsServicesActions.loadCatalogueSuccess({
                  serviceCategories,
                  productCategories,
                  items,
                });
              }),
            ),
          ),
          catchError((err) =>
            of(
              ProduitsServicesActions.loadCatalogueFailure({
                error: err?.message ?? 'Erreur chargement catalogue',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  addItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProduitsServicesActions.addItem),
      switchMap(({ draft }) =>
        this.api.createItem(draft).pipe(
          map((item) => ProduitsServicesActions.addItemSuccess({ item })),
          catchError((err) =>
            of(ProduitsServicesActions.addItemFailure({ error: err?.message ?? 'Erreur ajout article' })),
          ),
        ),
      ),
    ),
  );

  updateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProduitsServicesActions.updateItem),
      switchMap(({ id, draft }) =>
        this.api.updateItem(id, draft).pipe(
          map((item) => ProduitsServicesActions.updateItemSuccess({ item })),
          catchError((err) =>
            of(ProduitsServicesActions.updateItemFailure({ error: err?.message ?? 'Erreur modification article' })),
          ),
        ),
      ),
    ),
  );

  removeItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProduitsServicesActions.removeItem),
      switchMap(({ id }) =>
        this.api.deleteItem(id).pipe(
          map(() => ProduitsServicesActions.removeItemSuccess({ id })),
          catchError((err) =>
            of(ProduitsServicesActions.removeItemFailure({ error: err?.message ?? 'Erreur suppression article' })),
          ),
        ),
      ),
    ),
  );

  addCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProduitsServicesActions.addCategory),
      switchMap(({ draft }) =>
        this.api.createCategory(draft.kind, draft.label.trim()).pipe(
          map((category) => ProduitsServicesActions.addCategorySuccess({ category })),
          catchError((err) =>
            of(ProduitsServicesActions.addCategoryFailure({ error: err?.message ?? 'Erreur ajout catégorie' })),
          ),
        ),
      ),
    ),
  );

  updateCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProduitsServicesActions.updateCategory),
      switchMap(({ id, draft }) =>
        this.api.updateCategory(id, { label: draft.label.trim() }).pipe(
          map((category) => ProduitsServicesActions.updateCategorySuccess({ category })),
          catchError((err) =>
            of(
              ProduitsServicesActions.updateCategoryFailure({
                error: err?.message ?? 'Erreur modification catégorie',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
