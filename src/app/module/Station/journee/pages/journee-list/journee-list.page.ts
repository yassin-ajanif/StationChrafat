import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { JourneeStatus } from '../../models/journee.model';
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
  imports: [RouterLink, ButtonComponent, DecimalPipe],
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

  statusLabel(status: JourneeStatus): string {
    const map: Record<JourneeStatus, string> = {
      brouillon: 'Brouillon',
      en_cours: 'En cours',
      soumise: 'Soumise',
      cloturee: 'Clôturée',
    };
    return map[status];
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
}
