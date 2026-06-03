import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { BonVidangeDialogComponent } from '../../components/bon-vidange-dialog/bon-vidange-dialog.component';
import {
  BonVidangeConfig,
  VidangeBon,
  VidangeBonDraftInput,
  computeBonConsumedQty,
  computeBonServicesAmount,
  computeBonTotal,
} from '../../models/bon-vidange';
import { computeLineAmountTTC } from '../../models/common/document-line.model';

export interface BonVidangeOperatorOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-bon-vidange-page',
  imports: [RouterLink, ButtonComponent, DecimalPipe, BonVidangeDialogComponent],
  templateUrl: './bon-vidange.page.html',
  styleUrl: './bon-vidange.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonVidangePage {
  readonly config = input.required<BonVidangeConfig>();
  readonly bons = input.required<VidangeBon[]>();
  readonly selectedChefId = input<number | null>(null);
  readonly filteredTotal = input(0);
  readonly loading = input(false);
  readonly loadError = input<string | null>(null);
  readonly canProceed = input(true);
  readonly operators = input.required<BonVidangeOperatorOption[]>();
  readonly operatorsLoading = input(false);

  readonly dialogOpen = input(false);
  readonly suggestedBonNumber = input('');
  readonly editingBon = input<VidangeBon | null>(null);

  readonly chefChangeRequested = output<number | null>();
  readonly newBonRequested = output<void>();
  readonly editBonRequested = output<number>();
  readonly removeBonRequested = output<number>();
  readonly bonSaved = output<VidangeBonDraftInput>();
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
