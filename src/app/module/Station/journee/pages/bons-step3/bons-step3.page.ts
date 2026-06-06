import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { LocaleCurrencyPipe, TranslatePipe } from '../../../../../core/i18n';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  JOURNEE_BON_CONFIG,
  StationBon,
  computeBonTotal as _computeBonTotal,
  computeBonServicesAmount as _computeBonServicesAmount,
  computeBonProductsAmount as _computeBonProductsAmount,
  suggestNextStationBonNumber,
  computeStationBonsTotal,
  emptyPaymentSplit,
  isPaymentSplitBalanced,
  LivraisonFormDraft,
  stationBonToFormEditValue,
  livraisonFormDraftToStationBonDraftInput,
} from '../../../shared/components/bon-dialog/bon-dialog.component';
import { LivraisonFormDialogComponent } from '../../../shared/components/dialogs/livraison-form-dialog/livraison-form-dialog.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { JourneeActions } from '../../state/journee.actions';
import {
  selectFilteredStationBons,
  selectJourneeDraftId,
  selectOperators,
  selectOperatorsLoading,
  selectStationBons,
  selectStationBonsChefId,
} from '../../state/journee.selectors';

@Component({
  selector: 'app-bons-step3-page',
  standalone: true,
  imports: [ButtonComponent, LivraisonFormDialogComponent, RouterLink, LocaleCurrencyPipe, TranslatePipe],
  template: `
    <div class="flex w-full flex-col gap-6">
      <header class="flex flex-wrap items-start justify-between gap-4">
        <div class="flex items-start gap-3">
          <span
            class="flex size-10 shrink-0 items-center justify-center rounded bg-primary/10 text-primary"
            aria-hidden="true"
          >{{ config.headerIcon }}</span>
          <div>
            <h1 class="font-display text-2xl font-bold uppercase text-on-surface">{{ config.title | translate }}</h1>
            <p class="mt-1 text-base text-on-surface-variant">{{ config.description | translate }}</p>
          </div>
        </div>
        <app-button variant="primary" (pressed)="openNewBonDialog()">
          {{ 'common.bon.new' | translate }}
        </app-button>
      </header>

      <div class="flex flex-wrap items-center gap-3 rounded-[var(--radius-card)] bg-surface-container-lowest px-4 py-3 shadow-sm">
        <label class="font-display text-xs font-bold uppercase text-on-surface-variant">{{ config.chefSelectLabel | translate }}</label>
        <select
          class="min-h-[var(--spacing-touch)] rounded-[var(--radius-card)] border border-outline px-3 text-base"
          [value]="selectedChefId() ?? ''"
          (change)="onChefChange($event)"
        >
          <option value="">{{ 'common.placeholders.selectOperator' | translate }}</option>
          @for (op of operators(); track op.id) {
            <option [value]="op.id" [selected]="selectedChefId() === op.id">{{ op.name }}</option>
          }
        </select>
        @if (operatorsLoading()) {
          <span class="text-sm text-on-surface-variant">{{ 'common.loading' | translate }}</span>
        }
      </div>

      <div class="overflow-x-auto rounded-[var(--radius-card)] border border-outline-variant bg-surface-container-lowest shadow-sm">
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr class="bg-table-header">
              <th class="px-4 py-3 text-left font-display text-xs font-bold uppercase text-white">{{ 'common.bon.number' | translate }}</th>
              <th class="px-4 py-3 text-left font-display text-xs font-bold uppercase text-white">{{ 'common.bon.clientPlate' | translate }}</th>
              <th class="px-4 py-3 text-left font-display text-xs font-bold uppercase text-white">{{ 'common.bon.operator' | translate }}</th>
              <th class="px-4 py-3 text-right font-display text-xs font-bold uppercase text-white">{{ 'common.documentLines.services' | translate }}</th>
              <th class="px-4 py-3 text-right font-display text-xs font-bold uppercase text-white">{{ 'common.documentLines.products' | translate }}</th>
              <th class="px-4 py-3 text-right font-display text-xs font-bold uppercase text-white">{{ 'common.table.total' | translate }}</th>
              <th class="px-4 py-3 text-center font-display text-xs font-bold uppercase text-white">{{ 'common.table.actions' | translate }}</th>
            </tr>
          </thead>
          <tbody>
            @for (bon of bons(); track bon.id) {
              <tr class="border-t border-outline-variant/50 bg-surface-container-lowest even:bg-surface-container/40">
                <td class="px-4 py-3 font-mono text-xs font-semibold text-on-surface">{{ bon.bonNumber }}</td>
                <td class="px-4 py-3 text-on-surface">{{ bon.partnerRef }}</td>
                <td class="px-4 py-3 text-on-surface-variant">{{ operatorName(bon.operatorId) }}</td>
                <td class="px-4 py-3 text-right tabular-nums text-on-surface">{{ computeBonServicesAmount(bon) | localeCurrency }}</td>
                <td class="px-4 py-3 text-right tabular-nums text-on-surface">{{ computeBonProductsAmount(bon) | localeCurrency }}</td>
                <td class="px-4 py-3 text-right font-bold tabular-nums text-on-surface">{{ computeBonTotal(bon) | localeCurrency }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      class="rounded px-2 py-1 text-xs font-semibold uppercase text-secondary hover:bg-secondary/10"
                      (click)="openEditBonDialog(bon.id)"
                    >
                      {{ 'common.actions.edit' | translate }}
                    </button>
                    <button
                      type="button"
                      class="rounded px-2 py-1 text-xs font-semibold uppercase text-primary hover:bg-primary/10"
                      (click)="removeBon(bon.id)"
                    >
                      {{ 'common.actions.delete' | translate }}
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="7" class="px-4 py-12 text-center text-on-surface-variant">
                  {{ 'journee.step3.empty' | translate }}
                </td>
              </tr>
            }
          </tbody>
          @if (bons().length > 0) {
            <tfoot>
              <tr class="border-t-2 border-outline-variant bg-surface-container">
                <td colspan="5" class="px-4 py-4 font-display text-sm font-bold uppercase text-on-surface">
                  {{ 'common.table.total' | translate }}
                </td>
                <td class="px-4 py-4 text-right font-bold tabular-nums text-on-surface">
                  {{ filteredTotal() | localeCurrency }}
                </td>
                <td></td>
              </tr>
            </tfoot>
          }
        </table>
      </div>

      <app-livraison-form-dialog
        [open]="dialogOpen()"
        variant="station"
        [editLivraison]="editingBonValue()"
        [suggestedBonNumber]="suggestedBonNumber()"
        [defaultOperatorId]="defaultOperatorId()"
        [operators]="operators()"
        [operatorsLoading]="operatorsLoading()"
        (saved)="onBonSaved($event)"
        (closed)="closeDialog()"
      />

      <footer class="mt-4 flex flex-wrap justify-between gap-4">
        <a [routerLink]="config.backLink">
          <app-button variant="secondary">{{ 'common.actions.back' | translate }}</app-button>
        </a>
        <app-button variant="primary" (pressed)="onNext()">
          {{ 'common.actions.next' | translate }}
        </app-button>
      </footer>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BonsStep3Page implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  readonly config = JOURNEE_BON_CONFIG;

  readonly journeeId = this.store.selectSignal(selectJourneeDraftId);
  readonly allBons = this.store.selectSignal(selectStationBons);
  readonly bons = this.store.selectSignal(selectFilteredStationBons);
  readonly selectedChefId = this.store.selectSignal(selectStationBonsChefId);
  readonly filteredTotal = computed(() => computeStationBonsTotal(this.bons()));
  readonly operators = this.store.selectSignal(selectOperators);
  readonly operatorsLoading = this.store.selectSignal(selectOperatorsLoading);

  readonly stepIsValid = computed(() => {
    if (this.selectedChefId() == null) {
      return false;
    }
    const bons = this.allBons();
    if (bons.length === 0) {
      return false;
    }
    return bons.every(isBonsStep3BonValid);
  });

  readonly dialogOpen = signal(false);
  readonly editingBonId = signal<number | null>(null);

  readonly editingBon = computed(() => {
    const id = this.editingBonId();
    if (id == null) {
      return null;
    }
    return this.allBons().find((bon) => bon.id === id) ?? null;
  });

  readonly editingBonValue = computed(() => {
    const bon = this.editingBon();
    return bon ? stationBonToFormEditValue(bon) : null;
  });

  readonly defaultOperatorId = computed(() => {
    const bon = this.editingBon();
    return bon ? bon.operatorId : null;
  });

  readonly suggestedBonNumber = computed(() => suggestNextStationBonNumber(this.allBons(), 'LAV', 8800));

  constructor() {
    effect(() => {
      this.store.dispatch(
        JourneeActions.patchBonsStep3({ patch: { isValid: this.stepIsValid() } }),
      );
    });
  }

  ngOnInit(): void {
    const redirect = this.config.guardRedirectIfNoDraft;
    if (this.journeeId() == null && redirect) {
      void this.router.navigate(redirect);
      return;
    }
    this.store.dispatch(JourneeActions.loadOperators());
  }

  computeBonTotal = _computeBonTotal;
  computeBonServicesAmount = _computeBonServicesAmount;
  computeBonProductsAmount = _computeBonProductsAmount;

  operatorName(operatorId: number): string {
    return this.operators().find((op) => op.id === operatorId)?.name ?? '';
  }

  onChefChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.store.dispatch(
      JourneeActions.setStationBonsChefId({ chefVidangeLavageId: value ? Number(value) : null }),
    );
  }

  openNewBonDialog(): void {
    if (this.selectedChefId() == null) {
      return;
    }
    this.editingBonId.set(null);
    this.dialogOpen.set(true);
  }

  openEditBonDialog(id: number): void {
    this.editingBonId.set(id);
    this.dialogOpen.set(true);
  }

  closeDialog(): void {
    this.dialogOpen.set(false);
    this.editingBonId.set(null);
  }

  onBonSaved(draft: LivraisonFormDraft): void {
    const chefVidangeLavageId = this.selectedChefId();
    if (chefVidangeLavageId == null) {
      return;
    }
    const bonDraft = livraisonFormDraftToStationBonDraftInput(draft, chefVidangeLavageId);
    const id = this.editingBonId();
    if (id != null) {
      this.store.dispatch(JourneeActions.updateStationBon({ id, bon: bonDraft }));
    } else {
      this.store.dispatch(JourneeActions.addStationBon({ bon: bonDraft }));
    }
    this.closeDialog();
  }

  removeBon(id: number): void {
    this.store.dispatch(JourneeActions.removeStationBon({ id }));
  }

  onNext(): void {
    void this.router.navigate(this.config.nextLink);
  }
}

function isBonsStep3BonValid(bon: StationBon): boolean {
  const total = _computeBonTotal(bon);
  return isPaymentSplitBalanced(bon.payments ?? emptyPaymentSplit(), total);
}
