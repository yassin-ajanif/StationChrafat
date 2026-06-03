import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { LavageApi } from '../data-access/lavage.api';
import { LavageActions } from './lavage.actions';

@Injectable()
export class LavageEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(LavageApi);

  loadStock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadStock),
      switchMap(() =>
        this.api.getStockOverview().pipe(
          map((overview) => LavageActions.loadStockSuccess({ overview })),
          catchError((err) =>
            of(LavageActions.loadStockFailure({ error: err?.message ?? 'Erreur chargement stock' })),
          ),
        ),
      ),
    ),
  );

  loadDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadDevis),
      switchMap(() =>
        this.api.getDevis().pipe(
          map((devis) => LavageActions.loadDevisSuccess({ devis })),
          catchError((err) =>
            of(LavageActions.loadDevisFailure({ error: err?.message ?? 'Erreur chargement devis' })),
          ),
        ),
      ),
    ),
  );

  addDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.addDevis),
      switchMap(({ draft }) =>
        this.api.addDevis(draft).pipe(
          map((devis) => LavageActions.addDevisSuccess({ devis })),
          catchError((err) =>
            of(LavageActions.addDevisFailure({ error: err?.message ?? 'Erreur ajout devis' })),
          ),
        ),
      ),
    ),
  );

  updateDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.updateDevis),
      switchMap(({ id, draft }) =>
        this.api.updateDevis(id, draft).pipe(
          map((devis) => LavageActions.updateDevisSuccess({ devis })),
          catchError((err) =>
            of(LavageActions.updateDevisFailure({ error: err?.message ?? 'Erreur modification devis' })),
          ),
        ),
      ),
    ),
  );

  removeDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.removeDevis),
      switchMap(({ id }) =>
        this.api.removeDevis(id).pipe(
          map(() => LavageActions.removeDevisSuccess({ id })),
          catchError((err) =>
            of(LavageActions.removeDevisFailure({ error: err?.message ?? 'Erreur suppression devis' })),
          ),
        ),
      ),
    ),
  );

  loadCommandes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadCommandes),
      switchMap(() =>
        this.api.getCommandes().pipe(
          map((commandes) => LavageActions.loadCommandesSuccess({ commandes })),
          catchError((err) =>
            of(LavageActions.loadCommandesFailure({ error: err?.message ?? 'Erreur chargement commandes' })),
          ),
        ),
      ),
    ),
  );

  loadLivraisons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadLivraisons),
      switchMap(() =>
        this.api.getLivraisons().pipe(
          map((livraisons) => LavageActions.loadLivraisonsSuccess({ livraisons })),
          catchError((err) =>
            of(LavageActions.loadLivraisonsFailure({ error: err?.message ?? 'Erreur chargement livraisons' })),
          ),
        ),
      ),
    ),
  );

  loadFactures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadFactures),
      switchMap(() =>
        this.api.getFactures().pipe(
          map((factures) => LavageActions.loadFacturesSuccess({ factures })),
          catchError((err) =>
            of(LavageActions.loadFacturesFailure({ error: err?.message ?? 'Erreur chargement factures' })),
          ),
        ),
      ),
    ),
  );

  loadAvoirs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadAvoirs),
      switchMap(() =>
        this.api.getAvoirs().pipe(
          map((avoirs) => LavageActions.loadAvoirsSuccess({ avoirs })),
          catchError((err) =>
            of(LavageActions.loadAvoirsFailure({ error: err?.message ?? 'Erreur chargement avoirs' })),
          ),
        ),
      ),
    ),
  );

  loadDevisAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadDevisAchat),
      switchMap(() =>
        this.api.getDevisAchat().pipe(
          map((devisAchat) => LavageActions.loadDevisAchatSuccess({ devisAchat })),
          catchError((err) =>
            of(LavageActions.loadDevisAchatFailure({ error: err?.message ?? 'Erreur chargement devis achat' })),
          ),
        ),
      ),
    ),
  );

  loadCommandesAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadCommandesAchat),
      switchMap(() =>
        this.api.getCommandesAchat().pipe(
          map((commandesAchat) => LavageActions.loadCommandesAchatSuccess({ commandesAchat })),
          catchError((err) =>
            of(LavageActions.loadCommandesAchatFailure({ error: err?.message ?? 'Erreur chargement commandes achat' })),
          ),
        ),
      ),
    ),
  );

  loadReceptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadReceptions),
      switchMap(() =>
        this.api.getReceptions().pipe(
          map((receptions) => LavageActions.loadReceptionsSuccess({ receptions })),
          catchError((err) =>
            of(LavageActions.loadReceptionsFailure({ error: err?.message ?? 'Erreur chargement réceptions' })),
          ),
        ),
      ),
    ),
  );

  loadFacturesFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadFacturesFournisseur),
      switchMap(() =>
        this.api.getFacturesFournisseur().pipe(
          map((facturesFournisseur) => LavageActions.loadFacturesFournisseurSuccess({ facturesFournisseur })),
          catchError((err) =>
            of(LavageActions.loadFacturesFournisseurFailure({
              error: err?.message ?? 'Erreur chargement factures fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  loadAvoirsFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LavageActions.loadAvoirsFournisseur),
      switchMap(() =>
        this.api.getAvoirsFournisseur().pipe(
          map((avoirsFournisseur) => LavageActions.loadAvoirsFournisseurSuccess({ avoirsFournisseur })),
          catchError((err) =>
            of(LavageActions.loadAvoirsFournisseurFailure({
              error: err?.message ?? 'Erreur chargement avoirs fournisseur',
            })),
          ),
        ),
      ),
    ),
  );
}
