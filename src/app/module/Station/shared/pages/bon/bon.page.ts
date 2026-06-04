import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LocaleNumberPipe, LocaleCurrencyPipe, TranslatePipe } from '../../../../../core/i18n'
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { BonDialogComponent } from '../../components/bon-dialog/bon-dialog.component';
import {
  BonConfig,
  StationBon,
  StationBonDraftInput,
  computeBonConsumedQty,
  computeBonServicesAmount,
  computeBonTotal,
} from '../../models/bon';
import { computeLineAmountTTC } from '../../models/common/document-line.model';

export interface BonOperatorOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-bon-page',
  imports: [RouterLink, ButtonComponent, BonDialogComponent, LocaleNumberPipe, LocaleCurrencyPipe, TranslatePipe],
  templateUrl: './bon.page.html',
  styleUrl: './bon.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonPage {
  readonly config = input.required<BonConfig>();
  readonly bons = input.required<StationBon[]>();
  readonly selectedChefId = input<number | null>(null);
  readonly filteredTotal = input(0);
  readonly loading = input(false);
  readonly loadError = input<string | null>(null);
  readonly canProceed = input(true);
  readonly operators = input.required<BonOperatorOption[]>();
  readonly operatorsLoading = input(false);

  readonly dialogOpen = input(false);
  readonly suggestedBonNumber = input('');
  readonly editingBon = input<StationBon | null>(null);

  readonly chefChangeRequested = output<number | null>();
  readonly newBonRequested = output<void>();
  readonly editBonRequested = output<number>();
  readonly removeBonRequested = output<number>();
  readonly bonSaved = output<StationBonDraftInput>();
  readonly dialogClosed = output<void>();
  readonly nextRequested = output<void>();

  readonly computeBonTotal = computeBonTotal;
  readonly computeBonServicesAmount = computeBonServicesAmount;
  readonly computeBonConsumedQty = computeBonConsumedQty;
  readonly computeLineAmountTTC = computeLineAmountTTC;

  onChefChange(event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;
    this.chefChangeRequested.emit(raw === '' ? null : Number(raw));
  }

  openNewBonDialog(): void {
    this.newBonRequested.emit();
  }

  openEditBonDialog(id: number): void {
    this.editBonRequested.emit(id);
  }

  removeBon(id: number): void {
    this.removeBonRequested.emit(id);
  }

  next(): void {
    this.nextRequested.emit();
  }
}
