import { DatePipe } from '@angular/common';
import { TranslateService, TranslatePipe, LocaleCurrencyPipe } from '../../../../../../core/i18n'
import { Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../../shared/components/button/button.component';
import { RecordListCardComponent } from '../../../../../../shared/components/record-list-card/record-list-card.component';
import { Avoir, AvoirDraft, AvoirStatut } from '../../../state/store';

const AVOIR_STATUT_KEYS: Record<AvoirStatut, string> = {
  brouillon: 'ventes.avoir.statusBrouillon',
  emis: 'ventes.avoir.statusEmis',
  applique: 'ventes.avoir.statusApplique',
};
import { VentesActions } from '../../../state/ventes.actions';
import {
  selectAvoirs,
  selectAvoirsError,
  selectAvoirsLoading,
  selectAvoirsSaving,
} from '../../../state/ventes.selectors';
import { AvoirFormDialogComponent } from './dialogs/avoir-form-dialog/avoir-form-dialog.component';

@Component({
  selector: 'app-erp-avoirs-list-page',
  standalone: true,
  imports: [ButtonComponent, AvoirFormDialogComponent, DatePipe, LocaleCurrencyPipe, RecordListCardComponent, TranslatePipe],
  templateUrl: './avoirs-list.page.html',
  styleUrl: './avoirs-list.page.scss',
})
export class AvoirsListPage implements OnInit {
  private readonly store = inject(Store);
  private readonly translate = inject(TranslateService);

  readonly avoirs = this.store.selectSignal(selectAvoirs);
  readonly loading = this.store.selectSignal(selectAvoirsLoading);
  readonly error = this.store.selectSignal(selectAvoirsError);
  readonly saving = this.store.selectSignal(selectAvoirsSaving);

  readonly statutKeys = AVOIR_STATUT_KEYS;
  readonly showDialog = signal(false);
  readonly editingAvoir = signal<Avoir | null>(null);

  ngOnInit(): void {
    this.store.dispatch(VentesActions.loadAvoirs());
  }

  openNew(): void {
    this.editingAvoir.set(null);
    this.showDialog.set(true);
  }

  openEdit(avoir: Avoir): void {
    this.editingAvoir.set(avoir);
    this.showDialog.set(true);
  }

  onSaved(draft: AvoirDraft): void {
    const editing = this.editingAvoir();
    if (editing) {
      this.store.dispatch(VentesActions.updateAvoir({ id: editing.id, draft }));
    } else {
      this.store.dispatch(VentesActions.addAvoir({ draft }));
    }
    this.showDialog.set(false);
    this.editingAvoir.set(null);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingAvoir.set(null);
  }

  removeAvoir(id: number): void {
    if (confirm(this.translate.instant('common.confirm.deleteAvoir'))) {
      this.store.dispatch(VentesActions.removeAvoir({ id }));
    }
  }

  statutClass(statut: AvoirStatut): string {
    const map: Record<AvoirStatut, string> = {
      brouillon: 'bg-surface-container text-on-surface-variant',
      emis: 'bg-secondary/15 text-secondary',
      applique: 'bg-success/15 text-success',
    };
    return map[statut];
  }
}

export { AvoirsListPage as VentesAvoirsListPage };
