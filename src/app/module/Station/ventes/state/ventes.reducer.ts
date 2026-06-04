import { createFeature, createReducer, on } from '@ngrx/store';
import { Avoir, Commande, Devis, Facture, Livraison, Retour } from '../models/ventes';
import { VentesActions } from './ventes.actions';

export interface VentesState {
  devis: Devis[];
  devisLoading: boolean;
  devisError: string | null;
  devisSaving: boolean;
  commandes: Commande[];
  commandesLoading: boolean;
  commandesError: string | null;
  commandesSaving: boolean;
  livraisons: Livraison[];
  livraisonsLoading: boolean;
  livraisonsError: string | null;
  livraisonsSaving: boolean;
  factures: Facture[];
  facturesLoading: boolean;
  facturesError: string | null;
  facturesSaving: boolean;
  avoirs: Avoir[];
  avoirsLoading: boolean;
  avoirsError: string | null;
  avoirsSaving: boolean;
  retours: Retour[];
  retoursLoading: boolean;
  retoursError: string | null;
  retoursSaving: boolean;
}

const initialVentesState: VentesState = {
  devis: [],
  devisLoading: false,
  devisError: null,
  devisSaving: false,
  commandes: [],
  commandesLoading: false,
  commandesError: null,
  commandesSaving: false,
  livraisons: [],
  livraisonsLoading: false,
  livraisonsError: null,
  livraisonsSaving: false,
  factures: [],
  facturesLoading: false,
  facturesError: null,
  facturesSaving: false,
  avoirs: [],
  avoirsLoading: false,
  avoirsError: null,
  avoirsSaving: false,
  retours: [],
  retoursLoading: false,
  retoursError: null,
  retoursSaving: false,
};

export const ventesFeature = createFeature({
  name: 'Ventes',
  reducer: createReducer(
    initialVentesState,

    on(VentesActions.loadDevis, (state) => ({ ...state, devisLoading: true, devisError: null })),
    on(VentesActions.loadDevisSuccess, (state, { devis }) => ({ ...state, devisLoading: false, devis })),
    on(VentesActions.loadDevisFailure, (state, { error }) => ({ ...state, devisLoading: false, devisError: error })),

    on(VentesActions.addDevis, (state) => ({ ...state, devisSaving: true })),
    on(VentesActions.addDevisSuccess, (state, { devis }) => ({ ...state, devisSaving: false, devis: [...state.devis, devis] })),
    on(VentesActions.updateDevis, (state) => ({ ...state, devisSaving: true })),
    on(VentesActions.updateDevisSuccess, (state, { devis }) => ({ ...state, devisSaving: false, devis: state.devis.map((d) => (d.id === devis.id ? devis : d)) })),
    on(VentesActions.removeDevis, (state) => ({ ...state, devisSaving: true })),
    on(VentesActions.removeDevisSuccess, (state, { id }) => ({ ...state, devisSaving: false, devis: state.devis.filter((d) => d.id !== id) })),
    on(VentesActions.addDevisFailure, VentesActions.updateDevisFailure, VentesActions.removeDevisFailure, (state) => ({ ...state, devisSaving: false })),

    on(VentesActions.loadCommandes, (state) => ({ ...state, commandesLoading: true, commandesError: null })),
    on(VentesActions.loadCommandesSuccess, (state, { commandes }) => ({ ...state, commandesLoading: false, commandes })),
    on(VentesActions.loadCommandesFailure, (state, { error }) => ({ ...state, commandesLoading: false, commandesError: error })),

    on(VentesActions.addCommande, (state) => ({ ...state, commandesSaving: true })),
    on(VentesActions.addCommandeSuccess, (state, { commande }) => ({ ...state, commandesSaving: false, commandes: [...state.commandes, commande] })),
    on(VentesActions.updateCommande, (state) => ({ ...state, commandesSaving: true })),
    on(VentesActions.updateCommandeSuccess, (state, { commande }) => ({ ...state, commandesSaving: false, commandes: state.commandes.map((c) => (c.id === commande.id ? commande : c)) })),
    on(VentesActions.removeCommande, (state) => ({ ...state, commandesSaving: true })),
    on(VentesActions.removeCommandeSuccess, (state, { id }) => ({ ...state, commandesSaving: false, commandes: state.commandes.filter((c) => c.id !== id) })),
    on(VentesActions.addCommandeFailure, VentesActions.updateCommandeFailure, VentesActions.removeCommandeFailure, (state) => ({ ...state, commandesSaving: false })),

    on(VentesActions.loadLivraisons, (state) => ({ ...state, livraisonsLoading: true, livraisonsError: null })),
    on(VentesActions.loadLivraisonsSuccess, (state, { livraisons }) => ({ ...state, livraisonsLoading: false, livraisons })),
    on(VentesActions.loadLivraisonsFailure, (state, { error }) => ({ ...state, livraisonsLoading: false, livraisonsError: error })),

    on(VentesActions.addLivraison, (state) => ({ ...state, livraisonsSaving: true })),
    on(VentesActions.addLivraisonSuccess, (state, { livraison }) => ({ ...state, livraisonsSaving: false, livraisons: [...state.livraisons, livraison] })),
    on(VentesActions.updateLivraison, (state) => ({ ...state, livraisonsSaving: true })),
    on(VentesActions.updateLivraisonSuccess, (state, { livraison }) => ({ ...state, livraisonsSaving: false, livraisons: state.livraisons.map((l) => (l.id === livraison.id ? livraison : l)) })),
    on(VentesActions.removeLivraison, (state) => ({ ...state, livraisonsSaving: true })),
    on(VentesActions.removeLivraisonSuccess, (state, { id }) => ({ ...state, livraisonsSaving: false, livraisons: state.livraisons.filter((l) => l.id !== id) })),
    on(VentesActions.addLivraisonFailure, VentesActions.updateLivraisonFailure, VentesActions.removeLivraisonFailure, (state) => ({ ...state, livraisonsSaving: false })),

    on(VentesActions.loadFactures, (state) => ({ ...state, facturesLoading: true, facturesError: null })),
    on(VentesActions.loadFacturesSuccess, (state, { factures }) => ({ ...state, facturesLoading: false, factures })),
    on(VentesActions.loadFacturesFailure, (state, { error }) => ({ ...state, facturesLoading: false, facturesError: error })),

    on(VentesActions.addFacture, (state) => ({ ...state, facturesSaving: true })),
    on(VentesActions.addFactureSuccess, (state, { facture }) => ({ ...state, facturesSaving: false, factures: [...state.factures, facture] })),
    on(VentesActions.updateFacture, (state) => ({ ...state, facturesSaving: true })),
    on(VentesActions.updateFactureSuccess, (state, { facture }) => ({ ...state, facturesSaving: false, factures: state.factures.map((f) => (f.id === facture.id ? facture : f)) })),
    on(VentesActions.removeFacture, (state) => ({ ...state, facturesSaving: true })),
    on(VentesActions.removeFactureSuccess, (state, { id }) => ({ ...state, facturesSaving: false, factures: state.factures.filter((f) => f.id !== id) })),
    on(VentesActions.addFactureFailure, VentesActions.updateFactureFailure, VentesActions.removeFactureFailure, (state) => ({ ...state, facturesSaving: false })),

    on(VentesActions.loadAvoirs, (state) => ({ ...state, avoirsLoading: true, avoirsError: null })),
    on(VentesActions.loadAvoirsSuccess, (state, { avoirs }) => ({ ...state, avoirsLoading: false, avoirs })),
    on(VentesActions.loadAvoirsFailure, (state, { error }) => ({ ...state, avoirsLoading: false, avoirsError: error })),

    on(VentesActions.addAvoir, (state) => ({ ...state, avoirsSaving: true })),
    on(VentesActions.addAvoirSuccess, (state, { avoir }) => ({ ...state, avoirsSaving: false, avoirs: [...state.avoirs, avoir] })),
    on(VentesActions.updateAvoir, (state) => ({ ...state, avoirsSaving: true })),
    on(VentesActions.updateAvoirSuccess, (state, { avoir }) => ({ ...state, avoirsSaving: false, avoirs: state.avoirs.map((a) => (a.id === avoir.id ? avoir : a)) })),
    on(VentesActions.removeAvoir, (state) => ({ ...state, avoirsSaving: true })),
    on(VentesActions.removeAvoirSuccess, (state, { id }) => ({ ...state, avoirsSaving: false, avoirs: state.avoirs.filter((a) => a.id !== id) })),
    on(VentesActions.addAvoirFailure, VentesActions.updateAvoirFailure, VentesActions.removeAvoirFailure, (state) => ({ ...state, avoirsSaving: false })),

    on(VentesActions.loadRetours, (state) => ({ ...state, retoursLoading: true, retoursError: null })),
    on(VentesActions.loadRetoursSuccess, (state, { retours }) => ({ ...state, retoursLoading: false, retours })),
    on(VentesActions.loadRetoursFailure, (state, { error }) => ({ ...state, retoursLoading: false, retoursError: error })),

    on(VentesActions.addRetour, (state) => ({ ...state, retoursSaving: true })),
    on(VentesActions.addRetourSuccess, (state, { retour }) => ({ ...state, retoursSaving: false, retours: [...state.retours, retour] })),
    on(VentesActions.updateRetour, (state) => ({ ...state, retoursSaving: true })),
    on(VentesActions.updateRetourSuccess, (state, { retour }) => ({ ...state, retoursSaving: false, retours: state.retours.map((r) => (r.id === retour.id ? retour : r)) })),
    on(VentesActions.removeRetour, (state) => ({ ...state, retoursSaving: true })),
    on(VentesActions.removeRetourSuccess, (state, { id }) => ({ ...state, retoursSaving: false, retours: state.retours.filter((r) => r.id !== id) })),
    on(VentesActions.addRetourFailure, VentesActions.updateRetourFailure, VentesActions.removeRetourFailure, (state) => ({ ...state, retoursSaving: false })),
  ),
});
