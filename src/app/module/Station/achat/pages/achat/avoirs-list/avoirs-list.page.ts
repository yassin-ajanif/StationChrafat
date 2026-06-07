import { DatePipe } from '@angular/common';
import { TranslateService, TranslatePipe, LocaleCurrencyPipe } from '../../../../../../core/i18n'
import { Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../../shared/components/button/button.component';
import { RecordListCardComponent } from '../../../../../../shared/components/record-list-card/record-list-card.component';
import {
  AvoirFournisseur,
  AvoirFournisseurDraft,
  AvoirFournisseurStatut,
} from '../../../state/store';

const AVOIR_FOURNISSEUR_STATUT_KEYS: Record<AvoirFournisseurStatut, string> = {
  brouillon: 'achat.avoir.statusBrouillon',
  recu: 'achat.avoir.statusRecu',
  applique: 'achat.avoir.statusApplique',
};
import { AchatActions } from '../../../state/achat.actions';
import {
  selectAvoirsFournisseur,
  selectAvoirsFournisseurError,
  selectAvoirsFournisseurLoading,
  selectAvoirsFournisseurSaving,
} from '../../../state/achat.selectors';
import { AvoirFournisseurFormDialogComponent } from './dialogs/avoir-fournisseur-form-dialog/avoir-fournisseur-form-dialog.component';

@Component({
  selector: 'app-erp-achat-avoirs-list-page',
  standalone: true,
  imports: [ButtonComponent, AvoirFournisseurFormDialogComponent, DatePipe, LocaleCurrencyPipe, RecordListCardComponent, TranslatePipe],
  templateUrl: './avoirs-list.page.html',
  styleUrl: './avoirs-list.page.scss',
})
export class AchatAvoirsListPage implements OnInit {
  private readonly store = inject(Store);
  private readonly translate = inject(TranslateService);

  readonly avoirs = this.store.selectSignal(selectAvoirsFournisseur);
  readonly loading = this.store.selectSignal(selectAvoirsFournisseurLoading);
  readonly error = this.store.selectSignal(selectAvoirsFournisseurError);
  readonly saving = this.store.selectSignal(selectAvoirsFournisseurSaving);

  readonly statutKeys = AVOIR_FOURNISSEUR_STATUT_KEYS;
  readonly showDialog = signal(false);
  readonly editingAvoir = signal<AvoirFournisseur | null>(null);

  ngOnInit(): void {
    this.store.dispatch(AchatActions.loadAvoirsFournisseur());
  }

  openNew(): void {
    this.editingAvoir.set(null);
    this.showDialog.set(true);
  }

  openEdit(avoir: AvoirFournisseur): void {
    this.editingAvoir.set(avoir);
    this.showDialog.set(true);
  }

  onSaved(draft: AvoirFournisseurDraft): void {
    const editing = this.editingAvoir();
    if (editing) {
      this.store.dispatch(AchatActions.updateAvoirFournisseur({ id: editing.id, draft }));
    } else {
      this.store.dispatch(AchatActions.addAvoirFournisseur({ draft }));
    }
    this.showDialog.set(false);
    this.editingAvoir.set(null);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingAvoir.set(null);
  }

  removeAvoir(id: number): void {
    if (confirm(this.translate.instant('common.confirm.deleteAvoirFournisseur'))) {
      this.store.dispatch(AchatActions.removeAvoirFournisseur({ id }));
    }
  }

  statutClass(statut: AvoirFournisseurStatut): string {
    const map: Record<AvoirFournisseurStatut, string> = {
      brouillon: 'bg-surface-container text-on-surface-variant',
      recu: 'bg-secondary/15 text-secondary',
      applique: 'bg-success/15 text-success',
    };
    return map[statut];
  }
}
