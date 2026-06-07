import { Component, OnInit, inject } from '@angular/core';
import { LocaleNumberPipe, LocaleCurrencyPipe, TranslatePipe } from '../../../../../core/i18n'
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { JourneeStatus, ShiftSlot } from '../../state/journee.store';
import { JourneeActions } from '../../state/journee.actions';
import {
  selectJournees,
  selectKpis,
  selectKpisLoading,
  selectListLoading,
  selectListError,
} from '../../state/journee.selectors';

@Component({
  selector: 'app-journee-list-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, LocaleNumberPipe, LocaleCurrencyPipe, TranslatePipe],
  templateUrl: './journee-list.page.html',
  styleUrl: './journee-list.page.scss',
})
export class JourneeListPage implements OnInit {
  private readonly store = inject(Store);

  readonly journees = this.store.selectSignal(selectJournees);
  readonly listLoading = this.store.selectSignal(selectListLoading);
  readonly listError = this.store.selectSignal(selectListError);
  readonly kpis = this.store.selectSignal(selectKpis);
  readonly kpisLoading = this.store.selectSignal(selectKpisLoading);

  ngOnInit(): void {
    this.store.dispatch(JourneeActions.loadList());
    this.store.dispatch(JourneeActions.loadKpis());
  }

  statusKey(status: JourneeStatus): string {
    const map: Record<JourneeStatus, string> = {
      brouillon: 'journee.list.statusBrouillon',
      en_cours: 'journee.list.statusEnCours',
      soumise: 'journee.list.statusSoumise',
      cloturee: 'journee.list.statusCloturee',
    };
    return map[status];
  }

  shiftSlotKey(slot: ShiftSlot): string {
    const map: Record<ShiftSlot, string> = {
      Matin: 'journee.shift.matin',
      'Apres-midi': 'journee.shift.apresMidi',
      Nuit: 'journee.shift.nuit',
    };
    return map[slot];
  }

  shiftSlotHoursKey(slot: ShiftSlot): string {
    const map: Record<ShiftSlot, string> = {
      Matin: 'journee.shift.matinHours',
      'Apres-midi': 'journee.shift.apresMidiHours',
      Nuit: 'journee.shift.nuitHours',
    };
    return map[slot];
  }

  statusClass(status: JourneeStatus): string {
    const base = 'rounded px-2 py-1 text-xs font-bold uppercase';
    if (status === 'en_cours') {
      return `${base} bg-warning-bg text-warning-text`;
    }
    if (status === 'cloturee') {
      return `${base} bg-surface-container text-on-surface-variant`;
    }
    return `${base} bg-surface-container text-on-surface`;
  }

  badgeClass(status: JourneeStatus): string {
    const base = 'journee-list__badge';
    if (status === 'en_cours') {
      return `${base} journee-list__badge--active`;
    }
    if (status === 'cloturee') {
      return `${base} journee-list__badge--closed`;
    }
    if (status === 'soumise') {
      return `${base} journee-list__badge--submitted`;
    }
    return `${base} journee-list__badge--draft`;
  }
}
