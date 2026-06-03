import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { BonLavageDialogComponent } from '../../components/bon-lavage-dialog/bon-lavage-dialog.component';
import {
  BonLavageConfig,
  LavageBon,
  LavageBonDraftInput,
  computeBonConsumedQty,
  computeBonServicesAmount,
  computeBonTotal,
} from '../../models/bon-lavage';
import { computeLineAmountTTC } from '../../models/common/document-line.model';

export interface BonLavageOperatorOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-bon-lavage-page',
  imports: [RouterLink, ButtonComponent, DecimalPipe, BonLavageDialogComponent],
  templateUrl: './bon-lavage.page.html',
  styleUrl: './bon-lavage.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonLavagePage {
  readonly config = input.required<BonLavageConfig>();
  readonly bons = input.required<LavageBon[]>();
  readonly selectedChefId = input<number | null>(null);
  readonly filteredTotal = input(0);
  readonly loading = input(false);
  readonly loadError = input<string | null>(null);
  readonly canProceed = input(true);
  readonly operators = input.required<BonLavageOperatorOption[]>();
  readonly operatorsLoading = input(false);

  readonly dialogOpen = input(false);
  readonly suggestedBonNumber = input('');
  readonly editingBon = input<LavageBon | null>(null);

  readonly chefChangeRequested = output<number | null>();
  readonly newBonRequested = output<void>();
  readonly editBonRequested = output<number>();
  readonly removeBonRequested = output<number>();
  readonly bonSaved = output<LavageBonDraftInput>();
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
