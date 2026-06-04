import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { VentesApi } from '../data-access/ventes.api';
import { VentesActions } from './ventes.actions';

@Injectable()
export class VentesEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(VentesApi);

  loadDevis$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.loadDevis), switchMap(() =>
      this.api.getDevis().pipe(map((devis) => VentesActions.loadDevisSuccess({ devis })), catchError((err) => of(VentesActions.loadDevisFailure({ error: err?.message ?? 'Erreur chargement devis' })))))));

  addDevis$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.addDevis), switchMap(({ draft }) =>
      this.api.addDevis(draft).pipe(map((devis) => VentesActions.addDevisSuccess({ devis })), catchError((err) => of(VentesActions.addDevisFailure({ error: err?.message ?? 'Erreur ajout devis' })))))));

  updateDevis$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.updateDevis), switchMap(({ id, draft }) =>
      this.api.updateDevis(id, draft).pipe(map((devis) => VentesActions.updateDevisSuccess({ devis })), catchError((err) => of(VentesActions.updateDevisFailure({ error: err?.message ?? 'Erreur modification devis' })))))));

  removeDevis$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.removeDevis), switchMap(({ id }) =>
      this.api.removeDevis(id).pipe(map(() => VentesActions.removeDevisSuccess({ id })), catchError((err) => of(VentesActions.removeDevisFailure({ error: err?.message ?? 'Erreur suppression devis' })))))));

  loadCommandes$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.loadCommandes), switchMap(() =>
      this.api.getCommandes().pipe(map((commandes) => VentesActions.loadCommandesSuccess({ commandes })), catchError((err) => of(VentesActions.loadCommandesFailure({ error: err?.message ?? 'Erreur chargement commandes' })))))));

  addCommande$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.addCommande), switchMap(({ draft }) =>
      this.api.addCommande(draft).pipe(map((commande) => VentesActions.addCommandeSuccess({ commande })), catchError((err) => of(VentesActions.addCommandeFailure({ error: err?.message ?? 'Erreur ajout commande' })))))));

  updateCommande$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.updateCommande), switchMap(({ id, draft }) =>
      this.api.updateCommande(id, draft).pipe(map((commande) => VentesActions.updateCommandeSuccess({ commande })), catchError((err) => of(VentesActions.updateCommandeFailure({ error: err?.message ?? 'Erreur modification commande' })))))));

  removeCommande$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.removeCommande), switchMap(({ id }) =>
      this.api.removeCommande(id).pipe(map(() => VentesActions.removeCommandeSuccess({ id })), catchError((err) => of(VentesActions.removeCommandeFailure({ error: err?.message ?? 'Erreur suppression commande' })))))));

  loadLivraisons$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.loadLivraisons), switchMap(() =>
      this.api.getLivraisons().pipe(map((livraisons) => VentesActions.loadLivraisonsSuccess({ livraisons })), catchError((err) => of(VentesActions.loadLivraisonsFailure({ error: err?.message ?? 'Erreur chargement livraisons' })))))));

  addLivraison$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.addLivraison), switchMap(({ draft }) =>
      this.api.addLivraison(draft).pipe(map((livraison) => VentesActions.addLivraisonSuccess({ livraison })), catchError((err) => of(VentesActions.addLivraisonFailure({ error: err?.message ?? 'Erreur ajout livraison' })))))));

  updateLivraison$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.updateLivraison), switchMap(({ id, draft }) =>
      this.api.updateLivraison(id, draft).pipe(map((livraison) => VentesActions.updateLivraisonSuccess({ livraison })), catchError((err) => of(VentesActions.updateLivraisonFailure({ error: err?.message ?? 'Erreur modification livraison' })))))));

  removeLivraison$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.removeLivraison), switchMap(({ id }) =>
      this.api.removeLivraison(id).pipe(map(() => VentesActions.removeLivraisonSuccess({ id })), catchError((err) => of(VentesActions.removeLivraisonFailure({ error: err?.message ?? 'Erreur suppression livraison' })))))));

  loadFactures$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.loadFactures), switchMap(() =>
      this.api.getFactures().pipe(map((factures) => VentesActions.loadFacturesSuccess({ factures })), catchError((err) => of(VentesActions.loadFacturesFailure({ error: err?.message ?? 'Erreur chargement factures' })))))));

  addFacture$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.addFacture), switchMap(({ draft }) =>
      this.api.addFacture(draft).pipe(map((facture) => VentesActions.addFactureSuccess({ facture })), catchError((err) => of(VentesActions.addFactureFailure({ error: err?.message ?? 'Erreur ajout facture' })))))));

  updateFacture$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.updateFacture), switchMap(({ id, draft }) =>
      this.api.updateFacture(id, draft).pipe(map((facture) => VentesActions.updateFactureSuccess({ facture })), catchError((err) => of(VentesActions.updateFactureFailure({ error: err?.message ?? 'Erreur modification facture' })))))));

  removeFacture$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.removeFacture), switchMap(({ id }) =>
      this.api.removeFacture(id).pipe(map(() => VentesActions.removeFactureSuccess({ id })), catchError((err) => of(VentesActions.removeFactureFailure({ error: err?.message ?? 'Erreur suppression facture' })))))));

  loadAvoirs$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.loadAvoirs), switchMap(() =>
      this.api.getAvoirs().pipe(map((avoirs) => VentesActions.loadAvoirsSuccess({ avoirs })), catchError((err) => of(VentesActions.loadAvoirsFailure({ error: err?.message ?? 'Erreur chargement avoirs' })))))));

  addAvoir$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.addAvoir), switchMap(({ draft }) =>
      this.api.addAvoir(draft).pipe(map((avoir) => VentesActions.addAvoirSuccess({ avoir })), catchError((err) => of(VentesActions.addAvoirFailure({ error: err?.message ?? 'Erreur ajout avoir' })))))));

  updateAvoir$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.updateAvoir), switchMap(({ id, draft }) =>
      this.api.updateAvoir(id, draft).pipe(map((avoir) => VentesActions.updateAvoirSuccess({ avoir })), catchError((err) => of(VentesActions.updateAvoirFailure({ error: err?.message ?? 'Erreur modification avoir' })))))));

  removeAvoir$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.removeAvoir), switchMap(({ id }) =>
      this.api.removeAvoir(id).pipe(map(() => VentesActions.removeAvoirSuccess({ id })), catchError((err) => of(VentesActions.removeAvoirFailure({ error: err?.message ?? 'Erreur suppression avoir' })))))));

  loadRetours$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.loadRetours), switchMap(() =>
      this.api.getRetours().pipe(map((retours) => VentesActions.loadRetoursSuccess({ retours })), catchError((err) => of(VentesActions.loadRetoursFailure({ error: err?.message ?? 'Erreur chargement retours' })))))));

  addRetour$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.addRetour), switchMap(({ draft }) =>
      this.api.addRetour(draft).pipe(map((retour) => VentesActions.addRetourSuccess({ retour })), catchError((err) => of(VentesActions.addRetourFailure({ error: err?.message ?? 'Erreur ajout retour' })))))));

  updateRetour$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.updateRetour), switchMap(({ id, draft }) =>
      this.api.updateRetour(id, draft).pipe(map((retour) => VentesActions.updateRetourSuccess({ retour })), catchError((err) => of(VentesActions.updateRetourFailure({ error: err?.message ?? 'Erreur modification retour' })))))));

  removeRetour$ = createEffect(() =>
    this.actions$.pipe(ofType(VentesActions.removeRetour), switchMap(({ id }) =>
      this.api.removeRetour(id).pipe(map(() => VentesActions.removeRetourSuccess({ id })), catchError((err) => of(VentesActions.removeRetourFailure({ error: err?.message ?? 'Erreur suppression retour' })))))));
}
