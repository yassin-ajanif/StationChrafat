import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import {
  BonLivraisonCarburantConfig,
  NozzleBombisteGroup,
  NozzleIndexLine,
  isLineValid,
} from '../../models/bon-livraison-carburant';
import { paymentDifferenceLabel as formatPaymentDifference } from '../../models/common/payment-split.model';

export interface BonLivraisonBombisteOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-bon-livraison-carburant-page',
  imports: [RouterLink, ButtonComponent, DecimalPipe],
  templateUrl: './bon-livraison-carburant.page.html',
  styleUrl: './bon-livraison-carburant.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonLivraisonCarburantPage {
  readonly config = input.required<BonLivraisonCarburantConfig>();
  readonly bombisteGroups = input.required<NozzleBombisteGroup[]>();
  readonly availableBombistes = input.required<BonLivraisonBombisteOption[]>();
  readonly loading = input(false);
  readonly operatorsLoading = input(false);
  readonly loadError = input<string | null>(null);
  readonly canProceed = input(false);

  readonly addBombisteRequested = output<number>();
  readonly removeBombisteRequested = output<number>();
  readonly indexChangeRequested = output<{
    lineId: number;
    field: 'entree' | 'sortie';
    value: number | null;
  }>();
  readonly paymentChangeRequested = output<{
    bombisteId: number;
    field: 'cash' | 'tpe' | 'bons';
    value: number;
  }>();
  readonly nextRequested = output<void>();

  readonly pendingBombisteId = signal<number | null>(null);

  readonly sessionTotals = computed(() => {
    const groups = this.bombisteGroups();
    return {
      liters: groups.reduce((sum, group) => sum + group.totals.liters, 0),
      amount: groups.reduce((sum, group) => sum + group.totals.amount, 0),
    };
  });

  onBombisteSelect(event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;
    this.pendingBombisteId.set(raw === '' ? null : Number(raw));
  }

  addBombiste(): void {
    const bombisteId = this.pendingBombisteId();
    if (bombisteId == null) {
      return;
    }
    this.addBombisteRequested.emit(bombisteId);
    this.pendingBombisteId.set(null);
  }

  removeBombiste(bombisteId: number): void {
    this.removeBombisteRequested.emit(bombisteId);
  }

  onIndexInput(lineId: number, field: 'entree' | 'sortie', event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    const parsed = raw === '' ? null : Number(raw);
    const value = parsed != null && Number.isNaN(parsed) ? null : parsed;
    this.indexChangeRequested.emit({ lineId, field, value });
  }

  onPaymentInput(
    bombisteId: number,
    field: 'cash' | 'tpe' | 'bons',
    event: Event,
  ): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    const parsed = raw === '' ? 0 : Number(raw);
    const value = Number.isNaN(parsed) ? 0 : Math.max(0, parsed);
    this.paymentChangeRequested.emit({ bombisteId, field, value });
  }

  paymentDifferenceLabel(difference: number): string {
    return formatPaymentDifference(difference);
  }

  lineInvalid(line: NozzleIndexLine): boolean {
    return !isLineValid(line);
  }

  exportCsv(): void {
    const header = [
      'Bombiste',
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
    const body = this.bombisteGroups().flatMap((group) =>
      group.rows.map(({ line, quantity, total }) =>
        [
          group.bombisteName,
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
      ),
    );
    const csv = [header.join(';'), ...body].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bon-livraison-carburant-${new Date().toISOString().slice(0, 10)}.csv`;
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
    this.nextRequested.emit();
  }
}
