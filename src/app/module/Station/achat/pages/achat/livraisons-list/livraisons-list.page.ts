import { DatePipe } from '@angular/common';
import { TranslateService, TranslatePipe, LocaleCurrencyPipe } from '../../../../../../core/i18n'
import { Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../../shared/components/button/button.component';
import { RecordListCardComponent } from '../../../../../../shared/components/record-list-card/record-list-card.component';
import {
  Reception,
  ReceptionDraft,
  ReceptionStatut,
} from '../../../state/store';

const RECEPTION_STATUT_KEYS: Record<ReceptionStatut, string> = {
  planifiee: 'achat.reception.statusPlanifiee',
  en_cours: 'achat.reception.statusEnCours',
  recue: 'achat.reception.statusRecue',
  annulee: 'achat.reception.statusAnnulee',
};
import { AchatActions } from '../../../state/achat.actions';
import {
  selectReceptions,
  selectReceptionsError,
  selectReceptionsLoading,
  selectReceptionsSaving,
} from '../../../state/achat.selectors';
import { ReceptionFormDialogComponent } from './dialogs/reception-form-dialog/reception-form-dialog.component';

@Component({
  selector: 'app-erp-achat-livraisons-list-page',
  standalone: true,
  imports: [ButtonComponent, ReceptionFormDialogComponent, DatePipe, LocaleCurrencyPipe, RecordListCardComponent, TranslatePipe],
  templateUrl: './livraisons-list.page.html',
  styleUrl: './livraisons-list.page.scss',
})
export class AchatLivraisonsListPage implements OnInit {
  private readonly store = inject(Store);
  private readonly translate = inject(TranslateService);

  readonly receptions = this.store.selectSignal(selectReceptions);
  readonly loading = this.store.selectSignal(selectReceptionsLoading);
  readonly error = this.store.selectSignal(selectReceptionsError);
  readonly saving = this.store.selectSignal(selectReceptionsSaving);

  readonly statutKeys = RECEPTION_STATUT_KEYS;
  readonly showDialog = signal(false);
  readonly editingReception = signal<Reception | null>(null);

  ngOnInit(): void {
    this.store.dispatch(AchatActions.loadReceptions());
  }

  openNew(): void {
    this.editingReception.set(null);
    this.showDialog.set(true);
  }

  openEdit(reception: Reception): void {
    this.editingReception.set(reception);
    this.showDialog.set(true);
  }

  onSaved(draft: ReceptionDraft): void {
    const editing = this.editingReception();
    if (editing) {
      this.store.dispatch(AchatActions.updateReception({ id: editing.id, draft }));
    } else {
      this.store.dispatch(AchatActions.addReception({ draft }));
    }
    this.showDialog.set(false);
    this.editingReception.set(null);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingReception.set(null);
  }

  removeReception(id: number): void {
    if (confirm(this.translate.instant('common.confirm.deleteReception'))) {
      this.store.dispatch(AchatActions.removeReception({ id }));
    }
  }

  statutClass(statut: ReceptionStatut): string {
    const map: Record<ReceptionStatut, string> = {
      planifiee: 'bg-secondary/15 text-secondary',
      en_cours: 'bg-warning-bg text-warning-text',
      recue: 'bg-success/15 text-success',
      annulee: 'bg-primary/15 text-primary',
    };
    return map[statut];
  }
}
