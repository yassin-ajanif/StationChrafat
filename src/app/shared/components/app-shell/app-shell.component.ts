import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { LocaleService, TranslatePipe, TranslateService } from '../../../core/i18n';
import { LocaleSwitcherComponent } from '../locale-switcher/locale-switcher.component';
import {
  SidebarNavIconComponent,
  SidebarNavIconId,
} from '../sidebar-nav-icon/sidebar-nav-icon.component';

interface NavLeaf {
  labelKey: string;
  route?: string;
  icon?: SidebarNavIconId;
}

interface NavBranch {
  id: string;
  labelKey: string;
  baseRoute: string;
  icon: SidebarNavIconId;
  children: NavLeaf[];
}

interface PrincipalMenu {
  id: string;
  labelKey: string;
  baseRoute: string;
  icon: SidebarNavIconId;
  entries: (NavLeaf | NavBranch)[];
}

function isNavBranch(entry: NavLeaf | NavBranch): entry is NavBranch {
  return 'children' in entry;
}

const VENTES_CHILDREN: NavLeaf[] = [
  { labelKey: 'shell.nav.devis', route: '/station/ventes/devis' },
  { labelKey: 'shell.nav.commande', route: '/station/ventes/commandes' },
  { labelKey: 'shell.nav.livraison', route: '/station/ventes/livraisons' },
  { labelKey: 'shell.nav.factures', route: '/station/ventes/factures' },
  { labelKey: 'shell.nav.retour', route: '/station/ventes/retours' },
  { labelKey: 'shell.nav.avoirs', route: '/station/ventes/avoirs' },
];

const ACHATS_CHILDREN: NavLeaf[] = [
  { labelKey: 'shell.nav.devis', route: '/station/achat/devis' },
  { labelKey: 'shell.nav.commande', route: '/station/achat/commandes' },
  { labelKey: 'shell.nav.reception', route: '/station/achat/livraisons' },
  { labelKey: 'shell.nav.factures', route: '/station/achat/factures' },
  { labelKey: 'shell.nav.retour', route: '/station/achat/retours' },
  { labelKey: 'shell.nav.avoirs', route: '/station/achat/avoirs' },
];

const STOCK_CHILDREN: NavLeaf[] = [
  { labelKey: 'shell.nav.stockGestion', route: '/station/stock/gestion' },
  { labelKey: 'shell.nav.stockPistolets', route: '/station/stock/pistolets-cuves' },
];

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    SidebarNavIconComponent,
    LocaleSwitcherComponent,
    TranslatePipe,
  ],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
  private static readonly SIDEBAR_COLLAPSED_KEY = 'charafate-sidebar-collapsed';

  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  readonly locale = inject(LocaleService);

  readonly sidebarCollapsed = signal(this.readSidebarCollapsedPreference());
  readonly mobileNavOpen = signal(false);

  readonly navLinks: NavLeaf[] = [
    { labelKey: 'shell.nav.dashboard', route: '/journees', icon: 'dashboard' },
  ];

  readonly principalMenus: PrincipalMenu[] = [
    {
      id: 'station',
      labelKey: 'shell.nav.station',
      baseRoute: '/station',
      icon: 'station',
      entries: [
        {
          id: 'station-ventes',
          labelKey: 'shell.nav.ventes',
          baseRoute: '/station/ventes',
          icon: 'ventes',
          children: VENTES_CHILDREN,
        },
        {
          id: 'station-achats',
          labelKey: 'shell.nav.achats',
          baseRoute: '/station/achat',
          icon: 'achats',
          children: ACHATS_CHILDREN,
        },
        {
          id: 'station-stock',
          labelKey: 'shell.nav.stock',
          baseRoute: '/station/stock',
          icon: 'stock',
          children: STOCK_CHILDREN,
        },
        {
          labelKey: 'shell.nav.produitsServices',
          route: '/station/produits-services',
          icon: 'catalogue',
        },
        {
          labelKey: 'shell.nav.clients',
          route: '/station/client',
          icon: 'client',
        },
        {
          labelKey: 'shell.nav.fournisseurs',
          route: '/station/fournisseur',
          icon: 'fournisseur',
        },
        { labelKey: 'shell.nav.journee', route: '/journees', icon: 'journee' },
      ],
    },
  ];

  readonly expandedGroups = signal<Set<string>>(new Set(['station']));

  private readonly navigationUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  constructor() {
    effect(() => {
      const url = this.navigationUrl();
      if (url) {
        this.syncSidebarExpansionFromUrl(url);
        this.mobileNavOpen.set(false);
      }
    });
  }

  readonly isStationRoute = computed(
    () => this.router.url.startsWith('/station') || this.router.url.startsWith('/journees'),
  );

  isPrincipalActive(menu: PrincipalMenu): boolean {
    if (menu.id === 'station') {
      return this.isStationRoute();
    }
    return this.router.url.startsWith(menu.baseRoute);
  }

  isBranchActive(branch: NavBranch): boolean {
    return this.router.url.startsWith(branch.baseRoute);
  }

  isExpanded(id: string): boolean {
    return this.expandedGroups().has(id);
  }

  toggleGroup(id: string): void {
    this.expandedGroups.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  onBranchClick(branch: NavBranch): void {
    this.expandedGroups.update((current) => {
      const next = new Set(current);
      next.add('station');
      next.delete('station-ventes');
      next.delete('station-achats');
      next.delete('station-stock');
      next.add(branch.id);
      return next;
    });

    const defaultRoute = branch.children.find((child) => child.route)?.route;
    if (defaultRoute) {
      void this.router.navigateByUrl(defaultRoute);
    }
  }

  private syncSidebarExpansionFromUrl(url: string): void {
    this.expandedGroups.update((current) => {
      const next = new Set(current);
      next.add('station');
      next.delete('station-ventes');
      next.delete('station-achats');
      next.delete('station-stock');

      if (url.includes('/ventes')) {
        next.add('station-ventes');
      } else if (url.includes('/achat')) {
        next.add('station-achats');
      } else if (url.includes('/stock')) {
        next.add('station-stock');
      }

      return next;
    });
  }

  isBranch(entry: NavLeaf | NavBranch): entry is NavBranch {
    return isNavBranch(entry);
  }

  isImplementedRoute(route: string | undefined): boolean {
    return !!route;
  }

  entryIcon(entry: NavLeaf | NavBranch): SidebarNavIconId {
    return entry.icon ?? 'station';
  }

  navLabel(key: string): string {
    this.translate.version();
    return this.translate.instant(key);
  }

  sidebarToggleLabel(): string {
    this.translate.version();
    return this.sidebarCollapsed()
      ? this.translate.instant('shell.sidebar.toggleExpand')
      : this.translate.instant('shell.sidebar.toggleCollapse');
  }

  mobileMenuLabel(): string {
    this.translate.version();
    return this.mobileNavOpen()
      ? this.translate.instant('shell.sidebar.closeMenu')
      : this.translate.instant('shell.sidebar.openMenu');
  }

  toggleMobileNav(): void {
    this.mobileNavOpen.update((open) => !open);
  }

  closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update((collapsed) => {
      const next = !collapsed;
      this.persistSidebarCollapsedPreference(next);
      return next;
    });
  }

  private readSidebarCollapsedPreference(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    return localStorage.getItem(AppShellComponent.SIDEBAR_COLLAPSED_KEY) === 'true';
  }

  private persistSidebarCollapsedPreference(collapsed: boolean): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(AppShellComponent.SIDEBAR_COLLAPSED_KEY, String(collapsed));
  }
}
