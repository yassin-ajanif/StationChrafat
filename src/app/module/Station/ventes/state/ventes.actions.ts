import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Avoir, AvoirDraft, Commande, CommandeDraft, Devis, DevisDraft, Facture, FactureDraft, Livraison, LivraisonDraft, Retour, RetourDraft } from '../models/ventes';

export const VentesActions = createActionGroup({
  source: 'Ventes',
  events: {
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

    'Add Commande': props<{ draft: CommandeDraft }>(),
    'Add Commande Success': props<{ commande: Commande }>(),
    'Add Commande Failure': props<{ error: string }>(),

    'Update Commande': props<{ id: number; draft: CommandeDraft }>(),
    'Update Commande Success': props<{ commande: Commande }>(),
    'Update Commande Failure': props<{ error: string }>(),

    'Remove Commande': props<{ id: number }>(),
    'Remove Commande Success': props<{ id: number }>(),
    'Remove Commande Failure': props<{ error: string }>(),

    'Load Livraisons': emptyProps(),
    'Load Livraisons Success': props<{ livraisons: Livraison[] }>(),
    'Load Livraisons Failure': props<{ error: string }>(),

    'Add Livraison': props<{ draft: LivraisonDraft }>(),
    'Add Livraison Success': props<{ livraison: Livraison }>(),
    'Add Livraison Failure': props<{ error: string }>(),

    'Update Livraison': props<{ id: number; draft: LivraisonDraft }>(),
    'Update Livraison Success': props<{ livraison: Livraison }>(),
    'Update Livraison Failure': props<{ error: string }>(),

    'Remove Livraison': props<{ id: number }>(),
    'Remove Livraison Success': props<{ id: number }>(),
    'Remove Livraison Failure': props<{ error: string }>(),

    'Load Factures': emptyProps(),
    'Load Factures Success': props<{ factures: Facture[] }>(),
    'Load Factures Failure': props<{ error: string }>(),

    'Add Facture': props<{ draft: FactureDraft }>(),
    'Add Facture Success': props<{ facture: Facture }>(),
    'Add Facture Failure': props<{ error: string }>(),

    'Update Facture': props<{ id: number; draft: FactureDraft }>(),
    'Update Facture Success': props<{ facture: Facture }>(),
    'Update Facture Failure': props<{ error: string }>(),

    'Remove Facture': props<{ id: number }>(),
    'Remove Facture Success': props<{ id: number }>(),
    'Remove Facture Failure': props<{ error: string }>(),

    'Load Avoirs': emptyProps(),
    'Load Avoirs Success': props<{ avoirs: Avoir[] }>(),
    'Load Avoirs Failure': props<{ error: string }>(),

    'Add Avoir': props<{ draft: AvoirDraft }>(),
    'Add Avoir Success': props<{ avoir: Avoir }>(),
    'Add Avoir Failure': props<{ error: string }>(),

    'Update Avoir': props<{ id: number; draft: AvoirDraft }>(),
    'Update Avoir Success': props<{ avoir: Avoir }>(),
    'Update Avoir Failure': props<{ error: string }>(),

    'Remove Avoir': props<{ id: number }>(),
    'Remove Avoir Success': props<{ id: number }>(),
    'Remove Avoir Failure': props<{ error: string }>(),

    'Load Retours': emptyProps(),
    'Load Retours Success': props<{ retours: Retour[] }>(),
    'Load Retours Failure': props<{ error: string }>(),

    'Add Retour': props<{ draft: RetourDraft }>(),
    'Add Retour Success': props<{ retour: Retour }>(),
    'Add Retour Failure': props<{ error: string }>(),

    'Update Retour': props<{ id: number; draft: RetourDraft }>(),
    'Update Retour Success': props<{ retour: Retour }>(),
    'Update Retour Failure': props<{ error: string }>(),

    'Remove Retour': props<{ id: number }>(),
    'Remove Retour Success': props<{ id: number }>(),
    'Remove Retour Failure': props<{ error: string }>(),
  },
});
