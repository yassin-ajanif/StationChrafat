import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { NozzleIndexLine } from '../../models/nozzle-index.model';
import { isLineValid } from '../../models/nozzle-index.model';
import { JourneeActions } from '../../state/journee.actions';
import {
  selectCanProceedNozzleStep,
  selectDraft,
  selectNozzleIndexesError,
  selectNozzleIndexesLoading,
  selectNozzleLinesWithTotals,
} from '../../state/journee.selectors';

@Component({
  selector: 'app-index-pistoles-step2-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, DecimalPipe],
  templateUrl: './index-pistoles-step2.page.html',
  styleUrl: './index-pistoles-step2.page.scss',
})
export class IndexPistolesStep2Page implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly draft = this.store.selectSignal(selectDraft);
  readonly rows = this.store.selectSignal(selectNozzleLinesWithTotals);
  readonly loading = this.store.selectSignal(selectNozzleIndexesLoading);

  readonly sessionTotals = computed(() => {
    const active = this.rows().filter(({ line }) => line.status === 'active');
    return {
      liters: active.reduce((sum, row) => sum + row.quantity, 0),
      amount: active.reduce((sum, row) => sum + row.total, 0),
    };
  });
  readonly loadError = this.store.selectSignal(selectNozzleIndexesError);
  readonly canProceed = this.store.selectSignal(selectCanProceedNozzleStep);

  ngOnInit(): void {
    if (this.draft().id == null) {
      void this.router.navigate(['/journees', 'nouvelle', 'configuration-step1']);
      return;
    }
    this.store.dispatch(JourneeActions.loadNozzleIndexes());
  }

  onIndexInput(lineId: number, field: 'entree' | 'sortie', event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    const parsed = raw === '' ? null : Number(raw);
    const value = parsed != null && Number.isNaN(parsed) ? null : parsed;
    this.store.dispatch(
      JourneeActions.updateNozzleIndex({
        lineId,
        ...(field === 'entree' ? { indexEntree: value } : { indexSortie: value }),
      }),
    );
  }

  lineInvalid(line: NozzleIndexLine): boolean {
    return !isLineValid(line);
  }

  exportCsv(): void {
    const header = [
      'Ilot',
      'Pistolet',
      'Carburant',
      'Index entree',
      'Index sortie',
      'Remise cuve',
      'Quantite',
      'PU',
      'Total',
    ];
    const body = this.rows().map(({ line, quantity, total }) =>
      [
        line.island,
        line.pumpLabel,
        line.fuelLabel,
        line.indexEntree ?? '',
        line.indexSortie ?? '',
        line.tankReturn,
        quantity.toFixed(2),
        line.unitPrice,
        total.toFixed(2),
      ].join(';'),
    );
    const csv = [header.join(';'), ...body].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `index-pistolets-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  print(): void {
    window.print();
  }

  next(): void {
    if (!this.canProceed()) {
      return;
    }
    void this.router.navigate(['/journees', 'nouvelle', 'bon-lavage-step3']);
  }
}
