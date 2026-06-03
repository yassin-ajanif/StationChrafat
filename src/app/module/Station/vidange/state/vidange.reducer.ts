import { createFeature, createReducer, on } from '@ngrx/store';
import { AvoirFournisseur, CommandeAchat, DevisAchat, FactureFournisseur, Reception } from '../models/achat';
import { Avoir, Commande, Devis, Facture, Livraison } from '../models/ventes';
import { StockOverview } from '../models/stock-overview';
import { VidangeActions } from './vidange.actions';

export interface VidangeState {
  stockOverview: StockOverview | null;
  stockLoading: boolean;
  stockError: string | null;
  devis: Devis[];
  devisLoading: boolean;
  devisError: string | null;
  devisSaving: boolean;
  commandes: Commande[];
  commandesLoading: boolean;
  commandesError: string | null;
  livraisons: Livraison[];
  livraisonsLoading: boolean;
  livraisonsError: string | null;
  factures: Facture[];
  facturesLoading: boolean;
  facturesError: string | null;
  avoirs: Avoir[];
  avoirsLoading: boolean;
  avoirsError: string | null;
  devisAchat: DevisAchat[];
  devisAchatLoading: boolean;
  devisAchatError: string | null;
  commandesAchat: CommandeAchat[];
  commandesAchatLoading: boolean;
  commandesAchatError: string | null;
  receptions: Reception[];
  receptionsLoading: boolean;
  receptionsError: string | null;
  facturesFournisseur: FactureFournisseur[];
  facturesFournisseurLoading: boolean;
  facturesFournisseurError: string | null;
  avoirsFournisseur: AvoirFournisseur[];
  avoirsFournisseurLoading: boolean;
  avoirsFournisseurError: string | null;
}

export const initialVidangeState: VidangeState = {
  stockOverview: null,
  stockLoading: false,
  stockError: null,
  devis: [],
  devisLoading: false,
  devisError: null,
  devisSaving: false,
  commandes: [],
  commandesLoading: false,
  commandesError: null,
  livraisons: [],
  livraisonsLoading: false,
  livraisonsError: null,
  factures: [],
  facturesLoading: false,
  facturesError: null,
  avoirs: [],
  avoirsLoading: false,
  avoirsError: null,
  devisAchat: [],
  devisAchatLoading: false,
  devisAchatError: null,
  commandesAchat: [],
  commandesAchatLoading: false,
  commandesAchatError: null,
  receptions: [],
  receptionsLoading: false,
  receptionsError: null,
  facturesFournisseur: [],
  facturesFournisseurLoading: false,
  facturesFournisseurError: null,
  avoirsFournisseur: [],
  avoirsFournisseurLoading: false,
  avoirsFournisseurError: null,
};

export const vidangeFeature = createFeature({
  name: 'Vidange',
  reducer: createReducer(
    initialVidangeState,

    on(VidangeActions.loadStock, (state) => ({
      ...state,
      stockLoading: true,
      stockError: null,
    })),
    on(VidangeActions.loadStockSuccess, (state, { overview }) => ({
      ...state,
      stockLoading: false,
      stockOverview: overview,
    })),
    on(VidangeActions.loadStockFailure, (state, { error }) => ({
      ...state,
      stockLoading: false,
      stockError: error,
    })),

    on(VidangeActions.loadDevis, (state) => ({
      ...state,
      devisLoading: true,
      devisError: null,
    })),
    on(VidangeActions.loadDevisSuccess, (state, { devis }) => ({
      ...state,
      devisLoading: false,
      devis,
    })),
    on(VidangeActions.loadDevisFailure, (state, { error }) => ({
      ...state,
      devisLoading: false,
      devisError: error,
    })),

    on(VidangeActions.addDevis, VidangeActions.updateDevis, VidangeActions.removeDevis, (state) => ({
      ...state,
      devisSaving: true,
    })),
    on(VidangeActions.addDevisSuccess, (state, { devis }) => ({
      ...state,
      devisSaving: false,
      devis: [...state.devis, devis],
    })),
    on(VidangeActions.updateDevisSuccess, (state, { devis }) => ({
      ...state,
      devisSaving: false,
      devis: state.devis.map((d) => (d.id === devis.id ? devis : d)),
    })),
    on(VidangeActions.removeDevisSuccess, (state, { id }) => ({
      ...state,
      devisSaving: false,
      devis: state.devis.filter((d) => d.id !== id),
    })),
    on(
      VidangeActions.addDevisFailure,
      VidangeActions.updateDevisFailure,
      VidangeActions.removeDevisFailure,
      (state) => ({
        ...state,
        devisSaving: false,
      }),
    ),

    on(VidangeActions.loadCommandes, (state) => ({
      ...state,
      commandesLoading: true,
      commandesError: null,
    })),
    on(VidangeActions.loadCommandesSuccess, (state, { commandes }) => ({
      ...state,
      commandesLoading: false,
      commandes,
    })),
    on(VidangeActions.loadCommandesFailure, (state, { error }) => ({
      ...state,
      commandesLoading: false,
      commandesError: error,
    })),

    on(VidangeActions.loadLivraisons, (state) => ({
      ...state,
      livraisonsLoading: true,
      livraisonsError: null,
    })),
    on(VidangeActions.loadLivraisonsSuccess, (state, { livraisons }) => ({
      ...state,
      livraisonsLoading: false,
      livraisons,
    })),
    on(VidangeActions.loadLivraisonsFailure, (state, { error }) => ({
      ...state,
      livraisonsLoading: false,
      livraisonsError: error,
    })),

    on(VidangeActions.loadFactures, (state) => ({
      ...state,
      facturesLoading: true,
      facturesError: null,
    })),
    on(VidangeActions.loadFacturesSuccess, (state, { factures }) => ({
      ...state,
      facturesLoading: false,
      factures,
    })),
    on(VidangeActions.loadFacturesFailure, (state, { error }) => ({
      ...state,
      facturesLoading: false,
      facturesError: error,
    })),

    on(VidangeActions.loadAvoirs, (state) => ({
      ...state,
      avoirsLoading: true,
      avoirsError: null,
    })),
    on(VidangeActions.loadAvoirsSuccess, (state, { avoirs }) => ({
      ...state,
      avoirsLoading: false,
      avoirs,
    })),
    on(VidangeActions.loadAvoirsFailure, (state, { error }) => ({
      ...state,
      avoirsLoading: false,
      avoirsError: error,
    })),

    on(VidangeActions.loadDevisAchat, (state) => ({
      ...state,
      devisAchatLoading: true,
      devisAchatError: null,
    })),
    on(VidangeActions.loadDevisAchatSuccess, (state, { devisAchat }) => ({
      ...state,
      devisAchatLoading: false,
      devisAchat,
    })),
    on(VidangeActions.loadDevisAchatFailure, (state, { error }) => ({
      ...state,
      devisAchatLoading: false,
      devisAchatError: error,
    })),

    on(VidangeActions.loadCommandesAchat, (state) => ({
      ...state,
      commandesAchatLoading: true,
      commandesAchatError: null,
    })),
    on(VidangeActions.loadCommandesAchatSuccess, (state, { commandesAchat }) => ({
      ...state,
      commandesAchatLoading: false,
      commandesAchat,
    })),
    on(VidangeActions.loadCommandesAchatFailure, (state, { error }) => ({
      ...state,
      commandesAchatLoading: false,
      commandesAchatError: error,
    })),

    on(VidangeActions.loadReceptions, (state) => ({
      ...state,
      receptionsLoading: true,
      receptionsError: null,
    })),
    on(VidangeActions.loadReceptionsSuccess, (state, { receptions }) => ({
      ...state,
      receptionsLoading: false,
      receptions,
    })),
    on(VidangeActions.loadReceptionsFailure, (state, { error }) => ({
      ...state,
      receptionsLoading: false,
      receptionsError: error,
    })),

    on(VidangeActions.loadFacturesFournisseur, (state) => ({
      ...state,
      facturesFournisseurLoading: true,
      facturesFournisseurError: null,
    })),
    on(VidangeActions.loadFacturesFournisseurSuccess, (state, { facturesFournisseur }) => ({
      ...state,
      facturesFournisseurLoading: false,
      facturesFournisseur,
    })),
    on(VidangeActions.loadFacturesFournisseurFailure, (state, { error }) => ({
      ...state,
      facturesFournisseurLoading: false,
      facturesFournisseurError: error,
    })),

    on(VidangeActions.loadAvoirsFournisseur, (state) => ({
      ...state,
      avoirsFournisseurLoading: true,
      avoirsFournisseurError: null,
    })),
    on(VidangeActions.loadAvoirsFournisseurSuccess, (state, { avoirsFournisseur }) => ({
      ...state,
      avoirsFournisseurLoading: false,
      avoirsFournisseur,
    })),
    on(VidangeActions.loadAvoirsFournisseurFailure, (state, { error }) => ({
      ...state,
      avoirsFournisseurLoading: false,
      avoirsFournisseurError: error,
    })),
  ),
});
