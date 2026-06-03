import { createFeature, createReducer, on } from '@ngrx/store';
import { AvoirFournisseur, CommandeAchat, DevisAchat, FactureFournisseur, Reception } from '../models/achat';
import { Avoir, Commande, Devis, Facture, Livraison } from '../models/ventes';
import { StockOverview } from '../models/stock-overview';
import { CarburantActions } from './carburant.actions';

export interface CarburantState {
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

export const initialCarburantState: CarburantState = {
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

export const carburantFeature = createFeature({
  name: 'carburant',
  reducer: createReducer(
    initialCarburantState,

    on(CarburantActions.loadStock, (state) => ({
      ...state,
      stockLoading: true,
      stockError: null,
    })),
    on(CarburantActions.loadStockSuccess, (state, { overview }) => ({
      ...state,
      stockLoading: false,
      stockOverview: overview,
    })),
    on(CarburantActions.loadStockFailure, (state, { error }) => ({
      ...state,
      stockLoading: false,
      stockError: error,
    })),

    on(CarburantActions.loadDevis, (state) => ({
      ...state,
      devisLoading: true,
      devisError: null,
    })),
    on(CarburantActions.loadDevisSuccess, (state, { devis }) => ({
      ...state,
      devisLoading: false,
      devis,
    })),
    on(CarburantActions.loadDevisFailure, (state, { error }) => ({
      ...state,
      devisLoading: false,
      devisError: error,
    })),

    on(CarburantActions.addDevis, CarburantActions.updateDevis, CarburantActions.removeDevis, (state) => ({
      ...state,
      devisSaving: true,
    })),
    on(CarburantActions.addDevisSuccess, (state, { devis }) => ({
      ...state,
      devisSaving: false,
      devis: [...state.devis, devis],
    })),
    on(CarburantActions.updateDevisSuccess, (state, { devis }) => ({
      ...state,
      devisSaving: false,
      devis: state.devis.map((d) => (d.id === devis.id ? devis : d)),
    })),
    on(CarburantActions.removeDevisSuccess, (state, { id }) => ({
      ...state,
      devisSaving: false,
      devis: state.devis.filter((d) => d.id !== id),
    })),
    on(
      CarburantActions.addDevisFailure,
      CarburantActions.updateDevisFailure,
      CarburantActions.removeDevisFailure,
      (state) => ({
        ...state,
        devisSaving: false,
      }),
    ),

    on(CarburantActions.loadCommandes, (state) => ({
      ...state,
      commandesLoading: true,
      commandesError: null,
    })),
    on(CarburantActions.loadCommandesSuccess, (state, { commandes }) => ({
      ...state,
      commandesLoading: false,
      commandes,
    })),
    on(CarburantActions.loadCommandesFailure, (state, { error }) => ({
      ...state,
      commandesLoading: false,
      commandesError: error,
    })),

    on(CarburantActions.loadLivraisons, (state) => ({
      ...state,
      livraisonsLoading: true,
      livraisonsError: null,
    })),
    on(CarburantActions.loadLivraisonsSuccess, (state, { livraisons }) => ({
      ...state,
      livraisonsLoading: false,
      livraisons,
    })),
    on(CarburantActions.loadLivraisonsFailure, (state, { error }) => ({
      ...state,
      livraisonsLoading: false,
      livraisonsError: error,
    })),

    on(CarburantActions.loadFactures, (state) => ({
      ...state,
      facturesLoading: true,
      facturesError: null,
    })),
    on(CarburantActions.loadFacturesSuccess, (state, { factures }) => ({
      ...state,
      facturesLoading: false,
      factures,
    })),
    on(CarburantActions.loadFacturesFailure, (state, { error }) => ({
      ...state,
      facturesLoading: false,
      facturesError: error,
    })),

    on(CarburantActions.loadAvoirs, (state) => ({
      ...state,
      avoirsLoading: true,
      avoirsError: null,
    })),
    on(CarburantActions.loadAvoirsSuccess, (state, { avoirs }) => ({
      ...state,
      avoirsLoading: false,
      avoirs,
    })),
    on(CarburantActions.loadAvoirsFailure, (state, { error }) => ({
      ...state,
      avoirsLoading: false,
      avoirsError: error,
    })),

    on(CarburantActions.loadDevisAchat, (state) => ({
      ...state,
      devisAchatLoading: true,
      devisAchatError: null,
    })),
    on(CarburantActions.loadDevisAchatSuccess, (state, { devisAchat }) => ({
      ...state,
      devisAchatLoading: false,
      devisAchat,
    })),
    on(CarburantActions.loadDevisAchatFailure, (state, { error }) => ({
      ...state,
      devisAchatLoading: false,
      devisAchatError: error,
    })),

    on(CarburantActions.loadCommandesAchat, (state) => ({
      ...state,
      commandesAchatLoading: true,
      commandesAchatError: null,
    })),
    on(CarburantActions.loadCommandesAchatSuccess, (state, { commandesAchat }) => ({
      ...state,
      commandesAchatLoading: false,
      commandesAchat,
    })),
    on(CarburantActions.loadCommandesAchatFailure, (state, { error }) => ({
      ...state,
      commandesAchatLoading: false,
      commandesAchatError: error,
    })),

    on(CarburantActions.loadReceptions, (state) => ({
      ...state,
      receptionsLoading: true,
      receptionsError: null,
    })),
    on(CarburantActions.loadReceptionsSuccess, (state, { receptions }) => ({
      ...state,
      receptionsLoading: false,
      receptions,
    })),
    on(CarburantActions.loadReceptionsFailure, (state, { error }) => ({
      ...state,
      receptionsLoading: false,
      receptionsError: error,
    })),

    on(CarburantActions.loadFacturesFournisseur, (state) => ({
      ...state,
      facturesFournisseurLoading: true,
      facturesFournisseurError: null,
    })),
    on(CarburantActions.loadFacturesFournisseurSuccess, (state, { facturesFournisseur }) => ({
      ...state,
      facturesFournisseurLoading: false,
      facturesFournisseur,
    })),
    on(CarburantActions.loadFacturesFournisseurFailure, (state, { error }) => ({
      ...state,
      facturesFournisseurLoading: false,
      facturesFournisseurError: error,
    })),

    on(CarburantActions.loadAvoirsFournisseur, (state) => ({
      ...state,
      avoirsFournisseurLoading: true,
      avoirsFournisseurError: null,
    })),
    on(CarburantActions.loadAvoirsFournisseurSuccess, (state, { avoirsFournisseur }) => ({
      ...state,
      avoirsFournisseurLoading: false,
      avoirsFournisseur,
    })),
    on(CarburantActions.loadAvoirsFournisseurFailure, (state, { error }) => ({
      ...state,
      avoirsFournisseurLoading: false,
      avoirsFournisseurError: error,
    })),
  ),
});
