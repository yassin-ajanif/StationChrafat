import { Component, OnInit, computed, inject } from '@angular/core';
import { TranslatePipe } from '../../../../../core/i18n';
import { Store } from '@ngrx/store';
import { StockGestionKpiCardsComponent } from '../../components/stock-gestion-kpi-cards/stock-gestion-kpi-cards.component';
import { StockGestionTabsComponent } from '../../components/stock-gestion-tabs/stock-gestion-tabs.component';
import { StockGestionToolbarComponent } from '../../components/stock-gestion-toolbar/stock-gestion-toolbar.component';
import { StockProductTableComponent } from '../../components/stock-product-table/stock-product-table.component';
import { StockGestionTab } from '../../state/store';
import { StockGestionActions } from '../../state/actions';
import {
  selectActiveTab,
  selectCurrentPage,
  selectGestionError,
  selectFilteredProducts,
  selectGestionLoading,
  selectPageSize,
  selectPaginatedProducts,
  selectSearchQuery,
  selectSummaries,
  selectTotalPages,
  selectVisiblePages,
} from '../../state/selectors';

@Component({
  selector: 'app-stock-gestion-page',
  standalone: true,
  imports: [StockGestionKpiCardsComponent, StockGestionTabsComponent, StockGestionToolbarComponent, StockProductTableComponent, TranslatePipe],
  templateUrl: './stock-gestion.page.html',
  styleUrl: './stock-gestion.page.scss',
})
export class StockGestionPage implements OnInit {
  private readonly store = inject(Store);

  readonly loading = this.store.selectSignal(selectGestionLoading);
  readonly error = this.store.selectSignal(selectGestionError);
  readonly summaries = this.store.selectSignal(selectSummaries);
  readonly activeTab = this.store.selectSignal(selectActiveTab);
  readonly searchQuery = this.store.selectSignal(selectSearchQuery);
  readonly filteredProducts = this.store.selectSignal(selectFilteredProducts);
  readonly pageSize = this.store.selectSignal(selectPageSize);
  readonly paginatedProducts = this.store.selectSignal(selectPaginatedProducts);
  readonly currentPage = this.store.selectSignal(selectCurrentPage);
  readonly totalPages = this.store.selectSignal(selectTotalPages);
  readonly visiblePages = this.store.selectSignal(selectVisiblePages);

  readonly paginationRange = computed(() => {
    const total = this.filteredProducts().length;
    const page = this.currentPage();
    const size = this.pageSize();
    if (total === 0) {
      return null;
    }
    const start = (page - 1) * size + 1;
    const end = Math.min(page * size, total);
    return { start, end, total };
  });

  ngOnInit(): void {
    this.store.dispatch(StockGestionActions.loadPage());
  }

  onTabChange(tab: StockGestionTab): void {
    this.store.dispatch(StockGestionActions.setActiveTab({ tab }));
  }

  onSearchChange(query: string): void {
    this.store.dispatch(StockGestionActions.setSearchQuery({ query }));
  }

  onPageChange(page: number): void {
    this.store.dispatch(StockGestionActions.setPage({ page }));
  }
}
