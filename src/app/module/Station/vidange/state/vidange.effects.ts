import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { VidangeApi } from '../data-access/vidange.api';
import { VidangeActions } from './vidange.actions';

@Injectable()
export class VidangeEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(VidangeApi);

  loadStock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadStock),
      switchMap(() =>
        this.api.getStockOverview().pipe(
          map((overview) => VidangeActions.loadStockSuccess({ overview })),
          catchError((err) =>
            of(VidangeActions.loadStockFailure({ error: err?.message ?? 'Erreur chargement stock' })),
          ),
        ),
      ),
    ),
  );

  loadDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadDevis),
      switchMap(() =>
        this.api.getDevis().pipe(
          map((devis) => VidangeActions.loadDevisSuccess({ devis })),
          catchError((err) =>
            of(VidangeActions.loadDevisFailure({ error: err?.message ?? 'Erreur chargement devis' })),
          ),
        ),
      ),
    ),
  );

  addDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.addDevis),
      switchMap(({ draft }) =>
        this.api.addDevis(draft).pipe(
          map((devis) => VidangeActions.addDevisSuccess({ devis })),
          catchError((err) =>
            of(VidangeActions.addDevisFailure({ error: err?.message ?? 'Erreur ajout devis' })),
          ),
        ),
      ),
    ),
  );

  updateDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.updateDevis),
      switchMap(({ id, draft }) =>
        this.api.updateDevis(id, draft).pipe(
          map((devis) => VidangeActions.updateDevisSuccess({ devis })),
          catchError((err) =>
            of(VidangeActions.updateDevisFailure({ error: err?.message ?? 'Erreur modification devis' })),
          ),
        ),
      ),
    ),
  );

  removeDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.removeDevis),
      switchMap(({ id }) =>
        this.api.removeDevis(id).pipe(
          map(() => VidangeActions.removeDevisSuccess({ id })),
          catchError((err) =>
            of(VidangeActions.removeDevisFailure({ error: err?.message ?? 'Erreur suppression devis' })),
          ),
        ),
      ),
    ),
  );

  loadCommandes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadCommandes),
      switchMap(() =>
        this.api.getCommandes().pipe(
          map((commandes) => VidangeActions.loadCommandesSuccess({ commandes })),
          catchError((err) =>
            of(VidangeActions.loadCommandesFailure({ error: err?.message ?? 'Erreur chargement commandes' })),
          ),
        ),
      ),
    ),
  );

  addCommande$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.addCommande),
      switchMap(({ draft }) =>
        this.api.addCommande(draft).pipe(
          map((commande) => VidangeActions.addCommandeSuccess({ commande })),
          catchError((err) =>
            of(VidangeActions.addCommandeFailure({ error: err?.message ?? 'Erreur ajout commande' })),
          ),
        ),
      ),
    ),
  );

  updateCommande$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.updateCommande),
      switchMap(({ id, draft }) =>
        this.api.updateCommande(id, draft).pipe(
          map((commande) => VidangeActions.updateCommandeSuccess({ commande })),
          catchError((err) =>
            of(VidangeActions.updateCommandeFailure({ error: err?.message ?? 'Erreur modification commande' })),
          ),
        ),
      ),
    ),
  );

  removeCommande$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.removeCommande),
      switchMap(({ id }) =>
        this.api.removeCommande(id).pipe(
          map(() => VidangeActions.removeCommandeSuccess({ id })),
          catchError((err) =>
            of(VidangeActions.removeCommandeFailure({ error: err?.message ?? 'Erreur suppression commande' })),
          ),
        ),
      ),
    ),
  );

  loadLivraisons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadLivraisons),
      switchMap(() =>
        this.api.getLivraisons().pipe(
          map((livraisons) => VidangeActions.loadLivraisonsSuccess({ livraisons })),
          catchError((err) =>
            of(VidangeActions.loadLivraisonsFailure({ error: err?.message ?? 'Erreur chargement livraisons' })),
          ),
        ),
      ),
    ),
  );

  addLivraison$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.addLivraison),
      switchMap(({ draft }) =>
        this.api.addLivraison(draft).pipe(
          map((livraison) => VidangeActions.addLivraisonSuccess({ livraison })),
          catchError((err) =>
            of(VidangeActions.addLivraisonFailure({ error: err?.message ?? 'Erreur ajout livraison' })),
          ),
        ),
      ),
    ),
  );

  updateLivraison$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.updateLivraison),
      switchMap(({ id, draft }) =>
        this.api.updateLivraison(id, draft).pipe(
          map((livraison) => VidangeActions.updateLivraisonSuccess({ livraison })),
          catchError((err) =>
            of(VidangeActions.updateLivraisonFailure({ error: err?.message ?? 'Erreur modification livraison' })),
          ),
        ),
      ),
    ),
  );

  removeLivraison$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.removeLivraison),
      switchMap(({ id }) =>
        this.api.removeLivraison(id).pipe(
          map(() => VidangeActions.removeLivraisonSuccess({ id })),
          catchError((err) =>
            of(VidangeActions.removeLivraisonFailure({ error: err?.message ?? 'Erreur suppression livraison' })),
          ),
        ),
      ),
    ),
  );

  loadFactures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadFactures),
      switchMap(() =>
        this.api.getFactures().pipe(
          map((factures) => VidangeActions.loadFacturesSuccess({ factures })),
          catchError((err) =>
            of(VidangeActions.loadFacturesFailure({ error: err?.message ?? 'Erreur chargement factures' })),
          ),
        ),
      ),
    ),
  );

  addFacture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.addFacture),
      switchMap(({ draft }) =>
        this.api.addFacture(draft).pipe(
          map((facture) => VidangeActions.addFactureSuccess({ facture })),
          catchError((err) =>
            of(VidangeActions.addFactureFailure({ error: err?.message ?? 'Erreur ajout facture' })),
          ),
        ),
      ),
    ),
  );

  updateFacture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.updateFacture),
      switchMap(({ id, draft }) =>
        this.api.updateFacture(id, draft).pipe(
          map((facture) => VidangeActions.updateFactureSuccess({ facture })),
          catchError((err) =>
            of(VidangeActions.updateFactureFailure({ error: err?.message ?? 'Erreur modification facture' })),
          ),
        ),
      ),
    ),
  );

  removeFacture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.removeFacture),
      switchMap(({ id }) =>
        this.api.removeFacture(id).pipe(
          map(() => VidangeActions.removeFactureSuccess({ id })),
          catchError((err) =>
            of(VidangeActions.removeFactureFailure({ error: err?.message ?? 'Erreur suppression facture' })),
          ),
        ),
      ),
    ),
  );

  loadAvoirs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadAvoirs),
      switchMap(() =>
        this.api.getAvoirs().pipe(
          map((avoirs) => VidangeActions.loadAvoirsSuccess({ avoirs })),
          catchError((err) =>
            of(VidangeActions.loadAvoirsFailure({ error: err?.message ?? 'Erreur chargement avoirs' })),
          ),
        ),
      ),
    ),
  );

  addAvoir$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.addAvoir),
      switchMap(({ draft }) =>
        this.api.addAvoir(draft).pipe(
          map((avoir) => VidangeActions.addAvoirSuccess({ avoir })),
          catchError((err) =>
            of(VidangeActions.addAvoirFailure({ error: err?.message ?? 'Erreur ajout avoir' })),
          ),
        ),
      ),
    ),
  );

  updateAvoir$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.updateAvoir),
      switchMap(({ id, draft }) =>
        this.api.updateAvoir(id, draft).pipe(
          map((avoir) => VidangeActions.updateAvoirSuccess({ avoir })),
          catchError((err) =>
            of(VidangeActions.updateAvoirFailure({ error: err?.message ?? 'Erreur modification avoir' })),
          ),
        ),
      ),
    ),
  );

  removeAvoir$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.removeAvoir),
      switchMap(({ id }) =>
        this.api.removeAvoir(id).pipe(
          map(() => VidangeActions.removeAvoirSuccess({ id })),
          catchError((err) =>
            of(VidangeActions.removeAvoirFailure({ error: err?.message ?? 'Erreur suppression avoir' })),
          ),
        ),
      ),
    ),
  );

  loadDevisAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadDevisAchat),
      switchMap(() =>
        this.api.getDevisAchat().pipe(
          map((devisAchat) => VidangeActions.loadDevisAchatSuccess({ devisAchat })),
          catchError((err) =>
            of(VidangeActions.loadDevisAchatFailure({ error: err?.message ?? 'Erreur chargement devis achat' })),
          ),
        ),
      ),
    ),
  );

  addDevisAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.addDevisAchat),
      switchMap(({ draft }) =>
        this.api.addDevisAchat(draft).pipe(
          map((devisAchat) => VidangeActions.addDevisAchatSuccess({ devisAchat })),
          catchError((err) =>
            of(VidangeActions.addDevisAchatFailure({ error: err?.message ?? 'Erreur ajout devis achat' })),
          ),
        ),
      ),
    ),
  );

  updateDevisAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.updateDevisAchat),
      switchMap(({ id, draft }) =>
        this.api.updateDevisAchat(id, draft).pipe(
          map((devisAchat) => VidangeActions.updateDevisAchatSuccess({ devisAchat })),
          catchError((err) =>
            of(VidangeActions.updateDevisAchatFailure({ error: err?.message ?? 'Erreur modification devis achat' })),
          ),
        ),
      ),
    ),
  );

  removeDevisAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.removeDevisAchat),
      switchMap(({ id }) =>
        this.api.removeDevisAchat(id).pipe(
          map(() => VidangeActions.removeDevisAchatSuccess({ id })),
          catchError((err) =>
            of(VidangeActions.removeDevisAchatFailure({ error: err?.message ?? 'Erreur suppression devis achat' })),
          ),
        ),
      ),
    ),
  );

  loadCommandesAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadCommandesAchat),
      switchMap(() =>
        this.api.getCommandesAchat().pipe(
          map((commandesAchat) => VidangeActions.loadCommandesAchatSuccess({ commandesAchat })),
          catchError((err) =>
            of(VidangeActions.loadCommandesAchatFailure({ error: err?.message ?? 'Erreur chargement commandes achat' })),
          ),
        ),
      ),
    ),
  );

  addCommandeAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.addCommandeAchat),
      switchMap(({ draft }) =>
        this.api.addCommandeAchat(draft).pipe(
          map((commandeAchat) => VidangeActions.addCommandeAchatSuccess({ commandeAchat })),
          catchError((err) =>
            of(VidangeActions.addCommandeAchatFailure({ error: err?.message ?? 'Erreur ajout commande achat' })),
          ),
        ),
      ),
    ),
  );

  updateCommandeAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.updateCommandeAchat),
      switchMap(({ id, draft }) =>
        this.api.updateCommandeAchat(id, draft).pipe(
          map((commandeAchat) => VidangeActions.updateCommandeAchatSuccess({ commandeAchat })),
          catchError((err) =>
            of(VidangeActions.updateCommandeAchatFailure({
              error: err?.message ?? 'Erreur modification commande achat',
            })),
          ),
        ),
      ),
    ),
  );

  removeCommandeAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.removeCommandeAchat),
      switchMap(({ id }) =>
        this.api.removeCommandeAchat(id).pipe(
          map(() => VidangeActions.removeCommandeAchatSuccess({ id })),
          catchError((err) =>
            of(VidangeActions.removeCommandeAchatFailure({
              error: err?.message ?? 'Erreur suppression commande achat',
            })),
          ),
        ),
      ),
    ),
  );

  loadReceptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadReceptions),
      switchMap(() =>
        this.api.getReceptions().pipe(
          map((receptions) => VidangeActions.loadReceptionsSuccess({ receptions })),
          catchError((err) =>
            of(VidangeActions.loadReceptionsFailure({ error: err?.message ?? 'Erreur chargement réceptions' })),
          ),
        ),
      ),
    ),
  );

  addReception$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.addReception),
      switchMap(({ draft }) =>
        this.api.addReception(draft).pipe(
          map((reception) => VidangeActions.addReceptionSuccess({ reception })),
          catchError((err) =>
            of(VidangeActions.addReceptionFailure({ error: err?.message ?? 'Erreur ajout réception' })),
          ),
        ),
      ),
    ),
  );

  updateReception$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.updateReception),
      switchMap(({ id, draft }) =>
        this.api.updateReception(id, draft).pipe(
          map((reception) => VidangeActions.updateReceptionSuccess({ reception })),
          catchError((err) =>
            of(VidangeActions.updateReceptionFailure({ error: err?.message ?? 'Erreur modification réception' })),
          ),
        ),
      ),
    ),
  );

  removeReception$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.removeReception),
      switchMap(({ id }) =>
        this.api.removeReception(id).pipe(
          map(() => VidangeActions.removeReceptionSuccess({ id })),
          catchError((err) =>
            of(VidangeActions.removeReceptionFailure({ error: err?.message ?? 'Erreur suppression réception' })),
          ),
        ),
      ),
    ),
  );

  loadFacturesFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadFacturesFournisseur),
      switchMap(() =>
        this.api.getFacturesFournisseur().pipe(
          map((facturesFournisseur) => VidangeActions.loadFacturesFournisseurSuccess({ facturesFournisseur })),
          catchError((err) =>
            of(VidangeActions.loadFacturesFournisseurFailure({
              error: err?.message ?? 'Erreur chargement factures fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  addFactureFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.addFactureFournisseur),
      switchMap(({ draft }) =>
        this.api.addFactureFournisseur(draft).pipe(
          map((factureFournisseur) => VidangeActions.addFactureFournisseurSuccess({ factureFournisseur })),
          catchError((err) =>
            of(VidangeActions.addFactureFournisseurFailure({
              error: err?.message ?? 'Erreur ajout facture fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  updateFactureFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.updateFactureFournisseur),
      switchMap(({ id, draft }) =>
        this.api.updateFactureFournisseur(id, draft).pipe(
          map((factureFournisseur) => VidangeActions.updateFactureFournisseurSuccess({ factureFournisseur })),
          catchError((err) =>
            of(VidangeActions.updateFactureFournisseurFailure({
              error: err?.message ?? 'Erreur modification facture fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  removeFactureFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.removeFactureFournisseur),
      switchMap(({ id }) =>
        this.api.removeFactureFournisseur(id).pipe(
          map(() => VidangeActions.removeFactureFournisseurSuccess({ id })),
          catchError((err) =>
            of(VidangeActions.removeFactureFournisseurFailure({
              error: err?.message ?? 'Erreur suppression facture fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  loadAvoirsFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.loadAvoirsFournisseur),
      switchMap(() =>
        this.api.getAvoirsFournisseur().pipe(
          map((avoirsFournisseur) => VidangeActions.loadAvoirsFournisseurSuccess({ avoirsFournisseur })),
          catchError((err) =>
            of(VidangeActions.loadAvoirsFournisseurFailure({
              error: err?.message ?? 'Erreur chargement avoirs fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  addAvoirFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.addAvoirFournisseur),
      switchMap(({ draft }) =>
        this.api.addAvoirFournisseur(draft).pipe(
          map((avoirFournisseur) => VidangeActions.addAvoirFournisseurSuccess({ avoirFournisseur })),
          catchError((err) =>
            of(VidangeActions.addAvoirFournisseurFailure({
              error: err?.message ?? 'Erreur ajout avoir fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  updateAvoirFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.updateAvoirFournisseur),
      switchMap(({ id, draft }) =>
        this.api.updateAvoirFournisseur(id, draft).pipe(
          map((avoirFournisseur) => VidangeActions.updateAvoirFournisseurSuccess({ avoirFournisseur })),
          catchError((err) =>
            of(VidangeActions.updateAvoirFournisseurFailure({
              error: err?.message ?? 'Erreur modification avoir fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  removeAvoirFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VidangeActions.removeAvoirFournisseur),
      switchMap(({ id }) =>
        this.api.removeAvoirFournisseur(id).pipe(
          map(() => VidangeActions.removeAvoirFournisseurSuccess({ id })),
          catchError((err) =>
            of(VidangeActions.removeAvoirFournisseurFailure({
              error: err?.message ?? 'Erreur suppression avoir fournisseur',
            })),
          ),
        ),
      ),
    ),
  );
}
