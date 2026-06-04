import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { StockGestionKpiCardsComponent } from '../../components/stock-gestion-kpi-cards/stock-gestion-kpi-cards.component';
import { StockGestionTabsComponent } from '../../components/stock-gestion-tabs/stock-gestion-tabs.component';
import { StockGestionToolbarComponent } from '../../components/stock-gestion-toolbar/stock-gestion-toolbar.component';
import { StockProductTableComponent } from '../../components/stock-product-table/stock-product-table.component';
import { StockGestionTab } from '../../models/stock-gestion-tab.model';
import { StockGestionActions } from '../../state/stock-gestion.actions';
import {
  selectActiveTab,
  selectCurrentPage,
  selectError,
  selectLoading,
  selectPaginatedProducts,
  selectPaginationLabel,
  selectSearchQuery,
  selectSummaries,
  selectTotalPages,
  selectVisiblePages,
} from '../../state/stock-gestion.selectors';

@Component({
  selector: 'app-stock-gestion-page',
  standalone: true,
  imports: [
    StockGestionKpiCardsComponent,
    StockGestionTabsComponent,
    StockGestionToolbarComponent,
    StockProductTableComponent,
  ],
  templateUrl: './stock-gestion.page.html',
  styleUrl: './stock-gestion.page.scss',
})
export class StockGestionPage implements OnInit {
  private readonly store = inject(Store);

  readonly loading = this.store.selectSignal(selectLoading);
  readonly error = this.store.selectSignal(selectError);
  readonly summaries = this.store.selectSignal(selectSummaries);
  readonly activeTab = this.store.selectSignal(selectActiveTab);
  readonly searchQuery = this.store.selectSignal(selectSearchQuery);
  readonly paginatedProducts = this.store.selectSignal(selectPaginatedProducts);
  readonly paginationLabel = this.store.selectSignal(selectPaginationLabel);
  readonly currentPage = this.store.selectSignal(selectCurrentPage);
  readonly totalPages = this.store.selectSignal(selectTotalPages);
  readonly visiblePages = this.store.selectSignal(selectVisiblePages);

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
