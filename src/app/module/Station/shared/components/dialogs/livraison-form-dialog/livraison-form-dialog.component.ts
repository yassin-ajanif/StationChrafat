import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  BonDialogComponent,
  LivraisonFormDraft,
  LivraisonFormEditValue,
  LivraisonFormVariant,
} from '../../bon-dialog/bon-dialog.component';

export type { LivraisonFormDraft, LivraisonFormEditValue, LivraisonFormVariant };

@Component({
  selector: 'app-livraison-form-dialog',
  standalone: true,
  imports: [BonDialogComponent],
  template: `
    <app-bon-dialog
      [open]="open()"
      [variant]="variant()"
      [editValue]="editLivraison()"
      [suggestedBonNumber]="suggestedBonNumber()"
      [defaultOperatorId]="defaultOperatorId()"
      [operators]="operators()"
      [operatorsLoading]="operatorsLoading()"
      (saved)="saved.emit($event)"
      (closed)="closed.emit()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LivraisonFormDialogComponent {
  readonly open = input(false);
  readonly variant = input<LivraisonFormVariant>('station');
  readonly editLivraison = input<LivraisonFormEditValue | null>(null);
  readonly suggestedBonNumber = input('');
  readonly defaultOperatorId = input<number | null>(null);
  readonly operators = input<{ id: number; name: string }[]>([]);
  readonly operatorsLoading = input(false);
  readonly saved = output<LivraisonFormDraft>();
  readonly closed = output<void>();
}
