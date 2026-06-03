import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  AvoirFournisseur,
  CommandeAchat,
  DevisAchat,
  FactureFournisseur,
  Reception,
} from '../models/achat';
import { Avoir, Commande, Devis, DevisDraft, Facture, Livraison } from '../models/ventes';
import { StockOverview } from '../models/stock-overview';

export const CarburantActions = createActionGroup({
  source: 'Carburant',
  events: {
    'Load Stock': emptyProps(),
    'Load Stock Success': props<{ overview: StockOverview }>(),
    'Load Stock Failure': props<{ error: string }>(),

    'Load Devis': emptyProps(),
    'Load Devis Success': props<{ devis: Devis[] }>(),
    'Load Devis Failure': props<{ error: string }>(),

    'Add Devis': props<{ draft: DevisDraft }>(),
    'Add Devis Success': props<{ devis: Devis }>(),
    'Add Devis Failure': props<{ error: string }>(),

    'Update Devis': props<{ id: number; draft: DevisDraft }>(),
    'Update Devis Success': props<{ devis: Devis }>(),
    'Update Devis Failure': props<{ error: string }>(),

    'Remove Devis': props<{ id: number }>(),
    'Remove Devis Success': props<{ id: number }>(),
    'Remove Devis Failure': props<{ error: string }>(),

    'Load Commandes': emptyProps(),
    'Load Commandes Success': props<{ commandes: Commande[] }>(),
    'Load Commandes Failure': props<{ error: string }>(),

    'Load Livraisons': emptyProps(),
    'Load Livraisons Success': props<{ livraisons: Livraison[] }>(),
    'Load Livraisons Failure': props<{ error: string }>(),

    'Load Factures': emptyProps(),
    'Load Factures Success': props<{ factures: Facture[] }>(),
    'Load Factures Failure': props<{ error: string }>(),

    'Load Avoirs': emptyProps(),
    'Load Avoirs Success': props<{ avoirs: Avoir[] }>(),
    'Load Avoirs Failure': props<{ error: string }>(),

    'Load Devis Achat': emptyProps(),
    'Load Devis Achat Success': props<{ devisAchat: DevisAchat[] }>(),
    'Load Devis Achat Failure': props<{ error: string }>(),

    'Load Commandes Achat': emptyProps(),
    'Load Commandes Achat Success': props<{ commandesAchat: CommandeAchat[] }>(),
    'Load Commandes Achat Failure': props<{ error: string }>(),

    'Load Receptions': emptyProps(),
    'Load Receptions Success': props<{ receptions: Reception[] }>(),
    'Load Receptions Failure': props<{ error: string }>(),

    'Load Factures Fournisseur': emptyProps(),
    'Load Factures Fournisseur Success': props<{ facturesFournisseur: FactureFournisseur[] }>(),
    'Load Factures Fournisseur Failure': props<{ error: string }>(),

    'Load Avoirs Fournisseur': emptyProps(),
    'Load Avoirs Fournisseur Success': props<{ avoirsFournisseur: AvoirFournisseur[] }>(),
    'Load Avoirs Fournisseur Failure': props<{ error: string }>(),
  },
});
