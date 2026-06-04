import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { ErpApi } from '../data-access/erp.api';
import { ErpActions } from './erp.actions';

@Injectable()
export class ErpEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(ErpApi);

  loadStock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.loadStock),
      switchMap(() =>
        this.api.getStockOverview().pipe(
          map((overview) => ErpActions.loadStockSuccess({ overview })),
          catchError((err) =>
            of(ErpActions.loadStockFailure({ error: err?.message ?? 'Erreur chargement stock' })),
          ),
        ),
      ),
    ),
  );

  loadDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.loadDevis),
      switchMap(() =>
        this.api.getDevis().pipe(
          map((devis) => ErpActions.loadDevisSuccess({ devis })),
          catchError((err) =>
            of(ErpActions.loadDevisFailure({ error: err?.message ?? 'Erreur chargement devis' })),
          ),
        ),
      ),
    ),
  );

  addDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.addDevis),
      switchMap(({ draft }) =>
        this.api.addDevis(draft).pipe(
          map((devis) => ErpActions.addDevisSuccess({ devis })),
          catchError((err) =>
            of(ErpActions.addDevisFailure({ error: err?.message ?? 'Erreur ajout devis' })),
          ),
        ),
      ),
    ),
  );

  updateDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.updateDevis),
      switchMap(({ id, draft }) =>
        this.api.updateDevis(id, draft).pipe(
          map((devis) => ErpActions.updateDevisSuccess({ devis })),
          catchError((err) =>
            of(ErpActions.updateDevisFailure({ error: err?.message ?? 'Erreur modification devis' })),
          ),
        ),
      ),
    ),
  );

  removeDevis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.removeDevis),
      switchMap(({ id }) =>
        this.api.removeDevis(id).pipe(
          map(() => ErpActions.removeDevisSuccess({ id })),
          catchError((err) =>
            of(ErpActions.removeDevisFailure({ error: err?.message ?? 'Erreur suppression devis' })),
          ),
        ),
      ),
    ),
  );

  loadCommandes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.loadCommandes),
      switchMap(() =>
        this.api.getCommandes().pipe(
          map((commandes) => ErpActions.loadCommandesSuccess({ commandes })),
          catchError((err) =>
            of(ErpActions.loadCommandesFailure({ error: err?.message ?? 'Erreur chargement commandes' })),
          ),
        ),
      ),
    ),
  );

  addCommande$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.addCommande),
      switchMap(({ draft }) =>
        this.api.addCommande(draft).pipe(
          map((commande) => ErpActions.addCommandeSuccess({ commande })),
          catchError((err) =>
            of(ErpActions.addCommandeFailure({ error: err?.message ?? 'Erreur ajout commande' })),
          ),
        ),
      ),
    ),
  );

  updateCommande$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.updateCommande),
      switchMap(({ id, draft }) =>
        this.api.updateCommande(id, draft).pipe(
          map((commande) => ErpActions.updateCommandeSuccess({ commande })),
          catchError((err) =>
            of(ErpActions.updateCommandeFailure({ error: err?.message ?? 'Erreur modification commande' })),
          ),
        ),
      ),
    ),
  );

  removeCommande$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.removeCommande),
      switchMap(({ id }) =>
        this.api.removeCommande(id).pipe(
          map(() => ErpActions.removeCommandeSuccess({ id })),
          catchError((err) =>
            of(ErpActions.removeCommandeFailure({ error: err?.message ?? 'Erreur suppression commande' })),
          ),
        ),
      ),
    ),
  );

  loadLivraisons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.loadLivraisons),
      switchMap(() =>
        this.api.getLivraisons().pipe(
          map((livraisons) => ErpActions.loadLivraisonsSuccess({ livraisons })),
          catchError((err) =>
            of(ErpActions.loadLivraisonsFailure({ error: err?.message ?? 'Erreur chargement livraisons' })),
          ),
        ),
      ),
    ),
  );

  addLivraison$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.addLivraison),
      switchMap(({ draft }) =>
        this.api.addLivraison(draft).pipe(
          map((livraison) => ErpActions.addLivraisonSuccess({ livraison })),
          catchError((err) =>
            of(ErpActions.addLivraisonFailure({ error: err?.message ?? 'Erreur ajout livraison' })),
          ),
        ),
      ),
    ),
  );

  updateLivraison$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.updateLivraison),
      switchMap(({ id, draft }) =>
        this.api.updateLivraison(id, draft).pipe(
          map((livraison) => ErpActions.updateLivraisonSuccess({ livraison })),
          catchError((err) =>
            of(ErpActions.updateLivraisonFailure({ error: err?.message ?? 'Erreur modification livraison' })),
          ),
        ),
      ),
    ),
  );

  removeLivraison$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.removeLivraison),
      switchMap(({ id }) =>
        this.api.removeLivraison(id).pipe(
          map(() => ErpActions.removeLivraisonSuccess({ id })),
          catchError((err) =>
            of(ErpActions.removeLivraisonFailure({ error: err?.message ?? 'Erreur suppression livraison' })),
          ),
        ),
      ),
    ),
  );

  loadFactures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.loadFactures),
      switchMap(() =>
        this.api.getFactures().pipe(
          map((factures) => ErpActions.loadFacturesSuccess({ factures })),
          catchError((err) =>
            of(ErpActions.loadFacturesFailure({ error: err?.message ?? 'Erreur chargement factures' })),
          ),
        ),
      ),
    ),
  );

  addFacture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.addFacture),
      switchMap(({ draft }) =>
        this.api.addFacture(draft).pipe(
          map((facture) => ErpActions.addFactureSuccess({ facture })),
          catchError((err) =>
            of(ErpActions.addFactureFailure({ error: err?.message ?? 'Erreur ajout facture' })),
          ),
        ),
      ),
    ),
  );

  updateFacture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.updateFacture),
      switchMap(({ id, draft }) =>
        this.api.updateFacture(id, draft).pipe(
          map((facture) => ErpActions.updateFactureSuccess({ facture })),
          catchError((err) =>
            of(ErpActions.updateFactureFailure({ error: err?.message ?? 'Erreur modification facture' })),
          ),
        ),
      ),
    ),
  );

  removeFacture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.removeFacture),
      switchMap(({ id }) =>
        this.api.removeFacture(id).pipe(
          map(() => ErpActions.removeFactureSuccess({ id })),
          catchError((err) =>
            of(ErpActions.removeFactureFailure({ error: err?.message ?? 'Erreur suppression facture' })),
          ),
        ),
      ),
    ),
  );

  loadAvoirs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.loadAvoirs),
      switchMap(() =>
        this.api.getAvoirs().pipe(
          map((avoirs) => ErpActions.loadAvoirsSuccess({ avoirs })),
          catchError((err) =>
            of(ErpActions.loadAvoirsFailure({ error: err?.message ?? 'Erreur chargement avoirs' })),
          ),
        ),
      ),
    ),
  );

  addAvoir$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.addAvoir),
      switchMap(({ draft }) =>
        this.api.addAvoir(draft).pipe(
          map((avoir) => ErpActions.addAvoirSuccess({ avoir })),
          catchError((err) =>
            of(ErpActions.addAvoirFailure({ error: err?.message ?? 'Erreur ajout avoir' })),
          ),
        ),
      ),
    ),
  );

  updateAvoir$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.updateAvoir),
      switchMap(({ id, draft }) =>
        this.api.updateAvoir(id, draft).pipe(
          map((avoir) => ErpActions.updateAvoirSuccess({ avoir })),
          catchError((err) =>
            of(ErpActions.updateAvoirFailure({ error: err?.message ?? 'Erreur modification avoir' })),
          ),
        ),
      ),
    ),
  );

  removeAvoir$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.removeAvoir),
      switchMap(({ id }) =>
        this.api.removeAvoir(id).pipe(
          map(() => ErpActions.removeAvoirSuccess({ id })),
          catchError((err) =>
            of(ErpActions.removeAvoirFailure({ error: err?.message ?? 'Erreur suppression avoir' })),
          ),
        ),
      ),
    ),
  );

  loadDevisAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.loadDevisAchat),
      switchMap(() =>
        this.api.getDevisAchat().pipe(
          map((devisAchat) => ErpActions.loadDevisAchatSuccess({ devisAchat })),
          catchError((err) =>
            of(ErpActions.loadDevisAchatFailure({ error: err?.message ?? 'Erreur chargement devis achat' })),
          ),
        ),
      ),
    ),
  );

  addDevisAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.addDevisAchat),
      switchMap(({ draft }) =>
        this.api.addDevisAchat(draft).pipe(
          map((devisAchat) => ErpActions.addDevisAchatSuccess({ devisAchat })),
          catchError((err) =>
            of(ErpActions.addDevisAchatFailure({ error: err?.message ?? 'Erreur ajout devis achat' })),
          ),
        ),
      ),
    ),
  );

  updateDevisAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.updateDevisAchat),
      switchMap(({ id, draft }) =>
        this.api.updateDevisAchat(id, draft).pipe(
          map((devisAchat) => ErpActions.updateDevisAchatSuccess({ devisAchat })),
          catchError((err) =>
            of(ErpActions.updateDevisAchatFailure({ error: err?.message ?? 'Erreur modification devis achat' })),
          ),
        ),
      ),
    ),
  );

  removeDevisAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.removeDevisAchat),
      switchMap(({ id }) =>
        this.api.removeDevisAchat(id).pipe(
          map(() => ErpActions.removeDevisAchatSuccess({ id })),
          catchError((err) =>
            of(ErpActions.removeDevisAchatFailure({ error: err?.message ?? 'Erreur suppression devis achat' })),
          ),
        ),
      ),
    ),
  );

  loadCommandesAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.loadCommandesAchat),
      switchMap(() =>
        this.api.getCommandesAchat().pipe(
          map((commandesAchat) => ErpActions.loadCommandesAchatSuccess({ commandesAchat })),
          catchError((err) =>
            of(ErpActions.loadCommandesAchatFailure({ error: err?.message ?? 'Erreur chargement commandes achat' })),
          ),
        ),
      ),
    ),
  );

  addCommandeAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.addCommandeAchat),
      switchMap(({ draft }) =>
        this.api.addCommandeAchat(draft).pipe(
          map((commandeAchat) => ErpActions.addCommandeAchatSuccess({ commandeAchat })),
          catchError((err) =>
            of(ErpActions.addCommandeAchatFailure({ error: err?.message ?? 'Erreur ajout commande achat' })),
          ),
        ),
      ),
    ),
  );

  updateCommandeAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.updateCommandeAchat),
      switchMap(({ id, draft }) =>
        this.api.updateCommandeAchat(id, draft).pipe(
          map((commandeAchat) => ErpActions.updateCommandeAchatSuccess({ commandeAchat })),
          catchError((err) =>
            of(ErpActions.updateCommandeAchatFailure({
              error: err?.message ?? 'Erreur modification commande achat',
            })),
          ),
        ),
      ),
    ),
  );

  removeCommandeAchat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.removeCommandeAchat),
      switchMap(({ id }) =>
        this.api.removeCommandeAchat(id).pipe(
          map(() => ErpActions.removeCommandeAchatSuccess({ id })),
          catchError((err) =>
            of(ErpActions.removeCommandeAchatFailure({
              error: err?.message ?? 'Erreur suppression commande achat',
            })),
          ),
        ),
      ),
    ),
  );

  loadReceptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.loadReceptions),
      switchMap(() =>
        this.api.getReceptions().pipe(
          map((receptions) => ErpActions.loadReceptionsSuccess({ receptions })),
          catchError((err) =>
            of(ErpActions.loadReceptionsFailure({ error: err?.message ?? 'Erreur chargement réceptions' })),
          ),
        ),
      ),
    ),
  );

  addReception$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.addReception),
      switchMap(({ draft }) =>
        this.api.addReception(draft).pipe(
          map((reception) => ErpActions.addReceptionSuccess({ reception })),
          catchError((err) =>
            of(ErpActions.addReceptionFailure({ error: err?.message ?? 'Erreur ajout réception' })),
          ),
        ),
      ),
    ),
  );

  updateReception$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.updateReception),
      switchMap(({ id, draft }) =>
        this.api.updateReception(id, draft).pipe(
          map((reception) => ErpActions.updateReceptionSuccess({ reception })),
          catchError((err) =>
            of(ErpActions.updateReceptionFailure({ error: err?.message ?? 'Erreur modification réception' })),
          ),
        ),
      ),
    ),
  );

  removeReception$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.removeReception),
      switchMap(({ id }) =>
        this.api.removeReception(id).pipe(
          map(() => ErpActions.removeReceptionSuccess({ id })),
          catchError((err) =>
            of(ErpActions.removeReceptionFailure({ error: err?.message ?? 'Erreur suppression réception' })),
          ),
        ),
      ),
    ),
  );

  loadFacturesFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.loadFacturesFournisseur),
      switchMap(() =>
        this.api.getFacturesFournisseur().pipe(
          map((facturesFournisseur) => ErpActions.loadFacturesFournisseurSuccess({ facturesFournisseur })),
          catchError((err) =>
            of(ErpActions.loadFacturesFournisseurFailure({
              error: err?.message ?? 'Erreur chargement factures fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  addFactureFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.addFactureFournisseur),
      switchMap(({ draft }) =>
        this.api.addFactureFournisseur(draft).pipe(
          map((factureFournisseur) => ErpActions.addFactureFournisseurSuccess({ factureFournisseur })),
          catchError((err) =>
            of(ErpActions.addFactureFournisseurFailure({
              error: err?.message ?? 'Erreur ajout facture fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  updateFactureFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.updateFactureFournisseur),
      switchMap(({ id, draft }) =>
        this.api.updateFactureFournisseur(id, draft).pipe(
          map((factureFournisseur) => ErpActions.updateFactureFournisseurSuccess({ factureFournisseur })),
          catchError((err) =>
            of(ErpActions.updateFactureFournisseurFailure({
              error: err?.message ?? 'Erreur modification facture fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  removeFactureFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.removeFactureFournisseur),
      switchMap(({ id }) =>
        this.api.removeFactureFournisseur(id).pipe(
          map(() => ErpActions.removeFactureFournisseurSuccess({ id })),
          catchError((err) =>
            of(ErpActions.removeFactureFournisseurFailure({
              error: err?.message ?? 'Erreur suppression facture fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  loadAvoirsFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.loadAvoirsFournisseur),
      switchMap(() =>
        this.api.getAvoirsFournisseur().pipe(
          map((avoirsFournisseur) => ErpActions.loadAvoirsFournisseurSuccess({ avoirsFournisseur })),
          catchError((err) =>
            of(ErpActions.loadAvoirsFournisseurFailure({
              error: err?.message ?? 'Erreur chargement avoirs fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  addAvoirFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.addAvoirFournisseur),
      switchMap(({ draft }) =>
        this.api.addAvoirFournisseur(draft).pipe(
          map((avoirFournisseur) => ErpActions.addAvoirFournisseurSuccess({ avoirFournisseur })),
          catchError((err) =>
            of(ErpActions.addAvoirFournisseurFailure({
              error: err?.message ?? 'Erreur ajout avoir fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  updateAvoirFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.updateAvoirFournisseur),
      switchMap(({ id, draft }) =>
        this.api.updateAvoirFournisseur(id, draft).pipe(
          map((avoirFournisseur) => ErpActions.updateAvoirFournisseurSuccess({ avoirFournisseur })),
          catchError((err) =>
            of(ErpActions.updateAvoirFournisseurFailure({
              error: err?.message ?? 'Erreur modification avoir fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  removeAvoirFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.removeAvoirFournisseur),
      switchMap(({ id }) =>
        this.api.removeAvoirFournisseur(id).pipe(
          map(() => ErpActions.removeAvoirFournisseurSuccess({ id })),
          catchError((err) =>
            of(ErpActions.removeAvoirFournisseurFailure({
              error: err?.message ?? 'Erreur suppression avoir fournisseur',
            })),
          ),
        ),
      ),
    ),
  );

  loadRetours$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.loadRetours),
      switchMap(() =>
        this.api.getRetours().pipe(
          map((retours) => ErpActions.loadRetoursSuccess({ retours })),
          catchError((err) =>
            of(ErpActions.loadRetoursFailure({ error: err?.message ?? 'Erreur chargement retours' })),
          ),
        ),
      ),
    ),
  );

  addRetour$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.addRetour),
      switchMap(({ draft }) =>
        this.api.addRetour(draft).pipe(
          map((retour) => ErpActions.addRetourSuccess({ retour })),
          catchError((err) =>
            of(ErpActions.addRetourFailure({ error: err?.message ?? 'Erreur ajout retour' })),
          ),
        ),
      ),
    ),
  );

  updateRetour$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.updateRetour),
      switchMap(({ id, draft }) =>
        this.api.updateRetour(id, draft).pipe(
          map((retour) => ErpActions.updateRetourSuccess({ retour })),
          catchError((err) =>
            of(ErpActions.updateRetourFailure({ error: err?.message ?? 'Erreur modification retour' })),
          ),
        ),
      ),
    ),
  );

  removeRetour$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.removeRetour),
      switchMap(({ id }) =>
        this.api.removeRetour(id).pipe(
          map(() => ErpActions.removeRetourSuccess({ id })),
          catchError((err) =>
            of(ErpActions.removeRetourFailure({ error: err?.message ?? 'Erreur suppression retour' })),
          ),
        ),
      ),
    ),
  );

  loadRetoursFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.loadRetoursFournisseur),
      switchMap(() =>
        this.api.getRetoursFournisseur().pipe(
          map((retoursFournisseur) => ErpActions.loadRetoursFournisseurSuccess({ retoursFournisseur })),
          catchError((err) =>
            of(ErpActions.loadRetoursFournisseurFailure({ error: err?.message ?? 'Erreur chargement retours fournisseur' })),
          ),
        ),
      ),
    ),
  );

  addRetourFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.addRetourFournisseur),
      switchMap(({ draft }) =>
        this.api.addRetourFournisseur(draft).pipe(
          map((retourFournisseur) => ErpActions.addRetourFournisseurSuccess({ retourFournisseur })),
          catchError((err) =>
            of(ErpActions.addRetourFournisseurFailure({ error: err?.message ?? 'Erreur ajout retour fournisseur' })),
          ),
        ),
      ),
    ),
  );

  updateRetourFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.updateRetourFournisseur),
      switchMap(({ id, draft }) =>
        this.api.updateRetourFournisseur(id, draft).pipe(
          map((retourFournisseur) => ErpActions.updateRetourFournisseurSuccess({ retourFournisseur })),
          catchError((err) =>
            of(ErpActions.updateRetourFournisseurFailure({ error: err?.message ?? 'Erreur modification retour fournisseur' })),
          ),
        ),
      ),
    ),
  );

  removeRetourFournisseur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErpActions.removeRetourFournisseur),
      switchMap(({ id }) =>
        this.api.removeRetourFournisseur(id).pipe(
          map(() => ErpActions.removeRetourFournisseurSuccess({ id })),
          catchError((err) =>
            of(ErpActions.removeRetourFournisseurFailure({ error: err?.message ?? 'Erreur suppression retour fournisseur' })),
          ),
        ),
      ),
    ),
  );
}
