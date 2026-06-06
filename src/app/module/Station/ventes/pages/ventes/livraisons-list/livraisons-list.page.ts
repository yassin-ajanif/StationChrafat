import { DatePipe } from '@angular/common';
import { TranslateService, TranslatePipe, LocaleCurrencyPipe } from '../../../../../../core/i18n'
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../../shared/components/button/button.component';
import { LivraisonFormDialogComponent, LivraisonFormEditValue, LivraisonFormDraft } from '../../../../shared/components/dialogs/livraison-form-dialog/livraison-form-dialog.component';
import { Livraison, LivraisonDraft, LivraisonStatut } from '../../../state/store';

const LIVRAISON_STATUT_KEYS: Record<LivraisonStatut, string> = {
  planifiee: 'ventes.livraison.statusPlanifiee',
  en_cours: 'ventes.livraison.statusEnCours',
  livree: 'ventes.livraison.statusLivree',
  annulee: 'ventes.livraison.statusAnnulee',
};
import { VentesActions } from '../../../state/ventes.actions';
import {
  selectLivraisons,
  selectLivraisonsError,
  selectLivraisonsLoading,
  selectLivraisonsSaving,
} from '../../../state/ventes.selectors';

@Component({
  selector: 'app-erp-livraisons-list-page',
  standalone: true,
  imports: [ButtonComponent, LivraisonFormDialogComponent, DatePipe, LocaleCurrencyPipe, TranslatePipe],
  templateUrl: './livraisons-list.page.html',
  styleUrl: './livraisons-list.page.scss',
})
export class LivraisonsListPage implements OnInit {
  private readonly store = inject(Store);
  private readonly translate = inject(TranslateService);

  readonly livraisons = this.store.selectSignal(selectLivraisons);
  readonly loading = this.store.selectSignal(selectLivraisonsLoading);
  readonly error = this.store.selectSignal(selectLivraisonsError);
  readonly saving = this.store.selectSignal(selectLivraisonsSaving);

  readonly statutKeys = LIVRAISON_STATUT_KEYS;
  readonly showDialog = signal(false);
  readonly editingLivraison = signal<Livraison | null>(null);

  readonly editingLivraisonValue = computed<LivraisonFormEditValue | null>(() => {
    const l = this.editingLivraison();
    if (!l) return null;
    return {
      client: l.client,
      dateLivraison: l.dateLivraison,
      statut: l.statut,
      adresse: l.adresse,
      description: l.description,
      serviceLines: l.serviceLines,
      productLines: l.productLines,
      payments: l.payments,
    };
  });

  ngOnInit(): void {
    this.store.dispatch(VentesActions.loadLivraisons());
  }

  openNew(): void {
    this.editingLivraison.set(null);
    this.showDialog.set(true);
  }

  openEdit(livraison: Livraison): void {
    this.editingLivraison.set(livraison);
    this.showDialog.set(true);
  }

  onSaved(draft: LivraisonFormDraft): void {
    const livraisonDraft: LivraisonDraft = {
      client: draft.client,
      dateLivraison: draft.dateLivraison,
      statut: draft.statut,
      adresse: draft.adresse,
      description: draft.description,
      serviceLines: draft.serviceLines,
      productLines: draft.productLines,
      payments: draft.payments,
    };
    const editing = this.editingLivraison();
    if (editing) {
      this.store.dispatch(VentesActions.updateLivraison({ id: editing.id, draft: livraisonDraft }));
    } else {
      this.store.dispatch(VentesActions.addLivraison({ draft: livraisonDraft }));
    }
    this.showDialog.set(false);
    this.editingLivraison.set(null);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingLivraison.set(null);
  }

  removeLivraison(id: number): void {
    if (confirm(this.translate.instant('common.confirm.deleteLivraison'))) {
      this.store.dispatch(VentesActions.removeLivraison({ id }));
    }
  }

  statutClass(statut: LivraisonStatut): string {
    const map: Record<LivraisonStatut, string> = {
      planifiee: 'bg-secondary/15 text-secondary',
      en_cours: 'bg-surface-container text-on-surface-variant',
      livree: 'bg-success/15 text-success',
      annulee: 'bg-primary/15 text-primary',
    };
    return map[statut];
  }
}

export { LivraisonsListPage as VentesLivraisonsListPage };